import DataType from 'sequelize';
import Model from '../sequelize.js';

const Tag = Model.define('tag', {
  TagIndex: {
    type: DataType.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  Name: {
    type: DataType.STRING(255),
    allowNull: false,
  },
  Hidden: {
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  Type: {
    type: DataType.ENUM,
    values: ['replay', 'level', 'levelpack'],
    allowNull: false,
  },
});

export default Tag;
