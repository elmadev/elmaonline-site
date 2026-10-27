import DataType from 'sequelize';
import Model from '../sequelize.js';

const ReplayLog = Model.define(
  'replay_log',
  {
    ReplayLogIndex: {
      type: DataType.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    KuskiIndex: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    ReplayIndex: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    BattleIndex: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    CupTimeIndex: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    TimeIndex: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    UUID: {
      type: DataType.STRING(54),
      defaultValue: null,
      allowNull: true,
    },
    Fingerprint: {
      type: DataType.STRING(32),
      defaultValue: null,
      allowNull: true,
    },
    Day: {
      type: DataType.STRING(8),
      defaultValue: null,
      allowNull: true,
    },
    Timestamp: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    indexes: [{ fields: ['ReplayLogIndex'] }],
  },
);

export default ReplayLog;
