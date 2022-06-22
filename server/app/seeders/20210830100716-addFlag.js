'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('miscellaneousFlag', [{
      id: 1,
      flag: 'useApiService',
      value: 'true'
    },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('miscellaneousFlag', {
      flag: [
        'useApiService',
      ],
    });
  }
};
