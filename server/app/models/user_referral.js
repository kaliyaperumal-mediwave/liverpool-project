module.exports = function modelUser(sequelize, types) {
  const Referral = sequelize.define('Referral', {
    uuid: {
      type: types.UUID,
      defaultValue: types.UUIDV4,
      primarykey: true,
      unique: true,
    },
    login_id: {
      type: types.TEXT,
    },
    referral_progress: {
      type: types.INTEGER
    },
    reference_code: {
      type: types.TEXT,
      unique: true,
    },
    user_role: {
      type: types.TEXT
    },
    child_firstname: {
      type: types.TEXT
    },
    parent_firstname: {
      type: types.TEXT
    },
    professional_firstname: {
      type: types.TEXT
    },
    need_interpreter: {
      type: types.TEXT
    },
    child_dob: {
      type: types.DATE
    },
    // provide_information: {
    //   type: types.TEXT
    // },
    registered_gp: {
      type: types.TEXT
    },
    contact_parent: {
      type: types.TEXT
    },
    consent_child: {
      type: types.TEXT
    },
    consent_parent: {
      type: types.TEXT
    },
    child_NHS: {
      type: types.TEXT
    },
    child_email: {
      type: types.TEXT
    },
    child_contact_number: {
      type: types.TEXT
    },
    child_address: {
      type: types.TEXT
    },
    can_send_post: {
      type: types.TEXT
    },
    child_gender: {
      type: types.TEXT
    },
    child_gender_birth: {
      type: types.TEXT
    },
    child_sexual_orientation: {
      type: types.TEXT
    },
    child_ethnicity: {
      type: types.TEXT
    },
    // child_household_name: {
    //   type: types.TEXT
    // },
    // child_household_relationship: {
    //   type: types.TEXT
    // },
    // child_household_dob: {
    //   type: types.DATE
    // },
    // child_household_profession: {
    //   type: types.TEXT
    // },
    child_care_adult: {
      type: types.TEXT
    },
    parental_responsibility: {
      type: types.TEXT
    },
    responsibility_parent_firstname: {
      type: types.TEXT
    },
    child_parent_relationship: {
      type: types.TEXT
    },
    parent_contact_number: {
      type: types.TEXT
    },
    parent_email: {
      type: types.TEXT
    },
    parent_same_house: {
      type: types.TEXT
    },
    parent_address: {
      type: types.TEXT
    },
    legal_care_status: {
      type: types.TEXT
    },
    //-----------
    child_profession: {
      type: types.TEXT
    },
    child_education_place: {
      type: types.TEXT
    },
    child_EHCP: {
      type: types.TEXT
    },
    child_EHAT: {
      type: types.TEXT
    },
    child_socialworker: {
      type: types.TEXT
    },
    child_socialworker_firstname: {
      type: types.TEXT
    },
    child_socialworker_contact: {
      type: types.TEXT
    },
    //-----------
    professional_email: {
      type: types.TEXT
    },
    professional_contact_number: {
      type: types.TEXT
    },
    contact_preferences:{
      type: types.JSONB
    },
    household_member:{
      type: types.JSONB
    },
    referral_complete_status:{
      type: types.TEXT
    },
    referral_status: {
      type: types.TEXT,
      defaultValue: 'Nothing',
    },
    contact_parent_camhs:{
      type: types.TEXT
    },
    reason_contact_parent_camhs:{
      type: types.TEXT
    },
    referral_provider:{
      type: types.TEXT
    },
    referral_provider_other:{
      type: types.TEXT
    },
    professional_address:{
      type: types.TEXT
    },
    professional_profession:{
      type: types.TEXT
    },
    child_lastname: {
      type: types.TEXT
    },
    parent_lastname: {
      type: types.TEXT
    },
    professional_lastname: {
      type: types.TEXT
    },
    responsibility_parent_lastname: {
      type: types.TEXT
    },
    child_socialworker_lastname: {
      type: types.TEXT
    },
    child_name_title: {
      type: types.TEXT
    },
    service_location: {
      type: types.TEXT
    },
    selected_service: {
      type: types.TEXT
    },
    child_contact_type: {
      type: types.TEXT
    },
    child_manual_address: {
      type: types.JSONB
    },
    sex_at_birth: {
      type: types.TEXT
    },
    gp_school: {
      type: types.TEXT
    },
    parent_manual_address: {
      type: types.JSONB
    },
    professional_manual_address: {
      type: types.JSONB
    },
    child_education_manual_address: {
      type: types.JSONB
    },
    parent_contact_type: {
      type: types.TEXT
    },
    professional_contact_type: {
      type: types.TEXT
    },
    contact_person: {
      type: types.TEXT
    },
    parent_manual_address: {
      type: types.JSONB
    },
    professional_manual_address: {
      type: types.JSONB
    },
    child_education_manual_address: {
      type: types.JSONB
    },

    parent_contact_type: {
      type: types.TEXT
    },
    professional_contact_type: {
      type: types.TEXT
    },
    child_socialworker_contact_type: { 
      type: types.TEXT
    },
  }, {
    tableName: 'referrals',
  });
  Referral.belongsToMany(sequelize.models.Type, {
    as: 'type',
    through: 'UserType',
  });
  Referral.belongsToMany(sequelize.models.Reason, {
    as: 'referral_reason',
    through: 'UserReferralReason',
  });
  Referral.belongsToMany(Referral, {
    as: 'parent',
    through: 'ChildParents',
  });
  Referral.belongsToMany(Referral, {
    as: 'professional',
    through: 'ChildProfessional',
  });
  Referral.belongsToMany(Referral, {
    as: 'child_parent',
    through: 'ChildParents',
    foreignKey: 'parentId',
  });
  Referral.belongsToMany(Referral, {
    as: 'child_professional',
    through: 'ChildProfessional',
    foreignKey: 'professionalId'
  });
  return Referral;
};