import express from 'express';
import request from 'request';
import { Op } from 'sequelize';
import { intersection, isEqual } from 'lodash-es';
import moment from 'moment';
import path from 'path';
import elmajs from 'elmajs';
import { authContext } from '#utils/auth';
import { LGR, Kuski, Tag, Replay } from '#data/models';
import { like, searchLimit, searchOffset } from '#utils/database';
import { uploadLGRS3, deleteLGRS3, lgrUrl } from '#utils/upload';
import { deleteLGRComments } from './lgr_comment.js';
import { DEFAULT_LGR_PALETTE } from '#constants/lgr';
import config from '../config.js';

const router = express.Router();

const models = {
  Kuski: { model: Kuski, as: 'KuskiData', attributes: ['Kuski'] },
  Replay: {
    model: Replay,
    as: 'ReplayData',
    attributes: ['LevelIndex', 'UUID', 'RecFileName'],
  },
  Tag: {
    model: Tag,
    as: 'Tags',
    through: {
      attributes: [],
    },
  },
};

const CreateLGR = async (req, auth, usesDefaultPalette) => {
  console.log('Hello')
  if (!req.files.lgr || !req.files.preview) {
    return {
      error:
        'Both an lgr and an image file must be provided to create new lgr!',
    };
  }
  if (!req.body.replay) {
    return {
      error:
        'A valid replay must be linked!',
    };
  }
  const lowerFilename = req.body.filename.toLowerCase();
  const lgrS3 = await uploadLGRS3(req.files.lgr, `${lowerFilename}.lgr`);
  if (lgrS3.error) {
    return {
      error:
        'Unable to upload lgr file to database!',
    };
  }
  const previewS3 = await uploadLGRS3(
    req.files.preview,
    `${lowerFilename}_${req.files.preview.name}`,
  );
  if (previewS3.error) {
    deleteLGRS3(lgrS3.url);
    return {
      error:
        'Unable to upload preview file to database!',
    };
  }
  const lgr = {
    FileLink: lgrS3.url,
    PreviewLink: previewS3.url,
    LGRName: lowerFilename,
    KuskiIndex: auth.userid,
    LGRDesc: req.body.description,
    ReplayIndex: req.body.replay,
    Added: moment().format('YYYY-MM-DD HH:mm:ss'),
  };
  const NewLGR = await LGR.create(lgr);
  if (NewLGR.error) {
    deleteLGRS3(lgrS3.url);
    deleteLGRS3(previewS3.url);
    return {
      error:
        'Unable to add lgr information to database!',
    };
  }

  const tagIDs = JSON.parse(req.body.tags);
  const allTags = await Tag.findAll({
    where: { Type: 'lgr' },
  });
  const allValidTagIDs = allTags
    .filter(tag => tag.Hidden === 0)
    .map(tag => tag.TagIndex);
  const validatedTagIDs = intersection(tagIDs, allValidTagIDs);
  const altPaletteTagID = allTags.find(
    tag => tag.Name === 'Alt Palette',
  ).TagIndex;
  if (!usesDefaultPalette) {
    validatedTagIDs.push(altPaletteTagID);
  }
  await NewLGR.setTags(validatedTagIDs);
  return NewLGR;
};

const EditLGR = async (req, auth) => {
  const originalFilename = req.params.LGRName.toLowerCase();
  const newFilename = req.body.filename.toLowerCase();
  if (originalFilename !== newFilename) {
    if (!auth.mod) {
      return {
        error: 'Cannot rename lgr - only a mod can rename an lgr!',
      };
    }
    if (await getLGRByName(newFilename)) {
      return {
        error: `Cannot rename lgr - ${req.body.filename}.lgr is already used!`,
      };
    }
  }
  const lgr = await getLGRByName(originalFilename);
  if (lgr.KuskiData.Kuski !== req.body.kuskiName) {
    if (!auth.mod) {
      return {
        error: 'Cannot change lgr ownership - only a mod can reassign an lgr!',
      };
    }
    const kuski = await Kuski.findOne({
      where: { Kuski: req.body.kuskiName },
      attributes: ['KuskiIndex', 'Kuski'],
    });
    if (!kuski) {
      return {
        error: 'Cannot change lgr ownership - kuski not found!',
      };
    }
    lgr.KuskiIndex = kuski.KuskiIndex;
  }
  lgr.LGRName = newFilename;
  lgr.LGRDesc = req.body.description;
  if(req.body.replay) {
    lgr.ReplayIndex = req.body.replay
  }

  let previewS3Url = null;
  if (req.files?.preview) {
    deleteLGRS3(lgr.PreviewLink);
    const previewS3 = await uploadLGRS3(
      req.files.preview,
      `${newFilename}_${req.files.preview.name}`,
    );
    if (previewS3.error) {
      return {
        error:
          'Unable to upload preview file to database!',
      };
    }
    previewS3Url = previewS3.url;
    lgr.PreviewLink = previewS3Url;
  }
  const NewLGR = await lgr.save();
  if (NewLGR.error) {
    if (previewS3Url) {
      deleteLGRS3(previewS3Url);
    }
    return {
      error:
        'Unable update lgr information!',
    };
  }
  const tagIDs = JSON.parse(req.body.tags);
  const allTags = await Tag.findAll({
    where: { Type: 'lgr' },
  });
  const allValidTagIDs = allTags
    .filter(tag => tag.Hidden === 0 || auth.mod)
    .map(tag => tag.TagIndex);
  const validatedTagIDs = intersection(tagIDs, allValidTagIDs);
  // Non-mods cannot affect hidden tags, so let's add them back in!
  if (!auth.mod) {
    validatedTagIDs.push(
      ...NewLGR.Tags.filter(tag => tag.Hidden).map(tag => tag.TagIndex),
    );
  }
  await NewLGR.setTags(validatedTagIDs);
  return NewLGR;
};

const ValidateLGR = async lgrBuffer => {
  try {
    const lgr_parsed = elmajs.LGR.from(lgrBuffer);
    if (
      !lgr_parsed.pictureList.some(
        picture => picture.name.toLowerCase() === 'zz883000',
      )
    ) {
      return { error: 'LGR file must be fancyboosted.' };
    }
    const q1bike = lgr_parsed.pictureData.find(
      image => image.name.toLowerCase() === 'q1bike.pcx',
    );
    if (q1bike.data[q1bike.data.byteLength - 769] !== 12) {
      return { error: "LGR's q1bike.pcx's palette was not found!" };
    }
    const palette = q1bike.data.subarray(q1bike.data.byteLength - 768);
    return { usesDefaultPalette: isEqual(palette, DEFAULT_LGR_PALETTE) };
  } catch (error) {
    // If elmajs can't open the file, I guess it must be invalid
    return { error: 'Invalid LGR file.' };
  }
};

const deleteLGR = async lgr => {
  await deleteLGRComments(lgr.LGRIndex);
  const errorFile = await deleteLGRS3(lgr.FileLink);
  if (errorFile) {
    return { error: 'Internal server error.' };
  }
  const errorPreview = await deleteLGRS3(lgr.PreviewLink);
  if (errorPreview) {
    return { error: 'Internal server error.' };
  }
  await lgr.setTags([]);
  await lgr.destroy();
  return {};
};

export const getLGRByName = async LGRName => {
  const LGRInfo = await LGR.findOne({
    where: { LGRName: LGRName.toLowerCase() },
    include: [models.Kuski, models.Replay, models.Tag],
  });
  return LGRInfo;
};

export const getLGRByIndex = async LGRIndex => {
  const LGRInfo = await LGR.findOne({
    where: { LGRIndex },
    /*include: [models.Kuski, models.Replay, models.Tag],*/
  });
  return LGRInfo;
};

const getAllLGRs = async () => {
  const lgrs = await LGR.findAll({
    include: [models.Kuski, models.Replay, models.Tag],
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
  if (await getLGRByName(LGRName)) {
    res.status(403).json({ error: 'LGR name already exists.' });
    return;
  }
  const lgr_status = await ValidateLGR(req.files.lgr.data);
  if (lgr_status.error) {
    res.status(403).json({ error: lgr_status.error });
    return;
  }
  const response = await CreateLGR(req, auth, lgr_status.usesDefaultPalette);
  if (response.error) {
    res.status(403).json({ error: response.error });
    return;
  }
  res.json(response);
});

// pipes a .lgr or preview.img file
const getLGRFile = async (req, res, next, key) => {
  const LGRName = req.params.LGRName;
  const lgr = await getLGRByName(LGRName);
  if (!lgr) {
    res.status(404).json({ error: 'LGR not found.' });
    return;
  }
  try {
    const link = lgr[key];
    // cannot use relative path in dev environment - convert to full path
    const url =
      config.accessKeyId !== 'local'
        ? `${config.s3Domain}${lgrUrl(lgr.FileLink)}`
        : `http://localhost:3003/${lgrUrl(link).slice(9)}`;
    // .lgr for lgr files, or else .imgext for preview images
    const filename =
      key === 'FileLink'
        ? `${lgr.LGRName}.lgr`
        : `${lgr.LGRName}${path.extname(url)}`;
    const cacheControl =
      key === 'FileLink' ? 'public, max-age=2628000' : 'public, max-age=604800';
    res.set({
      'Content-disposition': `attachment; filename=${filename}`,
      'Content-Type': 'application/octet-stream',
      'Cache-Control': cacheControl,
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

// Get the LGR metadata
router.get('/info', async (req, res) => {
  const lgrs = await getAllLGRs();
  res.json(lgrs);
});
router.get('/info/:LGRName', async (req, res) => {
  const LGRName = req.params.LGRName;
  const lgr = await getLGRByName(LGRName);
  if (!lgr) {
    res.status(404).json({ error: 'LGR not found.' });
    return;
  }
  res.json(lgr);
});

// Edit the LGR
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
  const response = await EditLGR(req, auth);
  if (response.error) {
    res.status(403).json({ error: response.error });
    return;
  }
  res.json(response);
});

// Delete an LGR
router.delete('/del/:LGRName', async (req, res) => {
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
  if (!auth.mod) {
    res.status(401).json({ error: 'Only mods can delete LGRs.' });
    return;
  }
  const deleted = await deleteLGR(lgr);
  if (deleted.error) {
    res.status(500).json(deleted);
    return;
  }
  res.status(200).json({ success: 1 });
});

export default router;
