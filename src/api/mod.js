import express from 'express';
import { acceptNickMail } from 'utils/email';
import { authContext } from 'utils/auth';
import { SiteSetting, Kuski } from '../data/models';

const router = express.Router();

const getNickRequests = async () => {
  const ranking = await SiteSetting.findAll({
    where: { SettingName: 'ChangeNick' },
    order: [['SiteSettingIndex', 'DESC']],
    include: [
      {
        model: Kuski,
        as: 'KuskiData',
        attributes: ['Kuski'],
      },
    ],
  });
  return ranking;
};

const getNickRequest = async SiteSettingIndex => {
  const data = await SiteSetting.findOne({
    where: { SiteSettingIndex },
  });
  return data;
};

const DeclineNick = async SiteSettingIndex => {
  await SiteSetting.destroy({ where: { SiteSettingIndex } });
};

const AcceptNick = async data => {
  const kuskiInfo = await Kuski.findOne({
    where: { KuskiIndex: data.KuskiIndex },
  });
  await Kuski.update(
    { Kuski: data.Setting },
    { where: { KuskiIndex: data.KuskiIndex } },
  );
  await SiteSetting.destroy({
    where: { SiteSettingIndex: data.SiteSettingIndex },
  });
  await acceptNickMail(data.Setting, kuskiInfo.Email, kuskiInfo.Kuski);
};

router
  .get('/nickrequests', async (req, res) => {
    const auth = authContext(req);
    if (auth.mod) {
      const data = await getNickRequests();
      res.json(data);
    } else {
      res.sendStatus(401);
    }
  })
  .post('/nickrequests/:action/:id', async (req, res) => {
    const auth = authContext(req);
    if (auth.mod) {
      const data = await getNickRequest(req.params.id);
      if (data) {
        if (req.params.action === 'accept') {
          await AcceptNick(data);
        }
        if (req.params.action === 'decline') {
          await DeclineNick(data.SiteSettingIndex);
        }
        res.json({ success: 1 });
      } else {
        res.json({ success: 0 });
      }
    } else {
      res.sendStatus(401);
    }
  });

export default router;
