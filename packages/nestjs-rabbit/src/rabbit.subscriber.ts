import { Logger } from '@nestjs/common';
import { ConsumeMessage } from 'amqplib';

export interface RabbitMessage<T> extends Omit<ConsumeMessage, 'content'> {
  content: T;
}

export abstract class RabbitSubscriber<TInput = any, TOutput = any> {
  protected logger: Logger;

  constructor() {
    this.logger = new Logger(this.constructor.name);
  }

  public abstract process(message: RabbitMessage<TInput>): Promise<TOutput>;

  public onerror(message: RabbitMessage<TInput>, error: unknown) {
    this.logger.debug(error);
  }

  public onmessage(message: RabbitMessage<TInput>) {
    this.logger.debug(`Received message ${JSON.stringify(message, undefined, 0)}`);
  }

  public onsuccess(message: RabbitMessage<TInput>) {
    this.logger.debug(`Completed message ${JSON.stringify(message, undefined, 0)}`);
  }
}
