import DataType from 'sequelize';
import Model from '../sequelize.js';

const Notification = Model.define('notification', {
  NotificationIndex: {
    type: DataType.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  KuskiIndex: {
    type: DataType.INTEGER,
    allowNull: true,
  },
  CreatedAt: {
    type: DataType.INTEGER,
    allowNull: false,
  },
  SeenAt: {
    type: DataType.INTEGER,
    allowNull: true,
  },
  Type: {
    type: DataType.ENUM,
    values: ['comment', 'beaten', 'besttime'],
    allowNull: false,
  },
  Meta: {
    type: DataType.TEXT,
    allowNull: true,
  },
});

export default Notification;
