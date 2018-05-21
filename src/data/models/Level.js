import DataType from 'sequelize';
import Model from '../sequelize';

const Level = Model.define(
  'level',
  {
    LevelIndex: {
      type: DataType.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    LevelName: {
      type: DataType.STRING(8),
      allowNull: false,
      defaultValue: '',
    },
    CRC: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    LongName: {
      type: DataType.STRING(50),
      allowNull: true,
      defaultValue: DataType.NULL,
    },
    Apples: {
      type: DataType.INTEGER,
      allowNull: true,
      defaultValue: DataType.NULL,
    },
    Killers: {
      type: DataType.INTEGER,
      allowNull: true,
      defaultValue: DataType.NULL,
    },
    Flowers: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: DataType.NULL,
    },
    LevelData: {
      type: DataType.BLOB,
      allowNull: true,
      defaultValue: '',
    },
    Locked: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    SiteLock: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    Hidden: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    indexes: [{ fields: ['LevelIndex', 'LevelName'] }],
  },
);

export default Level;
