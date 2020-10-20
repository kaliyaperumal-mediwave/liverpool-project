module.exports = function modelReferral(sequelize, types) {
    const Referral = sequelize.define('Referral', {
      referral_type: {
        type: types.TEXT
      },
      is_covid: {
        type: types.TEXT
      },
      mental_health_diagnosis: {
        type: types.TEXT
      },
      symptoms_supportneeds: {
        type: types.TEXT
      },
      mental_diagnosis: {
        type: types.TEXT
      },
      eating_diagnosis: {
        type: types.TEXT
      },
      referral_issues:{
        type: types.TEXT
      },
      has_anything_helped:{
        type: types.TEXT
      },
      any_particular_trigger:{
        type: types.TEXT
      },
      disabilities:{
        type: types.TEXT
      },
      any_other_services:{
        type: types.TEXT
      },
      other_services:{
        type: types.TEXT
      },

    }, {
      tableName: 'referrals',
    });
    return Referral;
  };
  