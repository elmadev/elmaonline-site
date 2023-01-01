import DataType from 'sequelize';
import moment from 'moment';
import Model from '../sequelize';

const SiteCup = Model.define(
  'sitecup',
  {
    CupIndex: {
      type: DataType.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    CupGroupIndex: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: false,
    },
    LevelIndex: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: false,
    },
    StartTime: {
      type: DataType.STRING(19),
      defaultValue: '0000-00-00 00:00:00',
      allowNull: false,
      get() {
        return moment(this.getDataValue('StartTime')).format('X');
      },
    },
    EndTime: {
      type: DataType.STRING(19),
      defaultValue: '0000-00-00 00:00:00',
      allowNull: false,
      get() {
        return moment(this.getDataValue('EndTime')).format('X');
      },
    },
    Designer: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: false,
    },
    ShowResults: {
      type: DataType.INTEGER(1),
      allowNull: false,
      defaultValue: 0,
    },
    Updated: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    Started: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    AppleBugs: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    FirstPlaceInterview: {
      type: DataType.STRING,
      allowNull: true,
      defaultValue: null,
    },
    SecondPlaceInterview: {
      type: DataType.STRING,
      allowNull: true,
      defaultValue: null,
    },
    ThirdPlaceInterview: {
      type: DataType.STRING,
      allowNull: true,
      defaultValue: null,
    },
    DesignerInterview: {
      type: DataType.STRING,
      allowNull: true,
      defaultValue: null,
    },
    ShownTimes: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    indexes: [{ fields: ['CupGroupIndex, LevelIndex, Designer'] }],
  },
);

export default SiteCup;
