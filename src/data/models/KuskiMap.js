import DataType from 'sequelize';
import Model from '../sequelize';

const KuskiMap = Model.define(
  'kuskimap',
  {
    KuskiMapIndex: {
      type: DataType.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    KuskiIndex: {
      type: DataType.INTEGER,
      defaultValue: false,
      allowNull: false,
    },
    Lng: {
      type: DataType.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    Lat: {
      type: DataType.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    LastUpdated: {
      type: DataType.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
  },
  {
    indexes: [{ fields: ['KuskiIndex'] }],
  },
);

export default KuskiMap;
