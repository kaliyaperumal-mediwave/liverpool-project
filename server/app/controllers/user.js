


exports.eligibility = ctx => {

  const user = ctx.orm().User;
  var userid;

  console.log(ctx.request.body);
  if (ctx.request.body.role == "child") {
    return user.create({
      need_interpreter: ctx.request.body.interpreter,
      child_dob:ctx.request.body.childDob,
      contact_parent:ctx.request.body.contactParent,
      registerd_gp: ctx.request.body.registerd_gp,
      user_section: 1
    }).then((childUserInfo) => {
      childUserInfo.setType("1")
      const responseData = {
        userid: childUserInfo.uuid,
        status: "ok",
      }
      return ctx.body = responseData;
    }).catch((error) => {

    });
  }
  else if (ctx.request.body.role == "parent") {
    return user.create({
      need_interpreter: ctx.request.body.interpreter,
      child_dob:ctx.request.body.childDob,
      consent_child: ctx.request.body.isInformation,
      registerd_gp: ctx.request.body.registerd_gp,
      user_section: 1
    }).then((childUserInfo) => {
      childUserInfo.setType("2")
      const responseData = {
        userid: childUserInfo.uuid,
        status: "ok"
      }
      return ctx.body = responseData;
    }).catch((error) => {

    });
  }

  else if (ctx.request.body.role == "professional") {
    return user.create({
      professional_name: ctx.request.body.profName,
      professional_email: ctx.request.body.profEmail,
      professional_contact_number: ctx.request.body.profContactNumber,
      child_dob:ctx.request.body.profChildDob,
      consent_parent: ctx.request.body.parentConcernInformation,
      consent_child: ctx.request.body.childConcernInformation,
      registerd_gp: ctx.request.body.profRegisterd_gp,
      user_section: 1
    }).then((childUserInfo) => {
      childUserInfo.setType("3")
      const responseData = {
        userid: childUserInfo.uuid,
        status: "ok"
      }
      return ctx.body = responseData;
    }).catch((error) => {

    });
  }
};

exports.about = ctx => {
  const user = ctx.orm().User;  
  console.log(ctx.request.body);
  if (ctx.request.body.role == "child") {

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
      child_ethnicity:ctx.request.body.childEthnicity,
      child_household_name: ctx.request.body.houseHoldName,
      child_household_relationship: ctx.request.body.houseHoldRelationship,
      child_household_dob: ctx.request.body.houseHoldDOB,
      child_household_profession: ctx.request.body.houseHoldProfession,
      child_care_adult: ctx.request.body.childCareAdult,
      user_section: 2
    },
    {
      where:
        { uuid: ctx.request.body.userid }
    }
  ).then((result) => {

    return user.findOne({
      where: {
        uuid: ctx.request.body.userid,
      },
      attributes: ['id', 'uuid']
    }).then((userResult) => {

      console.log(userResult.id +"====>"+userResult.uuid );
      return user.create({
        parent_name: ctx.request.body.parentName,
        parential_responsibility: ctx.request.body.parentialResponsibility,
        child_parent_relationship: ctx.request.body.childParentRelationship,
        parent_contact_number: ctx.request.body.parentContactNumber,
        parent_email: ctx.request.body.parentEmail,
        parent_same_house:ctx.request.body.parentSameHouse,
        parent_address: ctx.request.body.parentAddress,
        legal_care_status: ctx.request.body.legalCareStatus,
      }).then((parentUserInfo) => {
  
        parentUserInfo.setType("2")
        parentUserInfo.setParent(userResult.id)
        const responseData = {
          userid: ctx.request.body.userid,
          status: "ok",
          role:ctx.request.body.role
        }
        return ctx.body = responseData;
      }).catch((error) => {
  
      });

    })
  })
  }

  // else if(ctx.request.body.role == "parent")
  // {
  //   return user.update(
  //     {
  //       parent_name: ctx.request.body.parentName,
  //       parential_responsibility: ctx.request.body.parentialResponsibility,
  //       child_parent_relationship: ctx.request.body.childParentRelationship,
  //       parent_contact_number: ctx.request.body.parentContactNumber,
  //       parent_email: ctx.request.body.parentEmail,
  //       parent_same_house:ctx.request.body.parentSameHouse,
  //       parent_address: ctx.request.body.parentAddress,
  //       legal_care_status: ctx.request.body.legalCareStatus,
  //       user_section: 2
  //     },
  //     {
  //       where:
  //         { uuid: ctx.request.body.userid }
  //     }
  //   ).then((result) => {

  //     return user.findOne({
  //       where: {
  //         uuid: ctx.request.body.userid,
  //       },
  //       attributes: ['id', 'uuid']
  //     }).then((userResult) => {

  //       return user.create({
  //         child_name: ctx.request.body.childName,
  //         child_NHS: ctx.request.body.childNHS,
  //         child_email: ctx.request.body.childEmail,
  //         child_contact_number: ctx.request.body.childContactNumber,
  //         child_address: ctx.request.body.childAddress,
  //         can_send_post: ctx.request.body.sendPost,
  //         child_gender: ctx.request.body.childGender,
  //         child_gender_birth: ctx.request.body.childGenderBirth,
  //         child_sexual_orientation: ctx.request.body.childSexualOrientation,
  //         child_ethnicity:ctx.request.body.childEthnicity,
  //         child_household_name: ctx.request.body.houseHoldName,
  //         child_household_relationship: ctx.request.body.houseHoldRelationship,
  //         child_household_dob: ctx.request.body.houseHoldDOB,
  //         child_household_profession: ctx.request.body.houseHoldProfession,
  //         child_care_adult: ctx.request.body.childCareAdult,
  //       }).then((childUserInfo) => {
  //         childUserInfo.setType("1")
  //         childUserInfo.setParent(userResult.id)
  //         const responseData = {
  //           userid: ctx.request.body.userid,
  //           status: "ok",
  //           role:ctx.request.body.role
  //         }
  //         return ctx.body = responseData;
  //       }).catch((error) => {
  //       });
  //     })
  //   })
  // }

  else if(ctx.request.body.role == "parent")
  {
    return user.create(
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
        child_ethnicity:ctx.request.body.childEthnicity,
        child_household_name: ctx.request.body.houseHoldName,
        child_household_relationship: ctx.request.body.houseHoldRelationship,
        child_household_dob: ctx.request.body.houseHoldDOB,
        child_household_profession: ctx.request.body.houseHoldProfession,
        child_care_adult: ctx.request.body.childCareAdult,
      },
    ).then((childResult) => {
      childResult.setType("1")
      return user.findOne({
        where: {
          uuid: ctx.request.body.userid,
        },
        attributes: ['id', 'uuid']
      }).then((userResult) => {

        return user.update({
        parent_name: ctx.request.body.parentName,
        parential_responsibility: ctx.request.body.parentialResponsibility,
        child_parent_relationship: ctx.request.body.childParentRelationship,
        parent_contact_number: ctx.request.body.parentContactNumber,
        parent_email: ctx.request.body.parentEmail,
        parent_same_house:ctx.request.body.parentSameHouse,
        parent_address: ctx.request.body.parentAddress,
        legal_care_status: ctx.request.body.legalCareStatus,
        user_section: 2,
        },
        {
          where:
            { id: userResult.id }
        },
        
        ).then((parentResult) => {
          parentResult.setType("1")
          parentResult.setParent(userResult.id)
          const responseData = {
            userid: ctx.request.body.userid,
            status: "ok",
            role:ctx.request.body.role
          }
          return ctx.body = responseData;
        }).catch((error) => {
        });
      })
    })
  }

  // else if(ctx.request.body.role == "professional")
  // {
  //   return user.create(
  //     {
  //       parent_name: ctx.request.body.parentName,
  //       parential_responsibility: ctx.request.body.parentialResponsibility,
  //       child_parent_relationship: ctx.request.body.childParentRelationship,
  //       parent_contact_number: ctx.request.body.parentContactNumber,
  //       parent_email: ctx.request.body.parentEmail,
  //       parent_same_house:ctx.request.body.parentSameHouse,
  //       parent_address: ctx.request.body.parentAddress,
  //       legal_care_status: ctx.request.body.legalCareStatus,
  //     }).then((parentInfo) => {
  //       parentInfo.setType("2")
  //       return user.create({
  //         child_name: ctx.request.body.childName,
  //         child_NHS: ctx.request.body.childNHS,
  //         child_email: ctx.request.body.childEmail,
  //         child_contact_number: ctx.request.body.childContactNumber,
  //         child_address: ctx.request.body.childAddress,
  //         can_send_post: ctx.request.body.sendPost,
  //         child_gender: ctx.request.body.childGender,
  //         child_gender_birth: ctx.request.body.childGenderBirth,
  //         child_sexual_orientation: ctx.request.body.childSexualOrientation,
  //         child_ethnicity:ctx.request.body.childEthnicity,
  //         child_household_name: ctx.request.body.houseHoldName,
  //         child_household_relationship: ctx.request.body.houseHoldRelationship,
  //         child_household_dob: ctx.request.body.houseHoldDOB,
  //         child_household_profession: ctx.request.body.houseHoldProfession,
  //         child_care_adult: ctx.request.body.childCareAdult,
  //       }).then((childUserInfo) => {
  //         childUserInfo.setType("1")
  //         childUserInfo.setParent(parentInfo.id)

  //         return user.findOne({
  //           where: {
  //             uuid: ctx.request.body.userid,
  //           },
  //           attributes: ['id', 'uuid']
  //         }).then((userResult) => {
  //           childUserInfo.setProfessional(userResult.id)      
  //           return user.update(
  //             {user_section: 2},
  //             {where:{id:userResult.id} }
  //           ).then((result) => {
  //             const responseData = {
  //               userid: ctx.request.body.userid,
  //               status: "ok",
  //               role:ctx.request.body.role
  //             }
  //             return ctx.body = responseData;
  //           }).catch((error) => {
  //             console.log(error)
  //           });
  //         })
         

  //       }).catch((error) => {
    
  //       });
  //   })
  // }

  else if(ctx.request.body.role == "professional")
  {
    return user.create(
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
        child_ethnicity:ctx.request.body.childEthnicity,
        child_household_name: ctx.request.body.houseHoldName,
        child_household_relationship: ctx.request.body.houseHoldRelationship,
        child_household_dob: ctx.request.body.houseHoldDOB,
        child_household_profession: ctx.request.body.houseHoldProfession,
        child_care_adult: ctx.request.body.childCareAdult,
      }).then((childInfo) => {
        childInfo.setType("1")
        return user.create({
          parent_name: ctx.request.body.parentName,
          parential_responsibility: ctx.request.body.parentialResponsibility,
          child_parent_relationship: ctx.request.body.childParentRelationship,
          parent_contact_number: ctx.request.body.parentContactNumber,
          parent_email: ctx.request.body.parentEmail,
          parent_same_house:ctx.request.body.parentSameHouse,
          parent_address: ctx.request.body.parentAddress,
          legal_care_status: ctx.request.body.legalCareStatus,
        }).then((parentInfo) => {
          parentInfo.setType("2")
          return user.findOne({
            where: {
              uuid: ctx.request.body.userid,
            },
            attributes: ['id', 'uuid']
          }).then((userResult) => {
            console.log(userResult.id);
            childInfo.setParent(parentInfo.id)
            userResult.setProfessional(childInfo.id)      
            return user.update(
              {user_section: 2},
              {where:{id:userResult.id} }
            ).then((result) => {
              const responseData = {
                userid: ctx.request.body.userid,
                status: "ok",
                role:ctx.request.body.role
              }
              return ctx.body = responseData;
            }).catch((error) => {
              console.log(error)
            });
          })
         

        }).catch((error) => {
    
        });
    })
  }

};



exports.profession = ctx => {

  if(ctx.request.body.role == "professional")
  {
    const user = ctx.orm().User;
    return user.findOne({
      where: {
        uuid: ctx.request.body.userid,
      },
      attributes: ['id', 'uuid']
    }).then((result) => {
  
      return user.findAll({
        include: [
        {
          model: ctx.orm().User,
          nested: true,
          as: 'professional',
        },
        ],
        where: {
          id: result.id,
        },
      }).then((userResult) => {
  
        console.log(userResult[0].professional[0].ChildProfessional.professionalId)
  
        var childId=userResult[0].professional[0].ChildProfessional.professionalId
  
        return user.update(
          {
            child_profession: ctx.request.body.childProfession,
            child_education_place: ctx.request.body.childEducationPlace,
            child_EHCP: ctx.request.body.childEHCP,
            child_EHAT: ctx.request.body.childEHAT,
      
            child_socialworker: ctx.request.body.isSocialWorker,
            child_socialworker_name: ctx.request.body.socialWorkerName,
            child_socialworker_contact: ctx.request.body.socialWorkerContactNumber,
            //user_section: 3
          },
          {
            where:
              { id: childId }
          }
        ).then((updateResult) => {
  
          return user.update(
            {user_section: 3},
            {where:{id:result.id} }
          ).then((result) => {
            const responseData = {
              userid: ctx.request.body.userid,
              status: "ok",
              role:ctx.request.body.role
            }
            return ctx.body = responseData;
          }).catch((error) => {
            console.log(error)
          });
        })
      })
  
    })
  }
  else if(ctx.request.body.role == "parent")
  {
    return;
  }
  



  // const user = ctx.orm().User;

  // console.log(ctx.request.body);

  return user.update(
    {
      child_profession: ctx.request.body.childProfession,
      child_education_place: ctx.request.body.childEducationPlace,
      child_EHCP: ctx.request.body.childEHCP,
      child_EHAT: ctx.request.body.childEHAT,

      child_socialworker: ctx.request.body.isSocialWorker,
      child_socialworker_name: ctx.request.body.socialWorkerName,
      child_socialworker_contact: ctx.request.body.socialWorkerContactNumber,
      user_section: 3
    },
    {
      where:
        { id: ctx.request.body.userid }
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
    childDob: '2020-10-09',
    camhsSelect: 'yes',
    gp: "B"
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

