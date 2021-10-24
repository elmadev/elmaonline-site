import DataType from 'sequelize';
import Model from '../sequelize';

const BattleLeague = Model.define(
  'battleleague',
  {
    BattleLeagueIndex: {
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
    LeagueName: {
      type: DataType.STRING(255),
      allowNull: false,
      defaultValue: '',
    },
    ShortName: {
      type: DataType.STRING(10),
      allowNull: false,
      defaultValue: '',
    },
    LeagueDescription: {
      type: DataType.STRING(25555),
      allowNull: false,
      defaultValue: '',
    },
    PointSystem: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: '0',
    },
    Skips: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: '0',
    },
    Events: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: '0',
    },
  },
  {
    indexes: [{ fields: ['KuskiIndex'] }],
  },
);

export default BattleLeague;
