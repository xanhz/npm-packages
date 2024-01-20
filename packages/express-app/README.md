# Installation

```bash
npm install express @xanhz/express-app
```

# Usage

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
const { ApplicationFactory } = require('@xanhz/express-app');
const { EnvService } = require('./services/env.service');

const app = new ApplicationFactory.create();

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
const { Router } = require('express');

const router = Router();

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
const { Logger, log } = require('@xanhz/express-app');
const cors = require('cors');
const compression = require('compression');
const { json, urlencoded } = require('express');
const app = require('./app');
const router = require('./router');
const { EnvService } = require('./services/env.service');

async function main() {
  await app.bootstrap();

  const env = app.get(EnvService);
  const logger = app.get(Logger);

  const middlewares = [
    cors(),
    compression(),
    json({
      limit: '5mb',
    }),
    urlencoded({
      limit: '5mb',
      extend: true,
    }),
    log({
      exclude: ['/'],
    }),
  ];

  const port = +env.get('PORT', 3000);

  app
    .use(...middlewares)
    .use(router)
    .listen(port, () => {
      logger.info('Listening on port %d', port);
    });
}

main();
```
