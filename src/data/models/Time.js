import DataType from 'sequelize';
import Model from '../sequelize';

const Time = Model.define(
  'time',
  {
    TimeIndex: {
      type: DataType.INTEGER,
      allowNull: false,
      autoIncrement: true,
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
    Finished: {
      type: DataType.STRING(1),
      allowNull: false,
      defaultValue: '',
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
          'LevelIndex',
          'MaxSpeed',
        ],
      },
    ],
  },
);

export default Time;
