const dotenv = require('dotenv');
const { join } = require('path');
// Load environment variables from .env file
dotenv.config();

const env = process.env.NODE_ENV || 'development';
var ssl = (process.env.SSL == 'true');
const configs = {
  base: {
    env,
    name: process.env.APP_NAME || 'koa-rest-api-boilerplate',
    host: process.env.APP_HOST || '0.0.0.0',
    port: process.env.APP_PORT,
    orm: {
      name: 'orm',
      modelPath: join(__dirname, '../models'),
      db: process.env.POSTGRES_DB,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: process.env.POSTGRES_PORT,
      ssl:ssl,
      dialectOptions: {
        ssl: ssl,
      },
      pool: {
        maxConnections: 10,
        minConnections: 0,
        maxIdleTime: 30000,
      },
    },
  },
  development: {
    development: {
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      host: process.env.POSTGRES_HOST,
      dialect: 'postgres',
      ssl: process.env.SSL,
      dialectOptions: {
        ssl:process.env.SSL,
      },
    },
  },
  production: {
    production: {
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      host: process.env.POSTGRES_HOST,
      dialect: 'postgres',
      ssl: process.env.SSL,
      dialectOptions: {
        ssl: process.env.SSL,
      },
    },
  },
  test: {
    port: 7072,
  }
};
const config = Object.assign(configs.base, configs[env]);
module.exports = config;
