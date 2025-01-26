import express from 'express';
import { authContext } from '#utils/auth';
import { LGR, Kuski } from '#data/models';
import moment from 'moment';
import stream from 'stream';
import elmajs from 'elmajs';

const router = express.Router();

const AddLGR = async lgr => {
  try {
    const lgr_parsed = elmajs.LGR.from(lgr.LGRData);
    if (!lgr_parsed.pictureList.some(picture => picture.name === 'zz883000')) {
      return { error: 'LGR file must be fancyboosted.' };
    }
  } catch {
    // Failed to open file - invalid LGR file
    return { error: 'Invalid LGR file.' };
  }
  const NewLGR = await LGR.create(lgr);
  return NewLGR;
};

export const getLGRByName = async LGRName => {
  const LGRInfo = await LGR.findOne({
    where: { LGRName: LGRName.toLowerCase() },
    include: [{ model: Kuski, as: 'KuskiData', attributes: ['Kuski'] }],
  });
  return LGRInfo;
};

// Add a new LGR
router.post('/add/:LGRName', async (req, res) => {
  const auth = authContext(req);
  if (!auth.auth) {
    res.status(401).json({ error: 'Access denied.' });
    return;
  }
  const LGRName = req.params.LGRName;
  if (await getLGRByName(LGRName)) {
    res.status(403).json({ error: 'LGR name already exists.' });
    return;
  }
  const response = await AddLGR({
    LGRData: req.body,
    LGRName,
    KuskiIndex: auth.userid,
    Added: moment().format('YYYY-MM-DD HH:mm:ss'),
  });
  if (response.error) {
    res.status(403).json({ error: response.error });
    return;
  }
  delete response.dataValues.LGRData;
  res.json(response);
});

// Get the LGR file
router.get('/get/:LGRName', async (req, res, next) => {
  const LGRName = req.params.LGRName;
  const lgr = await getLGRByName(LGRName);
  if (!lgr) {
    res.status(404).json({ error: 'LGR not found.' });
    return;
  }
  try {
    lgr.update({ Downloads: lgr.Downloads + 1 });
    const readStream = new stream.PassThrough();
    readStream.end(lgr.LGRData);
    res.set({
      'Content-disposition': `attachment; filename=${lgr.LGRName}.lgr`,
      'Content-Type': 'application/octet-stream',
    });
    readStream.pipe(res);
  } catch (e) {
    next({ msg: e.message, status: 422 });
  }
});

// Get the LGR metadata
router.get('/info/:LGRName', async (req, res) => {
  const LGRName = req.params.LGRName;
  const lgr = await getLGRByName(LGRName);
  if (!lgr) {
    res.status(404).json({ error: 'LGR not found.' });
    return;
  }
  lgr.LGRData = undefined;
  res.json(lgr);
});

// Update the LGR info
router.post('/info/:LGRName', async (req, res) => {
  const auth = authContext(req);
  if (!auth.auth) {
    res.status(401).json({ error: 'Access denied.' });
    return;
  }
  const LGRName = req.params.LGRName;
  const lgr = await getLGRByName(LGRName);
  if (!lgr) {
    res.status(404).json({ error: 'LGR not found.' });
    return;
  }
  if (!(lgr.KuskiIndex === auth.userid || auth.mod)) {
    res.status(401).json({ error: 'This is not your LGR.' });
    return;
  }
  const updated_data = {
    LGRDesc: req.body.LGRDesc,
  };
  await lgr.update(updated_data);
  res.json(updated_data);
});

// Delete an LGR
router.delete('/del/:LGRName', async (req, res) => {
  const auth = authContext(req);
  if (!auth.auth) {
    res.sendStatus(401);
    return;
  }
  const LGRName = req.params.LGRName;
  const lgr = await getLGRByName(LGRName);
  if (!lgr) {
    res.status(404).json({ error: 'LGR not found.' });
    return;
  }
  if (!(lgr.KuskiIndex === auth.userid || auth.mod)) {
    res.status(401).json({ error: 'This is not your LGR.' });
    return;
  }
  await lgr.destroy();
  res.status(200).json({ success: 1 });
});

/*
// Testing function, to remove TODO
router.get('/sync', async (req, res) => {
  //await LGR.sync();
  await LGR.sync({ alter: true });
  //await LGR.sync({force: true});
  res.json('Success');
});
*/

export default router;
