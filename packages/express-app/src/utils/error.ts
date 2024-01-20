import { HttpError, IntervalServerError } from '../core';
import * as _ from './lodash';

export function toHttpError(error: any) {
  if (error instanceof HttpError) {
    return error;
  }
  if (error instanceof Error) {
    const { message, stack } = error;
    return new IntervalServerError({ message, stack });
  }
  const message = _.isString(error) ? error : undefined;
  return new IntervalServerError({ message });
}
