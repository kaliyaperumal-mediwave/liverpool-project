


exports.eligibility = ctx => {
  const user = ctx.orm().User;
  var userid;
  if (ctx.request.body.type == "Child") {
    return user.create({
      need_interpreter: ctx.request.body.interpreter,
      provide_information: ctx.request.body.isInformation,
      registerd_gp: ctx.request.body.registerd_gp,
      user_section:1
    }).then((childUserInfo) => {
      childUserInfo.setType("1")
      const responseData = {
        userid: childUserInfo.id,
        status: "ok"
      }
      userid = childUserInfo.id
      return ctx.body = responseData;
    }).catch((error) => {

    });
  }
};

exports.about = ctx => {

  const user = ctx.orm().User;
  const userSection = ctx.orm();

  return user.update(
    {
      child_name: ctx.request.body.childName,
      child_NHS: ctx.request.body.childNHS,
      child_email: ctx.request.body.childEmail,
      child_contact_number: ctx.request.body.childContactNumber,

      child_address: ctx.request.body.childAddress,
      can_send_post: ctx.request.body.sendPost,

      child_gender: ctx.request.body.childGender,
      child_gender_birth: ctx.request.body.childGenderBirth,
      child_sexual_orientation: ctx.request.body.childSexualOrientation,

      child_household_name: ctx.request.body.houseHoldName,
      child_household_relationship: ctx.request.body.houseHoldRelationship,
      child_household_dob: ctx.request.body.houseHoldDOB,
      child_household_profession: ctx.request.body.houseHoldProfession,
      child_care_adult: ctx.request.body.childCareAdult,
      user_section:2
    },
    {
      where:
        { id: ctx.request.body.userId }
    }
  ).then((result) => {

    return user.create({
      parent_name: ctx.request.body.parentName,
      parential_responsibility: ctx.request.body.parentialResponsibility,
      child_parent_relationship: ctx.request.body.childParentRelationship,
      parent_contact_number: ctx.request.body.parentContactNumber,
      parent_email: ctx.request.body.parentEmail,
      parent_address: ctx.request.body.parentAddress,
      legal_care_status: ctx.request.body.legalCareStatus,
    }).then((parentUserInfo) => {

      parentUserInfo.setType("2")
      parentUserInfo.setParent(ctx.request.body.userId)
      const responseData = {
        userid: parentUserInfo.id,
        status: "ok"
      }
      return ctx.body = responseData;
    }).catch((error) => {

    });

  })

};



exports.profession = ctx => {

  const user = ctx.orm().User;

  return user.update(
    {
      child_profession: ctx.request.body.childProfession,
      child_education_place: ctx.request.body.childEducationPlace,
      child_EHCP: ctx.request.body.childEHCP,
      child_EHAT: ctx.request.body.childEHAT,

      child_socialworker: ctx.request.body.isSocialWorker,
      child_socialworker_name: ctx.request.body.socialWorkerName,
      child_socialworker_contact: ctx.request.body.socialWorkerContactNumber,
      user_section:3
    },
    {
      where:
        { id: ctx.request.body.userId }
    }
  ).then((result) => {

    const responseData = {
      userid: result,
      status: "ok"
    }
    return ctx.body = responseData;

  })

}




exports.signUpUser = ctx => {

  const responseData = {
    role: "child",
    interpreter: "no",
    childDob:'2020-10-09',
    camhsSelect:'yes',
    gp:"B"
  }


  console.log(ctx.request.body)
  return ctx.body = responseData;
return;
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

