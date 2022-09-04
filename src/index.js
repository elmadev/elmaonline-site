import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import config from './config.js';
import './data/sequelize.js';

const app = express();

// ----------------------------------------------------------
// public/static folder
// ----------------------------------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));

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
app.get('*', (req, res) => {
  res.send(
    `I just don't have time to be responsible for every little thing that goes wrong in your life.`
  );
});

// ----------------------------------------------------------
// error logging
// ----------------------------------------------------------
app.use((err, req, res) => {
  // eslint-disable-next-line no-console
  console.error(err);
  res.status(err.status || 500);
  res.send(err.msg);
});

// ----------------------------------------------------------
// start server
// ----------------------------------------------------------
app.listen(config.port, () => {
  // eslint-disable-next-line no-console
  console.log(`The server is running at http://localhost:${config.port}/`);
});
