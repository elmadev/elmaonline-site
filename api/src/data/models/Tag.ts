import DataTypes from 'sequelize';
import type { TagRow } from '#contract/tag.ts';
import type { ModelInstance } from '../columns.ts';
import sequelize from '../sequelize.js';

export type TagInstance = ModelInstance<TagRow>;

const Tag = sequelize.define<TagInstance>('tag', {
  TagIndex: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  Name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  Hidden: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  Type: {
    type: DataTypes.ENUM,
    values: ['replay', 'level', 'levelpack', 'lgr'],
    allowNull: false,
  },
});

export default Tag;
