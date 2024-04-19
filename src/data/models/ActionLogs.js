import DataType from 'sequelize';
import moment from 'moment';
import Model from '../sequelize.js';

const ActionLogs = Model.define(
  'actionlogs',
  {
    ActionLogsIndex: {
      type: DataType.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    KuskiIndex: {
      type: DataType.INTEGER(11),
      allowNull: false,
      defaultValue: 0,
    },
    RightsKuski: {
      type: DataType.INTEGER(11),
      allowNull: false,
      defaultValue: 0,
    },
    ActionType: {
      type: DataType.STRING,
      allowNull: false,
      defaultValue: '',
    },
    Action: {
      type: DataType.STRING,
      allowNull: false,
      defaultValue: '',
    },
    Time: {
      type: DataType.STRING(19),
      allowNull: false,
      defaultValue: '0000-00-00 00:00:00',
      get() {
        const ts = this.getDataValue('Time')
          ? moment(this.getDataValue('Time')).format('X')
          : 0;
        return ts;
      },
    },
    ActionIndex: {
      type: DataType.INTEGER(11),
      allowNull: false,
      defaultValue: 0,
    },
    Text: {
      type: DataType.STRING,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    indexes: [{ fields: ['KuskiIndex'] }],
  },
);

export default ActionLogs;
