import { DataTypes } from 'sequelize';
import type { Model, Optional } from 'sequelize';
import { unixSeconds } from '../columns.ts';
import sequelize from '../sequelize.js';

// the columns as stored. Not in the contract yet, since no level endpoint is
// converted. Neither is the level file, which no client gets in a list
interface LevelAttributes {
  LevelIndex: number;
  LevelName: string;
  CRC: number;
  LongName: string | null;
  Apples: number | null;
  Killers: number | null;
  Flowers: number;
  LevelData: Buffer | null;
  Locked: number;
  HardLocked: number;
  Hidden: number;
  Legacy: number;
  ForceHide: number;
  AcceptBugs: number;
  /** 'YYYY-MM-DD HH:mm:ss' */
  Added: string;
}

type LevelCreation = Optional<
  LevelAttributes,
  | 'LevelIndex'
  | 'LevelName'
  | 'CRC'
  | 'LongName'
  | 'Apples'
  | 'Killers'
  | 'LevelData'
  | 'Locked'
  | 'HardLocked'
  | 'Hidden'
  | 'Legacy'
  | 'ForceHide'
  | 'AcceptBugs'
  | 'Added'
>;

// reading Added from an instance goes through its getter: unix seconds.
// dataValues, where clauses and raw queries see the stored string
export interface LevelInstance
  extends Model<LevelAttributes, LevelCreation>,
    Omit<LevelAttributes, 'Added'> {
  Added: number;
}

const Level = sequelize.define<LevelInstance>(
  'level',
  {
    LevelIndex: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    LevelName: {
      type: DataTypes.STRING(8),
      allowNull: false,
      defaultValue: '',
    },
    CRC: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    LongName: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: null,
    },
    Apples: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
    Killers: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
    Flowers: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: null,
    },
    LevelData: {
      type: DataTypes.BLOB,
      allowNull: true,
      defaultValue: '',
    },
    Locked: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    HardLocked: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    Hidden: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    Legacy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    ForceHide: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    AcceptBugs: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    Added: {
      type: DataTypes.STRING(19),
      defaultValue: '0000-00-00 00:00:00',
      allowNull: false,
      ...unixSeconds('Added'),
    },
  },
  {
    indexes: [{ fields: ['LevelIndex', 'LevelName'] }],
  },
);

export default Level;
