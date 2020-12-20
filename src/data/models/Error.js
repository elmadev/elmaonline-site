import DataType from 'sequelize';
import moment from 'moment';
import Model from '../sequelize';

const Error = Model.define(
  'error',
  {
    ErrorIndex: {
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
    IP: {
      type: DataType.STRING(15),
      allowNull: false,
      defaultValue: false,
    },
    ErrorText: {
      type: DataType.STRING(100),
      allowNull: false,
      defaultValue: false,
    },
    PreviousMessage: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: false,
    },
    CurrentMessage: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: false,
    },
    ErrorTime: {
      type: DataType.STRING(19),
      allowNull: false,
      defaultValue: '0000-00-00 00:00:00',
      get() {
        const ts = this.getDataValue('ErrorTime')
          ? moment(this.getDataValue('ErrorTime')).format('X')
          : 0;
        return ts;
      },
    },
  },
  {
    indexes: [{ fields: ['KuskiIndex'] }],
  },
);

export default Error;
