'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('referrals', 'referral_status', { 
      type: Sequelize.DataTypes.TEXT,
      allowNull: false,
      defaultValue: 'Nothing',
      after: 'referral_complete_status'
   });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('referrals', 'referral_status');
  }
};
