import DataType from 'sequelize';
import Model from '../sequelize.js';

const Country = Model.define('country', {
  Iso: {
    type: DataType.STRING(2),
    allowNull: false,
    primaryKey: true,
  },
  NameUppercase: {
    type: DataType.STRING(80),
    allowNull: false,
  },
  Name: {
    type: DataType.STRING(80),
    allowNull: false,
  },
  Iso3: {
    type: DataType.CHAR(3),
    allowNull: true,
    defaultValue: null,
  },
  Numcode: {
    type: DataType.INTEGER,
    allowNull: true,
    defaultValue: null,
  },
});

export default Country;
