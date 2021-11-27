import express from 'express';
import { authContext } from 'utils/auth';
import {
  BattleLeague,
  BattleLeagueBattle,
  Kuski,
  Battle,
  Level,
  Battletime,
} from '../data/models';

const router = express.Router();

const getLeagues = async () => {
  const data = await BattleLeague.findAll({});
  return data;
};

const getLeague = async ShortName => {
  const data = await BattleLeague.findOne({
    where: { ShortName },
    include: [
      {
        model: Kuski,
        as: 'KuskiData',
      },
      {
        model: BattleLeagueBattle,
        as: 'Battles',
        include: [
          {
            model: Battle,
            as: 'BattleData',
            attributes: ['BattleType', 'Started', 'Duration'],
            include: [
              {
                model: Kuski,
                as: 'KuskiData',
              },
              {
                model: Level,
                as: 'LevelData',
                attributes: ['LevelName'],
              },
              {
                model: Battletime,
                as: 'Results',
                attributes: [
                  'KuskiIndex',
                  'TimeIndex',
                  'Time',
                  'Apples',
                  'BattleTimeIndex',
                ],
                include: [
                  {
                    model: Kuski,
                    as: 'KuskiData',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  });
  return data;
};

const addLeague = async data => {
  const add = await BattleLeague.create(data);
  return add;
};

router
  .get('/', async (req, res) => {
    const data = await getLeagues();
    res.json(data);
  })
  .get('/:league', async (req, res) => {
    const data = await getLeague(req.params.league);
    res.json(data);
  })
  .post('/add', async (req, res) => {
    const auth = authContext(req);
    if (auth.auth) {
      const add = await addLeague({
        ...req.body,
        KuskiIndex: auth.userid,
      });
      res.json(add);
    } else {
      res.sendStatus(401);
    }
  });

export default router;
