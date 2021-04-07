'use strict';
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash('Admin#123', saltRounds);
    return queryInterface.bulkInsert('users', [
      {
        first_name: 'Service Admin',
        last_name: 'YPAS',
        uuid: uuidv4(),
        email: 'selvakumar+ypas@mindwaveventures.com',
        password: hashedPassword,
        user_role: 'service_admin',
        service_type: 'ypas',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        first_name: 'Service Admin',
        last_name: 'Venus',
        uuid: uuidv4(),
        email: 'selvakumar+venus@mindwaveventures.com',
        password: hashedPassword,
        user_role: 'service_admin',
        service_type: 'venus',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        first_name: 'Service Admin',
        last_name: 'IAPTUS',
        uuid: uuidv4(),
        email: 'selvakumar+iaptus@mindwaveventures.com',
        password: hashedPassword,
        user_role: 'service_admin',
        service_type: 'iaptus',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        first_name: 'Service Admin',
        last_name: 'Others',
        uuid: uuidv4(),
        email: 'selvakumar+others@mindwaveventures.com',
        password: hashedPassword,
        user_role: 'service_admin',
        service_type: 'others',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', {
      email: [
        'selvakumar+ypas@mindwaveventures.com',
        'selvakumar+others@mindwaveventures.com',
        'selvakumar+iaptus@mindwaveventures.com',
        'selvakumar+venus@mindwaveventures.com'
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
