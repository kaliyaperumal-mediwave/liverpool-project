'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addColumn(
      'users', // table name
      'password_verification_token', // new field name
      {
        type: Sequelize.TEXT,
        allowNull: true,
      },
    ),
      queryInterface.addColumn(
        'users', // table name
        'password_verification_expiry', // new field name
        {
          type: Sequelize.DATE,
          allowNull: true,
        },
      )
    queryInterface.addColumn(
      'users', // table name
      'email_verification_token', // new field name
      {
        type: Sequelize.TEXT,
        allowNull: true,
      },
    ),
      queryInterface.addColumn(
        'users', // table name
        'email_verification_expiry', // new field name
        {
          type: Sequelize.DATE,
          allowNull: true,
        },
      )
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn('users', 'email_verification_token'),
      queryInterface.removeColumn('users', 'email_verification_expiry')
    queryInterface.removeColumn('users', 'password_verification_token'),
      queryInterface.removeColumn('users', 'password_verification_expiry')
  }
};
