import moment from 'moment';
import DataTypes from 'sequelize';
import type { BattleRow } from '#contract/battle.ts';
import type { ModelInstance } from '../columns.ts';
import sequelize from '../sequelize.js';
import type { BattletimeInstance } from './Battletime.ts';
import type { LevelInstance } from './Level.ts';

export type BattleInstance = ModelInstance<
  BattleRow,
  { Results?: BattletimeInstance[]; LevelData: LevelInstance }
>;

const Battle = sequelize.define<BattleInstance>(
  // give the model same name as the db table
  'battle', // the actual MySQL table name
  {
    BattleIndex: {
      type: DataTypes.INTEGER, // see available types on http://docs.sequelizejs.com/manual/tutorial/models-definition.html#data-types
      autoIncrement: true, // always used for the primary index
      allowNull: false, // false/true as per MySQL table structure
      primaryKey: true, // EOL tables always have primary index on a field called TablenameIndex
    },
    KuskiIndex: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    LevelIndex: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    BattleType: {
      type: DataTypes.STRING(2),
      allowNull: false,
      defaultValue: '',
    },
    SeeOthers: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: '0',
    },
    SeeTimes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: '0',
    },
    AllowStarter: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: '0',
    },
    AcceptBugs: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: '0',
    },
    NoVolt: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: '0',
    },
    NoTurn: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: '0',
    },
    OneTurn: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: '0',
    },
    NoBrake: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: '0',
    },
    NoThrottle: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: '0',
    },
    Drunk: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: '0',
    },
    OneWheel: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: '0',
    },
    Multi: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: '0',
    },
    Started: {
      type: DataTypes.STRING(19),
      allowNull: true,
      defaultValue: '0000-00-00 00:00:00',
      get(this: BattleInstance) {
        const ts = this.getDataValue('Started')
          ? moment(this.getDataValue('Started')).format('X')
          : 0;
        return ts;
      },
    },
    StartedUtc: {
      type: DataTypes.VIRTUAL,
      allowNull: true,
      defaultValue: '0000-00-00 00:00:00',
      get(this: BattleInstance) {
        const ts = this.getDataValue('Started')
          ? moment(this.getDataValue('Started')).add(8, 'hours').format('X')
          : 0;
        return ts;
      },
    },
    Duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    Aborted: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    Finished: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    InQueue: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    Countdown: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    RecFileName: {
      type: DataTypes.STRING(15),
    },
    RecData: {
      type: DataTypes.BLOB,
      allowNull: true,
      defaultValue: '',
    },
    Views: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    indexes: [{ fields: ['Started', 'LevelIndex', 'KuskiIndex'] }],
  },
);

export default Battle;
