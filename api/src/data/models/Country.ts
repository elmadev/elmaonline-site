import { DataTypes } from 'sequelize';
import type { Model } from 'sequelize';
import type { CountryData } from '#contract/country.ts';
import sequelize from '../sequelize.js';

// all columns are public, so the contract entity is the full row
interface CountryInstance extends Model<CountryData>, CountryData {}

const Country = sequelize.define<CountryInstance>('country', {
  Iso: {
    type: DataTypes.STRING(2),
    allowNull: false,
    primaryKey: true,
  },
  NameUppercase: {
    type: DataTypes.STRING(80),
    allowNull: false,
  },
  Name: {
    type: DataTypes.STRING(80),
    allowNull: false,
  },
  Iso3: {
    type: DataTypes.CHAR(3),
    allowNull: true,
    defaultValue: null,
  },
  Numcode: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: null,
  },
});

export default Country;
