import DataType from 'sequelize';
import Model from '../sequelize.js';

const Message = Model.define(
  'message',
  {
    MessageIndex: {
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
    Text: {
      type: DataType.TEXT,
      allowNull: false,
    },
    CreatedAt: {
      type: DataType.INTEGER,
      allowNull: false,
    },
    Type: {
      type: DataType.ENUM,
      values: ['text', 'system'],
      allowNull: false,
      defaultValue: 'text',
    },
    ExpiresAt: {
      type: DataType.INTEGER,
      allowNull: true,
    },
  },
  {
    indexes: [
      { fields: ['ConversationIndex', 'MessageIndex'] },
      { fields: ['ExpiresAt'] },
    ],
  },
);

export default Message;
