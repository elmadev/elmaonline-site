import DataType from 'sequelize';
import Model from '../sequelize';

const BestMultitime = Model.define(
  'bestmultitime',
  {
    BestMultiTimeIndex: {
      type: DataType.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    KuskiIndex1: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    KuskiIndex2: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    LevelIndex: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    MultiTimeIndex: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    Time: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    indexes: [
      {
        fields: ['BestMultiTimeIndex, LevelIndex, MultiTimeIndex'],
      },
    ],
  },
);

export default BestMultitime;
