import { DataTypes } from 'sequelize';
import type {
  BelongsToManyGetAssociationsMixin,
  BelongsToManySetAssociationsMixin,
  Model,
  Optional,
} from 'sequelize';
import type { ReplayData, ReplayRow } from '#contract/replay.ts';
import type { TagInstance } from './Tag.ts';
import sequelize from '../sequelize.js';

// the contract only has the public columns, the checksum of the rec file is
// not one of them
interface ReplayAttributes extends ReplayRow {
  MD5: string | null;
}

type ReplayCreation = Optional<
  ReplayAttributes,
  | 'ReplayIndex'
  | 'DrivenBy'
  | 'DrivenByText'
  | 'UploadedBy'
  | 'LevelIndex'
  | 'TimeIndex'
  | 'ReplayTime'
  | 'Finished'
  | 'Uploaded'
  | 'Unlisted'
  | 'Hide'
  | 'TAS'
  | 'Bug'
  | 'Nitro'
  | 'Comment'
  | 'UUID'
  | 'RecFileName'
  | 'MD5'
  | 'Views'
>;

// ReplayData has the associations an endpoint may include, as optional
export interface ReplayInstance
  extends Model<ReplayAttributes, ReplayCreation>,
    ReplayData {
  getTags: BelongsToManyGetAssociationsMixin<TagInstance>;
  setTags: BelongsToManySetAssociationsMixin<TagInstance, number>;
}

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
