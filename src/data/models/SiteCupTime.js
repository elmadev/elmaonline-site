import DataType from 'sequelize';
import Model from '../sequelize';

const SiteCupTime = Model.define(
  'sitecuptime',
  {
    CupTimeIndex: {
      type: DataType.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    CupIndex: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: false,
    },
    KuskiIndex: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: false,
    },
    TimeIndex: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    Time: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: false,
    },
    TimeExists: {
      type: DataType.INTEGER(1),
      allowNull: false,
      defaultValue: 0,
    },
    RecData: {
      type: DataType.BLOB,
      allowNull: true,
      defaultValue: false,
    },
    Replay: {
      type: DataType.INTEGER(1),
      allowNull: false,
      defaultValue: 0,
    },
    Code: {
      type: DataType.STRING,
      allowNull: false,
      defaultValue: false,
    },
    ShareReplay: {
      type: DataType.INTEGER(1),
      allowNull: false,
      defaultValue: 0,
    },
    Comment: {
      type: DataType.STRING,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    indexes: [{ fields: ['CupIndex, KuskiIndex, TimeIndex'] }],
  },
);

export default SiteCupTime;
