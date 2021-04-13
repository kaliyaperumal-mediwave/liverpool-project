const orm = require('./orm');
const db = orm.database();
const logger = require('./logger');

const typeInsert = require('./fixtures/type');
const orchaCredentialsInsert = require('./fixtures/orchaCredential')
//const sectionInsert = require('./fixtures/section');
db.sync({
  force: true,
})
  .then((success) => {
    db.Type.bulkCreate(typeInsert.types);
    db.Orcha.bulkCreate(orchaCredentialsInsert.orcha);
    console.log("success")

  })
  .catch((error) => {
    console.log(error)
    logger.info(error);
  });
