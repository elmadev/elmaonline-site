import DataType from 'sequelize';
import moment from 'moment';
import Model from '../sequelize';

const Ban = Model.define(
  'ban',
  {
    BanIndex: {
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
      defaultValue: '',
    },
    BanType: {
      type: DataType.STRING(1),
      allowNull: false,
      defaultValue: '',
    },
    Expires: {
      type: DataType.STRING(19),
      allowNull: false,
      defaultValue: '0000-00-00 00:00:00',
      get() {
        const ts = this.getDataValue('Expires')
          ? moment(this.getDataValue('Expires')).format('X')
          : 0;
        return ts;
      },
    },
    Reason: {
      type: DataType.STRING,
      allowNull: false,
      defaultValue: false,
    },
    Type: {
      type: DataType.STRING,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    indexes: [{ fields: ['KuskiIndex'] }],
  },
);

export default Ban;
