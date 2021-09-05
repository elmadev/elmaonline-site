import DataType from 'sequelize';
import Model from '../sequelize';

const MultiTimeFile = Model.define(
  'multitimefile',
  {
    MultiTimeFileIndex: {
      type: DataType.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    MultiTimeIndex: {
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
    Shared: {
      type: DataType.INTEGER(1),
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    indexes: [
      {
        fields: ['MultiTimeIndex', 'BattleIndex'],
      },
    ],
  },
);

export default MultiTimeFile;
