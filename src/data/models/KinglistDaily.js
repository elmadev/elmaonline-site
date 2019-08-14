import DataType from 'sequelize';
import { forEach } from 'lodash';
import Model from '../sequelize';

const BattleTypes = ['All'];

const Types = ['Played', 'Wins', 'Points', 'Ranking', 'Designed'];

const getFields = () => {
  const fields = {
    KinglistDailyIndex: {
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
      fields[`${type}${battleType}`] = {
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 0,
      };
    });
  });
  return fields;
};

const KinglistDaily = Model.define('kinglist_daily', getFields(), {
  indexes: [{ fields: ['KinglistDailyIndex', 'KuskiIndex', 'Day'] }],
});

export default KinglistDaily;
