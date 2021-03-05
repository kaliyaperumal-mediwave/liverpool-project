'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    queryInterface.renameColumn('referrals', 'child_name', 'child_firstname');
    queryInterface.renameColumn('referrals', 'parent_name', 'parent_firstname');
    queryInterface.renameColumn('referrals', 'professional_name', 'professional_firstname');
    queryInterface.renameColumn('referrals', 'responsibility_parent_name', 'responsibility_parent_firstname');
    queryInterface.addColumn(
      'referrals', // table name
      'child_lastname', // new field name
      {
        type: Sequelize.TEXT,
        allowNull: true,
      },
    ),
      queryInterface.addColumn(
        'referrals', // table name
        'parent_lastname', // new field name
        {
          type: Sequelize.TEXT,
          allowNull: true,
        },
      ),
      queryInterface.addColumn(
        'referrals', // table name
        'professional_lastname', // new field name
        {
          type: Sequelize.TEXT,
          allowNull: true,
        },
      ),
      queryInterface.addColumn(
        'referrals', // table name
        'responsibility_parent_lastname', // new field name
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
    queryInterface.renameColumn('referrals', 'child_firstname', 'child_name');
    queryInterface.renameColumn('referrals', 'parent_firstname', 'parent_name');
    queryInterface.renameColumn('referrals', 'professional_firstname', 'professional_name');
    queryInterface.renameColumn('referrals', 'responsibility_parent_firstname', 'responsibility_parent_name');
    queryInterface.removeColumn('referrals', 'child_lastname');
    queryInterface.removeColumn('referrals', 'parent_lastname');
    queryInterface.removeColumn('referrals', 'professional_lastname');
    queryInterface.removeColumn('referrals', 'responsibility_parent_lastname');
  }
};
