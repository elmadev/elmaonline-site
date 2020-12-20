import DataType from 'sequelize';
import Model from '../sequelize';

const FlagBan = Model.define(
  'flagban',
  {
    FlagBanIndex: {
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
    BanType: {
      type: DataType.STRING,
      allowNull: false,
      defaultValue: '',
    },
    ExpireDate: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: false,
    },
    Reason: {
      type: DataType.STRING,
      allowNull: false,
      defaultValue: false,
    },
    Severeness: {
      type: DataType.STRING,
      allowNull: false,
      defaultValue: false,
    },
    Expired: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    Revoked: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    indexes: [{ fields: ['KuskiIndex'] }],
  },
);

export default FlagBan;
