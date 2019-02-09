import { Kinglist } from 'data/models'; // import the data model

export const schema = [
  `
  # A user stored in the database
  type DatabaseKinglist {
    KinglistIndex: Int
    KuskiIndex: Int
    PointsNM: Int
    PlayedNM: Int
    WinsNM: Int
    RowNM: Int
    BestRowNM: Int
    RankingNM: Int
    DesignedNM: Int
  }
`,
];

export const queries = [
  `
  # Retrieves kinglist stored in the database
  getKinglist: [DatabaseKinglist]
`,
];

export const resolvers = {
  RootQuery: {
    async getKinglist() {
      const kinglist = await Kinglist.findAll();
      return kinglist;
    },
  },
};
