import DataType from 'sequelize';
import Model from '../sequelize';

const LevelPackLevel = Model.define(
  'levelpack_level',
  {
    LevelPackLevelIndex: {
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
    LevelIndex: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    indexes: [{ fields: ['LevelIndex, LevelPackIndex'] }],
  },
);

export default LevelPackLevel;
