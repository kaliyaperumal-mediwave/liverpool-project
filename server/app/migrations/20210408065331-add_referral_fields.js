'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    //Adding manual address field to save manual address
    queryInterface.renameColumn('referrals', 'manual_address', 'child_manual_address');
    queryInterface.renameColumn('referrals', 'contact_type', 'child_contact_type');

    queryInterface.addColumn(
      'referrals', // table name
      'parent_manual_address', // new field name
      {
        type: Sequelize.JSONB,
        allowNull: true,
      },
    ),
      queryInterface.addColumn(
        'referrals', // table name
        'professional_manual_address', // new field name
        {
          type: Sequelize.JSONB,
          allowNull: true,
        },
      ),
      queryInterface.addColumn(
        'referrals', // table name
        'child_education_manual_address', // new field name
        {
          type: Sequelize.JSONB,
          allowNull: true,
        },
      ),
      //Adding contact person type
      queryInterface.addColumn(
        'referrals', // table name
        'contact_person', // new field name
        {
          type: Sequelize.TEXT,
          allowNull: true,
        },
      ),
      //Adding contact detail type
      queryInterface.addColumn(
        'referrals', // table name
        'parent_contact_type', // new field name
        {
          type: Sequelize.TEXT,
          allowNull: true,
        },
      ),
      queryInterface.addColumn(
        'referrals', // table name
        'professional_contact_type', // new field name
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

    queryInterface.renameColumn('referrals', 'child_manual_address', 'manual_address');
    queryInterface.renameColumn('referrals', 'child_contact_type', 'contact_type');

    queryInterface.removeColumn('referrals', 'parent_manual_address');
    queryInterface.removeColumn('referrals', 'professional_manual_address');
    queryInterface.removeColumn('referrals', 'child_education_manual_address');
    queryInterface.removeColumn('referrals', 'contact_person');
    queryInterface.removeColumn('referrals', 'parent_contact_type');
    queryInterface.removeColumn('referrals', 'professional_contact_type');
  }
};
