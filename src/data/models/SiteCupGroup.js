import DataType from 'sequelize';
import Model from '../sequelize';

const SiteCupGroup = Model.define(
  'sitecupgroup',
  {
    CupGroupIndex: {
      type: DataType.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    KuskiIndex: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: false,
    },
    CupName: {
      type: DataType.STRING(32),
      allowNull: false,
      defaultValue: false,
    },
    Hidden: {
      type: DataType.INTEGER(1),
      allowNull: false,
      defaultValue: 0,
    },
    Finished: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    Description: {
      type: DataType.STRING(65535),
      allowNull: true,
      defaultValue: false,
    },
    Cover: {
      type: DataType.STRING(255),
      allowNull: true,
      defaultValue: false,
    },
    AppleResults: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    ReplayRequired: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    ShortName: {
      type: DataType.STRING(4),
      allowNull: false,
      defaultValue: false,
    },
    Skips: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    Events: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    ReadAccess: {
      type: DataType.STRING(255),
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    indexes: [{ fields: ['KuskiIndex'] }],
  },
);

export default SiteCupGroup;
