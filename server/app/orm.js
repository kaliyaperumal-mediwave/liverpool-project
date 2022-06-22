const config = require('./config');
module.exports = require('koa-orm')(config.orm);