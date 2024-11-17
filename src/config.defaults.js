if (process.env.BROWSER) {
  throw new Error(
    'Do not import `config.js` from inside the client-side code.',
  );
}

// default config, this file should not be changed unless you are adding a new key
export default {
  // Node.js app
  port: process.env.PORT || 3003,

  consoleEndpoints: false,
  consoleQueries: false,

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
    host: 'eol-sql-amd-do-user-3380165-0.c.db.ondigitalocean.com',
    port: 25060,
    user: 'sandbox',
    pass: 'AVNS_BMv__q3E57g5owVincz',
    database: 'eolwebtest',
  },

  // files
  publicFolder: '/public',
  s3SubFolder: 'test/',
  timeFolder: '67c4e1d54e3844bb8b46f1b6961388a5',

  // s3
  accessKeyId: '',
  secretAccessKey: '',
  SWaccessKeyId: '',
  SWsecretAccessKey: '',

  // Google
  google: {
    maps: 'AIzaSyDE8Prt4OybzNNxo1MzIn1XYNGxm9rI8Zk',
  },

  // auth
  // prettier-ignore
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
    playStats: 'asdigbaksdyg12kuhasdfjyhgkjhasd',
  },

  // Discord
  discord: {
    botApi: '', // url that discord bot api runs on
    botApiAuth: '', // Authorization header checked by discord bot api
    channels: {
      battle: 'battle',
      times: 'times',
      events: 'events',
      admin: 'admin',
    },
    apiAuth: '', // Authorization header sent by game events
    url: 'https://test.elma.online/', // url used in discord messages
  },
};
