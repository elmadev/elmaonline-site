import express from 'express';
import request from 'request';
import { intersection, isEqual, sortBy } from 'lodash-es';
import moment from 'moment';
import crypto from 'crypto';
import path from 'path';
import elmajs from 'elmajs';
import { PCX, writePCX, DefaultLGRPalette } from 'elma-pcx';
import { authContext } from '#utils/auth';
import { LGR, Kuski, Tag, Replay } from '#data/models';
import { uploadLGRS3, deleteLGRS3, lgrUrl } from '#utils/upload';
import { deleteLGRComments } from './lgr_comment.js';
import { WriteActionLog } from './mod.js';
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

const CreateLGR = async (req, auth, lgrParsed) => {
  if (!req.files.lgr || !req.files.preview) {
    return {
      error:
        'Both an lgr and an image file must be provided to create new lgr!',
    };
  }
  if (!req.body.replay) {
    return {
      error: 'A valid replay must be linked!',
    };
  }
  const lowerFilename = req.body.filename.toLowerCase();
  const boostedLgrFile = {
    data: lgrParsed.boostedLgr,
    mimetype: 'application/octet-stream',
    size: lgrParsed.boostedLgr.length,
  };
  const lgrS3 = await uploadLGRS3(boostedLgrFile, `${lowerFilename}.lgr`);
  if (lgrS3.error) {
    return {
      error: 'Unable to upload lgr file to database!',
    };
  }
  const previewS3 = await uploadLGRS3(
    req.files.preview,
    `${lowerFilename}_${req.files.preview.name}`,
  );
  if (previewS3.error) {
    deleteLGRS3(lgrS3.url);
    return {
      error: 'Unable to upload preview file to database!',
    };
  }
  const lgr = {
    FileLink: lgrS3.url,
    PreviewLink: previewS3.url,
    LGRName: lowerFilename,
    KuskiIndex: auth.userid,
    LGRDesc: req.body.description,
    ReplayIndex: req.body.replay,
    CRC: lgrParsed.lgrHash,
    Added: moment().format('YYYY-MM-DD HH:mm:ss'),
  };
  const NewLGR = await LGR.create(lgr);
  if (NewLGR.error) {
    deleteLGRS3(lgrS3.url);
    deleteLGRS3(previewS3.url);
    return {
      error: 'Unable to add lgr information to database!',
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
  if (!lgrParsed.usesDefaultPalette) {
    validatedTagIDs.push(altPaletteTagID);
  }
  await NewLGR.setTags(validatedTagIDs);
  return NewLGR;
};

const EditLGR = async (req, auth) => {
  const originalFilename = req.params.LGRName.toLowerCase();
  const newFilename = req.body.filename.toLowerCase();
  let actionLog = [];
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
    actionLog.push(`Rename ${originalFilename} => ${newFilename}`);
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
    actionLog.push(
      `Ownership ${lgr.KuskiData?.Kuski} => ${req.body.kuskiName}`,
    );
    lgr.KuskiIndex = kuski.KuskiIndex;
  }
  if (actionLog.length > 0) {
    WriteActionLog(
      auth.userid,
      lgr.KuskiIndex,
      'EditLGR',
      1,
      0,
      actionLog.join(', '),
    );
  }
  lgr.LGRName = newFilename;
  lgr.LGRDesc = req.body.description;
  if (req.body.replay) {
    lgr.ReplayIndex = req.body.replay;
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
        error: 'Unable to upload preview file to database!',
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
      error: 'Unable update lgr information!',
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

/**
 * Deletes an lgr
 * @param {LGR} lgr
 * @returns {Object}
 */
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

/**
 * Parses an lgr in preparation for adding the lgr file to the database
 * @param {Buffer} lgrBuffer
 * @returns {Object}
 */
const parseLGR = async lgrBuffer => {
  try {
    // Check if we can open the lgr file
    const parsedLgr = elmajs.LGR.from(lgrBuffer);

    // Repair errors and fancyboost the lgr
    const boostedParsedLgr = fixLGR(parsedLgr);
    const boostedLgr = boostedParsedLgr.toBuffer();

    // Determine the hash of the lgr file
    const lgrHash = hashLGR(boostedParsedLgr);
    const lgrDuplicateHash = await getLGRByHash(lgrHash);
    if (lgrDuplicateHash) {
      return {
        error: `A duplicate lgr was detected: ${lgrDuplicateHash.LGRName}`,
      };
    }

    // Check if default palette is used
    const palette = getLGRPalette(boostedParsedLgr);
    const usesDefaultPalette = isEqual(palette, DefaultLGRPalette);

    return { usesDefaultPalette, lgrHash, boostedLgr };
  } catch (error) {
    // If elmajs can't open the file, I guess it must be invalid
    return { error: 'Invalid LGR file.' };
  }
};

/**
 * Gets the palette of q1bike.pcx
 * @param {elmajs.LGR} lgr
 * @returns {Uint8Array}
 */
const getLGRPalette = lgr => {
  const q1bike = lgr.pictureData.find(
    image => image.name.toLowerCase() === 'q1bike.pcx',
  );
  if (q1bike.data[q1bike.data.byteLength - 769] !== 12) {
    return { error: "LGR's q1bike.pcx's palette was not found!" };
  }
  return q1bike.data.subarray(q1bike.data.byteLength - 768);
};

/**
 * Returns a hash of an LGR
 * @param {elmajs.LGR} lgr
 * @returns {string}
 */
const hashLGR = lgr => {
  const hash = crypto.createHash('md5');

  // Hash pictureList, excluding the images whose properties are ignored:
  //   qfood, qup/qdown
  // Exclude fancyboost images as well
  const excludeListRegex = [
    /^qfood[1-9]$/i,
    /^qup_.*/i,
    /^qdown_.*/i,
    /^zz......$/i,
  ];
  const filteredPictureList = lgr.pictureList.filter(
    pic => !excludeListRegex.some(re => re.test(pic.name)),
  );
  const sortedPictureList = sortBy(filteredPictureList, pic =>
    pic.name.toLowerCase(),
  );
  const pictureListString = sortedPictureList
    .map(
      pic =>
        `${pic.name.toLowerCase()}#${pic.pictureType}#${pic.distance}#${pic.clipping}#${pic.transparency}`,
    )
    .join('/');
  hash.update(pictureListString);

  // Hash pictureData, excluding fancyboost images
  const excludeDataRegex = /^zz......\.pcx/i;
  const filteredPictureData = lgr.pictureData.filter(
    pic => !excludeDataRegex.test(pic.name),
  );
  const sortedPictureData = sortBy(filteredPictureData, pic =>
    pic.name.toLowerCase(),
  );
  const pictureDataString = sortedPictureData
    .map(pic => {
      const name = pic.name.toLowerCase();
      const pcx = new PCX(pic.data);
      hash.update(pcx.getPixels());
      if (name === 'q1bike.pcx') {
        hash.update(pcx.getPalette());
      }
      return name;
    })
    .join('/');
  hash.update(pictureDataString);
  return hash.digest('base64');
};

/**
 * Removes mistakes in an lgr file and then fancyboosts it
 * @param {elmajs.LGR} lgr
 * @returns {elmajs.LGR}
 */
const fixLGR = lgr => {
  // Remove files that should not be in Pictures.lst (usually qgrass)
  // Remove fancyboost files from Pictures.lst and from pictureData
  const badFiles = [
    'q1body',
    'q1thigh',
    'q1leg',
    'q1bike',
    'q1wheel',
    'q1susp1',
    'q1susp2',
    'q1forarm',
    'q1up_arm',
    'q1head',
    'q2body',
    'q2thigh',
    'q2leg',
    'q2bike',
    'q2wheel',
    'q2susp1',
    'q2susp2',
    'q2forarm',
    'q2up_arm',
    'q2head',
    'qflag',
    'qkiller',
    'qexit',
    'qframe',
    'qcolors',
    'qgrass',
  ];
  lgr.pictureList = lgr.pictureList.filter(
    pic =>
      !(
        badFiles.includes(pic.name.toLowerCase()) ||
        /^zz......$/i.test(pic.name)
      ),
  );
  lgr.pictureData = lgr.pictureData.filter(
    pic => !/^zz......\.pcx$/i.test(pic.name),
  );

  // Apply fancyboost to lgr
  const palette = getLGRPalette(lgr);

  // Handle special case palette 0
  const pixels0 = new Uint8Array(200 * 201);
  pixels0.fill(1, 200 * 200);
  const pcx0 = Buffer.from(writePCX(pixels0, 200, 201, palette));
  const pictureData0 = new elmajs.PictureData('zz000000.pcx', pcx0);
  lgr.pictureData.push(pictureData0);
  const pictureDeclaration0 = new elmajs.PictureDeclaration();
  pictureDeclaration0.name = 'zz000000';
  pictureDeclaration0.pictureType = elmajs.PictureType.Normal;
  pictureDeclaration0.distance = 999;
  pictureDeclaration0.clipping = elmajs.Clip.Ground;
  pictureDeclaration0.transparency = elmajs.Transparency.BottomLeft;
  lgr.pictureList.push(pictureDeclaration0);

  // Do palette 1-255
  const fancyboostName = i =>
    `zz${`${DefaultLGRPalette[3 * i + 0].toString(16).padStart(2, '0')}${DefaultLGRPalette[3 * i + 1].toString(16).padStart(2, '0')}${DefaultLGRPalette[3 * i + 2].toString(16).padStart(2, '0')}`.toUpperCase()}`;
  for (let i = 1; i < 256; i++) {
    const pixels = new Uint8Array(200 * 200);
    pixels.fill(i);
    const pcx = Buffer.from(writePCX(pixels, 200, 200, palette));
    const name = fancyboostName(i);
    const pictureData = new elmajs.PictureData(`${name}.pcx`, pcx);
    lgr.pictureData.push(pictureData);
    const pictureDeclaration = new elmajs.PictureDeclaration();
    pictureDeclaration.name = name;
    pictureDeclaration.pictureType = elmajs.PictureType.Normal;
    pictureDeclaration.distance = 999;
    pictureDeclaration.clipping = elmajs.Clip.Ground;
    pictureDeclaration.transparency = elmajs.Transparency.Palette;
    lgr.pictureList.push(pictureDeclaration);
  }

  return lgr;
};

/**
 *
 * @param {string} LGRName
 * @returns {LGR}
 */
export const getLGRByName = async LGRName => {
  const LGRInfo = await LGR.findOne({
    where: { LGRName: LGRName.toLowerCase() },
    include: [models.Kuski, models.Replay, models.Tag],
  });
  return LGRInfo;
};

/**
 *
 * @param {string} CRC
 * @returns {LGR}
 */
export const getLGRByHash = async CRC => {
  const LGRInfo = await LGR.findOne({
    where: { CRC },
    /*include: [models.Kuski, models.Replay, models.Tag],*/
  });
  return LGRInfo;
};

/**
 *
 * @param {number} LGRIndex
 * @returns {LGR}
 */
export const getLGRByIndex = async LGRIndex => {
  const LGRInfo = await LGR.findOne({
    where: { LGRIndex },
    /*include: [models.Kuski, models.Replay, models.Tag],*/
  });
  return LGRInfo;
};

/**
 *
 * @returns {LGR[]}
 */
const getAllLGRs = async () => {
  const lgrs = await LGR.findAll({
    include: [models.Kuski, models.Replay, models.Tag],
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
  const lgrParsed = await parseLGR(req.files.lgr.data);
  if (lgrParsed.error) {
    res.status(403).json({ error: lgrParsed.error });
    return;
  }
  const response = await CreateLGR(req, auth, lgrParsed);
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
  WriteActionLog(auth.userid, lgr.KuskiIndex, 'DeleteLGR', 1, 0, lgr.LGRName);
  const deleted = await deleteLGR(lgr);
  if (deleted.error) {
    res.status(500).json(deleted);
    return;
  }
  res.status(200).json({ success: 1 });
});

export default router;
