import { Options } from 'amqplib';

export type ExchangeType = 'direct' | 'fanout' | 'topic' | 'headers';

export interface RabbitOptions {
  debug?: boolean;
  connect?: string | Options.Connect;
  prefix?: {
    queue?: string;
    exchange?: string;
  };
  serialize?: (content: unknown) => Buffer;
  deserialize?: (buffer: Buffer) => any;
}

export interface SendMessage<T = any> {
  queue: string;
  content: T;
  options?: Options.Publish;
}

export interface PublishMessage<T = any> {
  topic: string;
  type: ExchangeType;
  content: T;
  routing?: string;
  options?: Options.Publish;
}

export interface SubscribeOptions extends Options.Consume {
  concurrency?: number;
}

export type DirectMessageSource = {
  topic: string;
  type: 'direct';
  routing: string;
};

export type FanoutMessageSource = {
  topic: string;
  type: 'fanout';
};

export type TopicMessageSource = {
  topic: string;
  type: 'topic';
  routing: string;
};

export type HeadersMessageSource = {
  topic: string;
  type: 'headers';
  match: 'any' | 'all' | 'any-with-x' | 'all-with-x';
  headers: Record<string, string>;
};

export type MessageSource = DirectMessageSource | FanoutMessageSource | TopicMessageSource | HeadersMessageSource;

type KeepOnFailed = {
  operation: 'keep';
};

type RemoveOnFailed = {
  operation: 'remove';
};

type SendOnFailed = {
  operation: 'send';
  queue: string;
};

type PublishOnFailed = {
  operation: 'publish';
  topic: string;
  type: ExchangeType;
  routing?: string;
};

export interface BackoffOptions {
  attempts: number;
  delay: number;
  onfailed?: KeepOnFailed | RemoveOnFailed | SendOnFailed | PublishOnFailed;
}

export interface SubscriberOptions extends SubscribeOptions {
  queue: {
    name: string;
    options?: Options.AssertQueue;
    backoff?: BackoffOptions;
  };
  sources: MessageSource[];
}
