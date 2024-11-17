import { SetMetadata } from '@nestjs/common';
import { SubscriberOptions } from './rabbit.interfaces';
import { SUBSCRIBER_METADATA } from './rabbit.constants';

export function Subscriber(options: SubscriberOptions): ClassDecorator {
  return (target) => {
    SetMetadata(SUBSCRIBER_METADATA, options)(target);
  };
}
