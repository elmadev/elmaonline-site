import DataType from 'sequelize';
import moment from 'moment';
import Model from '../sequelize';

const LegacyFinished = Model.define(
  'legacyfinished',
  {
    LegacyFinishedIndex: {
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
        return moment(this.getDataValue('Driven')).format('X');
      },
    },
    Source: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    indexes: [
      {
        fields: ['LevelIndex'],
      },
    ],
  },
);

export default LegacyFinished;
