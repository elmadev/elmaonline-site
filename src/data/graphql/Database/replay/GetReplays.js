import { Replay } from 'data/models';

export const schema = [
  `
  # A replay stored in the database
  type DatabaseReplay {
    ReplayIndex: Int
    KuskiIndex: Int
    LevelIndex: Int
    TimeIndex: Int
    ReplayTime: Int
    Uploaded: String
    RecData: String
    ShareDesigner: Int
    ShareTeam: Int
    ShareAll: Int
  }
`,
];

export const queries = [
  `
  # Retrieves all replays stored in the database
  getReplays: [DatabaseReplay]

  # Retrieves a single replay from the database
  getReplay(
    # The replay's id
    ReplayIndex: Int!
  ): DatabaseReplay
`,
];

const attributes = [
  'ReplayIndex',
  'KuskiIndex',
  'LevelIndex',
  'TimeIndex',
  'ReplayTime',
  'Uploaded',
  'ShareDesigner',
  'ShareTeam',
  'ShareAll',
];

export const resolvers = {
  RootQuery: {
    async getReplays() {
      const replays = await Replay.findAll({
        attributes,
        limit: 100,
        order: [['ReplayIndex', 'DESC']],
      });
      return replays;
    },
    async getReplay(parent, { ReplayIndex }) {
      const replay = await Replay.findOne({
        attributes,
        where: { ReplayIndex },
      });
      return replay;
    },
  },
};
