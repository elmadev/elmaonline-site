import DataType from 'sequelize';
import Model from '../sequelize';

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
});

export default ReplayComment;
