import DataTypes from 'sequelize';
import type { ReplayRatingRow } from '#contract/replayrating.ts';
import type { ModelInstance } from '../columns.ts';
import sequelize from '../sequelize.js';

export type ReplayRatingInstance = ModelInstance<ReplayRatingRow>;

const ReplayRating = sequelize.define<ReplayRatingInstance>('replay_rating', {
  ReplayRatingIndex: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  KuskiIndex: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false,
  },
  ReplayIndex: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false,
  },
  Vote: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false,
  },
  BattleIndex: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false,
  },
  CupTimeIndex: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false,
  },
  UUID: {
    type: DataTypes.STRING(54),
    defaultValue: null,
    allowNull: true,
  },
});

export default ReplayRating;
