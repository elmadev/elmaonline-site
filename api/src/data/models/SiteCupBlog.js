import DataType from 'sequelize';
import Model from '../sequelize.js';
import { sanitizeHtml } from '#utils/html.js';

const SiteCupBlog = Model.define(
  'sitecupblog',
  {
    CupBlogIndex: {
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
    KuskiIndex: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: false,
    },
    Headline: {
      type: DataType.STRING,
      allowNull: false,
      defaultValue: false,
    },
    Text: {
      type: DataType.STRING,
      allowNull: false,
      defaultValue: false,
      set(val) {
        this.setDataValue('Text', sanitizeHtml(val));
      },
    },
    Written: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    indexes: [{ fields: ['KuskiIndex', 'CupIndex'] }],
  },
);

export default SiteCupBlog;
