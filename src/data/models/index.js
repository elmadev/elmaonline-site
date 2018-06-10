import sequelize from '../sequelize';
import User from './User';
import UserLogin from './UserLogin';
import UserClaim from './UserClaim';
import UserProfile from './UserProfile';
import Battle from './Battle'; // add the data model here to import
import Replay from './Replay';
import Level from './Level';
import Kuski from './Kuski';
import Battletime from './Battletime';

User.hasMany(UserLogin, {
  foreignKey: 'userId',
  as: 'logins',
  onUpdate: 'cascade',
  onDelete: 'cascade',
});

User.hasMany(UserClaim, {
  foreignKey: 'userId',
  as: 'claims',
  onUpdate: 'cascade',
  onDelete: 'cascade',
});

User.hasOne(UserProfile, {
  foreignKey: 'userId',
  as: 'profile',
  onUpdate: 'cascade',
  onDelete: 'cascade',
});

Battle.belongsTo(Kuski, {
  foreignKey: 'KuskiIndex',
  as: 'KuskiData',
});

function sync(...args) {
  return sequelize.sync(...args);
}

export default { sync };
export {
  User,
  UserLogin,
  UserClaim,
  UserProfile,
  Battle,
  Replay,
  Level,
  Kuski,
  Battletime,
}; // add the data model here as well so it exports
