import DataType from 'sequelize';
import Model from '../sequelize.js';

const LGRComment = Model.define('lgr_comment', {
  LGRCommentIndex: {
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
  LGRIndex: {
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
    type: DataType.TEXT,
    defaultValue: '',
    allowNull: true,
  },
});

export default LGRComment;
