import DataTypes from 'sequelize';
import type { LevelRow } from '#contract/level.ts';
import { unixSeconds } from '../columns.ts';
import type { ModelInstance } from '../columns.ts';
import sequelize from '../sequelize.js';

export type LevelInstance = ModelInstance<LevelRow>;

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
