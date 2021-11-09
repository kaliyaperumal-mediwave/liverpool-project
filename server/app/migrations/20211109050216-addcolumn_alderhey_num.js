'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    [
      queryInterface.addColumn('appointments', 'alderhey_number', {
        type: Sequelize.TEXT,
        allowNull: true,
      }),
    ]
  },

  down: async (queryInterface, Sequelize) => {
    [
      queryInterface.removeColumn('appointments', 'alderhey_number'),
    ]
  }
};
