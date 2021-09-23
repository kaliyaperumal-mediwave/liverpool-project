'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('referrals', 'careLeaver', { 
      type: Sequelize.DataTypes.TEXT,
      allowNull: true,
   });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('referrals', 'careLeaver');
  }
};
