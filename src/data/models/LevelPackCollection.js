import DataType from 'sequelize';
import Model from '../sequelize.js';

const LevelPackCollection = Model.define('levelpack_collection', {
  LevelPackCollectionIndex: {
    type: DataType.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  CollectionName: {
    type: DataType.STRING(16),
    allowNull: false,
    defaultValue: '',
  },
  CollectionLongName: {
    type: DataType.STRING(50),
    allowNull: false,
    defaultValue: '',
  },
  KuskiIndex: {
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
});

export default LevelPackCollection;
