import DataType from 'sequelize';
import Model from '../sequelize';

const WeeklyWRs = Model.define(
  'weeklywrs',
  {
    WeeklyWRsIndex: {
      type: DataType.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    TimeIndex: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    indexes: [{ fields: ['WeeklyWRsIndex', 'TimeIndex'] }],
  },
);

export default WeeklyWRs;
