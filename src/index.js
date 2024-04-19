import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import cors from 'cors';
import request from 'request';
import fileUpload from 'express-fileupload';
import config from './config.js';
import './data/sequelize.js';
import { auth } from '#utils/auth';
import { downloadFileS3 } from '#utils/upload';
import apiRoutes from './api/index.js';
import eventsRoutes from './events.js';
import dlRoutes from './dl.js';
import runRoutes from './run.js';
import uploadRoutes from './upload.js';

const app = express();

// ----------------------------------------------------------
// public/static folder
// ----------------------------------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, '../public')));

// ----------------------------------------------------------
// express middleware
// ----------------------------------------------------------
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(fileUpload());
app.use(bodyParser.raw({ type: 'application/octet-stream', limit: '10mb' }));

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
app.post('/token', async (req, res) => {
  const authResponse = await auth(req.body);
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
    request
      .get(
        `https://eol.ams3.digitaloceanspaces.com/${config.s3SubFolder}files/${req.params.uuid}/${req.params.filename}`,
      )
      .pipe(res);
  } else {
    res.sendStatus(404);
  }
});

// wildcard and root
app.get('*', (req, res) => {
  res.send(
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
