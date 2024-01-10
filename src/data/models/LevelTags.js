import DataType from 'sequelize';
import Model from '../sequelize';

const LevelTags = Model.define('level_tags', {
  TagIndex: {
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: false,
  },
  LevelIndex: {
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: false,
  },
});

export default LevelTags;
