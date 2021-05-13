const defaults = require('./config.defaults');
const local = require('./config.local');

if (process.env.BROWSER) {
  throw new Error(
    'Do not import `config.js` from inside the client-side code.',
  );
}

// combine defaults with local config, giving priority to local
module.exports = { ...defaults, ...local };
