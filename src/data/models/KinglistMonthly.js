import DataType from 'sequelize';
import { forEach } from 'lodash';
import Model from '../sequelize';

const BattleTypes = ['NM', 'All', 'FF', 'AP'];

const Types = ['Played', 'Wins', 'Points', 'Ranking', 'Designed'];

const getFields = () => {
  const fields = {
    KinglistMonthlyIndex: {
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
    Month: {
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

const KinglistMonthly = Model.define('kinglist_monthly', getFields(), {
  indexes: [{ fields: ['KinglistMonthlyIndex', 'KuskiIndex', 'Month'] }],
});

export default KinglistMonthly;
