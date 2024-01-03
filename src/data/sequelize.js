import Sequelize from 'sequelize';
import config from '../config';
import { log } from '../utils/database';

const { host, port, user, pass, database } = config.mysql;
const uri = `mysql://${user}:${pass}@${host}:${port}/${database}`;

const sequelize = new Sequelize(uri, {
  define: {
    freezeTableName: true,
    timestamps: false,
    hooks: {
      beforeFind: o => {
        const n = o;
        n.benchmark = true;
        n.logging = (q, b) => {
          log('find', q, b);
        };
        return n;
      },
      beforeCreate: (d, o) => {
        const n = o;
        n.benchmark = true;
        n.logging = (q, b) => {
          log('create', q, b);
        };
        return n;
      },
      beforeDestroy: (d, o) => {
        const n = o;
        n.benchmark = true;
        n.logging = (q, b) => {
          log('destroy', q, b);
        };
        return n;
      },
      beforeUpdate: (d, o) => {
        const n = o;
        n.benchmark = true;
        n.logging = (q, b) => {
          log('update', q, b);
        };
        return n;
      },
      beforeCount: o => {
        const n = o;
        n.benchmark = true;
        n.logging = (q, b) => {
          log('count', q, b);
        };
        return n;
      },
      beforeBulkCreate: o => {
        const n = o;
        n.benchmark = false;
        n.logging = false;
        return n;
      },
    },
  },
});

sequelize
  .authenticate()
  .then(() => {
    console.info(`MySQL connection established at ${uri}`);
  })
  .catch(err => {
    console.error(`Unable to connect to MySQL database at ${uri}:`, err);
  });

export const dbquery = async (q, replacements = []) => {
  const [result] = await sequelize.query(q, {
    replacements,
    benchmark: true,
    logging: (query, b) => log('query', query, b),
  });
  return result;
};

export default sequelize;
