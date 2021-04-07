import DataType from 'sequelize';
import Model from '../sequelize';

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
});

export default Tag;
