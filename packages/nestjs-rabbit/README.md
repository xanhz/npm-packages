# @xanhz/nestjs-rabbitmq

RabbitMQ module for NestJS

# **1. Installation**

```bash
# For npm
npm install @xanhz/nestjs-rabbit

# For yarn
yarn install @xanhz/nestjs-rabbit
```

# **2. Usage**

## **2.1. Module Initialization**

```ts
import { Module } from '@nestjs/common';
import { RabbitModule } from '@xanhz/nestjs-rabbit';

@Module({
  imports: [
    RabbitModule.forRootAsync({
      useFactory: () => {
        return {
          debug: true,
          connect: 'amqp://localhost:5672',
          prefix: {
            queue: 'prefix',
            exchange: 'prefix',
          },
          deserialize(buffer: Buffer) {
            const str = buffer.toString('utf8');
            return JSON.parse(str);
          },
          serialize(content: unknown) {
            if (typeof content === 'string') {
              return Buffer.from(content);
            }
            content = JSON.stringify(content, undefined, 0);
            return Buffer.from(content as string);
          },
        };
      },
    }),
  ],
})
export class AppModule {}
```

## **2.2. Publish message**

```ts
import { Body, Controller, Post } from '@nestjs/common';
import { RabbitService } from '@xanhz/nestjs-rabbit';

@Controller()
export class AppController {
  constructor(private readonly rabbit: RabbitService) {}

  @Post()
  public publish() {
    return this.rabbit.publish({
      topic: 'some-topic',
      type: 'direct',
      routing: 'routing-pattern',
      content: {
        message: 'hello world',
      },
      options: {
        persistent: true,
      },
    });
  }
}
```

## **2.3. Subscribe message**

```ts
import { RabbitMessage, RabbitSubscriber, Subscriber } from '@xanhz/nestjs-rabbit';

@Subscriber({
  queue: {
    name: 'direct-queue',
    options: {
      durable: true,
      autoDelete: false,
    },
    backoff: {
      attempts: 5, // maximum retry
      delay: 5_000, // delay in ms
      onfailed: {
        operation: 'remove', // remove | keep | send | publish
        queue: 'queue to send with operation send',
        topic: 'topic to publish with operation publish',
        type: 'type of exchange to publish',
        routing: 'routing key to publish',
      },
    },
  },
  // define binding to queue
  sources: [
    {
      topic: 'exchange',
      type: 'direct',
      routing: 'direct-queue',
    },
  ],
  // prefetch
  concurrency: 1,
  // manually ack
  noAck: false,
})
export class DirectSubscriber extends RabbitSubscriber {
  public async process(message: RabbitMessage<{ message: string }>) {
    console.log(message.content);
  }
}
```
