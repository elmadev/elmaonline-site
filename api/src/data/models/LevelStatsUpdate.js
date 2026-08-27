import Sequelize, { Model } from 'sequelize';
import sequelize from '#data/sequelize';
import { JsonUpdate, getCol } from '#utils/sequelize';

export const ddl = {
  LevelStatsUpdateIndex: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  // time.TimeIndex
  TimeIndex0: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  // time.TimeIndex
  TimeIndex1: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  // unix timestamp
  TimeStart: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  // JSON
  Debug: {
    // get/set here to handle json might break updateDebug fn in model.
    type: Sequelize.TEXT('long'),
  },
};

class LevelStatsUpdate extends Model {
  // ie. this.updateDebug(prev => { prev.newValue = 23 }, save = true)
  updateDebug = (callable, save) => {
    return JsonUpdate(this, 'Debug', callable, save);
  };

  static getLastTimeIndexProcessed = async () =>
    getCol(
      'SELECT MAX(TimeIndex1) maxIndex from levelstatsupdate',
      {},
      'maxIndex',
    );
}

LevelStatsUpdate.init(ddl, {
  sequelize,
  tableName: 'levelstatsupdate',
});

export default LevelStatsUpdate;
