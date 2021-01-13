'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    queryInterface.removeColumn('reasons', 'mental_health_diagnosis'),
    queryInterface.removeColumn('reasons', 'symptoms_supportneeds'),
    queryInterface.addColumn(
      'reasons', // table name
      'Eating_disorder_difficulties', // new field name
      {
        type: Sequelize.JSONB,
        allowNull: true,
      },
    ),
    queryInterface.addColumn(
      'reasons', // table name
      'food_fluid_intake', // new field name
      {
        type: Sequelize.TEXT,
        allowNull: true,
      },
    ),
    queryInterface.addColumn(
      'reasons', // table name
      'height', // new field name
      {
        type: Sequelize.TEXT,
        allowNull: true,
      },
    ),
    queryInterface.addColumn(
      'reasons', // table name
      'weight', // new field name
      {
        type: Sequelize.TEXT,
        allowNull: true,
      },
    )
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    queryInterface.addColumn(
      'reasons', // table name
      'mental_health_diagnosis', // new field name
      {
        type: Sequelize.JSONB,
        allowNull: true,
      },
    ),
    queryInterface.addColumn(
      'reasons', // table name
      'symptoms_supportneeds', // new field name
      {
        type: Sequelize.TEXT,
        allowNull: true,
      },
    ),
    queryInterface.removeColumn('reasons', 'food_fluid_intake'),
    queryInterface.removeColumn('reasons', 'height'),
    queryInterface.removeColumn('reasons', 'weight')
  }
};
