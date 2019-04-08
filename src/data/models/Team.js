import DataType from 'sequelize';
import Model from '../sequelize';

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
  },
  {
    indexes: [{ fields: ['Team'] }],
  },
);

export default Team;
