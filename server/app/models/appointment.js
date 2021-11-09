module.exports = function modelType(sequelize, types) {
  const appointments = sequelize.define('appointments', {
    ReferralId: {
      type: types.UUID,
      references: {
        model: sequelize.models.Referral,
        key: 'uuid',
      },
    },
    status: {
      type: types.TEXT
    },
    service: {
      type: types.TEXT
    },
    date: {
      type: types.DATE
    },
    time: {
      type: types.TIME
    },
    otherInfo: {
      type: types.JSONB
    },
    automatic_booking: {
      type: types.JSONB
    },
    alderhey_number: {
      type: types.TEXT
    },
  }, {
    tableName: 'appointments',
  });

  appointments.associate = models => {
    appointments.belongsTo(models.Referral, { foreignKey: "ReferralId" })
}

  return appointments;
};
