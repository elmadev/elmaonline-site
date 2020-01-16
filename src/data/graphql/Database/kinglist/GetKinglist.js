import {
  Kinglist,
  KinglistYearly,
  KinglistMonthly,
  KinglistWeekly,
  KinglistDaily,
  Kuski,
  Team,
  RankingHistory,
} from 'data/models'; // import the data model

export const schema = [
  `
  # Battle rankings overall
  type DatabaseKinglist {
    KinglistIndex: Int
    KuskiIndex: Int
    PlayedNM: Int
    PlayedAll: Int
    PlayedFF: Int
    PlayedOL: Int
    PlayedSL: Int
    PlayedSR: Int
    PlayedLC: Int
    PlayedFT: Int
    PlayedAP: Int
    PlayedSP: Int
    PlayedFC: Int
    PlayedNV: Int
    PlayedNT: Int
    PlayedOT: Int
    PlayedNB: Int
    PlayedNTH: Int
    PlayedAT: Int
    PlayedD: Int
    PlayedOW: Int
    PlayedM: Int
    WinsNM: Int
    WinsAll: Int
    WinsFF: Int
    WinsOL: Int
    WinsSL: Int
    WinsSR: Int
    WinsLC: Int
    WinsFT: Int
    WinsAP: Int
    WinsSP: Int
    WinsFC: Int
    WinsNV: Int
    WinsNT: Int
    WinsOT: Int
    WinsNB: Int
    WinsNTH: Int
    WinsAT: Int
    WinsD: Int
    WinsOW: Int
    WinsM: Int
    RowNM: Int
    BestRowNM: Int
    BestRowAll: Int
    RowAll: Int
    PointsNM: Int
    PointsAll: Int
    PointsFF: Int
    PointsOL: Int
    PointsSL: Int
    PointsSR: Int
    PointsLC: Int
    PointsFT: Int
    PointsAP: Int
    PointsSP: Int
    PointsFC: Int
    PointsNV: Int
    PointsNT: Int
    PointsOT: Int
    PointsNB: Int
    PointsNTH: Int
    PointsAT: Int
    PointsD: Int
    PointsOW: Int
    PointsM: Int
    RankingNM: Float
    RankingAll: Float
    RankingFF: Float
    RankingOL: Float
    RankingSL: Float
    RankingSR: Float
    RankingLC: Float
    RankingFT: Float
    RankingAP: Float
    RankingSP: Float
    RankingFC: Float
    RankingNV: Float
    RankingNT: Float
    RankingOT: Float
    RankingNB: Float
    RankingNTH: Float
    RankingAT: Float
    RankingD: Float
    RankingOW: Float
    RankingM: Float
    DesignedNM: Int
    DesignedAll: Int
    DesignedFF: Int
    DesignedOL: Int
    DesignedSL: Int
    DesignedSR: Int
    DesignedLC: Int
    DesignedFT: Int
    DesignedAP: Int
    DesignedSP: Int
    DesignedFC: Int
    DesignedNV: Int
    DesignedNT: Int
    DesignedOT: Int
    DesignedNB: Int
    DesignedNTH: Int
    DesignedAT: Int
    DesignedD: Int
    DesignedOW: Int
    DesignedM: Int
    KuskiData: DatabaseKuski
  }

  # Battle rankings yearly
  type DatabaseKinglistYearly {
    KinglistYearlyIndex: Int
    KuskiIndex: Int
    Year: Int
    PlayedNM: Int
    PlayedAll: Int
    PlayedFF: Int
    PlayedOL: Int
    PlayedSL: Int
    PlayedSR: Int
    PlayedLC: Int
    PlayedFT: Int
    PlayedAP: Int
    PlayedSP: Int
    PlayedFC: Int
    PlayedNV: Int
    PlayedNT: Int
    PlayedOT: Int
    PlayedNB: Int
    PlayedNTH: Int
    PlayedAT: Int
    PlayedD: Int
    PlayedOW: Int
    PlayedM: Int
    WinsNM: Int
    WinsAll: Int
    WinsFF: Int
    WinsOL: Int
    WinsSL: Int
    WinsSR: Int
    WinsLC: Int
    WinsFT: Int
    WinsAP: Int
    WinsSP: Int
    WinsFC: Int
    WinsNV: Int
    WinsNT: Int
    WinsOT: Int
    WinsNB: Int
    WinsNTH: Int
    WinsAT: Int
    WinsD: Int
    WinsOW: Int
    WinsM: Int
    PointsNM: Int
    PointsAll: Int
    PointsFF: Int
    PointsOL: Int
    PointsSL: Int
    PointsSR: Int
    PointsLC: Int
    PointsFT: Int
    PointsAP: Int
    PointsSP: Int
    PointsFC: Int
    PointsNV: Int
    PointsNT: Int
    PointsOT: Int
    PointsNB: Int
    PointsNTH: Int
    PointsAT: Int
    PointsD: Int
    PointsOW: Int
    PointsM: Int
    RankingNM: Float
    RankingAll: Float
    RankingFF: Float
    RankingOL: Float
    RankingSL: Float
    RankingSR: Float
    RankingLC: Float
    RankingFT: Float
    RankingAP: Float
    RankingSP: Float
    RankingFC: Float
    RankingNV: Float
    RankingNT: Float
    RankingOT: Float
    RankingNB: Float
    RankingNTH: Float
    RankingAT: Float
    RankingD: Float
    RankingOW: Float
    RankingM: Float
    DesignedNM: Int
    DesignedAll: Int
    DesignedFF: Int
    DesignedOL: Int
    DesignedSL: Int
    DesignedSR: Int
    DesignedLC: Int
    DesignedFT: Int
    DesignedAP: Int
    DesignedSP: Int
    DesignedFC: Int
    DesignedNV: Int
    DesignedNT: Int
    DesignedOT: Int
    DesignedNB: Int
    DesignedNTH: Int
    DesignedAT: Int
    DesignedD: Int
    DesignedOW: Int
    DesignedM: Int
    KuskiData: DatabaseKuski
  }

  # Battle rankings monthly
  type DatabaseKinglistMonthly {
    KinglistMonthlyIndex: Int
    KuskiIndex: Int
    Month: Int
    PlayedNM: Int
    PlayedAll: Int
    PlayedFF: Int
    PlayedAP: Int
    WinsNM: Int
    WinsAll: Int
    WinsFF: Int
    WinsAP: Int
    PointsNM: Int
    PointsAll: Int
    PointsFF: Int
    PointsAP: Int
    RankingNM: Float
    RankingAll: Float
    RankingFF: Float
    RankingAP: Float
    DesignedNM: Int
    DesignedAll: Int
    DesignedFF: Int
    DesignedAP: Int
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
    DesignedAll: Int
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
    DesignedAll: Int
    KuskiData: DatabaseKuski
  }

  # Battle rankings history
  type DatabaseRankingHistory {
    RankingHistoryIndex: Int
    KuskiIndex: Int
    BattleIndex: Int
    BattleType: String
    Played: Int
    Ranking: Float
    Increase: Float
    Points: Int
    Wins: Int
    Designed: Int
    Position: Int
    Started: Int
  }
`,
];

export const queries = [
  `
  # Retrives kinglist for a single kuski
  getKinglistByKuski(KuskiIndex: Int!): [DatabaseKinglist]
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
  # Retrieves ranking history for a battle
  getRankingHistoryByBattle(BattleIndex: Int!): [DatabaseRankingHistory]
`,
];

export const resolvers = {
  RootQuery: {
    async getKinglistByKuski(parent, { KuskiIndex }) {
      const kinglist = await Kinglist.findAll({
        where: { KuskiIndex },
      });
      return kinglist;
    },
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
    async getRankingHistoryByBattle(parent, { BattleIndex }) {
      const RankingHistoryByBattle = await RankingHistory.findAll({
        where: { BattleIndex },
      });
      return RankingHistoryByBattle;
    },
  },
};
