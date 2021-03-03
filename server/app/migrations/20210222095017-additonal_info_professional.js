'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    queryInterface.addColumn(
      'referrals', // table name
      'professional_address', // new field name
      {
        type: Sequelize.TEXT,
        allowNull: true,
      },
    ),
      queryInterface.addColumn(
        'referrals', // table name
        'professional_profession', // new field name
        {
          type: Sequelize.TEXT,
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
    queryInterface.removeColumn('referrals', 'professional_address')
    queryInterface.removeColumn('referrals', 'professional_profession')
  }
};
