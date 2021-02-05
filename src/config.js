/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* eslint-disable max-len */

// IMPORTANT NOTE:
// Adjust .github/workflows/*.yml after changes to make correct replacements in CI

if (process.env.BROWSER) {
  throw new Error(
    'Do not import `config.js` from inside the client-side code.',
  );
}

module.exports = {
  // Node.js app
  port: process.env.PORT || 3003,

  // API Gateway
  api: {
    // API URL to be used in the client-side code
    clientUrl: process.env.API_CLIENT_URL || '',
    // API URL to be used in the server-side code
    serverUrl:
      process.env.API_SERVER_URL ||
      `http://localhost:${process.env.PORT || 3003}`,
  },

  // Database
  mysql: {
    host: 'sql-master.elma.online',
    port: 3306,
    user: 'sandbox',
    pass: 'cksnmbmlfchozooqrdxahytwer',
    database: 'eolwebtest',
  },

  // files
  publicFolder: '/public',
  s3SubFolder: 'test/',

  // s3
  accessKeyId: '',
  secretAccessKey: '',

  // Google
  google: {
    maps: 'AIzaSyDE8Prt4OybzNNxo1MzIn1XYNGxm9rI8Zk',
  },

  // Authentication
  grant: {
    defaults: {
      protocol: 'https',
      host: process.env.API_CLIENT_URL || '',
      transport: 'session',
      state: true,
    },
  },
  // eslint-disable-next-line prettier/prettier
  jwtSecret: 'eAwI4zcTDd4Pvc8QtN9z57Fqsr4ENNcTpK1x4A1dCLj0Y44OravXZDzNbA-4VEwAIh1Hw3vn1nhB9ygWLqAGE4GiX6hjjLsJi8IJ',
  jwtAlgo: 'HS256',
  recaptcha: {
    client: '6Le-n9QUAAAAAG-3bYyysXddxwD6I6iJeDBTHf2r',
    server: '6Le-n9QUAAAAAHjJaG9QXAUcAzgu462rrpCF_Jan',
  },

  // email
  sibApiKey: '',

  // running scripts
  run: {
    ranking: 'ueMDaaSlyhNsYGUCGnq0FChDg0DSaPsRb3-gdMXz',
  },

  // Discord, with no token it will not attempt to connect
  // to test locally create own server and bot
  // see: https://discordjs.guide/preparations/setting-up-a-bot-application.html
  discord: {
    token: '',
    channels: {
      battle: '',
      times: '',
      events: '',
      admin: '',
    },
    apiAuth: '',
    url: 'https://test.elma.online/',
    icons: {
      started: '',
      queue: '',
      results: '',
      ended: '',
    },
    prefix: '!',
    bn: {
      storePath: '../bn/bn.store.json',
      logsPath: '../bn/logs/',
      fallbackChannelId: '219884674330132480',
    },
  },
};
