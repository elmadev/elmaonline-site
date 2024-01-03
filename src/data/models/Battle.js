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
      foreignKey: true,
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
    SeeOthers: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: '0',
    },
    SeeTimes: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: '0',
    },
    AllowStarter: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: '0',
    },
    AcceptBugs: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: '0',
    },
    NoVolt: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: '0',
    },
    NoTurn: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: '0',
    },
    OneTurn: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: '0',
    },
    NoBrake: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: '0',
    },
    NoThrottle: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: '0',
    },
    Drunk: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: '0',
    },
    OneWheel: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: '0',
    },
    Multi: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: '0',
    },
    Started: {
      type: DataType.STRING(19),
      allowNull: true,
      defaultValue: '0000-00-00 00:00:00',
      get() {
        const ts = this.getDataValue('Started')
          ? moment(this.getDataValue('Started')).format('X')
          : 0;
        return ts;
      },
    },
    StartedUtc: {
      type: DataType.VIRTUAL,
      allowNull: true,
      defaultValue: '0000-00-00 00:00:00',
      get() {
        const ts = this.getDataValue('Started')
          ? moment(this.getDataValue('Started')).add(8, 'hours').format('X')
          : 0;
        return ts;
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
    Views: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    indexes: [{ fields: ['Started', 'LevelIndex', 'KuskiIndex'] }],
  },
);

export default Battle;
