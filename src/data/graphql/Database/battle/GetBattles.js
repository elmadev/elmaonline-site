import { Battle, Kuski, Battletime, Level, Team } from 'data/models'; // import the data model

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
    StartedUtc: Int
    Duration: Int
    Aborted: Int
    Finished: Int
    InQueue: Int
    Countdown: Int
    RecFileName: String
    KuskiData: DatabaseKuski
    Results: [DatabaseBattletime]
    LevelData: DatabaseLevel
  }
`,
];

// documentation of the queries made below, used by graphql
export const queries = [
  `
  # Retrieves all battles stored in the database
  getBattles: [DatabaseBattle]

  # Retrieves all battles between two dates
  getBattlesBetween(start: String, end: String): [DatabaseBattle]

  # Retrieves a single battle from the database
  getBattle(
    # The battle's id
    BattleIndex: Int!
  ): DatabaseBattle

  getBattlesByKuski(KuskiIndex: Int!): [DatabaseBattle]
`,
];

const attributes = [
  'BattleIndex',
  'KuskiIndex',
  'LevelIndex',
  'BattleType',
  'Started',
  'StartedUtc',
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
        order: [['BattleIndex', 'DESC']],
      });
      return battles;
    },
    async getBattlesByKuski(parent, { KuskiIndex }) {
      const battles = await Battle.findAll({
        attributes: [
          'BattleIndex',
          'KuskiIndex',
          'LevelIndex',
          'Started',
          'Duration',
        ],
        limit: 20,
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
            model: Level,
            attributes: ['LevelName'],
            as: 'LevelData',
          },
          {
            model: Battletime,
            as: 'Results',
            where: {
              KuskiIndex,
            },
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
          },
        ],
        order: [['Started', 'DESC']],
      }).then(qb =>
        qb.map(b => {
          // eslint-disable-next-line no-param-reassign
          b.Results = Battletime.findAll({
            where: {
              BattleIndex: b.BattleIndex,
            },
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
          return b;
        }),
      );
      return battles;
    },
    async getBattlesBetween(parent, { start, end }) {
      const battles = await Battle.findAll({
        attributes: [
          'BattleIndex',
          'KuskiIndex',
          'LevelIndex',
          'Started',
          'Duration',
        ],
        limit: 100,
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
            model: Level,
            attributes: ['LevelName'],
            as: 'LevelData',
          },
          {
            model: Battletime,
            as: 'Results',
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
          },
        ],
        order: [['Started', 'DESC']],
        where: {
          Started: {
            between: [start, end],
          },
        },
      });
      return battles;
    },
    async getBattle(parent, { BattleIndex }) {
      const battle = await Battle.findOne({
        attributes: [
          'BattleIndex',
          'KuskiIndex',
          'LevelIndex',
          'Started',
          'BattleType',
          'Duration',
        ],
        where: { BattleIndex, Finished: 1 },
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
            model: Level,
            attributes: ['LevelName'],
            as: 'LevelData',
          },
          {
            model: Battletime,
            as: 'Results',
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
          },
        ],
      });
      return battle;
    },
  },
};
