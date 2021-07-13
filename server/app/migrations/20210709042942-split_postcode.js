'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addColumn(
      'referrals', // table name
      'registered_gp_postcode', // new field name
      {
        type: Sequelize.TEXT,
        allowNull: true,
      },
    ),
    queryInterface.addColumn(
      'referrals', // table name
      'child_address_postcode', // new field name
      {
        type: Sequelize.TEXT,
        allowNull: true,
      },
    ),
    queryInterface.addColumn(
      'referrals', // table name
      'parent_address_postcode', // new field name
      {
        type: Sequelize.TEXT,
        allowNull: true,
      },
    ),
    queryInterface.addColumn(
      'referrals', // table name
      'professional_address_postcode', // new field name
      {
        type: Sequelize.TEXT,
        allowNull: true,
      },
    ),
    queryInterface.addColumn(
      'referrals', // table name
      'child_education_place_postcode', // new field name
      {
        type: Sequelize.TEXT,
        allowNull: true,
      },
    )
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn('referrals', 'registered_gp_postcode');
    queryInterface.removeColumn('referrals', 'child_address_postcode');
    queryInterface.removeColumn('referrals', 'parent_address_postcode');
    queryInterface.removeColumn('referrals', 'professional_address_postcode');
    queryInterface.removeColumn('referrals', 'child_education_place_postcode');
  }
};
