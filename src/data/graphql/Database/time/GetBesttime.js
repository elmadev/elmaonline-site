import { Besttime, Kuski } from 'data/models'; // import the data model

export const schema = [
  `
  # A besttime stored in the database
  type DatabaseBesttime {
    BestTimeIndex: Int
    KuskiIndex: Int
    LevelIndex: Int
    TimeIndex: Int
    Time: Int
    KuskiData: DatabaseKuski
  }
`,
];

export const queries = [
  `
  # Retrieves best times from a level
  getBesttime(
    # The level's id
    LevelIndex: Int!
  ): [DatabaseBesttime]
`,
];

export const resolvers = {
  RootQuery: {
    async getBesttime(parent, { LevelIndex }) {
      const besttime = await Besttime.findAll({
        where: { LevelIndex },
        include: [
          {
            model: Kuski,
            as: 'KuskiData',
          },
        ],
      });
      return besttime;
    },
  },
};
