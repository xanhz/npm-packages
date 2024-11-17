import { Injectable, Logger } from '@nestjs/common';
import amqp, { AmqpConnectionManager, ChannelWrapper } from 'amqp-connection-manager';
import { ConfirmChannel, ConsumeMessage, Options, Replies } from 'amqplib';
import { UnknownMessageSourceError } from './rabbit.errors';
import {
  ExchangeType,
  MessageSource,
  PublishMessage,
  RabbitOptions,
  SendMessage,
  SubscribeOptions,
} from './rabbit.interfaces';

const $queue = (name: string, prefix?: string) => {
  if (prefix) {
    return `${prefix}.${name}`;
  }
  return name;
};

const $exchange = (topic: string, type: ExchangeType, prefix?: string) => {
  if (prefix) {
    return `${prefix}.${topic}.${type}`;
  }
  return `${topic}.${type}`;
};

const minify = (obj: any) => {
  return JSON.stringify(obj, undefined, 0);
};

@Injectable()
export class RabbitService {
  protected logger = new Logger(RabbitService.name);
  protected connection: AmqpConnectionManager;
  protected channels: Map<number, ChannelWrapper>;
  protected asserted: { exchanges: Set<string>; queues: Set<string> };
  protected options: Required<RabbitOptions>;
  protected _status: 'connecting' | 'connected' | 'disconnected';

  constructor(options: RabbitOptions) {
    this.options = {
      debug: process.env['NODE_ENV'] !== 'production',
      connect: 'amqp://localhost:5672',
      prefix: {
        queue: undefined,
        exchange: undefined,
      },
      serialize: (content) => {
        if (typeof content === 'string') {
          return Buffer.from(content);
        }
        return Buffer.from(minify(content));
      },
      deserialize: (buffer) => {
        const str = buffer.toString('utf8');
        return JSON.parse(str);
      },
      ...options,
    };
    if (!this.options.debug) {
      this.logger = new Proxy(this.logger, {
        get(target, property, receiver) {
          if (property === 'debug') {
            return function () {};
          }
          return Reflect.get(target, property, receiver);
        },
      });
    }
    this._status = 'connecting';
    this.connection = amqp.connect(options.connect);
    this.connection.on('connect', () => {
      this.logger.debug(`Connection is connected`);
      this._status = 'connected';
    });
    this.connection.on('disconnect', ({ err }) => {
      this.logger.debug(`Connection is disconnected`, err);
      this._status = 'disconnected';
    });
    this.channels = new Map();
    this.asserted = { exchanges: new Set(), queues: new Set() };
  }

  public get status() {
    return this._status;
  }

  public close() {
    return this.connection.close();
  }

  protected async assertChannel(concurrency = 1) {
    let channel = this.channels.get(concurrency);
    if (!channel) {
      channel = this.connection.createChannel({
        setup: (channel: ConfirmChannel) => {
          return channel.prefetch(concurrency, false);
        },
      });
      this.channels.set(concurrency, channel);
    }
    await channel.waitForConnect();
    return channel;
  }

  public async publish(message: PublishMessage) {
    const { content, topic, type, routing = '', options = {} } = message;
    const exchange = $exchange(topic, type, this.options.prefix.exchange);
    this.logger.debug(
      `Publish to exchange=${exchange} | routing=${routing} | content=${minify(content)} | options=${minify(options)}`,
    );
    const channel = await this.assertChannel();
    const buffer = this.options.serialize(content);
    return channel.publish(exchange, routing, buffer, options);
  }

  public async send<T = any>(message: SendMessage<T>) {
    // eslint-disable-next-line prefer-const
    let { queue, content, options } = message;
    queue = $queue(queue, this.options.prefix.queue);
    this.logger.debug(`Send to queue=${queue} | content=${minify(content)} | options=${minify(options)}`);
    const channel = await this.assertChannel();
    return channel.sendToQueue(queue, content, options);
  }

  public async subscribe(
    source: string,
    callback: (channel: ChannelWrapper, message: ConsumeMessage) => any,
    options: SubscribeOptions = {},
  ) {
    const channel = await this.assertChannel(options.concurrency);
    const queue = $queue(source, this.options.prefix.queue);
    this.logger.debug(`Create consumer on queue=${queue}`);
    return channel.consume(
      queue,
      (msg) => {
        msg.content = this.options.deserialize(msg.content);
        return callback(channel, msg);
      },
      options,
    );
  }

  public async assertQueue(name: string, options?: Options.AssertQueue) {
    let reply = {
      queue: $queue(name, this.options.prefix.queue),
    } as Replies.AssertQueue;
    if (this.asserted.queues.has(reply.queue)) {
      return reply;
    }
    const channel = await this.assertChannel();
    this.logger.debug(`Assert queue=${reply.queue} | options=${minify(options)}`);
    reply = await channel.assertQueue(reply.queue, options);
    this.asserted.queues.add(reply.queue);
    return reply;
  }

  public async assertRetryableQueue(name: string, delay: number, options?: Options.AssertQueue) {
    let targetQueue = {
      queue: $queue(name, this.options.prefix.queue),
    } as Replies.AssertQueue;
    if (this.asserted.queues.has(targetQueue.queue)) {
      return targetQueue;
    }
    const retryExchange = await this.assertExchange('retry', 'direct', { durable: true, autoDelete: false });
    const delayQueue = await this.assertQueue(`${name}.delay`, {
      durable: true,
      autoDelete: false,
      messageTtl: delay,
      deadLetterExchange: retryExchange.exchange,
      deadLetterRoutingKey: targetQueue.queue,
    });
    targetQueue = await this.assertQueue(name, {
      ...options,
      deadLetterExchange: retryExchange.exchange,
      deadLetterRoutingKey: delayQueue.queue,
    });
    await this.bindQueue(name, { topic: 'retry', type: 'direct', routing: targetQueue.queue });
    await this.bindQueue(`${name}.delay`, { topic: 'retry', type: 'direct', routing: delayQueue.queue });
    return targetQueue;
  }

  public async assertExchange(topic: string, type: ExchangeType, options?: Options.AssertExchange) {
    let reply = {
      exchange: $exchange(topic, type, this.options.prefix.exchange),
    } as Replies.AssertExchange;
    if (this.asserted.exchanges.has(reply.exchange)) {
      return reply;
    }
    const channel = await this.assertChannel();
    this.logger.debug(`Assert exchange=${reply.exchange} | options=${minify(options)}`);
    reply = await channel.assertExchange(reply.exchange, type, options);
    this.asserted.exchanges.add(reply.exchange);
    return reply;
  }

  public async bindQueue(name: string, source: MessageSource) {
    const queue = $queue(name, this.options.prefix.queue);
    const exchange = $exchange(source.topic, source.type, this.options.prefix.exchange);
    this.logger.debug(`Bind queue=${queue} to source=${minify(source)}`);
    const channel = await this.assertChannel();
    if (source.type === 'direct') {
      return channel.bindQueue(queue, exchange, source.routing);
    }
    if (source.type === 'fanout') {
      return channel.bindQueue(queue, exchange, '');
    }
    if (source.type === 'headers') {
      return channel.bindQueue(queue, exchange, '', {
        'x-match': source.match,
        ...source.headers,
      });
    }
    if (source.type === 'topic') {
      return channel.bindQueue(queue, exchange, source.routing);
    }
    throw new UnknownMessageSourceError(source);
  }
}
