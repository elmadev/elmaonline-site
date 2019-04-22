import { Battle, Battletime, Kuski, Team, AllFinished } from 'data/models'; // import the data model

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
  }
`,
];

export const queries = [
  `
  # Retrieves results from a battle
  getBattletime(
    # The battle's id
    BattleIndex: Int!
  ): [DatabaseBattletime]
  getAllBattleTimes(BattleIndex: Int!): [DatabaseTime]
`,
];

export const resolvers = {
  RootQuery: {
    async getBattletime(parent, { BattleIndex }) {
      const battleStatus = await Battle.findAll({
        attributes: ['Finished'],
        where: { BattleIndex },
      });
      let battletime;
      if (battleStatus[0].dataValues.Finished === 1) {
        battletime = await Battletime.findAll({
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
          ],
        });
      } else {
        battletime = [];
      }
      return battletime;
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
