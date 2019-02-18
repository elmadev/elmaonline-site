import DataType from 'sequelize';
import Model from '../sequelize';

const Replay = Model.define(
  'replay',
  {
    ReplayIndex: {
      type: DataType.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    DrivenBy: {
      type: DataType.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    UploadedBy: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    LevelIndex: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    TimeIndex: {
      type: DataType.INTEGER,
      allowNull: true,
      defaultValue: DataType.NULL,
    },
    ReplayTime: {
      type: DataType.INTEGER,
      allowNull: true,
      defaultValue: DataType.NULL,
    },
    Finished: {
      type: DataType.INTEGER,
      allowNull: true,
      defaultValue: DataType.NULL,
    },
    Uploaded: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    Unlisted: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    UUID: {
      type: DataType.STRING(10),
      allowNull: true,
      defaultValue: DataType.NULL,
    },
    RecFileName: {
      type: DataType.STRING(19),
      allowNull: true,
      defaultValue: DataType.NULL,
    },
  },
  {
    indexes: [{ fields: ['LevelIndex', 'TimeIndex'] }],
  },
);

export default Replay;
