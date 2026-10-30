import DataTypes from 'sequelize';
import type { SiteCupTimeRow } from '#contract/sitecuptime.ts';
import type { ModelInstance } from '../columns.ts';
import sequelize from '../sequelize.js';
import type { TimeInstance } from './Time.ts';
import type { LevelInstance } from './Level.ts';
import type { KuskiInstance } from './Kuski.ts';

export type SiteCupTimeInstance = ModelInstance<
  SiteCupTimeRow,
  {
    TimeData?: TimeInstance & { LevelData?: LevelInstance };
    KuskiData?: KuskiInstance;
  }
>;

const SiteCupTime = sequelize.define<SiteCupTimeInstance>(
  'sitecuptime',
  {
    CupTimeIndex: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    CupIndex: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: false,
    },
    KuskiIndex: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: false,
    },
    TimeIndex: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    Time: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: false,
    },
    TimeExists: {
      type: DataTypes.INTEGER({ length: 1 }),
      allowNull: false,
      defaultValue: 0,
    },
    RecData: {
      type: DataTypes.BLOB,
      allowNull: true,
      defaultValue: false,
    },
    Replay: {
      type: DataTypes.INTEGER({ length: 1 }),
      allowNull: false,
      defaultValue: 0,
    },
    Code: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: false,
    },
    ShareReplay: {
      type: DataTypes.INTEGER({ length: 1 }),
      allowNull: false,
      defaultValue: 0,
    },
    Comment: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: false,
    },
    TeamIndex: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    UUID: {
      type: DataTypes.STRING(10),
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
    indexes: [{ fields: ['CupIndex, KuskiIndex, TimeIndex'] }],
  },
);

export default SiteCupTime;
