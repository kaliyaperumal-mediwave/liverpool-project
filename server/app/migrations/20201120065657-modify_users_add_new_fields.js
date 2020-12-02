module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('users', 'child_household_name'),
      queryInterface.removeColumn('users', 'child_household_relationship'),
      queryInterface.removeColumn('users', 'child_household_dob'),
      queryInterface.removeColumn('users', 'child_household_profession'),
      queryInterface.addColumn(
        'users', // table name
        'household_member', // new field name
        {
          type: Sequelize.JSONB,
          allowNull: true,
        },
      ),
    ]);
  },

  down(queryInterface, Sequelize) {
    // logic for reverting the changes
    return Promise.all([
      queryInterface.addColumn(
        'users', // table name
        'child_household_name', // new field name
        {
          type: Sequelize.TEXT,
          allowNull: true,
        },
      ),
      queryInterface.addColumn(
        'users', // table name
        'child_household_relationship', // new field name
        {
          type: Sequelize.TEXT,
          allowNull: true,
        },
      ),
      queryInterface.addColumn(
        'users', // table name
        'child_household_dob', // new field name
        {
          type: Sequelize.DATE,
          allowNull: true,
        },
      ),
      queryInterface.addColumn(
        'users', // table name
        'child_household_profession', // new field name
        {
          type: Sequelize.TEXT,
          allowNull: true,
        },
      ),
      queryInterface.removeColumn('users', 'household_data'),
    ]);
  },
};