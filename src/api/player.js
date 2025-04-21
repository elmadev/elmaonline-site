import express from 'express';
import { Op } from 'sequelize';
import { like, searchLimit, searchOffset } from '#utils/database';
import { authContext } from '#utils/auth';
import { pick, omit } from 'lodash-es';
import {
  Team,
  Kuski,
  Ignored,
  Ranking,
  LevelStats,
  Level,
  Setting,
} from '#data/models';

const router = express.Router();

const PlayersSearch = async (query, offset) => {
  const get = await Kuski.findAll({
    where: { Kuski: { [Op.like]: `${like(query)}%` } },
    attributes: ['KuskiIndex', 'Kuski', 'TeamIndex', 'Country'],
    limit: searchLimit(offset),
    order: [['Kuski', 'ASC']],
    offset: searchOffset(offset),
    include: [
      {
        model: Team,
        as: 'TeamData',
        attributes: ['Team'],
      },
    ],
  });
  return get;
};

const Players = async () => {
  const get = await Kuski.findAll({
    attributes: ['KuskiIndex', 'Kuski', 'TeamIndex', 'Country', 'Confirmed'],
    order: [['Kuski', 'ASC']],
    where: {
      Confirmed: 1,
    },
    include: [
      {
        model: Team,
        as: 'TeamData',
        attributes: ['Team'],
      },
      {
        model: Ranking,
        as: 'RankingData',
        attributes: [
          'PlayedAll',
          'WinsAll',
          'DesignedAll',
          'RankingAll',
          'Played5All',
        ],
      },
    ],
  });

  return get;
};

const TeamsSearch = async (query, offset) => {
  const get = await Team.findAll({
    where: { Team: { [Op.like]: `${like(query)}%` } },
    limit: searchLimit(offset),
    order: [['Team', 'ASC']],
    offset: searchOffset(offset),
  });
  return get;
};

const NotifSettings = async KuskiIndex => {
  const get = await Setting.findOne({
    where: { KuskiIndex },
  });
  return get;
};

const ChangeSettings = async data => {
  await Setting.upsert({
    KuskiIndex: data.KuskiIndex,
    [data.Setting]: data.Value,
  });
  return 1;
};

const Player = async (IdentifierType, KuskiIdentifier, currentUser) => {
  const query = {
    where: {},
    include: {
      model: Team,
      as: 'TeamData',
      attributes: ['Team', 'TeamIndex', 'Locked', 'Logo'],
    },
    attributes: [
      'KuskiIndex',
      'Kuski',
      'TeamIndex',
      'Country',
      'RPlay',
      'RStartBattle',
      'RSpecialBattle',
      'RStartCup',
      'RStart24htt',
      'RStop',
      'RMultiPlay',
      'RChat',
      'RBan',
      'RMod',
      'RAdmin',
      'BmpCRC',
      'Confirmed',
    ],
  };
  if (
    currentUser === parseInt(KuskiIdentifier, 10) &&
    IdentifierType === 'KuskiIndex'
  ) {
    query.attributes.push('Email');
  }
  query.where[IdentifierType] = KuskiIdentifier;
  const data = await Kuski.findOne(query);
  return data;
};

const GetIgnored = async KuskiIndex => {
  const data = await Ignored.findAll({
    where: { KuskiIndex },
    include: [
      {
        model: Kuski,
        as: 'KuskiData',
        attributes: ['Kuski', 'Country'],
      },
    ],
  });
  return data;
};

const AddIgnore = async (KuskiIndex, IgnoredKuskiIndex) => {
  const newIgnore = await Ignored.create({ KuskiIndex, IgnoredKuskiIndex });
  return newIgnore;
};

const RemoveIgnore = async (KuskiIndex, IgnoredKuskiIndex) => {
  await Ignored.destroy({ where: { KuskiIndex, IgnoredKuskiIndex } });
};

const GetCrew = async () => {
  const crew = await Kuski.findAll({
    where: {
      [Op.or]: [{ RStop: 1 }, { RMod: 1 }, { RAdmin: 1 }],
    },
    attributes: [
      'KuskiIndex',
      'Kuski',
      'TeamIndex',
      'Country',
      'RPlay',
      'RStartBattle',
      'RSpecialBattle',
      'RStartCup',
      'RStart24htt',
      'RStop',
      'RMultiPlay',
      'RChat',
      'RBan',
      'RMod',
      'RAdmin',
    ],
    include: {
      model: Team,
      as: 'TeamData',
      attributes: ['TeamIndex', 'Team'],
    },
  });
  return crew;
};

router
  .get('/', async (req, res) => {
    const data = await Players();
    res.json(data);
  })
  .get('/crew', async (req, res) => {
    const crew = await GetCrew();
    res.json(crew);
  })
  .get('/record-count/:KuskiIndex', async (req, res) => {
    res.json({ error: 'endpoint disabled due to performance issue' });
    /* const q = `
    SELECT COUNT(s.LevelIndex) countRecords from levelstats s
    INNER JOIN level l ON l.LevelIndex = s.LevelIndex
    WHERE s.TopKuskiIndex0 = ?
    AND l.Locked = 0 AND l.Hidden = 0 AND l.ForceHide = 0
    `;

    const countRecords = await getCol(
      q,
      {
        replacements: [Number(req.params.KuskiIndex)],
      },
      'countRecords',
    );

    res.json(countRecords); */
  })
  .get('/records/:KuskiIndex', async (req, res) => {
    const offset = Number(req.query.offset || 0);
    const limit = Number(req.query.limit || 50);

    const orderBy = {
      Driven: ['TopDriven0', 'DESC'],
      Time: ['TopTime0', 'ASC'],
      TimeAll: ['TimeAll', 'DESC'],
      AttemptsAll: ['AttemptsAll', 'DESC'],
      KuskiCountF: ['KuskiCountF', 'DESC'],
      KuskiCountAll: ['KuskiCountAll', 'DESC'],
      LeaderCount: ['LeaderCount', 'DESC'],
    }[req.query.sort] || ['TopDriven0', 'ASC'];

    if (req.query.reverse) {
      orderBy[1] = orderBy[1] === 'ASC' ? 'DESC' : 'ASC';
    }

    let records = await LevelStats.findAll({
      attributes: [
        'LevelIndex',
        ['TopTime0', 'Time'],
        ['TopDriven0', 'Driven'],
        ['TopTimeIndex0', 'TimeIndex'],
        ['TopBattleIndex0', 'BattleIndex'],
        'TimeAll',
        'TimeF',
        'AttemptsAll',
        'AttemptsF',
        'KuskiCountF',
        'KuskiCountAll',
        'LeaderCount',
      ],
      where: {
        TopKuskiIndex0: Number(req.params.KuskiIndex),
      },
      include: [
        {
          model: Level,
          as: 'LevelData',
          attributes: ['LevelIndex', 'LevelName', 'LongName'],
          where: {
            Locked: 0,
            Hidden: 0,
          },
        },
      ],
      order: [orderBy],
      limit: [offset, limit],
    });

    // remove locked/hidden
    records = records.filter(row => row.LevelData !== null);

    // move stats into own object
    records = records.map(row => {
      const cols = ['Time', 'Driven', 'TimeIndex', 'BattleIndex', 'LevelData'];

      // a hack but pick/omit doesn't like model instances
      // eslint-disable-next-line no-param-reassign
      row = JSON.parse(JSON.stringify(row));

      return {
        ...pick(row, cols),
        LevelStatsData: {
          ...omit(row, cols),
        },
      };
    });

    res.json(records);
  })
  .get('/ignored', async (req, res) => {
    const auth = authContext(req);
    if (auth.auth) {
      const data = await GetIgnored(auth.userid);
      res.json(data);
    } else {
      res.sendStatus(401);
    }
  })
  .get('/settings', async (req, res) => {
    const auth = authContext(req);
    if (auth.auth) {
      const data = await NotifSettings(auth.userid);
      res.json(data);
    } else {
      res.sendStatus(401);
    }
  })
  .post('/settings', async (req, res) => {
    const auth = authContext(req);
    if (auth.auth) {
      const success = await ChangeSettings({
        ...req.body,
        KuskiIndex: auth.userid,
      });
      res.json({ success });
    } else {
      res.sendStatus(401);
    }
  })
  .post('/ignore/:Kuski', async (req, res) => {
    const auth = authContext(req);
    if (auth.auth) {
      const FindKuski = await Kuski.findOne({
        where: { Kuski: req.params.Kuski },
      });
      if (FindKuski) {
        await AddIgnore(auth.userid, FindKuski.KuskiIndex);
        res.json({ success: 1 });
      } else {
        res.json({ success: 0, error: 'Kuski not found.' });
      }
    } else {
      res.sendStatus(401);
    }
  })
  .post('/unignore/:KuskiIndex', async (req, res) => {
    const auth = authContext(req);
    if (auth.auth) {
      await RemoveIgnore(auth.userid, req.params.KuskiIndex);
      res.json({ success: 1 });
    } else {
      res.sendStatus(401);
    }
  })
  .get('/searchTeam/:query/:offset', async (req, res) => {
    const teams = await TeamsSearch(req.params.query, req.params.offset);
    res.json(teams);
  })
  .get('/search/:query/:offset', async (req, res) => {
    const players = await PlayersSearch(req.params.query, req.params.offset);
    res.json(players);
  })
  .get('/:KuskiIndex', async (req, res) => {
    let currentUser = 0;
    const auth = authContext(req);
    if (auth.auth) {
      currentUser = auth.userid;
    }
    const data = await Player('KuskiIndex', req.params.KuskiIndex, currentUser);
    res.json(data);
  })
  .get('/:identifierType/:kuskiIdentifier', async (req, res) => {
    const kuski = await Player(
      req.params.identifierType,
      req.params.kuskiIdentifier,
    );
    res.json(kuski);
  });

export default router;
