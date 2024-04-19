import DataType from 'sequelize';
import moment from 'moment';
import Model from '../sequelize.js';

const Besttime = Model.define(
  'besttime',
  {
    BestTimeIndex: {
      type: DataType.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    TimeIndex: {
      type: DataType.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    KuskiIndex: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    LevelIndex: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    Time: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    Driven: {
      type: DataType.STRING(19),
      defaultValue: '0000-00-00 00:00:00',
      allowNull: false,
      get() {
        const ts = this.getDataValue('Driven')
          ? moment(this.getDataValue('Driven')).format('X')
          : 0;
        return ts;
      },
    },
  },
  {
    indexes: [
      {
        fields: ['LevelIndex, TimeIndex'],
      },
    ],
  },
);

export default Besttime;
