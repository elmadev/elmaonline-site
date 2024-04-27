import Sequelize, { Model } from 'sequelize';
import * as PlayStats from './PlayStats.js';
import sequelizeInstance from '../sequelize.js';

// ** KUSKI STATS NOT CURRENTLY IMPLEMENTED YET **

export const ddl = {
  KuskiStatsIndex: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  KuskiIndex: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  ...PlayStats.getCommonCols(),
};

class KuskiStats extends Model {}

KuskiStats.init(ddl, {
  sequelize: sequelizeInstance,
  tableName: 'kuskiStats_dev1',
  indexes: [
    { unique: true, fields: ['KuskiIndex'] },
    { fields: ['KuskiStatsIndex', 'KuskiIndex'] },
  ],
});

export default KuskiStats;
