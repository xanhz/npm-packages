import util = require('util');
import winston = require('winston');

const { combine, errors, timestamp, json } = winston.format;

const format = () => {
  return {
    transform: (info: any) => {
      const args = info[Symbol.for('splat')];
      if (args) {
        info.message = util.format(info.message, ...args).replace(/"/g, "'");
      }
      const { message, timestamp, level, ...rest } = info;
      return { level, timestamp, ...rest, message };
    },
  };
};

const formatters = [errors({ stack: true }), timestamp({}), format(), json({ space: 0, deterministic: false })];

const root = winston.createLogger({
  exitOnError: false,
  level: 'info',
  format: combine(...formatters),
  transports: [new winston.transports.Console()],
  exceptionHandlers: [new winston.transports.Console()],
});

export class Logger {
  private readonly instance: winston.Logger;

  constructor(ctx?: string | Record<string, any>) {
    const options = typeof ctx === 'object' ? ctx : { ctx };
    this.instance = root.child(options);
  }

  debug(message: any, ...args: any[]) {
    this.instance.log('debug', message, ...args);
  }

  info(message: any, ...args: any[]) {
    this.instance.log('info', message, ...args);
  }

  warn(message: any, ...args: any[]) {
    this.instance.log('warn', message, ...args);
  }

  error(message: any, ...args: any[]) {
    this.instance.log('error', message, ...args);
  }
}
