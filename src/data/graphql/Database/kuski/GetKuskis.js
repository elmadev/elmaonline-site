import { Kuski, Team } from 'data/models'; // import the data model

export const schema = [
  `
  # A user stored in the database
  type DatabaseKuski {
    KuskiIndex: Int
    Kuski: String
    TeamIndex: Int
    Country: String
    Password: String
    Rights: Int
    BmpCRC: Int
    BmpData: String
    RPlay: Int
    RStartBattle: Int
    RSpecialBattle: Int
    RStartCup: Int
    RStart24htt: Int
    RStop: Int
    RMultiPlay: Int
    RChat: Int
    RBan: Int
    RMod: Int
    RAdmin: Int
    Confirmed: Int
    TeamData: DatabaseTeam
  }

  type DatabaseTeam {
    TeamIndex: Int
    Team: String
    Locked: Int
  }
`,
];

export const queries = [
  `
  # Retrieves all kuskis stored in the database
  getKuskis: [DatabaseKuski]

  # Retrieves a single kuski from the database by id
  getKuskiById(
    # The kuski's id
    KuskiIndex: Int!
  ): DatabaseKuski

  # Retrieves a single kuski from the database by name
  getKuskiByName(
    # The kuski's name
    Name: String!
  ): DatabaseKuski
`,
];

const attributes = [
  'KuskiIndex',
  'Kuski',
  'TeamIndex',
  'Country',
  'RPlay',
  'RStartBattle',
  'RSpecialBattle',
  'RStartCup',
  'RStart24htt',
  'RStop',
  'RMultiPlay',
  'RChat',
  'RBan',
  'RMod',
  'RAdmin',
  'Confirmed',
];

export const resolvers = {
  RootQuery: {
    async getKuskis() {
      const kuskis = await Kuski.findAll({
        attributes: ['Kuski', 'Country', 'KuskiIndex', 'TeamIndex'],
        include: [{ model: Team, as: 'TeamData' }],
        order: [['Kuski', 'ASC']],
      });
      return kuskis;
    },
    async getKuskiById(parent, { KuskiIndex }) {
      const kuski = await Kuski.findOne({
        attributes,
        where: { KuskiIndex },
      });
      return kuski;
    },
    async getKuskiByName(parent, { Name }) {
      const kuski = await Kuski.findOne({
        attributes,
        where: { Kuski: Name },
        include: [{ model: Team, as: 'TeamData' }],
      });
      return kuski;
    },
  },
};
