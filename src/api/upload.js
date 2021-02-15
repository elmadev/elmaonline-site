import express from 'express';
import { authContext } from 'utils/auth';
import { format, addDays } from 'date-fns';

import { Upload } from 'data/models';

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

export default router;
