import DataType from 'sequelize';
import Model from '../sequelize.js';

const LevelTags = Model.define('lgr_tags', {
  TagIndex: {
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: false,
  },
  LGRIndex: {
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: false,
  },
});

export default LevelTags;
