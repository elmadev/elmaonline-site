/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* eslint-disable max-len */

if (process.env.BROWSER) {
  throw new Error(
    'Do not import `config.js` from inside the client-side code.',
  );
}

module.exports = {
  // Node.js app
  port: process.env.PORT || 3000,

  // API Gateway
  api: {
    // API URL to be used in the client-side code
    clientUrl: process.env.API_CLIENT_URL || '',
    // API URL to be used in the server-side code
    serverUrl:
      process.env.API_SERVER_URL ||
      `http://localhost:${process.env.PORT || 3000}`,
  },

  // Database
  mysql: {
    host: 'sql.elma.online',
    port: 3306,
    user: 'sandbox',
    pass: 'Icommandthesun',
    database: 'eol1',
  },

  // files
  publicFolder: '/public',
  s3SubFolder: 'test/',

  // s3
  accessKeyId: 'BK6SGSL7RYGCASA3PUSV',
  secretAccessKey: '+7AvMTUk6QoPyqjud9Bz+Ai0M+A13eGgLRjrWw0nlrA',

  // Web analytics
  analytics: {
    // https://analytics.google.com/
    googleTrackingId: process.env.GOOGLE_TRACKING_ID, // UA-XXXXX-X
  },

  // Authentication
  auth: {
    TODO: 'Grant config',
  },
};
