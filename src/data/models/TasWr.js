import DataType from 'sequelize';
import Model from '../sequelize';
import moment from 'moment';

const TasWr = Model.define(
  'taswr',
  {
    TasIndex: {
      type: DataType.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    LevelIndex: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    KuskiIndex: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    Time: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    Uploaded: {
      type: DataType.STRING(19),
      defaultValue: '0000-00-00 00:00:00',
      allowNull: false,
      get() {
        return moment(this.getDataValue('Uploaded')).format('X');
      },
    },
    FPS: {
      type: DataType.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    BugFactor: {
      type: DataType.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    ChangedFps: {
      type: DataType.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    indexes: [{ fields: ['TasIndex', 'LevelIndex', 'KuskiIndex'] }],
  },
);

export default TasWr;
