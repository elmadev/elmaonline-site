import DataType from 'sequelize';
import Model from '../sequelize.js';

const Crippled = Model.define(
  'crippled',
  {
    CrippledIndex: {
      type: DataType.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    TimeIndex: {
      type: DataType.INTEGER,
      allowNull: false,
    },
    KuskiIndex: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    LevelIndex: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    CrippledType: {
      type: DataType.INTEGER,
      allowNull: false,
    },
    Time: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    Driven: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    Finished: {
      type: DataType.STRING(1),
      allowNull: false,
      defaultValue: '',
    },
  },
  {
    indexes: [
      {
        fields: [
          // 'TimeIndex', //  maybe ??
          // 'Driven', //  maybe ??
          'LevelIndex',
          'KuskiIndex',
          'CrippledType',
        ],
      },
    ],
  },
);

export const getCrippledTypes = () => {
  return {
    noVolt: 1,
    noTurn: 2,
    oneTurn: 3,
    noBrake: 4,
    noThrottle: 5,
    alwaysThrottle: 6,
    oneWheel: 7,
    drunk: 8,
  };
};

export default Crippled;
