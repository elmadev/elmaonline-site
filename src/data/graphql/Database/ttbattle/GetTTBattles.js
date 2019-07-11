import { TTBattle } from 'data/models';

export const schema = [
  `
  # A tt battle stored in the database
  type DatabaseTTBattle {
    TTBattleIndex: Int
    KuskiIndex: Int
    TTBattleName: String
    Levels: String
    StartTime: Int
    Duration: Int
  }
`,
];

export const queries = [
  `
  # Retrieves all tt battles stored in the database
  getTTBattles: [DatabaseTTBattle]

  # Retrieves a single tt battle from the database
  getTTBattle(
    # The tt battle's id
    TTBattleIndex: Int!
  ): DatabaseTTBattle
`,
];

export const resolvers = {
  RootQuery: {
    async getTTBattles() {
      const ttbattles = await TTBattle.findAll({
        limit: 100,
        order: [['TTBattleIndex', 'DESC']],
      });
      return ttbattles;
    },
    async getTTBattle(parent, { TTBattleIndex }) {
      const ttbattle = await TTBattle.findOne({
        where: { TTBattleIndex },
      });
      return ttbattle;
    },
  },
};
