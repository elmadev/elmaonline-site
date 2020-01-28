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
    RankingIndex: {
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
    RowNM: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    BestRowNM: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    BestRowAll: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    RowAll: {
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

const Ranking = Model.define('ranking', getFields(), {
  indexes: [{ fields: ['RankingIndex', 'KuskiIndex'] }],
});

export default Ranking;
