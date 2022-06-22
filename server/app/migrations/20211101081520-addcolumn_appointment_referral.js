'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    [
      queryInterface.addColumn('referrals', 'appointment_detail', {
        type: Sequelize.TEXT,
        allowNull: true,
      }),
    ]
  },

  down: async (queryInterface, Sequelize) => {
    [
      queryInterface.removeColumn('referrals', 'appointment_detail'),
    ]
  }
};
