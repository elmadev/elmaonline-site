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
    KuskiIndex: {
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
    Uploaded: {
      type: DataType.STRING(19),
      allowNull: false,
      defaultValue: '0000-00-00 00:00:00',
    },
    RecData: {
      type: DataType.BLOB,
      allowNull: false,
      defaultValue: DataType.NULL,
    },
    ShareDesigner: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    ShareTeam: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    ShareAll: {
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
