import { OnApplicationBootstrap, OnApplicationDestroy, OnHeartbeat } from '../core';
import * as _ from './lodash';

export function isOnApplicationBootstrap(obj: any): obj is OnApplicationBootstrap {
  return 'onBootstrap' in obj && typeof obj.onBootstrap === 'function';
}

export function isOnApplicationDestroy(obj: any): obj is OnApplicationDestroy {
  return 'onDestroy' in obj && typeof obj.onDestroy === 'function';
}

export function isOnHeartbeat(obj: any): obj is OnHeartbeat {
  return 'onHeartbeat' in obj && typeof obj.onHeartbeat === 'function';
}

export function toStringToken(token: Function | string) {
  return _.isFunction(token) ? token.name : token;
}
