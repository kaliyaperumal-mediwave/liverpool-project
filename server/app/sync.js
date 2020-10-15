const orm = require('./orm');
const db = orm.database();
const logger = require('./logger');

const typeInsert = require('./fixtures/type');
db.sync({
    force: true,
  })
  .then((success)=>{
    db.Type.bulkCreate(typeInsert.types);
    console.log("success")

  })
  .catch((error) => {
    logger.info('error', error);
  });
