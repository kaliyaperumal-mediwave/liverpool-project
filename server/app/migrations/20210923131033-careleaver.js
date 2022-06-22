'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    [
      queryInterface.addColumn('referrals', 'careLeaver', {
        type: Sequelize.DataTypes.TEXT,
        allowNull: true,
      }),
      queryInterface.addColumn('referrals', 'referral_type', {
        type: Sequelize.DataTypes.TEXT,
        allowNull: true,
        defaultValue:'child'
      }),
      queryInterface.addColumn('reasons', 'about_our_service', {
        type: Sequelize.DataTypes.TEXT,
        allowNull: true,
      }),
    ]
  },

  down: async (queryInterface, Sequelize) => {
    [
      queryInterface.removeColumn('referrals', 'careLeaver'),
      queryInterface.removeColumn('referrals', 'referral_type'),
      queryInterface.removeColumn('reasons', 'about_our_service')
    ]
  }
};
