import DataType from 'sequelize';
import moment from 'moment';
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
    Legacy: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    ForceHide: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    Added: {
      type: DataType.STRING(19),
      defaultValue: '0000-00-00 00:00:00',
      allowNull: false,
      get() {
        return moment(this.getDataValue('Added')).format('X');
      },
    },
  },
  {
    indexes: [{ fields: ['LevelIndex', 'LevelName'] }],
  },
);

export default Level;
