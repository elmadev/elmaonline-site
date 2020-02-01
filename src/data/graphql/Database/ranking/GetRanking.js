import {
  Ranking,
  RankingYearly,
  RankingMonthly,
  RankingWeekly,
  RankingDaily,
  Kuski,
  Team,
  RankingHistory,
} from 'data/models'; // import the data model

export const schema = [
  `
  # Battle rankings overall
  type DatabaseRanking {
    RankingIndex: Int
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
  type DatabaseRankingYearly {
    RankingYearlyIndex: Int
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
  type DatabaseRankingMonthly {
    RankingMonthlyIndex: Int
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
  type DatabaseRankingWeekly {
    RankingWeeklyIndex: Int
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
  type DatabaseRankingDaily {
    RankingDailyIndex: Int
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
  # Retrives ranking for a single kuski
  getRankingByKuski(KuskiIndex: Int!): [DatabaseRanking]
  # Retrieves ranking stored in the database
  getRanking: [DatabaseRanking]
  # Retrieves ranking yearly stored in the database
  getRankingYearly(Year: Int!): [DatabaseRankingYearly]
  # Retrieves ranking mothly stored in the database
  getRankingMonthly(Month: Int!): [DatabaseRankingMonthly]
  # Retrieves ranking weekly stored in the database
  getRankingWeekly(Week: Int!): [DatabaseRankingWeekly]
  # Retrieves ranking daily stored in the database
  getRankingDaily(Day: Int!): [DatabaseRankingDaily]
  # Retrieves ranking history for a battle
  getRankingHistoryByBattle(BattleIndex: Int!): [DatabaseRankingHistory]
`,
];

export const resolvers = {
  RootQuery: {
    async getRankingByKuski(parent, { KuskiIndex }) {
      const ranking = await Ranking.findAll({
        where: { KuskiIndex },
      });
      return ranking;
    },
    async getRanking() {
      const ranking = await Ranking.findAll({
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
      return ranking;
    },
    async getRankingYearly(parent, { Year }) {
      const rankingYearly = await RankingYearly.findAll({
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
      return rankingYearly;
    },
    async getRankingMonthly(parent, { Month }) {
      const rankingMonthly = await RankingMonthly.findAll({
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
      return rankingMonthly;
    },
    async getRankingWeekly(parent, { Week }) {
      const rankingWeekly = await RankingWeekly.findAll({
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
      return rankingWeekly;
    },
    async getRankingDaily(parent, { Day }) {
      const rankingDaily = await RankingDaily.findAll({
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
      return rankingDaily;
    },
    async getRankingHistoryByBattle(parent, { BattleIndex }) {
      const RankingHistoryByBattle = await RankingHistory.findAll({
        where: { BattleIndex },
      });
      return RankingHistoryByBattle;
    },
  },
};
