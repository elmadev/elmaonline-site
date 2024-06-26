import DataType from 'sequelize';
import moment from 'moment';
import Model from '../sequelize.js';

const Chat = Model.define('chat', {
  ChatIndex: {
    type: DataType.INTEGER,
    allowNull: false,
    primaryKey: true,
  },

  KuskiIndex: {
    type: DataType.INTEGER,
    defaultValue: 0,
    allowNull: false,
  },

  Entered: {
    type: DataType.STRING(19),
    defaultValue: '0000-00-00 00:00:00',
    allowNull: false,
    get() {
      return moment(this.getDataValue('Entered')).format('X');
    },
  },

  Text: {
    type: DataType.STRING(100),
    defaultValue: '',
    allowNull: false,
  },
});

export default Chat;
