module.exports = function modelUser(sequelize, types) {
  const User = sequelize.define('User', {

    uuid: {
      type: types.UUID,
      defaultValue: types.UUIDV4,
      primarykey: true,
      unique: true,
    },

    reference_code: {
      type: types.TEXT
    },

    child_name: {
      type: types.TEXT
    },
    parent_name: {
      type: types.TEXT
    },
    professional_name: {
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
    registerd_gp: {
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
    child_household_name: {
      type: types.TEXT
    },
    child_household_relationship: {
      type: types.TEXT
    },
    child_household_dob: {
      type: types.DATE
    },
    child_household_profession: {
      type: types.TEXT
    },
    child_care_adult: {
      type: types.TEXT
    },
    parent_name: {
      type: types.TEXT
    },

    parential_responsibility: {
      type: types.TEXT
    },

    responsibility_parent_name: {
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

    child_socialworker_name: {
      type: types.TEXT
    },

    child_socialworker_contact: {
      type: types.TEXT
    },
    //-----------
    user_section: {
      type: types.INTEGER
    },
    professional_email: {
      type: types.TEXT
    },
    professional_contact_number: {
      type: types.TEXT
    },
  }, {
    tableName: 'users',
  });

  User.belongsToMany(sequelize.models.Type, {
    as: 'type',
    through: 'UserType',
  });

  User.belongsToMany(sequelize.models.Referral, {
    as: 'referral',
    through: 'UserReferral',
  });

  User.belongsToMany(sequelize.models.Section, {
    as: 'section',
    through: 'UserSection',
  });

  User.belongsToMany(sequelize.models.Services, {
    as: 'services',
    through: 'ReferralServices',
  });

  User.belongsToMany(User, {
    as: 'parent',
    through: 'ChildParents',
  });

  User.belongsToMany(User, {
    as: 'professional',
    through: 'ChildProfessional',
  });



  return User;
};
