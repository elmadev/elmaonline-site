import DataType from 'sequelize';
import Model from '../sequelize.js';

const Team = Model.define(
  'team',
  {
    TeamIndex: {
      type: DataType.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    Team: {
      type: DataType.STRING(9),
      allowNull: false,
      defaultValue: '',
    },
    Locked: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    Logo: {
      type: DataType.STRING(255),
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    indexes: [{ fields: ['Team'] }],
  },
);

export default Team;
