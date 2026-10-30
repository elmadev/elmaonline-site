import DataTypes from 'sequelize';
import moment from 'moment';
import type { TimeRow } from '#contract/time.ts';
import type { ModelInstance } from '../columns.ts';
import sequelize from '../sequelize.js';

export type TimeInstance = ModelInstance<TimeRow>;

const Time = sequelize.define<TimeInstance>(
  'time',
  {
    TimeIndex: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
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
      type: DataTypes.STRING(19),
      defaultValue: '0000-00-00 00:00:00',
      allowNull: false,
      get(this: TimeInstance) {
        return moment(this.getDataValue('Driven')).format('X');
      },
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
          'LevelIndex',
          'MaxSpeed',
        ],
      },
    ],
  },
);

export default Time;
