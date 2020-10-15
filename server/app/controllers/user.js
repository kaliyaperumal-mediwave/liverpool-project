


exports.eligibility = ctx => {

const user = ctx.orm().User;

if(ctx.request.body.type)

  user.create({
    name: ctx.request.body.name,
  }).then((childUserInfo) => {

  }).catch((error) => {
  });


  ctx.body = ctx;

};




exports.signUpUser = ctx => {

  const user = ctx.orm().User;
  const referral = ctx.orm().Referral;

  if (ctx.request.body.type == "child") {

      user.create({
        name: ctx.request.body.p_name,
      }).then((parentUserInfo) => {

        parentUserInfo.setType("2")

        referral.create({
          referral_type: ctx.request.body.ref_type,
          covid: ctx.request.body.isCovid,
        }).then((referralInfo) => {
  
          user.create({
            name: ctx.request.body.name,
          }).then((childUserInfo) => {

            childUserInfo.setType("1")
            childUserInfo.setParent(parentUserInfo.id)
            childUserInfo.setReferral(referralInfo.id)
            
          }).catch((error) => {
          });
        }).catch((error) => {
          console.log(error)
        });
      }).catch((error) => {
      });

  }
  else {


    user.create({
      name: ctx.request.body.prof_name,
    }).then((profUserInfo) => {
      profUserInfo.setType("3")
      user.create({
        name: ctx.request.body.p_name,
      }).then((parentUserInfo) => {

        parentUserInfo.setType("2")

        referral.create({
          referral_type: ctx.request.body.ref_type,
          covid: ctx.request.body.isCovid,
        }).then((referralInfo) => {
  
          user.create({
            name: ctx.request.body.name,
          }).then((childUserInfo) => {


            childUserInfo.setType("1")
            childUserInfo.setProfessional(profUserInfo.id)
            childUserInfo.setParent(parentUserInfo.id)
            childUserInfo.setReferral(referralInfo.id)
            
          }).catch((error) => {
          });
        }).catch((error) => {
          console.log(error)
        });
      }).catch((error) => {
      });

    }).catch((error) => {
    });

  }
  ctx.body = ctx;
};

