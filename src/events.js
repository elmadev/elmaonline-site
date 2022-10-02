import express from 'express';
import {
  chatline,
  besttime,
  bestmultitime,
  battlestart,
  battlequeue,
  battleend,
  battleresults,
  eventsFile,
} from '#utils/events';

const app = express.Router();

app.post('/chatline', (req, res) => {
  chatline(req, res);
});
app.post('/besttime', (req, res) => {
  besttime(req, res);
});
app.post('/bestmultitime', (req, res) => {
  bestmultitime(req, res);
});
app.post('/battlestart', (req, res) => {
  battlestart(req, res);
});
app.post('/battlequeue', (req, res) => {
  battlequeue(req, res);
});
app.post('/battleend', (req, res) => {
  battleend(req, res);
});
app.post('/battleresults', (req, res) => {
  battleresults(req, res);
});
app.post('/file', (req, res) => {
  eventsFile(req, res);
});

export default app;
