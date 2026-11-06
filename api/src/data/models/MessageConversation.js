import DataType from 'sequelize';
import Model from '../sequelize.js';

const MessageConversation = Model.define('message_conversation', {
  ConversationIndex: {
    type: DataType.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  Name: {
    type: DataType.STRING(50),
    allowNull: true,
  },
  IsGroup: {
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  CreatedBy: {
    type: DataType.INTEGER,
    allowNull: false,
  },
  CreatedAt: {
    type: DataType.INTEGER,
    allowNull: false,
  },
  LastMessageAt: {
    type: DataType.INTEGER,
    allowNull: false,
  },
});

export default MessageConversation;
