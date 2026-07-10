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

const isPlainObject = value =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const validateWhitelistPayload = whitelist => {
  if (!Array.isArray(whitelist)) {
    return false;
  }
  return whitelist.every(item => Number.isInteger(item) && item >= 0);
};

const validateBreakPayload = brk => Number.isInteger(brk);

const validateOverridePayload = data => {
  if (!isPlainObject(data)) {
    return false;
  }

  const { BattleLeagueBattleIndex, KuskiIndex, Time, DNF, Kuski } = data;

  if (
    !(
      Number.isInteger(BattleLeagueBattleIndex) &&
      BattleLeagueBattleIndex >= 0 &&
      Number.isInteger(KuskiIndex) &&
      KuskiIndex >= 0 &&
      Number.isInteger(Time) &&
      typeof DNF === 'boolean' &&
      typeof Kuski === 'string'
    )
  ) {
    return false;
  }

  return true;
};

const getLeagueForSettingsUpdate = async data => {
  const where = data.BattleLeagueIndex
    ? { BattleLeagueIndex: data.BattleLeagueIndex }
    : null;

  if (!where) {
    return { error: `Missing league identifier` };
  }

  const league = await BattleLeague.findOne({ where });
  if (!league) {
    return { error: `Can't find league` };
  }
  if (data.By !== league.KuskiIndex) {
    return { error: `Not your battle league` };
  }

  return { league };
};

const updateLeagueWhitelist = async data => {
  const whitelist = data?.whitelist;
  if (!validateWhitelistPayload(whitelist)) {
    return `Invalid whitelist format`;
  }

  const result = await getLeagueForSettingsUpdate(data);
  if (result.error) {
    return result.error;
  }

  const currentSettings = isPlainObject(result.league.Settings)
    ? result.league.Settings
    : {};
  const override = isPlainObject(currentSettings.override)
    ? currentSettings.override
    : {};

  await result.league.update({
    Settings: { ...currentSettings, whitelist, override },
  });
  return false;
};

const updateLeagueBreak = async data => {
  const brk = data?.break;
  if (!validateBreakPayload(brk)) {
    return `Invalid break format`;
  }

  const result = await getLeagueForSettingsUpdate(data);
  if (result.error) {
    return result.error;
  }

  const currentSettings = isPlainObject(result.league.Settings)
    ? result.league.Settings
    : {};

  await result.league.update({
    Settings: { ...currentSettings, break: brk },
  });
  return false;
};

const updateLeagueOverride = async data => {
  if (!validateOverridePayload(data)) {
    return `Invalid override format`;
  }

  const result = await getLeagueForSettingsUpdate(data);
  if (result.error) {
    return result.error;
  }

  const currentSettings = isPlainObject(result.league.Settings)
    ? result.league.Settings
    : {};
  const currentOverride = isPlainObject(currentSettings.override)
    ? currentSettings.override
    : {};
  const battleId = String(data.BattleLeagueBattleIndex);
  const existingEntries = Array.isArray(currentOverride[battleId])
    ? currentOverride[battleId]
    : [];
  const nextEntries =
    data.Time === -1
      ? existingEntries.filter(entry => entry.KuskiIndex !== data.KuskiIndex)
      : [
          ...existingEntries,
          {
            KuskiIndex: data.KuskiIndex,
            Time: data.Time,
            DNF: data.DNF,
            Kuski: data.Kuski,
          },
        ];
  const nextOverride = {
    ...currentOverride,
    [battleId]: nextEntries,
  };

  await result.league.update({
    Settings: {
      ...currentSettings,
      whitelist: Array.isArray(currentSettings.whitelist)
        ? currentSettings.whitelist
        : [],
      override: nextOverride,
    },
  });
  return false;
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
  .post('/update/whitelist', async (req, res) => {
    const auth = authContext(req);
    if (auth.auth) {
      const update = await updateLeagueWhitelist({
        ...req.body,
        By: auth.userid,
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
  .post('/update/break', async (req, res) => {
    const auth = authContext(req);
    if (auth.auth) {
      const update = await updateLeagueBreak({
        ...req.body,
        By: auth.userid,
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
  .post('/update/override', async (req, res) => {
    const auth = authContext(req);
    if (auth.auth) {
      const update = await updateLeagueOverride({
        ...req.body,
        By: auth.userid,
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
