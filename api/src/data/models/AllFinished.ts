import DataTypes from 'sequelize';
import type { AllFinishedRow } from '#contract/allfinished.ts';
import type { ModelInstance } from '../columns.ts';
import sequelize from '../sequelize.js';

export type AllFinishedInstance = ModelInstance<AllFinishedRow>;

const AllFinished = sequelize.define<AllFinishedInstance>(
  'allfinished',
  {
    AllFinishedIndex: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    TimeIndex: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    KuskiIndex: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    LevelIndex: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    Time: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    Apples: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    Driven: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    Finished: {
      type: DataTypes.STRING(1),
      allowNull: false,
      defaultValue: '',
    },
    BattleIndex: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    '24httIndex': {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    MaxSpeed: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    ThrottleTime: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    BrakeTime: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    LeftVolt: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    RightVolt: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    SuperVolt: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    Turn: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    OneWheel: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    FPSLimit: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    indexes: [
      {
        fields: [
          'BattleIndex',
          'TimeIndex',
          'KuskiIndex',
          'LevelTime',
          'LevelIndex',
        ],
      },
    ],
  },
);

export default AllFinished;
