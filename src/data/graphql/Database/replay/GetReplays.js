import { Replay } from 'data/models';

export const schema = [
  `
  # A replay stored in the database
  type DatabaseReplay {
    ReplayIndex: Int
    DrivenBy: Int
    UploadedBy: Int
    LevelIndex: Int
    TimeIndex: Int
    ReplayTime: Int
    Finished: Int
    Uploaded: Int
    Unlisted: Int
    UUID: String
    RecFileName: String
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
  'DrivenBy',
  'UploadedBy',
  'LevelIndex',
  'TimeIndex',
  'ReplayTime',
  'Finished',
  'Uploaded',
  'Unlisted',
  'UUID',
  'RecFileName',
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
