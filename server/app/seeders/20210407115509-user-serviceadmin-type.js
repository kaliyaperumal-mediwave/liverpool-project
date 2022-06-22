'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('users', 'service_type', { 
      type: Sequelize.DataTypes.TEXT,
      allowNull: true,
      after: 'session_token_expiry'
   });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('users', 'service_type');
  }
};
