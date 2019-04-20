import { LevelPack, Kuski, LevelPackLevel } from 'data/models';

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
    }
  `,
];

export const queries = [
  `
  getLevelPacks: [DatabaseLevelPack]
`,
];

export const resolvers = {
  RootQuery: {
    async getLevelPacks() {
      const data = await LevelPack.findAll({
        include: [
          { model: Kuski, as: 'KuskiData', attributes: ['Kuski'] },
          { model: LevelPackLevel, as: 'Levels' },
        ],
        order: [['LevelPackName', 'ASC']],
      });
      return data;
    },
  },
};
