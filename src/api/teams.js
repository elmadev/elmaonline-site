import express from 'express';
import { Team, Kuski } from '../data/models';

const router = express.Router();

const getTeams = async () => {
  const data = await Team.findAll({});
  return data;
};

const GetMembers = async t => {
  const data = await Team.findOne({
    where: { Team: t },
    include: [
      {
        model: Kuski,
        as: 'Members',
      },
    ],
  });
  return data;
};

router
  .get('/', async (req, res) => {
    const data = await getTeams();
    res.json(data);
  })
  .get('/:Team', async (req, res) => {
    const data = await GetMembers(req.params.Team);
    res.json(data);
  });

export default router;
