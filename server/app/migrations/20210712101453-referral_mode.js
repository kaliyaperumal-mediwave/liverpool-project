'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
     queryInterface.addColumn(
      'referrals', // table name
      'referral_mode', // new field name
      {
        type: Sequelize.TEXT,
        allowNull: true,
      },
    )
  },

  down: async (queryInterface, Sequelize) => {
     queryInterface.removeColumn('referrals', 'referral_mode');
  }
};
