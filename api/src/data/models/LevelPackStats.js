import DataType from 'sequelize';
import Model from '../sequelize.js';

const LevelPackStats = Model.define('levelpack_stats', {
  LevelPackStatsIndex: {
    type: DataType.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  LevelPackIndex: {
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  KuskiIndex: {
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  TotalTime: {
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  LevelsFinished: {
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  Records: {
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  Points: {
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  LastUpdated: {
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
});

export default LevelPackStats;
