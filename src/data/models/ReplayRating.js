import DataType from 'sequelize';
import Model from '../sequelize';

const ReplayRating = Model.define('replay_rating', {
  ReplayRatingIndex: {
    type: DataType.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  KuskiIndex: {
    type: DataType.INTEGER,
    defaultValue: 0,
    allowNull: false,
  },
  ReplayIndex: {
    type: DataType.INTEGER,
    defaultValue: 0,
    allowNull: false,
  },
  Vote: {
    type: DataType.INTEGER,
    defaultValue: 0,
    allowNull: false,
  },
});

export default ReplayRating;
