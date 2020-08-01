/* eslint-disable prettier/prettier */
import express from 'express';
import { Op } from 'sequelize';
import { like } from 'utils/database';
import { Team, Kuski } from '../data/models';

const router = express.Router();

const PlayersSearch = async (query, offset) => {
  const get = await Kuski.findAll({
    where: { Kuski: { [Op.like]: `${like(query)}%` } },
    attributes: [
      'KuskiIndex',
      'Kuski',
      'TeamIndex',
      'Country',
    ],
    limit: 25,
    order: [
      ['Kuski', 'ASC'],
    ],
    offset: parseInt(offset, 10),
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

const TeamsSearch = async (query, offset) => {
  const get = await Team.findAll({
    where: { Team: { [Op.like]: `${like(query)}%` } },
    limit: 25,
    order: [
      ['Team', 'ASC'],
    ],
    offset: parseInt(offset, 10),
  });
  return get;
};

router
  .get('/', async (req, res) => {
    res.json({});
  })
  .get('/searchTeam/:query/:offset', async(req, res) => {
    const teams = await TeamsSearch(req.params.query, req.params.offset);
    res.json(teams);
  })
  .get('/search/:query/:offset/', async (req, res) => {
    const players = await PlayersSearch(
      req.params.query,
      req.params.offset,
    );
    res.json(players);
  });

export default router;
