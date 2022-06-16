'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    [
      queryInterface.addColumn('referrals', 'is_child_gp', {
        type: Sequelize.DataTypes.TEXT,
        allowNull: true,
      }),
      queryInterface.addColumn('referrals', 'manual_gp', {
        type: Sequelize.DataTypes.TEXT,
        allowNull: true,
      }),
      queryInterface.addColumn('referrals', 'is_child_school', {
        type: Sequelize.DataTypes.TEXT,
        allowNull: true,
      }),
    ]
  },

  down: async (queryInterface, Sequelize) => {
    [
      queryInterface.removeColumn('referrals', 'is_child_gp'),
      queryInterface.removeColumn('referrals', 'manual_gp'),
      queryInterface.removeColumn('referrals', 'is_child_school')
    ]
  }
};
