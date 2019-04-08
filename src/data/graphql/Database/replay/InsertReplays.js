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
    #
    TAS: Int!
    #
    Bug: Int!
    #
    Nitro: Int!
    #
    Comment: String!
    #
    MD5: String!
  ): DatabaseReplay

  # Updates a replay in database
  updateReplay(
    #
    ReplayIndex: Int!
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
        TAS: args.TAS,
        Bug: args.Bug,
        Nitro: args.Nitro,
        Comment: args.Comment,
        MD5: args.MD5,
      });
      return replay;
    },
    async updateReplay(parent, { ReplayIndex }) {
      const replay = await Replay.findOne({
        where: { ReplayIndex },
      });
      if (replay) {
        await replay.update({
          Unlisted: 0,
        });
        return replay;
      }
      return replay;
    },
  },
};
