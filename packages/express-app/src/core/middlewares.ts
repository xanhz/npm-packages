import { randomUUID } from 'crypto';
import { Handler } from 'express';
import { IExpressApplication, RequestContext } from './interfaces';
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
