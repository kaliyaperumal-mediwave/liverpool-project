'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    queryInterface.renameColumn('referrals', 'child_socialworker_name', 'child_socialworker_firstname');
    queryInterface.addColumn(
      'referrals', // table name
      'child_socialworker_lastname', // new field name
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
    queryInterface.renameColumn('referrals', 'child_socialworker_firstname', 'child_socialworker_name');
    queryInterface.removeColumn('referrals', 'child_socialworker_lastname');
  }
};
