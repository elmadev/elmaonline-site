import DataType from 'sequelize';
import { forEach } from 'lodash-es';
import Model from '../sequelize.js';

const BattleTypes = ['All'];

const Types = ['Played', 'Played5', 'Wins', 'Points', 'Ranking', 'Designed'];

const getFields = () => {
  const fields = {
    RankingDailyIndex: {
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
    Day: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  };
  forEach(Types, type => {
    forEach(BattleTypes, battleType => {
      let dataType = DataType.INTEGER;
      let defaultValue = 0;
      if (type === 'Ranking') {
        dataType = DataType.DECIMAL(24, 20);
        defaultValue = '1000.00000000000000000000';
      }
      fields[`${type}${battleType}`] = {
        type: dataType,
        allowNull: false,
        defaultValue,
      };
    });
  });
  return fields;
};

const RankingDaily = Model.define('ranking_daily', getFields(), {
  indexes: [{ fields: ['RankingDailyIndex', 'KuskiIndex', 'Day'] }],
});

export default RankingDaily;
