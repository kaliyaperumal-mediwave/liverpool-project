module.exports = function modelType(sequelize, types) {
  const Type = sequelize.define('appointment', {
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
  }, {
    tableName: 'appointments',
  });
  return Type;
};
