'use strict';

let orchaObj = {
  username: 'merseycare',
  password: 'Y6?Lp#F6nD?!PQrn',
  auth_token: '',
  createdAt: new Date(),
  updatedAt: new Date(),
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    await queryInterface.createTable('orcha', {
      id: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true,
      },
      username: {
        type: Sequelize.TEXT,
      },
      password: {
        type: Sequelize.TEXT,
      },
      auth_token: {
        type: Sequelize.TEXT,
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    }),

      await queryInterface.bulkInsert('orcha', [orchaObj], {})
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    queryInterface.dropTable('orcha')
  }
};
