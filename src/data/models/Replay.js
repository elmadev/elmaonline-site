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
    DrivenByText: {
      type: DataType.STRING(255),
      allowNull: true,
      defaultValue: DataType.NULL,
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
    Hide: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    TAS: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    Bug: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    Nitro: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    Comment: {
      type: DataType.STRING(255),
      allowNull: true,
      defaultValue: DataType.NULL,
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
    MD5: {
      type: DataType.STRING(32),
      allowNull: true,
      defaultValue: DataType.NULL,
    },
    Views: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    indexes: [{ fields: ['LevelIndex', 'TimeIndex'] }],
  },
);

export default Replay;
