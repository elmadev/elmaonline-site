import DataType from 'sequelize';
import Model from '../sequelize.js';

const ReplayComment = Model.define('replay_comment', {
  ReplayCommentIndex: {
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
  Entered: {
    type: DataType.INTEGER,
    defaultValue: 0,
    allowNull: false,
  },
  Text: {
    type: DataType.STRING(65535),
    defaultValue: '',
    allowNull: true,
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

export default ReplayComment;
