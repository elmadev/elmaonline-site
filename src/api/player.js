import express from 'express';
import { Op } from 'sequelize';
import { like, searchLimit, searchOffset } from 'utils/database';
import { authContext } from 'utils/auth';
import { Team, Kuski, Ignored } from '../data/models';

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
    include: [
      {
        model: Team,
        as: 'TeamData',
        attributes: ['Team'],
      },
    ],
  });
  return get.filter(k => k.Confirmed);
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

const Player = async (IdentifierType, KuskiIdentifier) => {
  const query = {
    where: {},
    attributes: ['KuskiIndex', 'Kuski', 'TeamIndex', 'Country', 'Email'],
    include: [
      {
        model: Team,
        as: 'TeamData',
        attributes: ['Team', 'Locked'],
      },
    ],
  };
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

router
  .get('/', async (req, res) => {
    const data = await Players();
    res.json(data);
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
    const data = await Player('KuskiIndex', req.params.KuskiIndex);
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
