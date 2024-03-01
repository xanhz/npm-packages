import { MongoTools } from '..';

jest.setTimeout(60_000);

describe('Mongo Restore', () => {
  it('Should restore success from test-dump.gz', () => {
    const promise = MongoTools.$restore({
      host: '127.0.0.1',
      db: 'test-dump',
      archive: 'test-dump.gz',
      gzip: true,
    });
    return expect(promise).resolves.toBe(void 0);
  });
});
