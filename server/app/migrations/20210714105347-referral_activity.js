'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.createTable('referralActivity', {
      id: Sequelize.INTEGER,
      uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primarykey: true,
        unique: true,
      },
      activity: {
        type: Sequelize.TEXT
      },
      otherInfo: {
        type: Sequelize.TEXT
      },
      doneBy: {
        type: Sequelize.UUID,
        references: {
          model: 'users',
          key: 'uuid',
        },
      },
      ReferralId: {
        type: Sequelize.UUID,
        references: {
          model: 'referrals',
          key: 'uuid',
        },
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('referralActivity');
  }
};

