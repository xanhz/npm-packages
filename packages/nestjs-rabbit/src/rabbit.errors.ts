import { MessageSource } from './rabbit.interfaces';

export class MissingSubscriberMetadataError extends Error {
  constructor(cname: string) {
    super(`Class '${cname}' is missing subscribe metadata`);
  }
}

export class UnknownMessageSourceError extends Error {
  constructor(source: MessageSource) {
    super(`Unknown message source topic '${source.topic}' and type '${source.type}'`);
  }
}
