import 'dotenv/config';

const db = {
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  dialect: 'mysql',
  timezone: '-03:00',
};

export default { development: db, production: db };
