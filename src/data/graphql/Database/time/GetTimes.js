// import { AllFinished, Kuski, Team, BestTime } from 'data/models';

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

  type DatabaseBestTime {
    BestTimeIndex: Int
    TimeIndex: Int
    KuskiIndex: Int
    LevelIndex: Int
    Time: Int
    KuskiData: DatabaseKuski
  }
`,
];

export const queries = [
  `
    getTimes(LevelIndex: Int!): [DatabaseTime]
    getBestTimes(LevelIndex: Int!): [DatabaseBestTime]
  `,
];

export const resolvers = {
  RootQuery: {
    async getTimes() {
      return null;
    },
    /* async getTimes(parent, { LevelIndex }) {
      const times = await AllFinished.findAll({
        where: { LevelIndex },
        order: [['Time', 'ASC']],
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
    }, */
    async getBestTimes() {
      return null;
    },
    /* async getBestTimes(parent, { LevelIndex }) {
      const times = await BestTime.findAll({
        where: { LevelIndex },
        order: [['Time', 'ASC']],
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
    }, */
  },
};
