import DataType from 'sequelize';
import Model from '../sequelize';

const SiteSetting = Model.define(
  'sitesetting',
  {
    SiteSettingIndex: {
      type: DataType.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    KuskiIndex: {
      type: DataType.INTEGER,
      defaultValue: false,
      allowNull: false,
    },
    SettingName: {
      type: DataType.STRING(255),
      defaultValue: false,
      allowNull: false,
    },
    Setting: {
      type: DataType.STRING(255),
      defaultValue: false,
      allowNull: false,
    },
    Value1: {
      type: DataType.STRING,
      defaultValue: DataType.NULL,
      allowNull: true,
    },
    Value2: {
      type: DataType.STRING,
      defaultValue: DataType.NULL,
      allowNull: true,
    },
    Value3: {
      type: DataType.STRING,
      defaultValue: DataType.NULL,
      allowNull: true,
    },
    Value4: {
      type: DataType.INTEGER(1),
      defaultValue: 0,
      allowNull: false,
    },
  },
  {
    indexes: [{ fields: ['KuskiIndex', 'SettingName'] }],
  },
);

export default SiteSetting;
