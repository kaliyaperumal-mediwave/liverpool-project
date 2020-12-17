module.exports = function modelType(sequelize, types) {
    const User = sequelize.define('User', {
      name: {
        type: types.TEXT
      },
      description: {
        type: types.TEXT
      },
    }, {
      tableName: 'users',
    });
    return User;
  };
  