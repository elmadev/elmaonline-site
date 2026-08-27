import express from 'express';
import { authContext } from '#utils/auth';
import { format, addDays } from 'date-fns';
import { fromTo } from '#utils/database';
import { Upload } from '#data/models';
import { deleteObject } from '#utils/upload';

const router = express.Router();

const parseExpire = expire => {
  const values = {
    '365 days': 365,
    '30 days': 30,
    '7 days': 7,
    '1 day': 1,
    Never: 0,
  };
  let add = 30;
  if (values[expire]) {
    add = values[expire];
  }
  if (expire === 'Never') {
    return 0;
  }
  return format(addDays(new Date(), add), 't');
};

const updateFile = async data => {
  const file = await Upload.findOne({
    where: { Uuid: data.Uuid, Filename: data.Filename },
  });
  if (file.KuskiIndex === data.KuskiIndex) {
    await file.update({
      Expire: parseExpire(data.expire),
      Downloads: data.maxDownloads ? data.maxDownloads : 0,
    });
    return true;
  }
  return false;
};

router.post('/', async (req, res) => {
  const auth = authContext(req);
  if (auth.auth) {
    const success = await updateFile({ ...req.body, KuskiIndex: auth.userid });
    if (success) {
      res.json({ success: 1 });
    } else {
      res.sendStatus(401);
    }
  } else {
    res.sendStatus(401);
  }
});

const MyFiles = async (KuskiIndex, limit, FileName, from, to) => {
  let where = { KuskiIndex };
  if (FileName) {
    where.FileName = FileName;
  }
  where = { ...where, ...fromTo(from, to, 'UploadedOn') };
  const files = await Upload.findAll({
    where,
    order: [['UploadIndex', 'DESC']],
    limit: parseInt(limit, 10) > 10000 ? 10000 : parseInt(limit, 10),
  });
  return files;
};

router.get('/:limit', async (req, res) => {
  const auth = authContext(req);
  if (auth.auth) {
    const files = await MyFiles(
      auth.userid,
      req.params.limit,
      req.query.filename,
      req.query.from,
      req.query.to,
    );
    res.json(files);
  } else {
    res.sendStatus(401);
  }
});

const DeleteFile = async (UploadIndex, KuskiIndex, uuid, filename) => {
  const file = await Upload.findOne({
    where: { UploadIndex, KuskiIndex },
  });
  if (file) {
    await deleteObject(uuid, filename);
    await file.destroy();
    return 200;
  }
  return 401;
};

router.delete('/:id/:uuid/:filename', async (req, res) => {
  const auth = authContext(req);
  if (auth.auth) {
    const del = await DeleteFile(
      req.params.id,
      auth.userid,
      req.params.uuid,
      req.params.filename,
    );
    res.sendStatus(del);
  } else {
    res.sendStatus(401);
  }
});

export default router;
