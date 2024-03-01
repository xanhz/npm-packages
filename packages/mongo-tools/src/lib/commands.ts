import { EJSON } from 'bson';
import { spawn } from 'child_process';
import { DumpOptions, ExportOptions, ImportOptions, RestoreOptions } from './interfaces';
import * as _ from './lodash';

export namespace MongoTools {
  const MultiFields = ['excludeCollection', 'excludeCollectionsWithPrefix', 'nsExclude', 'nsInclude'];

  class MongoToolsError extends Error {
    public readonly code: number | null;
    public readonly signal: NodeJS.Signals | null;

    constructor(code: number | null, signal: NodeJS.Signals | null) {
      if (code == null) {
        super(`Execute command failed`);
      } else {
        super(`Execute command failed with code ${code}`);
      }
      this.code = code;
      this.signal = signal;
    }
  }

  function toArgs(options: Record<string, any>): string[] {
    return Object.entries(options).map(([key, value]) => {
      if (_.isTrue(value)) {
        return `--${key}`;
      }
      if (_.isArray(value)) {
        if (MultiFields.includes(key)) {
          return value.map((item) => `--${key}=${item}`).join(' ');
        }
        return `--${key}=${value.join(',')}`;
      }
      if (_.isObject(value)) {
        return `--${key}=${EJSON.stringify(value, undefined, 0)}`;
      }
      return `--${key}=${value}`;
    });
  }

  function run(command: string, options: Record<string, any>) {
    const args = toArgs(options);
    return new Promise<void>((resolve, reject) => {
      const stream = spawn(command, args);
      stream.on('error', (error) => reject(error));
      stream.stdout.on('data', (message: Buffer) => {
        console.log(message.toString());
      })
      stream.stderr.on('data', (message: Buffer) => {
        console.log(message.toString());
      })
      stream.on('close', (code, signal) => {
        if (code === 0) {
          return resolve(void 0);
        }
        const error = new MongoToolsError(code, signal);
        return reject(error);
      });
    });
  }

  /**
   * @tutorial https://www.mongodb.com/docs/database-tools/mongodump
   */
  export function $dump(options: DumpOptions) {
    return run('mongodump', options);
  }

  /**
   * @tutorial https://www.mongodb.com/docs/database-tools/mongorestore
   */
  export function $restore(options: RestoreOptions) {
    return run('mongorestore', options);
  }

  /**
   * @tutorial https://www.mongodb.com/docs/database-tools/mongoimport
   */
  export function $import(options: ImportOptions) {
    return run('mongoimport', options);
  }

  /**
   * @tutorial https://www.mongodb.com/docs/database-tools/mongoexport
   */
  export function $export(options: ExportOptions) {
    return run('mongoexport', options);
  }
}
