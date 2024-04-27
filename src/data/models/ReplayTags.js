import DataType from 'sequelize';
import Model from '../sequelize.js';

const ReplayTags = Model.define('replay_tags', {
  TagIndex: {
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: false,
  },
  ReplayIndex: {
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: false,
  },
});

export default ReplayTags;
