import DataType from 'sequelize';
import moment from 'moment';
import Model from '../sequelize';

const News = Model.define(
  'news',
  {
    NewsIndex: {
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
    Headline: {
      type: DataType.STRING(255),
      allowNull: false,
      defaultValue: '',
    },
    News: {
      type: DataType.STRING(65535),
      allowNull: false,
      defaultValue: '',
    },
    Written: {
      type: DataType.STRING(10),
      allowNull: false,
      defaultValue: '0000-00-00 00:00:00',
      get() {
        const ts = this.getDataValue('Written')
          ? moment(this.getDataValue('Written')).format('X')
          : 0;
        return ts;
      },
    },
  },
  {
    indexes: [{ fields: ['KuskiIndex'] }],
  },
);

export default News;
