import express from 'express';
import { authContext } from '#utils/auth';
import { zeroPad } from '#utils/calcs';
import {
  BattleLeague,
  BattleLeagueBattle,
  Kuski,
  Battle,
  Level,
  Battletime,
} from '#data/models';

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
            model: Kuski,
            as: 'DesignerData',
          },
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

const getKuski = async k => {
  if (!k) return false;
  const findKuski = await Kuski.findOne({
    where: { Kuski: k },
    attributes: ['KuskiIndex', 'Kuski'],
  });
  return findKuski;
};

const AddBattle = async data => {
  const kuski = await getKuski(data.Designer);
  const add = await BattleLeagueBattle.create({
    LevelName: data.LevelName ? data.LevelName : '',
    Started:
      data.StartDate && data.StartHour
        ? `${data.StartDate} ${zeroPad(data.StartHour)}`
        : null,
    Designer: kuski ? kuski.KuskiIndex : 0,
    BattleType: data.BattleType ? data.BattleType : '',
    Season: data.Season ? data.Season : '',
    BattleIndex: data.BattleIndex ? data.BattleIndex : 0,
    BattleLeagueIndex: data.BattleLeagueIndex,
  });
  return add;
};

const UpdateBattle = async data => {
  const getBattle = await BattleLeagueBattle.findOne({
    where: { BattleLeagueBattleIndex: data.BattleLeagueBattleIndex },
  });
  if (!getBattle) {
    return `Can't find battle`;
  }
  const league = await BattleLeague.findOne({
    where: { BattleLeagueIndex: getBattle.BattleLeagueIndex },
  });
  if (!league) {
    return `Can't find league`;
  }
  if (data.By !== league.KuskiIndex) {
    return `Not your battle league`;
  }
  if (data.Action === 'update') {
    await getBattle.update({ Season: data.Season });
  }
  if (data.Action === 'delete') {
    await getBattle.destroy();
  }
  return false;
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
  })
  .post('/add/battle', async (req, res) => {
    const auth = authContext(req);
    if (auth.auth) {
      const add = await AddBattle(req.body);
      res.json(add);
    } else {
      res.sendStatus(401);
    }
  })
  .post('/update/battle', async (req, res) => {
    const auth = authContext(req);
    if (auth.auth) {
      const update = await UpdateBattle({
        ...req.body,
        By: auth.userid,
        Action: 'update',
      });
      if (update) {
        res.json({ success: 0, error: update });
      } else {
        res.json({ success: 1 });
      }
    } else {
      res.sendStatus(401);
    }
  })
  .delete('/delete/battle/:id', async (req, res) => {
    const auth = authContext(req);
    if (auth.auth) {
      const remove = await UpdateBattle({
        BattleLeagueBattleIndex: req.params.id,
        By: auth.userid,
        Action: 'delete',
      });
      if (remove) {
        res.json({ success: 0, error: remove });
      } else {
        res.json({ success: 1 });
      }
    } else {
      res.sendStatus(401);
    }
  });

export default router;
