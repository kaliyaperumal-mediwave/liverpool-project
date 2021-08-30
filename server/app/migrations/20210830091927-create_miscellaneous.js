'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('miscellaneousFlag', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
      },
      flag: {
        type: Sequelize.TEXT,
        unique: true,
      },
      value: {
        type: Sequelize.TEXT
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('miscellaneousFlag');
  }
};
