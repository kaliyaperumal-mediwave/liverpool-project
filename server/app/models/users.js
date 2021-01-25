module.exports = function modelType(sequelize, types) {
  const User = sequelize.define('User', {
    uuid: {
      type: types.UUID,
      defaultValue: types.UUIDV4,
      primarykey: true,
      unique: true,
    },
    first_name: {
      type: types.TEXT
    },
    last_name: {
      type: types.TEXT
    },
    user_role: {
      type: types.TEXT
    },
    email: {
      type: types.TEXT
    },
    secondary_email: {
      type: types.TEXT
    },
    // email: {
    //   type: types.STRING,
    //   allowNull: false,
    //   notEmpty: true,
    //   validate: {
    //     isEmail: true
    //   },
    //   unique: {
    //     args: 'email',
    //     msg: 'The email is already taken!'
    //   }
    // },
    password: {
      type: types.TEXT,
    },
    password_verification_token: {
      type: types.TEXT,
    },
    password_verification_expiry: {
      type: types.DATE,
    },
    email_verification_token: {
      type: types.TEXT,
    },
    email_verification_expiry: {
      type: types.DATE,
    },
  }, {
    tableName: 'users',
  });
  return User;
};
