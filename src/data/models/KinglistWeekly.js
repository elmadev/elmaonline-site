import DataType from 'sequelize';
import { forEach } from 'lodash';
import Model from '../sequelize';

const BattleTypes = ['All'];

const Types = ['Played', 'Wins', 'Points', 'Ranking', 'Designed'];

const getFields = () => {
  const fields = {
    KinglistWeeklyIndex: {
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
    Week: {
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

const KinglistWeekly = Model.define('kinglist_weekly', getFields(), {
  indexes: [{ fields: ['KinglistWeeklyIndex', 'KuskiIndex', 'Week'] }],
});

export default KinglistWeekly;
