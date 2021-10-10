'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'appointments', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
      },
      ReferralId: {
        type: Sequelize.UUID,
        references: {
          model: 'referrals',
          key: 'uuid',
        }
      },
      status: {
        type: Sequelize.TEXT
      },
      service: {
        type: Sequelize.TEXT
      },
      date: {
        type: Sequelize.DATE
      },
      time: {
        type: Sequelize.TIME
      },
      otherInfo: {
        type: Sequelize.JSONB
      },
      automatic_booking: {
        type: Sequelize.JSONB
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      }
    })
  },
  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable('appointments');
  }
};
