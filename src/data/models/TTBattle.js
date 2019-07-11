import DataType from 'sequelize';
import Model from '../sequelize';

const TTBattle = Model.define(
  'ttbattle',
  {
    TTBattleIndex: {
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
    TTBattleName: {
      type: DataType.TEXT('tiny'),
      allowNull: true,
    },
    Levels: {
      type: DataType.TEXT,
      allowNull: true,
    },
    StartTime: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    Duration: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    indexes: [{ fields: ['TTBattleIndex'] }],
  },
);

export default TTBattle;
