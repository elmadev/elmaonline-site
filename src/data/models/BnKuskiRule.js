import DataType from 'sequelize';
import Model from '../sequelize';

const Setting = Model.define('bn_kuski_rule', {
  BnKuskiRuleIndex: {
    type: DataType.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  KuskiIndex: {
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  BattleTypes: {
    type: DataType.STRING(255),
    allowNull: true,
    defaultValue: null,
  },
  Designers: {
    type: DataType.STRING(255),
    allowNull: true,
    defaultValue: null,
  },
  LevelPatterns: {
    type: DataType.STRING(255),
    allowNull: true,
    defaultValue: null,
  },
  BattleAttributes: {
    type: DataType.STRING(255),
    allowNull: true,
    defaultValue: null,
  },
  MinDuration: {
    type: DataType.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
  MaxDuration: {
    type: DataType.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
  IgnoreList: {
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
});

export default Setting;
