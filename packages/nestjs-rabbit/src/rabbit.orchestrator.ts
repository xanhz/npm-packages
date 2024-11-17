import { Injectable, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';
import { ChannelWrapper } from 'amqp-connection-manager';
import { ConsumeMessage, XDeath } from 'amqplib';
import { RabbitMetadataAccessor } from './rabbit-metadata.accessor';
import { MissingSubscriberMetadataError } from './rabbit.errors';
import { MessageSource, SubscriberOptions } from './rabbit.interfaces';
import { RabbitService } from './rabbit.service';
import { RabbitSubscriber } from './rabbit.subscriber';
import * as _ from './utils/lodash';

@Injectable()
export class RabbitOrchestrator implements OnApplicationBootstrap, OnApplicationShutdown {
  constructor(
    protected readonly accessor: RabbitMetadataAccessor,
    protected readonly discovery: DiscoveryService,
    protected readonly rabbit: RabbitService,
  ) {}

  public onApplicationShutdown() {
    return this.rabbit.close();
  }

  public onApplicationBootstrap() {
    this.init().catch(_.noop);
  }

  protected async init() {
    const subscribers = this.discovery
      .getProviders()
      .filter((wrapper) => wrapper.instance instanceof RabbitSubscriber)
      .map((wrapper) => wrapper.instance) as RabbitSubscriber[];
    for (const subscriber of subscribers) {
      const metadata = this.accessor.getSubscriberMetadata(subscriber.constructor);
      if (!metadata) {
        throw new MissingSubscriberMetadataError(subscriber.constructor.name);
      }
      const { queue, sources, ...options } = metadata;
      const asserted = await this.setupQueue(queue, sources);
      const automatically = Boolean(options.noAck);
      await this.rabbit.subscribe(
        queue.name,
        async (channel, message) => {
          if (!message) {
            return;
          }
          const deaths = _.get(message, 'properties.headers.x-death', [] as XDeath[]);
          const rejected = deaths.find((death) => {
            return death.reason === 'rejected' && death.queue === asserted.queue;
          });
          try {
            if (rejected?.count) {
              const attempts = _.get(queue, 'backoff.attempts', 1);
              if (rejected.count >= attempts) {
                return this.reject(channel, message, metadata);
              }
            }
            subscriber.onmessage(message);
            await subscriber.process(message);
            subscriber.onsuccess(message);
            if (automatically) {
              return true;
            }
            return channel.ack(message);
          } catch (error) {
            subscriber.onerror(message, error);
            if (automatically) {
              return true;
            }
            const attempts = _.get(queue, 'backoff.attempts', 1);
            if ((rejected?.count ?? 0) + 1 >= attempts) {
              return this.reject(channel, message, metadata);
            }
            return channel.nack(message, false, false);
          }
        },
        options,
      );
    }
  }

  protected async setupQueue(queue: SubscriberOptions['queue'], sources: MessageSource[]) {
    const { name, backoff, options } = queue;
    const promise = backoff
      ? this.rabbit.assertRetryableQueue(name, backoff.delay, options)
      : this.rabbit.assertQueue(name, options);
    const reply = await promise;
    for (const source of sources) {
      await this.rabbit.assertExchange(source.topic, source.type, { durable: true, autoDelete: false });
      await this.rabbit.bindQueue(queue.name, source);
    }
    return reply;
  }

  protected async reject(channel: ChannelWrapper, message: ConsumeMessage, options: SubscriberOptions) {
    const { name, backoff } = options.queue;
    if (backoff?.onfailed?.operation === 'keep') {
      await this.rabbit.assertQueue(`${name}.error`, { durable: true, autoDelete: false });
      await this.rabbit.send({ queue: `${name}.error`, content: message.content, options: { persistent: true } });
      return channel.ack(message);
    }
    if (backoff?.onfailed?.operation === 'send') {
      await this.rabbit.send({
        ...backoff.onfailed,
        content: message.content,
        options: { persistent: true },
      });
    }
    if (backoff?.onfailed?.operation === 'publish') {
      await this.rabbit.publish({
        ...backoff.onfailed,
        content: message.content,
        options: { persistent: true },
      });
    }
    return channel.ack(message);
  }
}
