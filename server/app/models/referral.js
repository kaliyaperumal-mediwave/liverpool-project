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

      diagnosis: {
        type: types.JSONB
      },

      symptoms_supportneeds: {
        type: types.TEXT
      },

      symptoms: {
        type: types.JSONB
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

      local_services:{
        type: types.JSONB
      },

      currently_accessing_services:{
        type: types.TEXT
      },

     services:{
        type: types.JSONB
      },

    }, {
      tableName: 'referrals',
    });


    return Referral;
  };
  