module.exports = function modelType(sequelize, types) {
    const Services = sequelize.define('Services', {
      service_name: {
        type: types.TEXT
      },
      professional_name: {
        type: types.TEXT
      },
      professional_contact_number: {
        type: types.TEXT
      },
    }, {
      tableName: 'services',
    });
    return Services;
  };
  