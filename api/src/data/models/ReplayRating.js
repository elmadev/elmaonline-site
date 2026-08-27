import DataType from 'sequelize';
import Model from '../sequelize.js';

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
  BattleIndex: {
    type: DataType.INTEGER,
    defaultValue: 0,
    allowNull: false,
  },
  CupTimeIndex: {
    type: DataType.INTEGER,
    defaultValue: 0,
    allowNull: false,
  },
  UUID: {
    type: DataType.STRING(54),
    defaultValue: null,
    allowNull: true,
  },
});

export default ReplayRating;
