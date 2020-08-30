import DataType from 'sequelize';
import Model from '../sequelize';

const Ignored = Model.define('ignored', {
  IgnoreIndex: {
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
  IgnoredKuskiIndex: {
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
});

export default Ignored;
