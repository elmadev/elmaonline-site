import {
  /* AllFinished, */ Kuski,
  Team,
  Besttime,
  Level,
  WeeklyBest,
  WeeklyWRs,
} from 'data/models';
import { forEach } from 'lodash';

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
    getBestTimes(LevelIndex: Int!): [DatabaseBestTime]
    getBestTimesIn(LevelIndices: String!): [DatabaseBestTime]
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
    async getBestTimes(parent, { LevelIndex }) {
      const level = await Level.findOne({
        attributes: ['Hidden', 'Locked'],
        where: { LevelIndex },
      });

      if (level.Locked) return [];

      const sourceModel = level.Hidden ? WeeklyBest : Besttime;

      const times = await sourceModel.findAll({
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
          {
            model: WeeklyWRs,
            as: 'WeeklyWR',
          },
        ],
      });
      return times.filter(t => !t.WeeklyWR);
    },
    async getBestTimesIn(parent, { LevelIndices }) {
      const levels = await Level.findOne({
        attributes: ['Hidden', 'Locked'],
        where: { LevelIndex: LevelIndices.split('-') },
      });

      let hidden = false;
      let locked = false;
      forEach(levels, level => {
        if (level.Locked) {
          locked = true;
        }
        if (level.Hidden) {
          hidden = true;
        }
      });

      if (locked) return [];

      const sourceModel = hidden ? WeeklyBest : Besttime;

      const times = await sourceModel.findAll({
        where: { LevelIndex: LevelIndices.split('-') },
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
          {
            model: WeeklyWRs,
            as: 'WeeklyWR',
          },
        ],
      });
      return times.filter(t => !t.WeeklyWR);
    },
  },
};
