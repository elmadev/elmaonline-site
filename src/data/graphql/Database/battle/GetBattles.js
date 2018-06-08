import { Battle } from 'data/models'; // import the data model

// table schema documentation used by graphql,
// basically simplified version of what's in the data model,
// see data types here: http://graphql.org/learn/schema/#scalar-types
export const schema = [
  `
  # A battle stored in the database
  type DatabaseBattle {
    BattleIndex: Int
    KuskiIndex: Int
    LevelIndex: Int
    BattleType: String
    Started: String
    Duration: Int
    Aborted: Int
    Finished: Int
    InQueue: Int
    Countdown: Int
    RecFileName: String
  }
`,
];

// documentation of the queries made below, used by graphql
export const queries = [
  `
  # Retrieves all battles stored in the database
  getBattles: [DatabaseBattle]

  # Retrieves a single battle from the database
  getBattle(
    # The battle's id
    BattleIndex: Int!
  ): DatabaseBattle
`,
];

const attributes = [
  'BattleIndex',
  'KuskiIndex',
  'LevelIndex',
  'BattleType',
  'Started',
  'Duration',
  'Aborted',
  'Finished',
  'InQueue',
  'Countdown',
  'RecFileName',
];

// database queries are called resolvers
// here you build the actual queries using the sequelize functions
// see more on querying here: http://docs.sequelizejs.com/manual/tutorial/querying.html
export const resolvers = {
  RootQuery: {
    async getBattles() {
      const battles = await Battle.findAll({
        attributes,
        limit: 25,
        order: [['BattleIndex', 'DESC']],
      });
      return battles;
    },
    async getBattle(parent, { BattleIndex }) {
      const battle = await Battle.findOne({
        attributes,
        where: { BattleIndex },
      });
      return battle;
    },
  },
};
