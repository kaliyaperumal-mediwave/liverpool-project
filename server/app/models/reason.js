module.exports = function modelReferral(sequelize, types) {

  //   mental_health_diagnosis: ctx.request.body.referralData.diagnosis,
        //  diagnosis: ctx.request.body.diagnosisList,//--------------------diagnosis list for both mental and eating
        // diagnosis_other: ctx.request.body.referralData.diagnosisOther,
        //  symptoms_supportneeds: ctx.request.body.referralData.supportOrSymptoms,
        //  symptoms: ctx.request.body.problemsList,//--------------------symptoms list for both mental and eating 
       //   symptoms_other: ctx.request.body.referralData.problemsOther,

    const Reason = sequelize.define('Reason', {
      referral_type: {
        type: types.TEXT
      },
      is_covid: {
        type: types.TEXT
      },

      // mental_health_diagnosis: {
      //   type: types.TEXT
      // },

      // diagnosis: {
      //   type: types.JSONB
      // },

      // diagnosis_other: {
      //   type: types.TEXT
      // },
      // symptoms_supportneeds: {
      //   type: types.TEXT
      // },

      // symptoms: {
      //   type: types.JSONB
      // },

      // symptoms_other: {
      //   type: types.TEXT
      // },

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
      eating_disorder_difficulties:{
        type: types.JSONB
      },
      reason_for_referral:{
        type: types.JSONB
      },
      other_reasons_referral:{
        type: types.TEXT
      },
      food_fluid_intake:{
        type: types.TEXT
      },
      height:{
        type: types.TEXT
      },
      weight:{
        type: types.TEXT
      },
      other_eating_difficulties:{
        type: types.TEXT
      },
      referral_reason_details:{
        type: types.JSONB
      },
      about_our_service: {
        type: types.TEXT
      },
    }, {
      tableName: 'reasons',
    });


    return Reason;
  };
  