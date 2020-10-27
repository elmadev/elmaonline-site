import {
  /* AllFinished, */ Kuski,
  Team,
  Besttime,
  Level,
  AllFinished,
} from 'data/models';

export const schema = [
  `
  type DatabaseTime {
    AllFinishedIndex: Int
    TimeIndex: Int
    KuskiIndex: Int
    LevelIndex: Int
    Time: Int
    Apples: Int
    Driven: Int
    BattleIndex: Int
    MaxSpeed: Int
    ThrottleTime: Int
    BrakeTime: Int
    LeftVolt: Int
    RightVolt: Int
    SuperVolt: Int
    OneWheel: Int
    KuskiData: DatabaseKuski
  }

  type DatabaseWeeklyWRs {
    WeeklyWRsIndex: Int
    TimeIndex: Int
  }

  type DatabaseBestTime {
    BestTimeIndex: Int
    TimeIndex: Int
    KuskiIndex: Int
    LevelIndex: Int
    Time: Int
    KuskiData: DatabaseKuski
    WeeklyWR: DatabaseWeeklyWRs
  }
`,
];

export const queries = [
  `
    getTimes(LevelIndex: Int!): [DatabaseTime]
    getBestTimes(LevelIndex: Int!, Limit: Int): [DatabaseBestTime]
  `,
];

export const resolvers = {
  RootQuery: {
    async getTimes(parent, { LevelIndex }) {
      const level = await Level.findOne({
        attributes: ['Hidden', 'Locked'],
        where: { LevelIndex },
      });

      if (level.Locked || level.Hidden) return [];

      const times = await AllFinished.findAll({
        where: { LevelIndex },
        order: [['Time', 'ASC'], ['TimeIndex', 'ASC']],
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
      return times;
    },
    async getBestTimes(parent, { LevelIndex, Limit }) {
      const level = await Level.findOne({
        attributes: ['Hidden', 'Locked'],
        where: { LevelIndex },
      });

      if (level.Locked) return [];
      if (level.Hidden) return [];

      const times = await Besttime.findAll({
        where: { LevelIndex },
        order: [['Time', 'ASC'], ['TimeIndex', 'ASC']],
        limit: Limit,
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
      return times;
    },
  },
};
