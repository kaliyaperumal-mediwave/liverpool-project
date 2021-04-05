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
      'contact_type', // new field name
      {
        type: Sequelize.TEXT,
        allowNull: true,
      },
    ),
    queryInterface.addColumn(
      'referrals', // table name
      'manual_address', // new field name
      {
        type: Sequelize.JSONB,
        allowNull: true,
      },
    ),
    queryInterface.addColumn(
      'referrals', // table name
      'sex_at_birth', // new field name
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
    queryInterface.removeColumn('referrals', 'contact_type'),
    queryInterface.removeColumn('referrals', 'manual_address'),
    queryInterface.removeColumn('referrals', 'sex_at_birth')
  }
};
