import express from 'express';
import { authContext } from '#utils/auth';
import { LGR, Kuski } from '#data/models';
import { Op } from 'sequelize';
import { like, searchLimit, searchOffset } from '#utils/database';
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

const getLGRByName = async (LGRName, include_file) => {
  const attributes = include_file ? {} : { exclude: ['LGRData'] };
  const LGRInfo = await LGR.findOne({
    where: { LGRName: LGRName.toLowerCase() },
    include: [{ model: Kuski, as: 'KuskiData', attributes: ['Kuski'] }],
    attributes: attributes,
  });
  return LGRInfo;
};

const getAllLGRs = async () => {
  const lgrs = await LGR.findAll({
    include: [{ model: Kuski, as: 'KuskiData', attributes: ['Kuski'] }],
    attributes: { exclude: ['LGRData'] },
  });
  return lgrs;
};

const LGRSearch = async (query, offset) => {
  const lgrs = await LGR.findAll({
    where: { LGRName: { [Op.like]: `${like(query)}%` } },
    include: [{ model: Kuski, as: 'KuskiData', attributes: ['Kuski'] }],
    attributes: { exclude: ['LGRData'] },
    limit: searchLimit(offset),
    order: [['LGRName', 'ASC']],
    offset: searchOffset(offset),
  });
  return lgrs;
};

// Add a new LGR
router.post('/add/:LGRName', async (req, res) => {
  const auth = authContext(req);
  if (!auth.auth) {
    res.status(401).json({ error: 'Access denied.' });
    return;
  }
  const LGRName = req.params.LGRName;
  if (await getLGRByName(LGRName, false)) {
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
  const lgr = await getLGRByName(LGRName, true);
  if (!lgr) {
    res.status(404).json({ error: 'LGR not found.' });
    return;
  }
  try {
    await lgr.update({ Downloads: lgr.Downloads + 1 });
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

// Search for lgrs
router.get('/search/:query/:offset', async (req, res) => {
  const lgrs = await LGRSearch(req.params.query, req.params.offset);
  res.json(lgrs);
});

// Get all lgrs
router.get('/all', async (req, res) => {
  const lgrs = await getAllLGRs();
  res.json(lgrs);
});

// Get the LGR metadata
router.get('/info/:LGRName', async (req, res) => {
  const LGRName = req.params.LGRName;
  const lgr = await getLGRByName(LGRName, false);
  if (!lgr) {
    res.status(404).json({ error: 'LGR not found.' });
    return;
  }
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
  const lgr = await getLGRByName(LGRName, false);
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
    res.status(401).json({ error: 'Access denied.' });
    return;
  }
  const LGRName = req.params.LGRName;
  const lgr = await getLGRByName(LGRName, false);
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

export default router;
