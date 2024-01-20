import { CorsOptions } from 'cors';
import { Logger } from './logger';

export interface Type<T = any> extends Function {
  new (...args: any[]): T;
}

export type InjectionToken<T = any> = string | Type<T>;

export interface ValueProvider<T = any> {
  provide: InjectionToken<T>;
  useValue: T;
}

export interface FactoryProvider<T = any> {
  provide: InjectionToken<T>;
  useFactory: (...args: any[]) => T | Promise<T>;
  inject?: InjectionToken[];
}

export type Provider<T = any> = ValueProvider<T> | FactoryProvider<T>;

export interface RequestContext {
  reqID: string;
  logger: Logger;
  get<TInput = any, TResult = TInput>(token: string | Type<TInput>): TResult;
}

export interface IExpressApplication {
  bootstrap(): Promise<void>;

  close(): Promise<void>;

  disable(setting: string): IExpressApplication;

  enable(setting: string): IExpressApplication;

  get<TInput = any, TResult = TInput>(token: string | Type<TInput>): TResult;

  set(setting: string, val: any): IExpressApplication;

  use(...handlers: any[]): IExpressApplication;

  listen(port: number, callback?: () => void): void;

  register(providers: Provider[]): IExpressApplication;
}

export interface OnApplicationBootstrap {
  onBootstrap(): Promise<any>;
}

export interface OnApplicationDestroy {
  onDestroy(): Promise<any>;
}

export interface OnHeartbeat {
  onHeartbeat(): Promise<any>;
}

export interface LoggingOptions {
  exclude?: Array<string | RegExp>;
}

export interface ApplicationOptions {
  name?: string;
  prefix?: string;
  logging?: LoggingOptions;
  cors?: CorsOptions;
}
