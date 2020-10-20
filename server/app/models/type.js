module.exports = function modelType(sequelize, types) {
  const Type = sequelize.define('Type', {
    name: {
      type: types.TEXT
    },
    description: {
      type: types.TEXT
    },
  }, {
    tableName: 'types',
  });
  return Type;
};
