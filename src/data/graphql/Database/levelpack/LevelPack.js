import { LevelPack, Kuski, Level, LevelPackLevel } from 'data/models';

export const schema = [
  `
    type DatabaseLevelPack {
      LevelPackIndex: Int
      KuskiIndex: Int
      LevelPackName: String
      LevelPackLongName: String
      LevelPackDesc: String
      NoneCrippled: Int
      NoVolt: Int
      NoSupervolt: Int
      NoTurn: Int
      OneTurn: Int
      NoBrake: Int
      NoThrottle: Int
      AlwaysThrottle: Int
      OneWheel: Int
      BestTimes: Int
      Overall: Int
      Speed: Int
      NOF: Int
      PlayingTime: Int
      Multi: Int
      FF: Int
      Weekly: String
      KuskiData: DatabaseKuski
      Levels: [DatabaseLevelPackLevel]
    }

    type DatabaseLevelPackLevel {
      LevelPackLevelIndex: Int
      LevelPackIndex: Int
      LevelIndex: Int
      Level: DatabaseLevel
    }
  `,
];

export const queries = [
  `
  getLevelPacks: [DatabaseLevelPack]
  getLevelPack(LevelPackName: String!): DatabaseLevelPack
`,
];

export const resolvers = {
  RootQuery: {
    async getLevelPacks() {
      const data = await LevelPack.findAll({
        include: [
          { model: Kuski, as: 'KuskiData', attributes: ['Kuski'] },
          {
            model: LevelPackLevel,
            as: 'Levels',
          },
        ],
        order: [['LevelPackName', 'ASC']],
      });
      return data;
    },
    async getLevelPack(parent, { LevelPackName }) {
      const data = await LevelPack.findOne({
        where: { LevelPackName },
        include: [
          { model: Kuski, as: 'KuskiData', attributes: ['Kuski'] },
          {
            model: LevelPackLevel,
            group: 'Levels.LevelIndex',
            as: 'Levels',
            include: [
              {
                model: Level,
                as: 'Level',
                attributes: ['LevelName', 'LongName'],
              },
            ],
          },
        ],
        order: [
          [
            { model: LevelPackLevel, as: 'Levels' },
            'LevelPackLevelIndex',
            'ASC',
          ],
        ],
      });
      data.Levels = data.Levels.reduce((acc, cur) => {
        if (!acc.find(a => a.LevelIndex === cur.LevelIndex)) acc.push(cur);
        return acc;
      }, []);
      return data;
    },
  },
};
