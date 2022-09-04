import DataType from 'sequelize';
import { forEach } from 'lodash-es';
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

const Types = ['Played', 'Played5', 'Wins', 'Points', 'Ranking', 'Designed'];

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

const Ranking = Model.define('ranking_yearly', getFields(), {
  indexes: [{ fields: ['RankingYearlyIndex', 'KuskiIndex', 'Year'] }],
});

export default Ranking;
