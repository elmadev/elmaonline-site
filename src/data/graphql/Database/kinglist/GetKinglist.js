import {
  Kinglist,
  KinglistYearly,
  KinglistMonthly,
  KinglistWeekly,
  KinglistDaily,
  Kuski,
  Team,
} from 'data/models'; // import the data model

export const schema = [
  `
  # Battle rankings overall
  type DatabaseKinglist {
    KinglistIndex: Int
    KuskiIndex: Int
    PlayedNM: Int
    PlayedAll: Int
    WinsNM: Int
    WinsAll: Int
    RowNM: Int
    BestRowNM: Int
    BestRowAll: Int
    RowAll: Int
    PointsNM: Int
    PointsAll: Int
    RankingNM: Float
    RankingAll: Float
    DesignedNM: Int
    DesginedAll: Int
    KuskiData: DatabaseKuski
  }

  # Battle rankings yearly
  type DatabaseKinglistYearly {
    KinglistYearlyIndex: Int
    KuskiIndex: Int
    Year: Int
    PlayedNM: Int
    PlayedAll: Int
    WinsNM: Int
    WinsAll: Int
    RowNM: Int
    BestRowNM: Int
    BestRowAll: Int
    RowAll: Int
    PointsNM: Int
    PointsAll: Int
    RankingNM: Float
    RankingAll: Float
    DesignedNM: Int
    DesginedAll: Int
    KuskiData: DatabaseKuski
  }

  # Battle rankings monthly
  type DatabaseKinglistMonthly {
    KinglistMonthlyIndex: Int
    KuskiIndex: Int
    Month: Int
    PlayedNM: Int
    PlayedAll: Int
    WinsNM: Int
    WinsAll: Int
    PointsNM: Int
    PointsAll: Int
    RankingNM: Float
    RankingAll: Float
    DesignedNM: Int
    DesginedAll: Int
    KuskiData: DatabaseKuski
  }

  # Battle rankings weekly
  type DatabaseKinglistWeekly {
    KinglistWeeklyIndex: Int
    KuskiIndex: Int
    Week: Int
    PlayedAll: Int
    WinsAll: Int
    PointsAll: Int
    RankingAll: Float
    DesginedAll: Int
    KuskiData: DatabaseKuski
  }

  # Battle rankings daily
  type DatabaseKinglistDaily {
    KinglistDailyIndex: Int
    KuskiIndex: Int
    Day: Int
    PlayedAll: Int
    WinsAll: Int
    PointsAll: Int
    RankingAll: Float
    DesginedAll: Int
    KuskiData: DatabaseKuski
  }
`,
];

export const queries = [
  `
  # Retrieves kinglist stored in the database
  getKinglist: [DatabaseKinglist]
  # Retrieves kinglist yearly stored in the database
  getKinglistYearly(Year: Int!): [DatabaseKinglistYearly]
  # Retrieves kinglist mothly stored in the database
  getKinglistMonthly(Month: Int!): [DatabaseKinglistMonthly]
  # Retrieves kinglist weekly stored in the database
  getKinglistWeekly(Week: Int!): [DatabaseKinglistWeekly]
  # Retrieves kinglist daily stored in the database
  getKinglistDaily(Day: Int!): [DatabaseKinglistDaily]
`,
];

export const resolvers = {
  RootQuery: {
    async getKinglist() {
      const kinglist = await Kinglist.findAll({
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
      return kinglist;
    },
    async getKinglistYearly(parent, { Year }) {
      const kinglistYearly = await KinglistYearly.findAll({
        where: { Year },
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
      return kinglistYearly;
    },
    async getKinglistMonthly(parent, { Month }) {
      const kinglistMonthly = await KinglistMonthly.findAll({
        where: { Month },
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
      return kinglistMonthly;
    },
    async getKinglistWeekly(parent, { Week }) {
      const kinglistWeekly = await KinglistWeekly.findAll({
        where: { Week },
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
      return kinglistWeekly;
    },
    async getKinglistDaily(parent, { Day }) {
      const kinglistDaily = await KinglistDaily.findAll({
        where: { Day },
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
      return kinglistDaily;
    },
  },
};
