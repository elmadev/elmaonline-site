import DataType from 'sequelize';
import Model from '../sequelize';

const Upload = Model.define(
  'upload',
  {
    UploadIndex: {
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
    Uuid: {
      type: DataType.STRING(10),
      allowNull: true,
      defaultValue: null,
    },
    Filename: {
      type: DataType.STRING(255),
      allowNull: true,
      defaultValue: null,
    },
    UploadedOn: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    Expire: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    Mimetype: {
      type: DataType.STRING(255),
      allowNull: true,
      defaultValue: null,
    },
    Downloads: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    Downloaded: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    indexes: [{ fields: ['KuskiIndex', 'Uuid_Filename'] }],
  },
);

export default Upload;
