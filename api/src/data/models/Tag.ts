import { DataTypes } from 'sequelize';
import type { Model, Optional } from 'sequelize';
import type { Tag as TagData } from '#contract/tag.ts';
import sequelize from '../sequelize.js';

type TagCreation = Optional<TagData, 'TagIndex' | 'Hidden'>;

// all columns are public, so the contract entity is the full row
export interface TagInstance extends Model<TagData, TagCreation>, TagData {}

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
