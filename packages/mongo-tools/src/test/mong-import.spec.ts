import { MongoTools } from '..';

jest.setTimeout(60_000);

describe('Mongo Import', () => {
  it('Should import success into collection products', () => {
    const promise = MongoTools.$import({
      host: '127.0.0.1',
      db: 'test-dump',
      collection: 'products',
      file: 'products.json',
    });
    return expect(promise).resolves.toBe(void 0);
  });
});
