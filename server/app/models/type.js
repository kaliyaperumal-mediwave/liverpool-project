module.exports = function modelType(sequelize, types) {
  const Type = sequelize.define('Type', {
    name: {
      type: types.STRING(90),
    },
    description: {
      type: types.STRING(255),
    },
  }, {
    tableName: 'types',
  });
  return Type;
};
