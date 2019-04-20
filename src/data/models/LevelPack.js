import DataType from 'sequelize';
import Model from '../sequelize';

const LevelPack = Model.define('levelpack', {
  LevelPackIndex: {
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
  LevelPackName: {
    type: DataType.STRING(16),
    defaultValue: '',
    allowNull: false,
  },
  LevelPackLongName: {
    type: DataType.STRING(30),
    defaultValue: '',
    allowNull: false,
  },
  LevelPackDesc: {
    type: DataType.STRING(255),
    defaultValue: '',
    allowNull: false,
  },
  NoneCrippled: {
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  NoVolt: {
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  NoSupervolt: {
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  NoTurn: {
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  OneTurn: {
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  NoBrake: {
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  NoThrottle: {
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  AlwaysThrottle: {
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  OneWheel: {
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  BestTimes: {
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  Overall: {
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  Speed: {
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  NOF: {
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  PlayingTime: {
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  Multi: {
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  FF: {
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  Weekly: {
    type: DataType.STRING(255),
    allowNull: false,
    defaultValue: 0,
  },
});

export default LevelPack;
