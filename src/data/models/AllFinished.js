import DataType from 'sequelize';
import Model from '../sequelize';

const AllFinished = Model.define(
  'allfinished',
  {
    AllFinishedIndex: {
      type: DataType.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    TimeIndex: {
      type: DataType.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    KuskiIndex: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    LevelIndex: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    Time: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    Apples: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    Driven: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    BattleIndex: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    '24httIndex': {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    MaxSpeed: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    ThrottleTime: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    BrakeTime: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    LeftVolt: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    RightVolt: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    SuperVolt: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    Turn: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    OneWheel: {
      type: DataType.INTEGER,
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
