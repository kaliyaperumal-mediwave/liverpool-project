'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    [
      queryInterface.addColumn('referrals', 'child_ethnicity_other', {
        type: Sequelize.TEXT,
        allowNull: true,
      }),
    ]
  },

  down: async (queryInterface, Sequelize) => {
    [
      queryInterface.removeColumn('referrals', 'child_ethnicity_other'),
    ]
  }
};
