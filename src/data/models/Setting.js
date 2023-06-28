import DataType from 'sequelize';
import Model from '../sequelize';

const Setting = Model.define(
  'setting',
  {
    SettingIndex: {
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
    DiscordId: {
      type: DataType.BIGINT,
      allowNull: false,
      defaultValue: 0,
    },
    DiscordTag: {
      type: DataType.STRING(255),
      allowNull: true,
      defaultValue: null,
    },
    DiscordUrl: {
      type: DataType.STRING(255),
      allowNull: true,
      defaultValue: null,
    },
    SendDiscord: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    SendEmail: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    Comment: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    Beaten: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    Besttime: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    News: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    BnEnabled: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ['KuskiIndex'],
      },
    ],
  },
);

export default Setting;
