import DataType from 'sequelize';
import Model from '../sequelize.js';

const Recap = Model.define(
  'recap',
  {
    RecapIndex: {
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
    OtherIndex: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    Year: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    Type: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    Value: {
      type: DataType.DECIMAL(14, 4),
      allowNull: false,
      defaultValue: 0.0,
    },
    Created: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    indexes: [{ fields: ['KuskiIndex', 'TypeKuskiIndex'] }],
  },
);

export default Recap;
