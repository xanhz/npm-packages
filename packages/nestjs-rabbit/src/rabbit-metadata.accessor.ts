import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SubscriberOptions } from './rabbit.interfaces';
import { SUBSCRIBER_METADATA } from './rabbit.constants';

@Injectable()
export class RabbitMetadataAccessor {
  constructor(private readonly reflector: Reflector) {}

  public getSubscriberMetadata(target: Function) {
    return this.reflector.get<SubscriberOptions>(SUBSCRIBER_METADATA, target);
  }
}
