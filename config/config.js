import 'dotenv/config';

const dialectOptions = process.env.DB_SSL === 'true' || process.env.DB_SSL_CA
  ? { ssl: { minVersion: 'TLSv1.2', ...(process.env.DB_SSL_CA ? { ca: process.env.DB_SSL_CA } : {}) } }
  : undefined;

const db = {
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  ...(dialectOptions ? { dialectOptions } : {}),
  dialect: 'mysql',
  timezone: '-03:00',
};

export default { development: db, production: db };
