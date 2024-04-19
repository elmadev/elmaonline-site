import DataType from 'sequelize';
import Model from '../sequelize.js';

const LevelPackFavourite = Model.define(
  'levelpack_favourite',
  {
    LevelPackFavouriteIndex: {
      type: DataType.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    LevelPackIndex: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    KuskiIndex: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    Sort: {
      type: DataType.STRING(255),
      defaultValue: '',
      allowNull: false,
    },
  },
  {
    indexes: [{ fields: ['KuskiIndex'] }],
  },
);

export default LevelPackFavourite;
