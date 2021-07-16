'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`update users set service_type = 'Alder Hey - Liverpool CAMHS' where service_type = 'Alder Hey - Liverpool CAMHS - EDYS'`);

    await queryInterface.sequelize.query(`update users set service_type = 'Alder Hey - Sefton CAMHS' where service_type = 'Alder Hey - Sefton CAMHS - EDYS'`);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`update users set service_type = 'Alder Hey - Liverpool CAMHS - EDYS' where service_type = 'Alder Hey - Liverpool CAMHS'`);

    await queryInterface.sequelize.query(`update users set service_type = 'Alder Hey - Sefton CAMHS - EDYS' where service_type = 'Alder Hey - Sefton CAMHS'`);
  }
};
