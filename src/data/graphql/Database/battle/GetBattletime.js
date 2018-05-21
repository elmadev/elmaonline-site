import { Battletime } from 'data/models'; // import the data model

export const schema = [
  `
  # A battle stored in the database
  type DatabaseBattletime {
    BattleTimeIndex: Int
    BattleIndex: Int
    KuskiIndex: Int
    KuskiIndex2: Int
    TimeIndex: Int
    Time: Int
    Apples: Int
  }
`,
];

export const queries = [
  `
  # Retrieves results from a battle
  getBattletime(
    # The battle's id
    BattleIndex: Int!
  ): DatabaseBattletime
`,
];

export const resolvers = {
  RootQuery: {
    async getBattletime(parent, { BattleIndex }) {
      const battletime = await Battletime.findAll({
        where: { BattleIndex },
      });
      return battletime;
    },
  },
};
