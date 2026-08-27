import DataType from 'sequelize';
import moment from 'moment';
import Model from '../sequelize.js';

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
    LevelName: {
      type: DataType.STRING(8),
      allowNull: false,
      defaultValue: '',
    },
    BattleType: {
      type: DataType.STRING(2),
      allowNull: false,
      defaultValue: '',
    },
    Designer: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    Started: {
      type: DataType.STRING(19),
      allowNull: true,
      defaultValue: null,
      get() {
        const ts = this.getDataValue('Started')
          ? moment(this.getDataValue('Started')).format('X')
          : 0;
        return ts;
      },
    },
  },
  {
    indexes: [{ fields: ['BattleLeagueIndex', 'BattleIndex'] }],
  },
);

export default BattleLeagueBattle;
