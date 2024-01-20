import { CorsOptions } from 'cors';
import { IncomingMessage, ServerResponse } from 'http';
import { Logger } from './logger';

interface Type<T = any> extends Function {
  new (...args: any[]): T;
}

type InjectionToken<T = any> = string | Type<T>;

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

interface LoggingOptions {
  /**
   * Routes should be excluded when logging
   */
  exclude?: Array<string | RegExp>;
}

interface RawOptions {
  /** When set to true, then deflated (compressed) bodies will be inflated; when false, deflated bodies are rejected. Defaults to true. */
  inflate?: boolean | undefined;
  /**
   * Controls the maximum request body size. If this is a number,
   * then the value specifies the number of bytes; if it is a string,
   * the value is passed to the bytes library for parsing. Defaults to '100kb'.
   */
  limit?: number | string | undefined;
  /**
   * The type option is used to determine what media type the middleware will parse
   */
  type?: string | string[] | ((req: IncomingMessage) => any) | undefined;
  /**
   * The verify option, if supplied, is called as verify(req, res, buf, encoding),
   * where buf is a Buffer of the raw request body and encoding is the encoding of the request.
   */
  verify?(req: IncomingMessage, res: ServerResponse, buf: Buffer, encoding: string): void;
}

interface JsonOptions extends RawOptions {
  /**
   * The reviver option is passed directly to JSON.parse as the second argument.
   */
  reviver?(key: string, value: any): any;
  /**
   * When set to `true`, will only accept arrays and objects;
   * when `false` will accept anything JSON.parse accepts. Defaults to `true`.
   */
  strict?: boolean | undefined;
}

interface UrlencodedOptions extends RawOptions {
  /**
   * The extended option allows to choose between parsing the URL-encoded data
   * with the querystring library (when `false`) or the qs library (when `true`).
   */
  extended?: boolean | undefined;
  /**
   * The parameterLimit option controls the maximum number of parameters
   * that are allowed in the URL-encoded data. If a request contains more parameters than this value,
   * a 413 will be returned to the client. Defaults to 1000.
   */
  parameterLimit?: number | undefined;
}

interface TextOptions extends RawOptions {
  /**
   * Specify the default character set for the text content if the charset
   * is not specified in the Content-Type header of the request.
   * Defaults to `utf-8`.
   */
  defaultCharset?: string | undefined;
}

export interface ApplicationOptions {
  /**
   * Application name
   */
  name?: string;
  /**
   * Router prefix
   */
  prefix?: string;
  /**
   * Logging request options
   */
  logging?: LoggingOptions;
  /**
   * Cors options
   */
  cors?: CorsOptions;
  /**
   * Body parser options
   */
  parsers?: {
    json?: JsonOptions;
    raw?: RawOptions;
    text?: TextOptions;
    urlencoded?: UrlencodedOptions;
  };
}
