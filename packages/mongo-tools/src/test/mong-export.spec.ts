import { MongoTools } from '..';

jest.setTimeout(60_000);

describe('Mongo Export', () => {
  it('Should export success into products.json', () => {
    const promise = MongoTools.$export({
      host: '127.0.0.1',
      db: 'test-dump',
      collection: 'products',
      out: 'products.json',
    });
    return expect(promise).resolves.toBe(void 0);
  });
});
