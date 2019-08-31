import DataType from 'sequelize';
import Model from '../sequelize';

const Multitime = Model.define(
  'multitime',
  {
    MultiTimeIndex: {
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
    Time: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    Finished: {
      type: DataType.STRING(1),
      allowNull: false,
      defaultValue: null,
    },
  },
  {
    indexes: [
      {
        fields: ['MultiTimeIndex, LevelIndex'],
      },
    ],
  },
);

export default Multitime;
