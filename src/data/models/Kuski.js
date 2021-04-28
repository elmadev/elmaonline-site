import DataType from 'sequelize';
import Model from '../sequelize';
import Team from './Team';

const Kuski = Model.define(
  'kuski',
  {
    KuskiIndex: {
      type: DataType.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    Kuski: {
      type: DataType.STRING(15),
      allowNull: false,
    },
    TeamIndex: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    Country: {
      type: DataType.STRING(2),
      allowNull: false,
    },
    Password: {
      type: DataType.STRING(32),
      allowNull: false,
      defaultValue: '',
    },
    Rights: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    BmpCRC: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    BmpData: {
      type: DataType.BLOB,
      allowNull: true,
    },
    RPlay: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    RStartBattle: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    RSpecialBattle: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    RStartCup: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    RStart24htt: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    RStop: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    RMultiPlay: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    RChat: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    RBan: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    RMod: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    RAdmin: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    Confirmed: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    ConfirmCode: {
      type: DataType.STRING(10),
      allowNull: false,
      defaultValue: '',
    },
    Email: {
      type: DataType.STRING,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    indexes: [{ fields: ['Kuski', 'TeamIndex', 'Country'] }],
    defaultScope: {
      attributes: ['Kuski', 'Country'],
      include: [
        {
          model: Team,
          as: 'TeamData',
          attributes: { exclude: 'Locked' },
        },
      ],
    },
  },
);

export default Kuski;
