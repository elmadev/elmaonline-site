import DataTypes from 'sequelize';
import type { ReplayLogRow } from '#contract/replaylog.ts';
import type { ModelInstance } from '../columns.ts';
import sequelize from '../sequelize.js';

export type ReplayLogInstance = ModelInstance<ReplayLogRow>;

const ReplayLog = sequelize.define<ReplayLogInstance>(
  'replay_log',
  {
    ReplayLogIndex: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    KuskiIndex: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    ReplayIndex: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    BattleIndex: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    CupTimeIndex: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    TimeIndex: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    UUID: {
      type: DataTypes.STRING(54),
      defaultValue: null,
      allowNull: true,
    },
    Fingerprint: {
      type: DataTypes.STRING(32),
      defaultValue: null,
      allowNull: true,
    },
    Day: {
      type: DataTypes.STRING(8),
      defaultValue: null,
      allowNull: true,
    },
    Timestamp: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    indexes: [{ fields: ['ReplayLogIndex'] }],
  },
);

export default ReplayLog;
