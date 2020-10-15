module.exports = function modelReferral(sequelize, types) {
    const Referral = sequelize.define('Referral', {
      referral_type: {
        type: types.STRING(20),
      },
      covid: {
        type: types.STRING(20),
      },
    }, {
      tableName: 'referrals',
    });
    return Referral;
  };
  