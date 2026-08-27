import DataType from 'sequelize';
import moment from 'moment';
import Model from '../sequelize.js';

const Logs = Model.define(
  'logs',
  {
    LogIndex: {
      type: DataType.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    KuskiIndex: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    LogFrom: {
      type: DataType.STRING(10),
      allowNull: false,
      defaultValue: '0000-00-00 00:00:00',
      get() {
        const ts = this.getDataValue('LogFrom')
          ? moment(this.getDataValue('LogFrom')).format('X')
          : 0;
        return ts;
      },
    },
    LogTo: {
      type: DataType.STRING(10),
      allowNull: false,
      defaultValue: '0000-00-00 00:00:00',
      get() {
        const ts = this.getDataValue('LogTo')
          ? moment(this.getDataValue('LogTo')).format('X')
          : 0;
        return ts;
      },
    },
    Player: {
      type: DataType.INTEGER(1),
      allowNull: false,
      defaultValue: 0,
    },
    IP: {
      type: DataType.STRING(16),
      allowNull: false,
      defaultValue: '',
    },
  },
  {
    indexes: [{ fields: ['KuskiIndex'] }],
  },
);

export default Logs;
