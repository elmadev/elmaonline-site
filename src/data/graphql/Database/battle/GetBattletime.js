import sequelize from 'sequelize';
import {
  Battle,
  Battletime,
  Kuski,
  Team,
  AllFinished,
  Time,
} from 'data/models'; // import the data model
import { sortResults } from 'utils/battle';

export const schema = [
  `
  # A battle stored in the database
  type DatabaseBattletime {
    BattleTimeIndex: Int
    BattleIndex: Int
    KuskiIndex: Int
    KuskiIndex2: Int
    TimeIndex: Int
    Time: Int
    Apples: Int
    KuskiData: DatabaseKuski
    KuskiData2: DatabaseKuski
  }
`,
];

export const queries = [
  `
  # Retrieves results from a battle
  getBattleTimes(
    # The battle's id
    BattleIndex: Int!
  ): [DatabaseBattletime]
  getAllBattleTimes(BattleIndex: Int!): [DatabaseTime]
`,
];

export const resolvers = {
  RootQuery: {
    async getBattleTimes(parent, { BattleIndex }) {
      const battle = await Battle.findOne({
        attributes: ['Finished', 'SeeTimes', 'AcceptBugs', 'BattleType'],
        where: { BattleIndex },
      });

      if (!battle.SeeTimes && !battle.Finished) {
        return [];
      }

      if (battle.Finished) {
        const times = await Battletime.findAll({
          where: { BattleIndex },
          include: [
            {
              model: Kuski,
              attributes: ['Kuski', 'Country'],
              as: 'KuskiData',
              include: [
                {
                  model: Team,
                  as: 'TeamData',
                },
              ],
            },
            {
              model: Kuski,
              attributes: ['Kuski', 'Country'],
              as: 'KuskiData2',
              include: [
                {
                  model: Team,
                  as: 'TeamData',
                },
              ],
            },
          ],
        });
        return times;
      }

      // live results
      const allowedTypes = ['F'];
      if (battle.AcceptBugs) allowedTypes.push('B');

      const times = await Time.findAll({
        where: {
          BattleIndex,
          Finished: {
            [sequelize.Op.in]: allowedTypes,
          },
        },
        include: [
          {
            model: Kuski,
            attributes: ['Kuski', 'Country'],
            as: 'KuskiData',
            include: [
              {
                model: Team,
                as: 'TeamData',
              },
            ],
          },
        ],
      });
      const filtered = times
        .sort(sortResults(battle.BattleType))
        .reduce((acc, cur) => {
          const existing = acc.find(t => t.KuskiIndex === cur.KuskiIndex);
          if (!existing) acc.push(cur);

          return acc;
        }, []);
      return filtered;
    },
    async getAllBattleTimes(parent, { BattleIndex }) {
      const battleStatus = await Battle.findAll({
        attributes: ['Finished'],
        where: { BattleIndex },
      });
      let times;
      if (battleStatus[0].dataValues.Finished === 1) {
        times = await AllFinished.findAll({
          where: { BattleIndex },
          order: [['TimeIndex', 'ASC']],
          include: [
            {
              model: Kuski,
              as: 'KuskiData',
              attributes: ['Kuski', 'Country'],
              include: [
                {
                  model: Team,
                  as: 'TeamData',
                },
              ],
            },
          ],
        });
      } else {
        times = [];
      }
      return times;
    },
  },
};
