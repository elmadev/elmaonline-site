import DataType from 'sequelize';
import Model from '../sequelize';

const TimeFile = Model.define(
  'timefile',
  {
    TimeFileIndex: {
      type: DataType.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    TimeIndex: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    BattleIndex: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    UUID: {
      type: DataType.STRING(10),
      allowNull: true,
      defaultValue: null,
    },
    MD5: {
      type: DataType.STRING(32),
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    indexes: [
      {
        fields: ['TimeIndex', 'BattleIndex'],
      },
    ],
  },
);

export default TimeFile;
