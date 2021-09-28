'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('types', [{
      id: 7,
      name: 'Young_Person',
      description: 'Young_Person',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 8,
      name: 'Family_Friends',
      description: 'Family_Friends',
      createdAt: new Date(),
      updatedAt: new Date()
    },
  ]);
  },

  down: async (queryInterface, Sequelize) => {

    return queryInterface.bulkDelete('types', {
      name: [
        'Young_Person',
        'Family_Friends',
      ],
    });
  }
};
