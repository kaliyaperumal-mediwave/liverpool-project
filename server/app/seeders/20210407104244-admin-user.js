'use strict';
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash('Admin#123', saltRounds);
    return queryInterface.bulkInsert('users', [{
      first_name: 'Admin',
      last_name: 'User',
      uuid: uuidv4(),
      email: 'admin@mindwaveventures.com',
      password: hashedPassword,
      user_role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', {
      email: [
        'admin@mindwaveventures.com'
      ],
    });
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
