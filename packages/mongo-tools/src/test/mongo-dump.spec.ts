import { MongoTools } from '..';

jest.setTimeout(60_000);

describe('Mongo Dump', () => {
  it('Should dump and zip into test-dump.gz', () => {
    const promise = MongoTools.$dump({
      host: '127.0.0.1',
      db: 'test-dump',
      archive: 'test-dump.gz',
      gzip: true,
    });
    return expect(promise).resolves.toBe(void 0);
  });
});
