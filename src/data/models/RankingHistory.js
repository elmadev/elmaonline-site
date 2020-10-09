import DataType from 'sequelize';
import Model from '../sequelize';

const getFields = () => {
  const fields = {
    RankingHistoryIndex: {
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
    BattleIndex: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    BattleType: {
      type: DataType.STRING(3),
      allowNull: false,
      defaultValue: 0,
    },
    Played: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    Ranking: {
      type: DataType.DECIMAL(24, 20),
      allowNull: false,
      defaultValue: '1000.00000000000000000000',
    },
    Increase: {
      type: DataType.DECIMAL(24, 20),
      allowNull: false,
      defaultValue: '1000.00000000000000000000',
    },
    Points: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    Wins: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    Designed: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    Position: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    Started: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  };
  return fields;
};

const RankingHistory = Model.define('rankinghistory', getFields(), {
  indexes: [{ fields: ['BattleIndex', 'KuskiIndex'] }],
});

export default RankingHistory;
