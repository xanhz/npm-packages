import { Handler, Request, Response } from 'express';
import { Writable } from 'stream';
import { toHttpError } from '../utils/error';
import { Storage } from './storage';

export function createRequestHandler(fn: (req: Request, res: Response) => any): Handler {
  return async (req, res) => {
    const ctx = Storage.getStore();
    try {
      const data = await fn(req, res);
      if (data instanceof Writable) {
        res.pipe(data);
      } else {
        res.status(200).send({ code: 200, data });
      }
    } catch (error) {
      const httpError = toHttpError(error);
      ctx.logger.error(httpError);
      const body = httpError.toJSON();
      res.status(body.code).send(body);
    }
  };
}
