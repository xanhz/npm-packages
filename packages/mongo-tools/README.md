# mongo-tools

#### A NodeJS Package for MongoDB Database Tools

## 1. Mongo Dump

```js
const { MongoTools } = require('@xanhz/mongo-tools');

MongoTools.$dump({
  host: '127.0.0.1',
  db: 'test-dump',
  archive: 'test-dump.gz',
  gzip: true,
})
  .then(() => console.log('Finish'))
  .catch((error) => console.error(error));
```

## 2. Mongo Restore

```js
const { MongoTools } = require('@xanhz/mongo-tools');

MongoTools.$restore({
  host: '127.0.0.1',
  db: 'test-dump',
  archive: 'test-dump.gz',
  gzip: true,
})
  .then(() => console.log('Finish'))
  .catch((error) => console.error(error));
```

## 3. Mongo Import

```js
const { MongoTools } = require('@xanhz/mongo-tools');

MongoTools.$import({
  host: '127.0.0.1',
  db: 'test-dump',
  collection: 'products',
  file: 'products.json',
})
  .then(() => console.log('Finish'))
  .catch((error) => console.error(error));
```

## 3. Mongo Export

```js
const { MongoTools } = require('@xanhz/mongo-tools');

MongoTools.$export({
  host: '127.0.0.1',
  db: 'test-dump',
  collection: 'products',
  out: 'products.json',
})
  .then(() => console.log('Finish'))
  .catch((error) => console.error(error));
```
