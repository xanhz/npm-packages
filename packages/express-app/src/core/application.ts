import { Express } from 'express';
import { isOnApplicationBootstrap, isOnApplicationDestroy, isOnHeartbeat, toStringToken } from '../utils/app';
import { toHttpError } from '../utils/error';
import * as _ from '../utils/lodash';
import { ApplicationOptions, IExpressApplication, Provider, Type } from './interfaces';
import { Logger } from './logger';
import { log, context } from './middlewares';

import express = require('express');
import $cors = require('cors');

export class ExpressApplication implements IExpressApplication {
  public readonly name: string;
  public readonly prefix: string;
  protected readonly providers: Provider[];
  protected readonly containers: Map<string, any>;
  protected readonly express: Express;
  protected readonly logger: Logger;

  constructor(options: ApplicationOptions = {}) {
    const { cors, logging, name = ExpressApplication.name, prefix = '', parsers = {} } = options;
    const { json, urlencoded, raw, text } = parsers;

    this.name = name;
    this.prefix = prefix;
    this.providers = [];
    this.containers = new Map();
    this.express = express();
    this.logger = new Logger(name);

    const middlewares = [$cors(cors), context(this), express.json(json), express.urlencoded(urlencoded)];

    if (!_.isNil(raw)) {
      middlewares.push(express.raw(raw));
    }

    if (!_.isNil(text)) {
      middlewares.push(express.text(text));
    }

    this.express.use(...middlewares, log(logging));

    this.setupHeartbeat();
  }

  private setupHeartbeat() {
    this.express.get('/heartbeat/ping', (_, res) => res.send(`Hi I am ${this.name}`));
    this.express.get('/heartbeat/ready', async (_, res) => {
      try {
        const services = this.containers.values();
        for (const service of services) {
          if (isOnHeartbeat(service)) {
            await service.onHeartbeat();
          }
        }
        res.send(`${this.name} is ready`);
      } catch (e) {
        const error = toHttpError(e);
        res.status(error.code).send(error.toJSON());
      }
    });
  }

  public async bootstrap(): Promise<void> {
    for (const provider of this.providers) {
      // @ts-ignore
      const { provide, inject = [], useFactory, useValue } = provider;
      const token = toStringToken(provide);
      let instance = null;

      this.logger.info('Initializing %s', token);

      if (!_.isNil(useValue)) {
        instance = useValue;
      }

      if (!_.isNil(useFactory)) {
        const args = inject.map((arg: any) => {
          const token = toStringToken(arg);
          const value = this.containers.get(token);
          if (_.isNil(value)) {
            throw new Error(`Missing ${token}`);
          }
          return value;
        });
        instance = await useFactory(...args);
      }

      if (_.isNil(instance)) {
        throw new Error(`Missing value or factory to create ${token}`);
      }

      this.containers.set(token, instance);

      if (isOnApplicationBootstrap(instance)) {
        this.logger.info('Bootstrapping %s', token);
        await instance.onBootstrap();
      }
    }
  }

  public async close(): Promise<void> {
    this.logger.info('Closing app...');
    for (const [token, instance] of this.containers.entries()) {
      if (isOnApplicationDestroy(instance)) {
        this.logger.info('Destroying %s', token);
        await instance.onDestroy();
      }
    }
  }

  public disable(setting: string): IExpressApplication {
    this.express.disable(setting);
    return this;
  }

  public enable(setting: string): IExpressApplication {
    this.express.enable(setting);
    return this;
  }

  public get<TInput = any, TResult = TInput>(token: string | Type<TInput>): TResult {
    const $token = toStringToken(token);
    if ($token === Logger.name) {
      return this.logger as TResult;
    }
    return this.containers.get($token);
  }

  public set(setting: string, val: any): IExpressApplication {
    this.express.set(setting, val);
    return this;
  }

  public use(...handlers: any[]): IExpressApplication {
    this.express.use(this.prefix, ...handlers);
    return this;
  }

  public listen(port: number, callback = () => {}): void {
    this.express.listen(port, callback);
  }

  public register(providers: Provider<any>[]): IExpressApplication {
    this.providers.push(...providers);
    return this;
  }
}
