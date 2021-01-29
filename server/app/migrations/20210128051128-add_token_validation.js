'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addColumn(
      'users', // table name
      'session_token', // new field name
      {
        type: Sequelize.TEXT,
        allowNull: true,
      },
    ),
      queryInterface.addColumn(
        'users', // table name
        'session_token_expiry', // new field name
        {
          type: Sequelize.DATE,
          allowNull: true,
        },
      )
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    queryInterface.removeColumn('users', 'session_token'),
    queryInterface.removeColumn('users', 'session_token_expiry')
  }
};
