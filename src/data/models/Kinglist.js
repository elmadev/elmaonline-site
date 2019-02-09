import DataType from 'sequelize';
import Model from '../sequelize';

const Kinglist = Model.define(
  'kinglist',
  {
    KinglistIndex: {
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
    PointsNM: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    PlayedNM: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    WinsNM: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    RowNM: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    BestRowNM: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    RankingNM: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 1000,
    },
    DesignedNM: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    indexes: [{ fields: ['KinglistIndex', 'KuskiIndex'] }],
  },
);

export default Kinglist;
