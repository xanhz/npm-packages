import { randomUUID } from 'crypto';
import { Handler } from 'express';
import * as _ from '../utils/lodash';
import { IExpressApplication, LoggingOptions, RequestContext } from './interfaces';
import { Logger } from './logger';
import { Storage } from './storage';

export const context = (app: IExpressApplication): Handler => {
  return (req, res, next) => {
    const reqID = randomUUID();
    res.setHeader('x-request-id', reqID);
    const ctx: RequestContext = {
      reqID,
      logger: new Logger({ reqID }),
      get: (token) => app.get(token),
    };
    Storage.run(ctx, () => next());
  };
};

export const log = (options: LoggingOptions = {}): Handler => {
  const { exclude = [] } = options;
  exclude.push('/heartbeat/ping', '/heartbeat/ready');

  return (req, res, next) => {
    const ctx = Storage.getStore();
    const { method, url, body } = req;

    const start = Date.now();

    const isDisabled = exclude.some((pattern) => {
      if (_.isString(pattern)) {
        return pattern === url;
      }
      return pattern.test(url);
    });

    if (isDisabled) {
      return next();
    }

    let msgFormat = '%s %s';
    let meta = [method, url];

    if (!_.isEmpty(body)) {
      msgFormat += ' - %o';
      meta = [...meta, body];
    }

    ctx.logger.info(msgFormat, ...meta);

    res.on('finish', () => {
      const { statusCode } = res;

      const end = Date.now();
      const duration = end - start;

      const msg = `${method} ${url} - ${statusCode} - ${duration} ms`;

      if (statusCode < 400) {
        ctx.logger.info(msg);
      } else {
        ctx.logger.error(msg);
      }
    });

    next();
  };
};
