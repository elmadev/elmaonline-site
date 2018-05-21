import { Level } from 'data/models';

export const schema = [
  `
  # A replay stored in the database
  type DatabaseLevel {
    LevelIndex: Int
    LevelName: String
    CRC: Int
    LongName: String
    Apples: Int
    Killers: Int
    Flowers: Int
    LevelData: String
    Locked: Int
    SiteLock: Int
    Hidden: Int
  }
`,
];

export const queries = [
  `
  # Retrieves all levels stored in the database
  getLevels: [DatabaseLevel]

  # Retrieves a single level from the database
  getLevel(
    # The level's id
    LevelIndex: Int!
  ): DatabaseLevel
`,
];

export const resolvers = {
  RootQuery: {
    async getLevels() {
      const levels = await Level.findAll({
        limit: 100,
        order: [['LevelIndex', 'DESC']],
      });
      return levels;
    },
    async getLevel(parent, { LevelIndex }) {
      const level = await Level.findOne({
        where: { LevelIndex },
      });
      return level;
    },
  },
};
