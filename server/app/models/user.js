module.exports = function modelUser(sequelize, types) {
    const User = sequelize.define('User', { 
        name: {
            type: types.STRING(90),
          },
    },{
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
