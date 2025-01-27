import DataType from 'sequelize';
import moment from 'moment';
import Model from '../sequelize.js';

const LGR = Model.define(
  'lgr',
  {
    LGRIndex: {
      type: DataType.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    LGRName: {
      type: DataType.STRING(8),
      defaultValue: '',
      allowNull: false,
      set(val) {
        this.setDataValue('LGRName', val.toLowerCase());
      },
    },
    LGRDesc: {
      type: DataType.STRING(255),
      defaultValue: '',
      allowNull: false,
    },
    KuskiIndex: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    Downloads: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    FileLink: {
      type: DataType.STRING(255),
      allowNull: false,
    },
    PreviewLink: {
      type: DataType.STRING(255),
      allowNull: false,
    },
    Added: {
      type: DataType.STRING(19),
      defaultValue: '0000-00-00 00:00:00',
      allowNull: false,
      get() {
        return moment(this.getDataValue('Added')).format('X');
      },
    },
  },
  {
    indexes: [{ fields: ['LGRIndex', 'LGRName'] }],
  },
);

export default LGR;
