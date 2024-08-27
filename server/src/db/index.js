import 'dotenv/config';

import Sequelize from 'sequelize';

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    pool: {
      max: 5,
      min: 0,
      idle: 10000,
    },
    logging: false,
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log('Connected to the database...');

    return sequelize.sync({ force: false });
  })
  .then(() => {
    console.log('Database synchronized.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });
