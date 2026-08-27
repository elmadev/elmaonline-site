import DataType from 'sequelize';
// import moment from 'moment';
import Model from '../sequelize.js';

const Donate = Model.define(
  'donate',
  {
    DonateIndex: {
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
    txn_id: {
      type: DataType.TEXT,
      allowNull: false,
      defaultValue: '',
    },
    payment_date: {
      type: DataType.TEXT('tiny'),
      allowNull: false,
      defaultValue: '0000-00-00 00:00:00',
      // parse old dates (above format), need different formatting for new (3 March 2019 at 12:37:50 CET type)
      // get() {
      //   const ts = this.getDataValue('payment_date')
      //     ? moment(this.getDataValue('payment_date')).format('X')
      //     : 0;
      //   return ts;
      // },
    },
    mc_fee: {
      type: DataType.FLOAT,
      allowNull: false,
      defaultValue: '',
    },
    mc_gross: {
      type: DataType.FLOAT,
      allowNull: false,
      defaultValue: '',
    },
    Processed: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: '',
    },
  },
  {
    indexes: [{ fields: ['KuskiIndex'] }],
  },
);

export default Donate;
