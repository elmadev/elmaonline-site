import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import cors from 'cors';
import request from 'request';
import fileUpload from 'express-fileupload';
import config from './config.js';
import './data/sequelize.js';
import { auth, secretMatches } from '#utils/auth.js';
import renewToken, { renewedTokenHeader } from '#middlewares/renewToken.js';
import { loginLimit } from '#middlewares/rateLimit.js';
import securityHeaders from '#middlewares/securityHeaders.js';
import { downloadFileS3 } from '#utils/upload.js';
import apiRoutes from './api/index.js';
import eventsRoutes from './events.js';
import dlRoutes from './dl.js';
import runRoutes from './run.js';
import uploadRoutes from './upload.js';
import { writeHeapSnapshot } from 'v8';
import { unlink } from 'fs';

const app = express();

// headers first, so static files get them too
app.use(securityHeaders);

// ----------------------------------------------------------
// public/static folder
// ----------------------------------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(
  express.static(path.join(__dirname, '../public'), {
    setHeaders: res => {
      res.set('Cache-Control', 'public, max-age=31536000');
    },
  }),
);

// ----------------------------------------------------------
// express middleware
// ----------------------------------------------------------
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({ exposedHeaders: [renewedTokenHeader] }));
app.use(fileUpload());
app.use(bodyParser.raw({ type: 'application/octet-stream', limit: '10mb' }));
app.use(renewToken);

// ----------------------------------------------------------
// development settings
// ----------------------------------------------------------
if (process.env.NODE_ENV === 'development') {
  app.set('json spaces', 2);
  app.enable('trust proxy');
}

// ----------------------------------------------------------
// logging
// ----------------------------------------------------------
app.use(async (req, res, next) => {
  if (config.consoleEndpoints) {
    const t1 = new Date().getTime();

    res.on('finish', () => {
      const t2 = new Date().getTime();
      const dt = t2 - t1;

      // eslint-disable-next-line no-console
      console.log(req.method, req.originalUrl, `${dt}ms`);
    });
  }

  next();
});

// ----------------------------------------------------------
// endpoints
// ----------------------------------------------------------

// login
app.post('/token', loginLimit, async (req, res) => {
  const authResponse = await auth(req.body);
  // only failed logins count towards the rate limit
  res.locals.success = authResponse.success;
  res.json({ Response: authResponse });
});

// api
app.use('/api', apiRoutes);

// events
app.use('/events', eventsRoutes);

// downloading files
app.use('/dl', dlRoutes);

// cron jobs and data imports
app.use('/run', runRoutes);

// upload files
app.use('/upload', uploadRoutes);

// download short url
app.get('/u/:uuid/:filename', async (req, res) => {
  const allow = await downloadFileS3(req.params.uuid, req.params.filename);
  if (allow) {
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    request
      .get(
        `https://eol.ams3.digitaloceanspaces.com/${config.s3SubFolder}files/${req.params.uuid}/${req.params.filename}`,
      )
      .pipe(res);
  } else {
    res.sendStatus(404);
  }
});

// memory dump
app.get('/heapdump', (req, res) => {
  if (!secretMatches(req.header('Authorization'), config.run.ranking)) {
    res.status(401).send('Unauthorized');
    return;
  }
  const filename = `../public/temp/heapdump-${Date.now()}.heapsnapshot`;
  writeHeapSnapshot(filename);
  res.download(filename, err => {
    if (err) {
      res.status(500).send('Error downloading heapdump');
      // eslint-disable-next-line no-console
      console.error(err);
    }
    unlink(filename, () => {});
  });
});

// wildcard and root
app.get('*', (req, res) => {
  res
    .status(404)
    .send(
      `I just don't have time to be responsible for every little thing that goes wrong in your life.`,
    );
});

// ----------------------------------------------------------
// error logging
// ----------------------------------------------------------
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error(err);
  res.status(err.status || 500).send(err.msg);
});

// ----------------------------------------------------------
// start server
// ----------------------------------------------------------
app.listen(config.port, () => {
  // eslint-disable-next-line no-console
  console.log(`The server is running at http://localhost:${config.port}/`);
});
