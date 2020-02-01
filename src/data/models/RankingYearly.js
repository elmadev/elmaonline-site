import DataType from 'sequelize';
import { forEach } from 'lodash';
import Model from '../sequelize';

const BattleTypes = [
  'NM',
  'All',
  'FF',
  'OL',
  'SL',
  'SR',
  'LC',
  'FT',
  'AP',
  'SP',
  'FC',
  'M',
  'NV',
  'NT',
  'OT',
  'NB',
  'NTH',
  'AT',
  'D',
  'OW',
];

const Types = ['Played', 'Wins', 'Points', 'Ranking', 'Designed'];

const getFields = () => {
  const fields = {
    RankingYearlyIndex: {
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
    Year: {
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

const Ranking = Model.define('ranking_yearly', getFields(), {
  indexes: [{ fields: ['RankingYearlyIndex', 'KuskiIndex', 'Year'] }],
});

export default Ranking;
