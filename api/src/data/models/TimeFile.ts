import DataTypes from 'sequelize';
import type { TimeFileRow } from '#contract/timefile.ts';
import type { ModelInstance } from '../columns.ts';
import sequelize from '../sequelize.js';

export type TimeFileInstance = ModelInstance<TimeFileRow>;

const TimeFile = sequelize.define<TimeFileInstance>(
  'timefile',
  {
    TimeFileIndex: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    TimeIndex: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    BattleIndex: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    UUID: {
      type: DataTypes.STRING(10),
      allowNull: true,
      defaultValue: null,
    },
    MD5: {
      type: DataTypes.STRING(32),
      allowNull: true,
      defaultValue: null,
    },
    Shared: {
      type: DataTypes.INTEGER({ length: 1 }),
      allowNull: false,
      defaultValue: 0,
    },
    Views: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    indexes: [
      {
        fields: ['TimeIndex', 'BattleIndex'],
      },
    ],
  },
);

export default TimeFile;
