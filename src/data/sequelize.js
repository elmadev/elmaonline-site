import Sequelize from 'sequelize';
import config from '../config';

const { host, port, user, pass, database } = config.mysql;
const uri = `mysql://${user}:${pass}@${host}:${port}/${database}`;

const sequelize = new Sequelize(uri, {
  define: {
    freezeTableName: true,
    timestamps: false,
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

export default sequelize;
