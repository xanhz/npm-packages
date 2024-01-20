import { RequestHandler } from 'express';
import { Storage } from '../core';
import * as _ from '../utils/lodash';

export interface LoggingOptions {
  /**
   * Routes should be excluded when logging
   */
  exclude?: Array<string | RegExp>;
}

export const log = (options: LoggingOptions = {}): RequestHandler => {
  const { exclude = [] } = options;

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
