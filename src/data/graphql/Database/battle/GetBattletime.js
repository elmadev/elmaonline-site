import { Battletime, Kuski, Team } from 'data/models'; // import the data model

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
    KuskiData: DatabaseKuski
  }
`,
];

export const queries = [
  `
  # Retrieves results from a battle
  getBattletime(
    # The battle's id
    BattleIndex: Int!
  ): [DatabaseBattletime]
`,
];

export const resolvers = {
  RootQuery: {
    async getBattletime(parent, { BattleIndex }) {
      const battletime = await Battletime.findAll({
        where: { BattleIndex },
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
      return battletime;
    },
  },
};
