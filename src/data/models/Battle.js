import moment from 'moment';
import DataType from 'sequelize';
import Model from '../sequelize';

const Battle = Model.define(
  // give the model same name as the db table
  'battle', // the actual MySQL table name
  {
    BattleIndex: {
      type: DataType.INTEGER, // see available types on http://docs.sequelizejs.com/manual/tutorial/models-definition.html#data-types
      autoIncrement: true, // always used for the primary index
      allowNull: false, // false/true as per MySQL table structure
      primaryKey: true, // EOL tables always have primary index on a field called TablenameIndex
    },
    KuskiIndex: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    LevelIndex: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    BattleType: {
      type: DataType.STRING(2),
      allowNull: false,
      defaultValue: '',
    },
    Started: {
      type: DataType.STRING(19),
      allowNull: true,
      defaultValue: '0000-00-00 00:00:00',
      get() {
        return moment(this.getDataValue('Started'))
          .add(8, 'hours')
          .format('X');
      },
    },
    Duration: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    Aborted: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    Finished: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    InQueue: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    Countdown: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    RecFileName: {
      type: DataType.STRING(15),
    },
    RecData: {
      type: DataType.BLOB,
      allowNull: true,
      defaultValue: '',
    },
  },
  {
    indexes: [{ fields: ['Started', 'LevelIndex', 'KuskiIndex'] }],
  },
);

export default Battle;
