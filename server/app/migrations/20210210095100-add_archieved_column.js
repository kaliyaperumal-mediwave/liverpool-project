'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addColumn('referrals',
      'archived',
      {
        type: Sequelize.BOOLEAN,
      },
    )
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn('referrals', 'archived')
  }
};
