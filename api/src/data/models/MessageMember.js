import DataType from 'sequelize';
import Model from '../sequelize.js';

const MessageMember = Model.define(
  'message_member',
  {
    MemberIndex: {
      type: DataType.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    ConversationIndex: {
      type: DataType.INTEGER,
      allowNull: false,
    },
    KuskiIndex: {
      type: DataType.INTEGER,
      allowNull: false,
    },
    JoinedAt: {
      type: DataType.INTEGER,
      allowNull: false,
    },
    LastReadMessageIndex: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    LeftAt: {
      type: DataType.INTEGER,
      allowNull: true,
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ['ConversationIndex', 'KuskiIndex'],
      },
      { fields: ['KuskiIndex'] },
    ],
  },
);

export default MessageMember;
