import express from 'express';
import { SiteSetting } from '../data/models';

const router = express.Router();

const getNickRequests = async () => {
  const ranking = await SiteSetting.findAll({
    where: { SettingName: 'ChangeNick' },
    order: [['SiteSettingIndex', 'DESC']],
  });
  return ranking;
};

router.get('/nickrequests', async (req, res) => {
  const data = await getNickRequests();
  res.json(data);
});

export default router;
