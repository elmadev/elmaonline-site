import DataType from 'sequelize';
import moment from 'moment';
import Model from '../sequelize.js';

const BestMultitime = Model.define(
  'bestmultitime',
  {
    BestMultiTimeIndex: {
      type: DataType.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    KuskiIndex1: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    KuskiIndex2: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    LevelIndex: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    MultiTimeIndex: {
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
        fields: ['BestMultiTimeIndex, LevelIndex, MultiTimeIndex'],
      },
    ],
  },
);

export default BestMultitime;
