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
    email_from_address: process.env.FROM_EMAIL,
    email_to_address: process.env.TO_EMAIL,
    orcha_api: process.env.ORCHA_API,
    orcha_user: process.env.ORCHA_USER,
    orcha_pass: process.env.ORCHA_PASS,
    //Provider Email address to send completed referrals.
    iaptus_email: process.env.IAPTUS_EMAIL,
    other_email: process.env.OTHER_EMAIL,
    alder_hey_liverpol: process.env.ALDER_HEY_LIVERPOOL,
    ypas_email: process.env.YPAS_EMAIL,
    liverpool_mhst_email: process.env.LIVERPOOL_MHST,
    seedlings_email: process.env.SEEDLINGS,
    wellbeing_clinics_email: process.env.WELLBEING_CLINICSE,
    alder_hey_sefton: process.env.ALDER_HEY_SEFTON,
    venus_email: process.env.VENUS_EMAIL,
    parenting_email: process.env.PARENTING_EMAIL,
    sefton_mhst_email: process.env.SEFTON_MHST,
    alder_hey_email: process.env.ALDER_HEY_FORMS_EMAIL,
    mhst_email: process.env.MHST_EMAIL,
    use_sendgrid: process.env.USE_SENDGRID,
    mayden_api_ypas: process.env.mayden_api_ypas,
    mayden_api_venus: process.env.mayden_api_venus,
    mayden_apiToken: process.env.mayden_apiToken,
    new_form: process.env.NEW_FORM,
    hccommsurl: process.env.HCCOMMS_URL,
    hccommskey: process.env.HCCOMMS_KEY,
    frontEndUrl: process.env.FRONT_END_DOMAIN_URL,
    orm: {
      name: 'orm',
      modelPath: join(__dirname, '../models'),
      db: process.env.POSTGRES_DB,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: process.env.POSTGRES_PORT,
      ssl: ssl,
      dialectOptions: {
        ssl: ssl,
      },
      pool: {
        maxConnections: 10,
        minConnections: 0,
        maxIdleTime: 30000,
      },
    },
    sendgrid_api_key: process.env.SENDGRID,
  },
  development: {
    development: {
      email_from_address: process.env.FROM_EMAIL,
      email_to_address: process.env.TO_EMAIL,
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
  production: {
    production: {
      email_from_address: process.env.FROM_EMAIL,
      email_to_address: process.env.TO_EMAIL,
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
