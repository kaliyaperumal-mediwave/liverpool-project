const orm = require('./orm');
const db = orm.database();
const logger = require('./logger');

const typeInsert = require('./fixtures/type');
//const sectionInsert = require('./fixtures/section');
db.sync({
  force: true,
})
  .then((success) => {
    db.Type.bulkCreate(typeInsert.types);
    //db.Section.bulkCreate(sectionInsert.sections);
    console.log("success")

  })
  .catch((error) => {
    console.log(error)
    logger.info(error);
  });
