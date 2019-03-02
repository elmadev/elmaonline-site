import { Replay, Kuski } from 'data/models';

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
    TAS: Int
    Comment: String
    UUID: String
    RecFileName: String
    DrivenByData: DatabaseKuski
    UploadedByData: DatabaseKuski
  }
`,
];

export const queries = [
  `
  # Retrieves all replays stored in the database
  getReplays: [DatabaseReplay]

  # Retrieves all replays in a specific level
  getReplaysByLevelIndex(
    # The level index
    LevelIndex: Int!
  ): [DatabaseReplay]

  # Retrieves a single replay from the database
  getReplay(
    # The replay's id
    ReplayIndex: Int!
  ): DatabaseReplay

  # Retrieves a single replay from the database by UUID
  getReplayByUuid(
    # The replay's uuid
    UUID: String!
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
  'Comment',
  'TAS',
];

export const resolvers = {
  RootQuery: {
    async getReplays() {
      const replays = await Replay.findAll({
        attributes,
        limit: 100,
        order: [['ReplayIndex', 'DESC']],
        where: { Unlisted: 0 },
      });
      return replays;
    },
    async getReplaysByLevelIndex(parent, { LevelIndex }) {
      const replays = await Replay.findAll({
        attributes,
        where: { LevelIndex, Unlisted: 0 },
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
    async getReplayByUuid(parent, { UUID }) {
      const replay = await Replay.findOne({
        attributes,
        where: { UUID },
        include: [
          {
            model: Kuski,
            as: 'UploadedByData',
          },
          {
            model: Kuski,
            as: 'DrivenByData',
          },
        ],
      });
      return replay;
    },
  },
};
