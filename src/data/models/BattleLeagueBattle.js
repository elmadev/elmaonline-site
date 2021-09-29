import DataType from 'sequelize';
import Model from '../sequelize';

const BattleLeagueBattle = Model.define(
  'battleleague_battle',
  {
    BattleLeagueBattleIndex: {
      type: DataType.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    BattleLeagueIndex: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    BattleIndex: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    Season: {
      type: DataType.STRING(15),
      allowNull: false,
      defaultValue: '',
    },
  },
  {
    indexes: [{ fields: ['BattleLeagueIndex', 'BattleIndex'] }],
  },
);

export default BattleLeagueBattle;
