import DataType from 'sequelize';
import Model from '../sequelize.js';

const LevelPackTags = Model.define('levelpack_tags', {
  TagIndex: {
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: false,
  },
  LevelPackIndex: {
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: false,
  },
});

export default LevelPackTags;
