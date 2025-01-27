import express from 'express';
import { authContext } from '#utils/auth';
import { LGR, Kuski } from '#data/models';
import { Op } from 'sequelize';
import { like, searchLimit, searchOffset } from '#utils/database';
import moment from 'moment';
import elmajs from 'elmajs';
import request from 'request';
import { uploadLGRS3, deleteLGRS3, lgrUrl } from '#utils/upload';
import config from '../config.js';
import path from 'path';

const router = express.Router();

const CreateLGR = async (req, auth) => {
  const lowerFilename = req.body.filename.toLowerCase();
  const lgrS3 = await uploadLGRS3(req.files.lgr, `${lowerFilename}.lgr`);
  if (lgrS3.error) {
    return lgrS3;
  }
  const previewS3 = await uploadLGRS3(
    req.files.preview,
    `${lowerFilename}_${req.files.preview.name}`,
  );
  if (previewS3.error) {
    await deleteLGRS3(lgrS3.url);
    return previewS3;
  }
  const lgr = {
    FileLink: lgrS3.url,
    PreviewLink: previewS3.url,
    LGRName: lowerFilename,
    KuskiIndex: auth.userid,
    LGRDesc: req.body.description,
    Added: moment().format('YYYY-MM-DD HH:mm:ss'),
  };
  const NewLGR = await LGR.create(lgr);
  if (NewLGR.error) {
    await deleteLGRS3(lgrS3.url);
    await deleteLGRS3(previewS3.url);
  }
  return NewLGR;
};

const ValidateLGR = async lgrBuffer => {
  try {
    const lgr_parsed = elmajs.LGR.from(lgrBuffer);
    if (!lgr_parsed.pictureList.some(picture => picture.name === 'zz883000')) {
      return { error: 'LGR file must be fancyboosted.' };
    }
    // TODO, palette status tag
  } catch (error) {
    // If elmajs can't open the file, I guess it must be invalid
    return { error: 'Invalid LGR file.' };
  }
  return { ok: true };
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
router.post('/add', async (req, res) => {
  const auth = authContext(req);
  if (!auth.auth) {
    res.status(401).json({ error: 'Access denied.' });
    return;
  }
  const LGRName = req.body.filename;
  if (await getLGRByName(LGRName, false)) {
    res.status(403).json({ error: 'LGR name already exists.' });
    return;
  }
  const lgr_status = await ValidateLGR(req.files.lgr.data);
  if (lgr_status.error) {
    res.status(403).json({ error: lgr_status.error });
    return;
  }
  const response = await CreateLGR(req, auth);
  if (response.error) {
    res.status(403).json({ error: response.error });
    return;
  }
  res.json(response);
});

// pipes a .lgr or preview.img file
const getLGRFile = async (req, res, next, key) => {
  const LGRName = req.params.LGRName;
  const lgr = await getLGRByName(LGRName, true);
  if (!lgr) {
    res.status(404).json({ error: 'LGR not found.' });
    return;
  }
  try {
    const link = lgr[key];
    // cannot use relative path in dev environment - convert to full path
    const url =
      config.accessKeyId !== 'local'
        ? lgrUrl(lgr.FileLink)
        : `http://localhost:3003/${lgrUrl(link).slice(9)}`;
    // .lgr for lgr files, or else .imgext for preview images
    const filename =
      key === 'FileLink'
        ? `${lgr.LGRName}.lgr`
        : `${lgr.LGRName}${path.extname(url)}`;
    res.set({
      'Content-disposition': `attachment; filename=${filename}`,
      'Content-Type': 'application/octet-stream',
    });
    request.get(url).pipe(res);
    if (key === 'FileLink') {
      lgr.update({ Downloads: lgr.Downloads + 1 });
    }
  } catch (e) {
    next({ msg: e.message, status: 422 });
  }
};
// Get the LGR file
router.get('/get/:LGRName', async (req, res, next) => {
  await getLGRFile(req, res, next, 'FileLink');
});
// Get the LGR preview image
router.get('/preview/:LGRName', async (req, res, next) => {
  await getLGRFile(req, res, next, 'PreviewLink');
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

// Update the LGR info - TODO needs to be updated
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
  const errorFile = await deleteLGRS3(lgr.FileLink);
  if (errorFile) {
    res.status(500).json({ error: 'Internal server error.' });
    return;
  }
  const errorPreview = await deleteLGRS3(lgr.PreviewLink);
  if (errorPreview) {
    res.status(500).json({ error: 'Internal server error.' });
    return;
  }
  await lgr.destroy();
  res.status(200).json({ success: 1 });
});

export default router;
