import DataTypes from 'sequelize';
import type { KuskiRow } from '#contract/kuski.ts';
import type { ModelInstance } from '../columns.ts';
import sequelize from '../sequelize.js';
import Team from './Team.js';

export type KuskiInstance = ModelInstance<KuskiRow>;

const Kuski = sequelize.define<KuskiInstance>(
  'kuski',
  {
    KuskiIndex: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    Kuski: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    TeamIndex: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    Country: {
      type: DataTypes.STRING(2),
      allowNull: false,
    },
    Password: {
      type: DataTypes.STRING(32),
      allowNull: false,
      defaultValue: '',
    },
    Password2: {
      type: DataTypes.STRING(128),
      allowNull: false,
      defaultValue: '',
    },
    Salt: {
      type: DataTypes.STRING(32),
      allowNull: false,
      defaultValue: '',
    },
    Rights: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    BmpCRC: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    BmpData: {
      type: DataTypes.BLOB,
      allowNull: true,
    },
    RPlay: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    RStartBattle: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    RSpecialBattle: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    RStartCup: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    RStart24htt: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    RStop: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    RMultiPlay: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    RChat: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    RBan: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    RMod: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    RAdmin: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    Confirmed: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    ConfirmCode: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: '',
    },
    Email: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    indexes: [{ fields: ['Kuski', 'TeamIndex', 'Country'] }],
    defaultScope: {
      attributes: ['Kuski', 'KuskiIndex', 'Country', 'BmpCRC'],
      include: [
        {
          model: Team,
          as: 'TeamData',
          attributes: { exclude: ['Locked'] },
        },
      ],
    },
  },
);

export default Kuski;
