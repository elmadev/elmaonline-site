import DataTypes from 'sequelize';
import type { LevelPackLevelRow } from '#contract/levelpacklevel.ts';
import type { ModelInstance } from '../columns.ts';
import sequelize from '../sequelize.js';

export type LevelPackLevelInstance = ModelInstance<LevelPackLevelRow>;

const LevelPackLevel = sequelize.define<LevelPackLevelInstance>(
  'levelpack_level',
  {
    LevelPackLevelIndex: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    LevelPackIndex: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    LevelIndex: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    LevelName: {
      type: DataTypes.STRING(8),
      defaultValue: '',
      allowNull: false,
    },
    Sort: {
      type: DataTypes.STRING(255),
      defaultValue: '',
      allowNull: true,
    },
    Targets: {
      type: DataTypes.STRING(255),
      defaultValue: '',
      allowNull: true,
    },
    ExcludeFromTotal: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    Order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    indexes: [{ fields: ['LevelIndex, LevelPackIndex'] }],
  },
);

export default LevelPackLevel;
