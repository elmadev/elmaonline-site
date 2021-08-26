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
    LevelName: {
      type: DataType.STRING(8),
      defaultValue: '',
      allowNull: false,
    },
    Sort: {
      type: DataType.STRING(255),
      defaultValue: '',
      allowNull: false,
    },
  },
  {
    indexes: [{ fields: ['LevelIndex, LevelPackIndex'] }],
  },
);

export default LevelPackLevel;
