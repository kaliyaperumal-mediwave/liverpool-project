module.exports = function modelType(sequelize, types) {
  const Section = sequelize.define('Section', {
    section: {
      type: types.INTEGER
    },
    description: {
      type: types.TEXT
    },
  }, {
    tableName: 'section',
  });
  return Section;
};
