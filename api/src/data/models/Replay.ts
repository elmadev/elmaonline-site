import DataTypes from 'sequelize';
import type {
  BelongsToManyGetAssociationsMixin,
  BelongsToManySetAssociationsMixin,
} from 'sequelize';
import type { ReplayRow } from '#contract/replay.ts';
import type { ModelInstance } from '../columns.ts';
import sequelize from '../sequelize.js';
import type { KuskiInstance } from './Kuski.ts';
import type { LevelInstance } from './Level.ts';
import type { ReplayRatingInstance } from './ReplayRating.ts';
import type { TagInstance } from './Tag.ts';

export type ReplayInstance = ModelInstance<
  ReplayRow,
  {
    getTags: BelongsToManyGetAssociationsMixin<TagInstance>;
    setTags: BelongsToManySetAssociationsMixin<TagInstance, number>;
    // sequelize sets an unmatched belongsTo include to null
    LevelData?: LevelInstance | null;
    UploadedByData?: KuskiInstance | null;
    DrivenByData?: KuskiInstance | null;
    Tags?: TagInstance[];
    Rating?: ReplayRatingInstance[];
  }
>;

const Replay = sequelize.define<ReplayInstance>(
  'replay',
  {
    ReplayIndex: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    DrivenBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    DrivenByText: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null,
    },
    UploadedBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    LevelIndex: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    TimeIndex: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
    ReplayTime: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
    Finished: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
    Uploaded: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    Unlisted: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    Hide: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    TAS: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    Bug: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    Nitro: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    Comment: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null,
    },
    UUID: {
      type: DataTypes.STRING(10),
      allowNull: true,
      defaultValue: null,
    },
    RecFileName: {
      type: DataTypes.STRING(19),
      allowNull: true,
      defaultValue: null,
    },
    MD5: {
      type: DataTypes.STRING(32),
      allowNull: true,
      defaultValue: null,
    },
    Views: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    indexes: [
      { fields: ['LevelIndex', 'TimeIndex'] },
      { unique: true, fields: ['MD5'] },
    ],
  },
);

export default Replay;
