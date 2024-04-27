import DataType from 'sequelize';
import Model from '../sequelize.js';

const LevelPackCollectionPack = Model.define(
  'levelpack_collection_pack',
  {
    LevelPackCollectionPackIndex: {
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
    LevelPackCollectionIndex: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    indexes: [{ fields: ['LevelPackCollectionIndex'] }],
  },
);

export default LevelPackCollectionPack;
