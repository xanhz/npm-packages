# Express App for personal project

## Usage

```js
// services/env.service.js
const dotenv = require('dotenv');

class EnvService {
  constructor(opts = {}) {
    const { parsed = {} } = dotenv.config(opts);
    this.store = { ...process.env, ...parsed };
  }

  get(key, defaultValue = null) {
    return this.store[key] ?? defaultValue;
  }
}

module.exports = { EnvService };

// app.js
const { ExpressApplication } = require('@xanhz/express-app');
const { EnvService } = require('./services/env.service');

const app = new ExpressApplication({
  name: 'my-app',
  cors: {
    origin: '*',
  },
  logging: {
    exclude: [],
  },
});

app.register([
  {
    provide: EnvService,
    useValue: new EnvService({
      path: process.env.NODE_ENV === 'production' ? '.env' : 'dev.env',
    }),
  },
  {
    provide: 'OTHER_SERVICE',
    inject: [EnvService],
    useFactory: (env) => {
      // create other service with env here
    },
  },
]);

module.exports = app;

// router.js
const { createRequestHandler, Storage } = require('@xanhz/express-app');
const express = require('express');

const router = express.Router();

const callback = (req) => {
  const ctx = Storage.getStore();
  const reqID = ctx.reqID; // get request id
  const logger = ctx.logger; // get logger attach to this request
  const env = ctx.get(EnvService); // get provider registered with app

  // handle request
  // return data
};

router.get('hello-world', createRequestHandler(callback));

module.exports = router;

// main.js
const { Logger } = require('@xanhz/express-app');
const app = require('./app');
const router = require('./router');
const { EnvService } = require('./services/env.service');

async function main() {
  await app.bootstrap();

  const env = app.get(EnvService);
  const logger = app.get(Logger);

  app.use(router);

  const port = +env.get('PORT', 3000);
  app.listen(port, () => {
    logger.info('Listening on port %d', port);
  });
}

main();
```
