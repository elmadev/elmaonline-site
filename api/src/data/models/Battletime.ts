import DataTypes from 'sequelize';
import type { BattletimeRow } from '#contract/battletime.ts';
import type { ModelInstance } from '../columns.ts';
import sequelize from '../sequelize.js';
import type { KuskiInstance } from './Kuski.ts';

export type BattletimeInstance = ModelInstance<
  BattletimeRow,
  { KuskiData?: KuskiInstance }
>;

const Battletime = sequelize.define<BattletimeInstance>(
  'battletime',
  {
    BattleTimeIndex: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    BattleIndex: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    KuskiIndex: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    KuskiIndex2: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    TimeIndex: {
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
  },
  {
    indexes: [
      { fields: ['BattleIndex', 'TimeIndex', 'KuskiIndex', 'KuskiIndex2'] },
    ],
  },
);

export default Battletime;
