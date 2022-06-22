'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('types', [{
      id: 4,
      name: 'Child',
      description: 'Child',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 5,
      name: 'Parent',
      description: 'Parent',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 6,
      name: 'Professional',
      description: 'Professional',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  down: async (queryInterface, Sequelize) => {

    return queryInterface.bulkDelete('types', {
      name: [
        'Child',
        'Parent',
        'Professional',
      ],
    });
  }
};
