import * as _ from '../utils/lodash';

interface HttpErrorOptions {
  code: number;
  stack?: string;
  message?: string;
}

interface ErrorOptions extends Omit<HttpErrorOptions, 'code'> {}

export class HttpError extends Error {
  public readonly code: number;

  constructor(options: HttpErrorOptions) {
    const { code, stack = null, message = 'Unknown error' } = options;
    super(message);
    this.code = code;
    if (!_.isNil(stack)) {
      this.stack = stack;
    }
  }

  toJSON() {
    return {
      code: this.code,
      name: this.name,
      message: this.message,
    };
  }
}

export class IntervalServerError extends HttpError {
  constructor(options: ErrorOptions = {}) {
    const { message = IntervalServerError.name, stack } = options;
    super({
      code: 500,
      message,
      stack,
    });
  }
}

export class BadRequestError extends HttpError {
  constructor(options: ErrorOptions = {}) {
    const { message = BadRequestError.name, stack } = options;
    super({
      code: 400,
      message,
      stack,
    });
  }
}

export class UnauthorizedError extends HttpError {
  constructor(options: ErrorOptions = {}) {
    const { message = UnauthorizedError.name, stack } = options;
    super({
      code: 401,
      message,
      stack,
    });
  }
}

export class ForbiddenError extends HttpError {
  constructor(options: ErrorOptions = {}) {
    const { message = ForbiddenError.name, stack } = options;
    super({
      code: 403,
      message,
      stack,
    });
  }
}

export class NotFoundError extends HttpError {
  constructor(options: ErrorOptions = {}) {
    const { message = NotFoundError.name, stack } = options;
    super({
      code: 404,
      message,
      stack,
    });
  }
}

export class ConflictError extends HttpError {
  constructor(options: ErrorOptions = {}) {
    const { message = NotFoundError.name, stack } = options;
    super({
      code: 409,
      message,
      stack,
    });
  }
}

export class TooManyRequestError extends HttpError {
  constructor(options: ErrorOptions = {}) {
    const { message = NotFoundError.name, stack } = options;
    super({
      code: 429,
      message,
      stack,
    });
  }
}
