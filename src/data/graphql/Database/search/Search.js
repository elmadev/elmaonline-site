import sequelize from 'sequelize';
import { Level, Replay, Kuski } from 'data/models';
import { like } from 'utils/database';

export const queries = [
  `
    searchLevel(
      Search: String!
      Offset: Int
    ): [DatabaseLevel]

    searchReplay(
      Search: String!
      Offset: Int
    ): [DatabaseReplay]
  `,
];

const attributes = [
  'LevelIndex',
  'LevelName',
  'CRC',
  'LongName',
  'Apples',
  'Killers',
  'Flowers',
  'Locked',
  'SiteLock',
  'Hidden',
];

export const resolvers = {
  RootQuery: {
    async searchLevel(parent, { Search, Offset }) {
      const levels = await Level.findAll({
        attributes,
        offset: Offset,
        where: {
          LevelName: {
            [sequelize.Op.like]: `${like(Search)}%`,
          },
          Locked: 0,
        },
        limit: 25,
        order: [['LevelName', 'ASC']],
      });
      return levels;
    },
    async searchReplay(parent, { Search, Offset }) {
      const replays = await Replay.findAll({
        offset: Offset,
        where: {
          RecFileName: {
            [sequelize.Op.like]: `${like(Search)}%`,
          },
          Unlisted: 0,
        },
        limit: 25,
        order: [['RecFileName', 'ASC']],
        include: [
          {
            model: Level,
            attributes: ['LevelName'],
            as: 'LevelData',
          },
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
      return replays;
    },
  },
};
