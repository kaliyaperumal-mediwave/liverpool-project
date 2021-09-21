'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'YoungFamily',
      {
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        ReferralId: {
          type: Sequelize.UUID,
          references: {
            model: 'referrals',
            key: 'uuid',
          },
        },
        FamilyId: {
          type: Sequelize.UUID,
          primaryKey: true,
        },
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable('YoungFamily');
  }
};
