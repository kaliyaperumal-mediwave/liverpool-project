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
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('miscellaneousFlag');
  }
};
