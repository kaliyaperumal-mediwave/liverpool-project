'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    [
      queryInterface.addColumn('reasons', 'referral_reason_details', {
        type: Sequelize.JSONB,
        allowNull: true,
      }),
    ]
  },
  down: async (queryInterface, Sequelize) => {
    [
      queryInterface.removeColumn('reasons', 'referral_reason_details'),
    ]
  }
};
