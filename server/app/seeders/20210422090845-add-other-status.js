'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('referrals', 'referral_provider_other', { 
      type: Sequelize.DataTypes.TEXT,
      allowNull: true,
      after: 'referral_provider'
   });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('referrals', 'referral_provider_other');
  }
};
