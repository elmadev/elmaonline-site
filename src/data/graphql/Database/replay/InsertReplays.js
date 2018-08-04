import { Replay } from 'data/models';

export const schema = [
  `
`,
];

export const mutation = [
  `
  # Adds a replay to the database
  insertReplay(
    #
    UploadedBy: Int!
    #
    UUID: String!
    #
    RecFileName: String!
    #
    Uploaded: Int!
    #
    ReplayTime: Int!
    #
    Finished: Int!
    #
    LevelIndex: Int!
    #
    Unlisted: Int!
    #
    DrivenBy: Int!
  ): DatabaseReplay
`,
];

export const resolvers = {
  Mutation: {
    async insertReplay(parent, args) {
      const replay = await Replay.create({
        UploadedBy: args.UploadedBy,
        UUID: args.UUID,
        RecFileName: args.RecFileName,
        Uploaded: args.Uploaded,
        ReplayTime: args.ReplayTime,
        Finished: args.Finished,
        LevelIndex: args.LevelIndex,
        Unlisted: args.Unlisted,
        DrivenBy: args.DrivenBy,
      });
      return replay;
    },
  },
};
