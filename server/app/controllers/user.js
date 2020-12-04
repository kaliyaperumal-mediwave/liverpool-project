const P = require("pino");
var uniqid = require('uniqid');
const sequalizeErrorHandler = require('../middlewares/errorHandler');

exports.eligibility = ctx => {

  const user = ctx.orm().User;
  var userid;

  console.log(ctx.request.body);

  if (ctx.request.body.role == "child") {
    if (ctx.request.body.editFlag != null) {
      return user.update({
        need_interpreter: ctx.request.body.interpreter,
        child_dob: ctx.request.body.childDob,
        contact_parent: ctx.request.body.contactParent,
        consent_child: ctx.request.body.isInformation,
        registerd_gp: ctx.request.body.registerd_gp,
      },
        {
          where:
            { uuid: ctx.request.body.uuid }
        }
      ).then((childUserInfo) => {
        //  childUserInfo.setType("1")
        const responseData = {
          userid: ctx.request.body.uuid,
          status: "ok",
        }
        return ctx.body = responseData;
      }).catch((error) => {
        console.log(error)
      });
    }
    else {
      return user.create({
        need_interpreter: ctx.request.body.interpreter,
        child_dob: ctx.request.body.childDob,
        contact_parent: ctx.request.body.contactParent,
        consent_child: ctx.request.body.isInformation,
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

  }
  else if (ctx.request.body.role == "parent") {
    if (ctx.request.body.editFlag != null) {
      return user.findOne({
        where: {
          uuid: ctx.request.body.uuid,
        },
        attributes: ['id', 'uuid']
      }).then((result) => {
        return user.findAll({
          include: [
            {
              model: ctx.orm().User,
              nested: true,
              as: 'parent',
            },
          ],
          where: {
            id: result.id,
          },
        }).then((userResult) => {

          var childId = userResult[0].parent[0].ChildParents.parentId;
          return user.update({
            child_dob: ctx.request.body.childDob,
            registerd_gp: ctx.request.body.registerd_gp,
          },
            {
              where:
                { id: childId }
            }).then((childUserInfo) => {
              return user.update({
                need_interpreter: ctx.request.body.interpreter,
                consent_child: ctx.request.body.isInformation,
              },
                {
                  where:
                    { uuid: ctx.request.body.uuid }
                }).then((parentUserInfo) => {
                  const responseData = {
                    userid: ctx.request.body.uuid,
                    status: "ok",
                  }
                  return ctx.body = responseData;
                })
            })
        })
      })
    }
    else {
      return user.create({
        child_dob: ctx.request.body.childDob,
        registerd_gp: ctx.request.body.registerd_gp,
      }).then((childUserInfo) => {
        childUserInfo.setType("1")
        return user.create({
          need_interpreter: ctx.request.body.interpreter,
          consent_child: ctx.request.body.isInformation,
          user_section: 1
        }).then((parentUserInfo) => {
          parentUserInfo.setType("2")
          parentUserInfo.setParent(childUserInfo.id)
          const responseData = {
            userid: parentUserInfo.uuid,
            status: "ok"
          }
          return ctx.body = responseData;
        }).catch((error) => {

        });
      }).catch((error) => {
      });

    }
  }

  else if (ctx.request.body.role == "professional") {
    console.log(ctx.request.body);
    if (ctx.request.body.editFlag != null) {

      return user.findOne({
        where: {
          uuid: ctx.request.body.uuid,
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

          var childId = userResult[0].professional[0].ChildProfessional.professionalId;
          return user.update({
            child_dob: ctx.request.body.profChildDob,
            registerd_gp: ctx.request.body.profRegisterd_gp,
          },
            {
              where:
                { id: childId }
            }).then((childUserInfo) => {
              return user.update({
                professional_name: ctx.request.body.profName,
                professional_email: ctx.request.body.profEmail,
                professional_contact_number: ctx.request.body.profContactNumber,
                consent_parent: ctx.request.body.contactProfParent,
                consent_child: ctx.request.body.parentConcernInformation,
              },
                {
                  where:
                    { uuid: ctx.request.body.uuid }
                }).then((parentUserInfo) => {
                  const responseData = {
                    userid: ctx.request.body.uuid,
                    status: "ok",
                  }
                  return ctx.body = responseData;
                })
            })


        })
      })
    }
    else {
      return user.create({
        child_dob: ctx.request.body.profChildDob,
        registerd_gp: ctx.request.body.profRegisterd_gp,
      }).then((childUserInfo) => {
        childUserInfo.setType("1")
        return user.create({
          professional_name: ctx.request.body.profName,
          professional_email: ctx.request.body.profEmail,
          professional_contact_number: ctx.request.body.profContactNumber,
          consent_parent: ctx.request.body.contactProfParent,
          consent_child: ctx.request.body.parentConcernInformation,
          user_section: 1
        }).then((professionalUserInfo) => {
          professionalUserInfo.setType("3")
          professionalUserInfo.setProfessional(childUserInfo.id)
          const responseData = {
            userid: professionalUserInfo.uuid,
            status: "ok"
          }
          return ctx.body = responseData;
        }).catch((error) => {

        });
      }).catch((error) => {
      });
    }
  }
};


exports.fetchEligibility = ctx => {
  const user = ctx.orm().User;
  if (ctx.request.body.role == "child") {
    return user.findOne({
      where: {
        uuid: ctx.request.body.uuid,
      },
      attributes: ['id', 'uuid']
    }).then((result) => {

      return user.findOne({
        where: {
          id: result.id,
        },
      }).then((userResult) => {

        return ctx.body = userResult;

      })

    })
  }
  else if (ctx.request.body.role == "parent") {
    return user.findOne({
      where: {
        uuid: ctx.request.body.uuid,
      },
      attributes: ['id', 'uuid']
    }).then((result) => {

      return user.findAll({
        include: [
          {
            model: ctx.orm().User,
            nested: true,
            as: 'parent',
          },
        ],
        where: {
          id: result.id,
        },
      }).then((userResult) => {

        return ctx.body = userResult;

      })

    })
  }

  else if (ctx.request.body.role == "professional") {
    return user.findOne({
      where: {
        uuid: ctx.request.body.uuid,
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

        return ctx.body = userResult;

      })

    })
  }
}


exports.about = ctx => {
  const user = ctx.orm().User;
  console.log(ctx.request.body.aboutData.nhsNumber);

  if (ctx.request.body.role == "child") {

    if (ctx.request.body.editFlag != null) {
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
              as: 'parent',
            },
          ],
          where: {
            id: result.id,
          },
        }).then((userResult) => {

          var parentid = userResult[0].parent[0].ChildParents.parentId
          return user.update(
            {
              child_name: ctx.request.body.aboutData.childName,
              child_NHS: ctx.request.body.aboutData.nhsNumber,
              child_email: ctx.request.body.aboutData.childEmail,
              child_contact_number: ctx.request.body.aboutData.childContactNumber,
              child_address: ctx.request.body.aboutData.childAddress,
              can_send_post: ctx.request.body.aboutData.sendPost,
              child_gender: ctx.request.body.aboutData.childGender,
              child_gender_birth: ctx.request.body.aboutData.childIdentity,
              child_sexual_orientation: ctx.request.body.aboutData.childSexualOrientation,
              child_ethnicity: ctx.request.body.aboutData.childEthnicity,
              // parential_responsibility: ctx.request.body.aboutData.parentialResponsibility,
              // child_household_name: ctx.request.body.houseHoldName,
              // child_household_relationship: ctx.request.body.houseHoldRelationship,
              // child_household_dob: ctx.request.body.childHouseHoldDob,
              household_member: ctx.request.body.allHouseHoldMembers,
              child_household_profession: ctx.request.body.aboutData.houseHoldProfession,
              child_care_adult: ctx.request.body.aboutData.childCareAdult,
            },
            {
              where:
                { id: result.id }
            }
          ).then((result) => {

            return user.update(
              {
                parent_name: ctx.request.body.aboutData.parentName,
                parential_responsibility: ctx.request.body.aboutData.parentialResponsibility,
                responsibility_parent_name: ctx.request.body.aboutData.parentCarerName,
                child_parent_relationship: ctx.request.body.aboutData.relationshipToYou,
                parent_contact_number: ctx.request.body.aboutData.contactNumber,
                parent_email: ctx.request.body.aboutData.emailAddress,
                parent_same_house: ctx.request.body.aboutData.sameHouse,
                parent_address: ctx.request.body.aboutData.parentOrCarrerAddress,
                legal_care_status: ctx.request.body.aboutData.legalCareStatus,


              },
              {
                where:
                  { id: parentid }
              }
            ).then((result) => {

              const responseData = {
                userid: ctx.request.body.userid,
                status: "ok",
                role: ctx.request.body.role
              }
              return ctx.body = responseData;
            })

          })
        })

      })
    }

    else {

      return user.update(
        {
          child_name: ctx.request.body.aboutData.childName,
          child_NHS: ctx.request.body.aboutData.nhsNumber,
          child_email: ctx.request.body.aboutData.childEmail,
          child_contact_number: ctx.request.body.aboutData.childContactNumber,
          child_address: ctx.request.body.aboutData.childAddress,
          can_send_post: ctx.request.body.aboutData.sendPost,
          child_gender: ctx.request.body.aboutData.childGender,
          child_gender_birth: ctx.request.body.aboutData.childIdentity,
          child_sexual_orientation: ctx.request.body.aboutData.childSexualOrientation,
          child_ethnicity: ctx.request.body.aboutData.childEthnicity,
          // parential_responsibility: ctx.request.body.aboutData.parentialResponsibility,
          // child_household_name: ctx.request.body.houseHoldName,
          // child_household_relationship: ctx.request.body.houseHoldRelationship,
          // child_household_dob: ctx.request.body.childHouseHoldDob,
          household_member: ctx.request.body.allHouseHoldMembers,
          child_household_profession: ctx.request.body.aboutData.houseHoldProfession,
          child_care_adult: ctx.request.body.aboutData.childCareAdult,
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

          console.log(userResult.id + "====>" + userResult.uuid);
          return user.create({
            parent_name: ctx.request.body.aboutData.parentName,
            parential_responsibility: ctx.request.body.aboutData.parentialResponsibility,
            responsibility_parent_name: ctx.request.body.aboutData.parentCarerName,
            child_parent_relationship: ctx.request.body.aboutData.relationshipToYou,
            parent_contact_number: ctx.request.body.aboutData.contactNumber,
            parent_email: ctx.request.body.aboutData.emailAddress,
            parent_same_house: ctx.request.body.aboutData.sameHouse,
            parent_address: ctx.request.body.aboutData.parentOrCarrerAddress,
            legal_care_status: ctx.request.body.aboutData.legalCareStatus,
          }).then((parentUserInfo) => {

            parentUserInfo.setType("2")
            userResult.setParent(parentUserInfo.id)
            const responseData = {
              userid: ctx.request.body.userid,
              status: "ok",
              role: ctx.request.body.role
            }
            return ctx.body = responseData;
          }).catch((error) => {

          });

        })
      })

    }
  }
  else if (ctx.request.body.role == "parent") {
    console.log(ctx.request.body)


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
            as: 'parent',
          },
        ],
        where: {
          id: result.id,
        },
      }).then((userResult) => {
        var childId = userResult[0].parent[0].ChildParents.parentId
        console.log(ctx.request.body.allHouseHoldMembers)
        return user.update(
          {
            child_name: ctx.request.body.aboutData.childName,
            child_NHS: ctx.request.body.aboutData.nhsNumber,
            child_email: ctx.request.body.aboutData.childEmail,
            child_contact_number: ctx.request.body.aboutData.childContactNumber,
            child_address: ctx.request.body.aboutData.childAddress,
            can_send_post: ctx.request.body.aboutData.sendPost,
            child_gender: ctx.request.body.aboutData.childGender,
            child_gender_birth: ctx.request.body.aboutData.childIdentity,
            child_sexual_orientation: ctx.request.body.aboutData.childSexualOrientation,
            child_ethnicity: ctx.request.body.aboutData.childEthnicity,
            parential_responsibility: ctx.request.body.aboutData.parentialResponsibility,
            // child_household_name: ctx.request.body.houseHoldName,
            // child_household_relationship: ctx.request.body.houseHoldRelationship,
            // child_household_dob: ctx.request.body.childHouseHoldDob,
            household_member: ctx.request.body.allHouseHoldMembers,
            child_household_profession: ctx.request.body.aboutData.houseHoldProfession,
            child_care_adult: ctx.request.body.aboutData.childCareAdult,
          },
          {
            where:
              { id: childId }
          }
        ).then((updateResult) => {

          // var  parentName;
          // var parentEmail;
          // var parentSameHouse;
          // var childParentRelationship;
          // var parentContactNumber;
          // var parentAddress;
          // if(ctx.request.body.aboutData.parentialResponsibility=="no")
          // {
          //   parentName = ctx.request.body.aboutData.parentCarerName;
          //   parentEmail = ctx.request.body.aboutData.emailAddress;
          //   parentSameHouse = ctx.request.body.aboutData.sameHouse;
          //   childParentRelationship = ctx.request.body.aboutData.relationshipToYou;
          //   parentContactNumber = ctx.request.body.aboutData.contactNumber;
          // }
          // else 
          // {
          //   parentName = ctx.request.body.aboutData.parentCarerName;
          //   parentEmail = ctx.request.body.aboutData.emailAddress;
          //   parentSameHouse = ctx.request.body.aboutData.sameHouse;
          //   childParentRelationship = ctx.request.body.aboutData.relationshipToYou;
          //   parentContactNumber = ctx.request.body.aboutData.contactNumber;
          // }
          return user.update({
            parent_name: ctx.request.body.aboutData.parentName,
            parential_responsibility: ctx.request.body.aboutData.parentialResponsibility,
            responsibility_parent_name: ctx.request.body.aboutData.parentCarerName,
            child_parent_relationship: ctx.request.body.aboutData.relationshipToYou,
            parent_contact_number: ctx.request.body.aboutData.contactNumber,
            parent_email: ctx.request.body.aboutData.emailAddress,
            parent_same_house: ctx.request.body.aboutData.sameHouse,
            parent_address: ctx.request.body.aboutData.parentOrCarrerAddress,
            legal_care_status: ctx.request.body.aboutData.legalCareStatus,
            user_section: 2,
          },
            {
              where:
                { id: result.id }
            },
          ).then((parentResult) => {
            const responseData = {
              userid: ctx.request.body.userid,
              status: "ok",
              role: ctx.request.body.role
            }
            return ctx.body = responseData;
          })
        })
      })

    })
  }

  else if (ctx.request.body.role == "professional") {
    if (ctx.request.body.editFlag != null) {
      console.log(ctx.request.body)
      // return ctx.body = ctx.request.body;
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
          var childId = userResult[0].professional[0].ChildProfessional.professionalId
          return user.update(
            {
              child_name: ctx.request.body.aboutData.childName,
              child_NHS: ctx.request.body.aboutData.nhsNumber,
              child_email: ctx.request.body.aboutData.childEmail,
              child_contact_number: ctx.request.body.aboutData.childContactNumber,
              child_address: ctx.request.body.aboutData.childAddress,
              can_send_post: ctx.request.body.aboutData.sendPost,
              child_gender: ctx.request.body.aboutData.childGender,
              child_gender_birth: ctx.request.body.aboutData.childIdentity,
              child_sexual_orientation: ctx.request.body.aboutData.childSexualOrientation,
              child_ethnicity: ctx.request.body.aboutData.childEthnicity,
              parential_responsibility: ctx.request.body.aboutData.parentialResponsibility,
              // child_household_name: ctx.request.body.houseHoldName,
              // child_household_relationship: ctx.request.body.houseHoldRelationship,
              // child_household_dob: ctx.request.body.childHouseHoldDob,
              household_member: ctx.request.body.allHouseHoldMembers,
              child_household_profession: ctx.request.body.aboutData.houseHoldProfession,
              child_care_adult: ctx.request.body.aboutData.childCareAdult,
            },
            {
              where:
                { id: childId }
            }
          ).then((updateResult) => {


            return user.findOne({
              where: {
                uuid: ctx.request.body.aboutData.parentUUID,
              },
              attributes: ['id', 'uuid']
            }).then((result) => {

              return user.update({
                parent_name: ctx.request.body.aboutData.parentName,
                parential_responsibility: ctx.request.body.aboutData.parentialResponsibility,
                responsibility_parent_name: ctx.request.body.aboutData.parentCarerName,
                child_parent_relationship: ctx.request.body.aboutData.relationshipToYou,
                parent_contact_number: ctx.request.body.aboutData.contactNumber,
                parent_email: ctx.request.body.aboutData.emailAddress,
                parent_same_house: ctx.request.body.aboutData.sameHouse,
                parent_address: ctx.request.body.aboutData.parentOrCarrerAddress,
                legal_care_status: ctx.request.body.aboutData.legalCareStatus,
              },
                {
                  where:
                    { id: result.id }
                }
              ).then((parentResult) => {

                const responseData = {
                  userid: ctx.request.body.userid,
                  status: "ok",
                  role: ctx.request.body.role
                }
                return ctx.body = responseData;
              })

            })

          })
        })
      })
    }
    else {

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
          var childId = userResult[0].professional[0].ChildProfessional.professionalId
          return user.update(
            {
              child_name: ctx.request.body.aboutData.childName,
              child_NHS: ctx.request.body.aboutData.nhsNumber,
              child_email: ctx.request.body.aboutData.childEmail,
              child_contact_number: ctx.request.body.aboutData.childContactNumber,
              child_address: ctx.request.body.aboutData.childAddress,
              can_send_post: ctx.request.body.aboutData.sendPost,
              child_gender: ctx.request.body.aboutData.childGender,
              child_gender_birth: ctx.request.body.aboutData.childIdentity,
              child_sexual_orientation: ctx.request.body.aboutData.childSexualOrientation,
              child_ethnicity: ctx.request.body.aboutData.childEthnicity,
              // parential_responsibility: ctx.request.body.aboutData.parentialResponsibility,
              // child_household_name: ctx.request.body.houseHoldName,
              // child_household_relationship: ctx.request.body.houseHoldRelationship,
              // child_household_dob: ctx.request.body.childHouseHoldDob,
              household_member: ctx.request.body.allHouseHoldMembers,
              child_household_profession: ctx.request.body.aboutData.houseHoldProfession,
              child_care_adult: ctx.request.body.aboutData.childCareAdult,
            },
            {
              where:
                { id: childId }
            }
          ).then((updateResult) => {

            return user.create({
              parent_name: ctx.request.body.aboutData.parentName,
              parential_responsibility: ctx.request.body.aboutData.parentialResponsibility,
              responsibility_parent_name: ctx.request.body.aboutData.parentCarerName,
              child_parent_relationship: ctx.request.body.aboutData.relationshipToYou,
              parent_contact_number: ctx.request.body.aboutData.contactNumber,
              parent_email: ctx.request.body.aboutData.emailAddress,
              parent_same_house: ctx.request.body.aboutData.sameHouse,
              parent_address: ctx.request.body.aboutData.parentOrCarrerAddress,
              legal_care_status: ctx.request.body.aboutData.legalCareStatus,
            }
            ).then((parentResult) => {

              parentResult.setType("2")
              parentResult.setParent(childId)

              const responseData = {
                userid: ctx.request.body.userid,
                status: "ok",
                role: ctx.request.body.role
              }
              return ctx.body = responseData;
            })
          })
        })
      })
    }
  }
};


exports.fetchAbout = ctx => {
  console.log("fetchAbout")
  const user = ctx.orm().User;
  if (ctx.request.body.role == "child") {
    return user.findOne({
      where: {
        uuid: ctx.request.body.uuid,
      },
      attributes: ['id', 'uuid']
    }).then((result) => {


      return user.findOne({
        include: [
          {
            model: ctx.orm().User,
            nested: true,
            as: 'parent',
          },
        ],

        where: {
          id: result.id,
        },
      }).then((userResult) => {

        return ctx.body = userResult;

      })

    })
  }
  else if (ctx.request.body.role == "parent") {
    return user.findOne({
      where: {
        uuid: ctx.request.body.uuid,
      },
      attributes: ['id', 'uuid']
    }).then((result) => {

      return user.findAll({
        include: [
          {
            model: ctx.orm().User,
            nested: true,
            as: 'parent',
          },
        ],
        where: {
          id: result.id,
        },
      }).then((userResult) => {

        return ctx.body = userResult;

      })

    })
  }

  else if (ctx.request.body.role == "professional") {
    return user.findOne({
      where: {
        uuid: ctx.request.body.uuid,
      },
      attributes: ['id', 'uuid']
    }).then((professionalResult) => {

      return user.findAll({
        include: [
          {
            model: ctx.orm().User,
            nested: true,
            as: 'professional',
          },
          {
            model: ctx.orm().User,
            nested: true,
            as: 'parent',
          },
        ],

        where: {
          id: professionalResult.id,
        },
      }).then((childResult) => {

        //  return ctx.body = childResult;
        var parentId = Number(childResult[0].professional[0].ChildProfessional.professionalId) + 2
        // return ctx.body = childResult;
        console.log(parentId)
        return user.findAll({
          include: [
            {
              model: ctx.orm().User,
              nested: true,
              as: 'parent',
            },
          ],
          where: {
            id: parentId,
          },
        }).then((parentResult) => {

          return ctx.body = parentResult;

        })


      })

    })
  }
}



exports.profession = ctx => {

  if (ctx.request.body.role == "professional") {
    const user = ctx.orm().User;
    console.log(ctx.request.body)
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

        var childId = userResult[0].professional[0].ChildProfessional.professionalId

        return user.update(
          {
            child_profession: ctx.request.body.educAndEmpData.position,
            child_education_place: ctx.request.body.educAndEmpData.attendedInfo,
            child_EHCP: ctx.request.body.educAndEmpData.haveEhcpPlan,
            child_EHAT: ctx.request.body.educAndEmpData.haveEhat,

            child_socialworker: ctx.request.body.educAndEmpData.haveSocialWorker,
            child_socialworker_name: ctx.request.body.educAndEmpData.socialWorkName,
            child_socialworker_contact: ctx.request.body.educAndEmpData.socialWorkContact,
            //user_section: 3
          },
          {
            where:
              { id: childId }
          }
        ).then((updateResult) => {

          return user.update(
            { user_section: 3 },
            { where: { id: result.id } }
          ).then((result) => {
            const responseData = {
              userid: ctx.request.body.userid,
              status: "ok",
              role: ctx.request.body.role
            }
            return ctx.body = responseData;
          }).catch((error) => {
            console.log(error)
          });
        })
      })

    })
  }
  else if (ctx.request.body.role == "parent") {
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
            as: 'parent',
          },
        ],
        where: {
          id: result.id,
        },
      }).then((userResult) => {
        //  console.log(userResult);
        console.log(userResult[0].parent[0].ChildParents.parentId)
        var childId = userResult[0].parent[0].ChildParents.parentId

        return user.update(
          {
            child_profession: ctx.request.body.educAndEmpData.position,
            child_education_place: ctx.request.body.educAndEmpData.attendedInfo,
            child_EHCP: ctx.request.body.educAndEmpData.haveEhcpPlan,
            child_EHAT: ctx.request.body.educAndEmpData.haveEhat,

            child_socialworker: ctx.request.body.educAndEmpData.haveSocialWorker,
            child_socialworker_name: ctx.request.body.educAndEmpData.socialWorkName,
            child_socialworker_contact: ctx.request.body.educAndEmpData.socialWorkContact,

          },
          {
            where:
              { id: childId }
          }
        ).then((updateResult) => {

          return user.update(
            { user_section: 3 },
            { where: { id: result.id } }
          ).then((result) => {
            const responseData = {
              userid: ctx.request.body.userid,
              status: "ok",
              role: ctx.request.body.role
            }
            return ctx.body = responseData;
          }).catch((error) => {
            console.log(error)
          });
        })
      })

    })
  }

  else if (ctx.request.body.role == "child") {
    const user = ctx.orm().User;
    return user.findOne({
      where: {
        uuid: ctx.request.body.userid,
      },
      attributes: ['id', 'uuid']
    }).then((result) => {

      return user.update(
        {
          child_profession: ctx.request.body.educAndEmpData.position,
          child_education_place: ctx.request.body.educAndEmpData.attendedInfo,
          child_EHCP: ctx.request.body.educAndEmpData.haveEhcpPlan,
          child_EHAT: ctx.request.body.educAndEmpData.haveEhat,

          child_socialworker: ctx.request.body.educAndEmpData.haveSocialWorker,
          child_socialworker_name: ctx.request.body.educAndEmpData.socialWorkName,
          child_socialworker_contact: ctx.request.body.educAndEmpData.socialWorkContact,
          // user_section: 3
        },
        {
          where:
            { id: result.id }
        }
      ).then((result) => {

        const responseData = {
          userid: ctx.request.body.userid,
          status: "ok",
          role: ctx.request.body.role
        }
        return ctx.body = responseData;
      })
    })
  }
}


exports.fetchProfession = ctx => {

  const user = ctx.orm().User;
  if (ctx.request.body.role == "child") {

    return user.findOne({
      where: {
        uuid: ctx.request.body.uuid,
      },

    }).then((result) => {
      return ctx.body = result;
    })
  }
  else if (ctx.request.body.role == "parent") {
    return user.findOne({
      where: {
        uuid: ctx.request.body.uuid,
      },

    }).then((result) => {

      return user.findAll({
        include: [
          {
            model: ctx.orm().User,
            nested: true,
            as: 'parent',
          },
        ],
        where: {
          id: result.id,
        },
      }).then((userResult) => {
        //  console.log(userResult);
        return ctx.body = userResult;
        console.log(userResult[0].parent[0].ChildParents.parentId)
        var childId = userResult[0].parent[0].ChildParents.parentId
      })
    })
  }

  else if (ctx.request.body.role == "professional") {
    return user.findOne({
      where: {
        uuid: ctx.request.body.uuid,
      },

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
        //  console.log(userResult);
        return ctx.body = userResult;

      })
    })
  }
}

//Section 4

exports.saveReferal = ctx => {

  const user = ctx.orm().User;
  const referral = ctx.orm().Referral

  if (ctx.request.body.role == "professional") {

    if (ctx.request.body.editFlag != null) {
      return referral.update(
        {
          referral_type: ctx.request.body.referralData.support,
          is_covid: ctx.request.body.referralData.covid,
          mental_health_diagnosis: ctx.request.body.referralData.diagnosis,
          diagnosis: ctx.request.body.diagnosisList,//--------------------diagnosis list for both mental and eating
          diagnosis_other: ctx.request.body.referralData.diagnosisOther,
          symptoms_supportneeds: ctx.request.body.referralData.supportOrSymptoms,
          symptoms: ctx.request.body.problemsList,//--------------------symptoms list for both mental and eating 
          symptoms_other: ctx.request.body.referralData.problemsOther,
          referral_issues: ctx.request.body.referralData.referralInfo,
          has_anything_helped: ctx.request.body.referralData.hasAnythingInfo,
          any_particular_trigger: ctx.request.body.referralData.triggerInfo,
          disabilities: ctx.request.body.referralData.disabilityOrDifficulty,
          any_other_services: ctx.request.body.referralData.accessService,
          local_services: ctx.request.body.accessList,//---------->checkbox
          currently_accessing_services: ctx.request.body.referralData.isAccessingService,
          services: ctx.request.body.allAvailableService//------------->dynamic add service for only child
        },
        {
          where:
            { id: ctx.request.body.id }
        }
      ).then((result) => {
        const responseData = {
          userid: ctx.request.body.userid,
          status: "ok",
          role: ctx.request.body.role
        }
        return ctx.body = responseData;
      })
    }
    else {
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

          //  console.log(userResult[0].professional[0].ChildProfessional.professionalId)

          var childId = userResult[0].professional[0].ChildProfessional.professionalId

          return referral.create(
            {
              referral_type: ctx.request.body.referralData.support,
              is_covid: ctx.request.body.referralData.covid,
              mental_health_diagnosis: ctx.request.body.referralData.diagnosis,
              diagnosis: ctx.request.body.diagnosisList,//--------------------diagnosis list for both mental and eating
              diagnosis_other: ctx.request.body.referralData.diagnosisOther,
              symptoms_supportneeds: ctx.request.body.referralData.supportOrSymptoms,
              symptoms: ctx.request.body.problemsList,//--------------------symptoms list for both mental and eating 
              symptoms_other: ctx.request.body.referralData.problemsOther,
              referral_issues: ctx.request.body.referralData.referralInfo,
              has_anything_helped: ctx.request.body.referralData.hasAnythingInfo,
              any_particular_trigger: ctx.request.body.referralData.triggerInfo,
              disabilities: ctx.request.body.referralData.disabilityOrDifficulty,
              any_other_services: ctx.request.body.referralData.accessService,
              local_services: ctx.request.body.accessList,//---------->checkbox
              currently_accessing_services: ctx.request.body.referralData.isAccessingService,
              services: ctx.request.body.allAvailableService//------------->dynamic add service for only child
            },
          ).then((fetchResult) => {
            result.setReferral(fetchResult.id)
            return referral.findOne({
              where: {
                id: fetchResult.id,
              },
              //attributes: ['id', 'uuid']
            }).then((sendResult) => {

              //  return ctx.body = sendResult;
              const responseData = {
                userid: ctx.request.body.userid,
                data: sendResult,
                status: "ok",
                role: ctx.request.body.role
              }
              return ctx.body = responseData;
            })
          })
        })

      })
    }
  }
  else if (ctx.request.body.role == "parent") {
    if (ctx.request.body.editFlag != null) {
      return referral.update(
        {
          referral_type: ctx.request.body.referralData.support,
          is_covid: ctx.request.body.referralData.covid,
          mental_health_diagnosis: ctx.request.body.referralData.diagnosis,
          diagnosis: ctx.request.body.diagnosisList,//--------------------diagnosis list for both mental and eating
          diagnosis_other: ctx.request.body.referralData.diagnosisOther,
          symptoms_supportneeds: ctx.request.body.referralData.supportOrSymptoms,
          symptoms: ctx.request.body.problemsList,//--------------------symptoms list for both mental and eating 
          symptoms_other: ctx.request.body.referralData.problemsOther,
          referral_issues: ctx.request.body.referralData.referralInfo,
          has_anything_helped: ctx.request.body.referralData.hasAnythingInfo,
          any_particular_trigger: ctx.request.body.referralData.triggerInfo,
          disabilities: ctx.request.body.referralData.disabilityOrDifficulty,
          any_other_services: ctx.request.body.referralData.accessService,
          local_services: ctx.request.body.accessList,//---------->checkbox
          currently_accessing_services: ctx.request.body.referralData.isAccessingService,
          services: ctx.request.body.allAvailableService//------------->dynamic add service for only child
        },
        {
          where:
            { id: ctx.request.body.id }
        }
      ).then((result) => {
        const responseData = {
          userid: ctx.request.body.userid,
          status: "ok",
          role: ctx.request.body.role
        }
        return ctx.body = responseData;
      })
    }
    else {
      console.log("333");
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
              as: 'parent',
            },
          ],
          where: {
            id: result.id,
          },
        }).then((userResult) => {
          //  console.log(userResult);
          console.log(userResult[0].parent[0].ChildParents.parentId)
          var childId = userResult[0].parent[0].ChildParents.parentId
          return referral.create(
            {
              referral_type: ctx.request.body.referralData.support,
              is_covid: ctx.request.body.referralData.covid,
              mental_health_diagnosis: ctx.request.body.referralData.diagnosis,
              diagnosis: ctx.request.body.diagnosisList,//--------------------diagnosis list for both mental and eating
              diagnosis_other: ctx.request.body.referralData.diagnosisOther,
              symptoms_supportneeds: ctx.request.body.referralData.supportOrSymptoms,
              symptoms: ctx.request.body.problemsList,//--------------------symptoms list for both mental and eating 
              symptoms_other: ctx.request.body.referralData.problemsOther,
              referral_issues: ctx.request.body.referralData.referralInfo,
              has_anything_helped: ctx.request.body.referralData.hasAnythingInfo,
              any_particular_trigger: ctx.request.body.referralData.triggerInfo,
              disabilities: ctx.request.body.referralData.disabilityOrDifficulty,
              any_other_services: ctx.request.body.referralData.accessService,
              local_services: ctx.request.body.accessList,//---------->checkbox
              currently_accessing_services: ctx.request.body.referralData.isAccessingService,
              services: ctx.request.body.allAvailableService//------------->dynamic add service for only child
            },
          ).then((fetchResult) => {
            result.setReferral(fetchResult.id)
            const responseData = {
              userid: ctx.request.body.userid,
              status: "ok",
              role: ctx.request.body.role
            }
            return ctx.body = responseData;
          })

        })

      })
    }

  }

  else if (ctx.request.body.role == "child") {
    if (ctx.request.body.editFlag != null) {
      return referral.update(
        {
          referral_type: ctx.request.body.referralData.support,
          is_covid: ctx.request.body.referralData.covid,
          mental_health_diagnosis: ctx.request.body.referralData.diagnosis,
          diagnosis: ctx.request.body.diagnosisList,//--------------------diagnosis list for both mental and eating
          diagnosis_other: ctx.request.body.referralData.diagnosisOther,
          symptoms_supportneeds: ctx.request.body.referralData.supportOrSymptoms,
          symptoms: ctx.request.body.problemsList,//--------------------symptoms list for both mental and eating 
          symptoms_other: ctx.request.body.referralData.problemsOther,
          referral_issues: ctx.request.body.referralData.referralInfo,
          has_anything_helped: ctx.request.body.referralData.hasAnythingInfo,
          any_particular_trigger: ctx.request.body.referralData.triggerInfo,
          disabilities: ctx.request.body.referralData.disabilityOrDifficulty,
          any_other_services: ctx.request.body.referralData.accessService,
          local_services: ctx.request.body.accessList,//---------->checkbox
          currently_accessing_services: ctx.request.body.referralData.isAccessingService,
          services: ctx.request.body.allAvailableService//------------->dynamic add service for only child
        },
        {
          where:
            { id: ctx.request.body.id }
        }
      ).then((result) => {
        const responseData = {
          userid: ctx.request.body.userid,
          status: "ok",
          role: ctx.request.body.role
        }
        return ctx.body = responseData;
      })
    }
    else {
      return user.findOne({
        where: {
          uuid: ctx.request.body.userid,
        },
        attributes: ['id', 'uuid']
      }).then((result) => {

        return referral.create(
          {
            referral_type: ctx.request.body.referralData.support,
            is_covid: ctx.request.body.referralData.covid,
            mental_health_diagnosis: ctx.request.body.referralData.diagnosis,
            diagnosis: ctx.request.body.diagnosisList,//--------------------diagnosis list for both mental and eating
            diagnosis_other: ctx.request.body.referralData.diagnosisOther,
            symptoms_supportneeds: ctx.request.body.referralData.supportOrSymptoms,
            symptoms: ctx.request.body.problemsList,//--------------------symptoms list for both mental and eating 
            symptoms_other: ctx.request.body.referralData.problemsOther,
            referral_issues: ctx.request.body.referralData.referralInfo,
            has_anything_helped: ctx.request.body.referralData.hasAnythingInfo,
            any_particular_trigger: ctx.request.body.referralData.triggerInfo,
            disabilities: ctx.request.body.referralData.disabilityOrDifficulty,
            any_other_services: ctx.request.body.referralData.accessService,
            local_services: ctx.request.body.accessList,//---------->checkbox
            currently_accessing_services: ctx.request.body.referralData.isAccessingService,
            services: ctx.request.body.allAvailableService//------------->dynamic add service for only child
          },
        ).then((fetchResult) => {


          result.setReferral(fetchResult.id)

          return referral.findOne({
            where: {
              id: fetchResult.id,
            },
          }).then((sendResult) => {
            const responseData = {
              userid: ctx.request.body.userid,
              data: sendResult,
              status: "ok",
              role: ctx.request.body.role
            }
            return ctx.body = responseData;
          })
        })
      })
    }
  }
}

exports.fetchReferral = ctx => {

  console.log("-------------------------------------------------------------------------------------------");
  const user = ctx.orm().User;
  const referral = ctx.orm().Referral


  return user.findOne({
    where: {
      uuid: ctx.request.body.userid,
    },
    attributes: ['id', 'uuid']
  }).then((fetchResult) => {
    return user.findAll({
      include: [
        {
          model: ctx.orm().Referral,
          nested: true,
          as: 'referral',
        },
      ],
      where: {
        id: fetchResult.id,
      },
    }).then((userResult) => {
      //   console.log(userResult);
      console.log(userResult[0].referral[0].id)
      var refId = userResult[0].referral[0].id;

      return referral.findOne({
        where: {
          id: refId,
        },

      }).then((referralResult) => {
        console.log(referralResult)
        return ctx.body = referralResult;
      })

      console.log(userResult)
    })
    console.log(fetchResult.id)


  })

  // else if (ctx.request.body.role == "parent") {
  // }
  // else if (ctx.request.body.role == "professional") {
  // }

}


//Section 5

exports.fetchReview = ctx => {

  const user = ctx.orm().User;
  const referral = ctx.orm().Referral
  console.log(ctx.query.user_id);
  if (ctx.query.role == "child") {
    return user.findOne({
      where: {
        uuid: ctx.query.user_id,
      },
      attributes: ['id', 'uuid', 'need_interpreter', 'child_dob', 'contact_parent', 'consent_child', 'registerd_gp']
    }).then((eligibilityObj) => {

      return user.findOne({
        include: [
          {
            model: ctx.orm().User,
            as: 'parent',
            attributes: ['id', 'parent_name', 'parential_responsibility', 'responsibility_parent_name', 'child_parent_relationship', 'parent_contact_number', 'parent_email', 'parent_same_house', 'parent_address', 'legal_care_status']
          },
        ],
        where: {
          id: eligibilityObj.id,
        },
        attributes: ['id', 'child_NHS', 'child_name', 'child_email', 'child_contact_number', 'child_address', 'can_send_post', 'child_gender', 'child_gender_birth', 'child_sexual_orientation', 'child_ethnicity', 'child_care_adult']
      }).then((aboutObj) => {
        return user.findOne({
          include: [
            {
              model: ctx.orm().Referral,
              nested: true,
              as: 'referral',
            },
          ],
          where: {
            id: eligibilityObj.id,
          },
          attributes: ['id', 'child_profession', 'child_education_place', 'child_EHCP', 'child_EHAT', 'child_socialworker', 'child_socialworker_name', 'child_socialworker_contact']
        }).then((educationObj) => {


          const section2Obj = {
            child_NHS: aboutObj.child_NHS,
            child_name: aboutObj.child_name,
            child_email: aboutObj.child_email,
            child_contact_number: aboutObj.child_contact_number,
            child_address: aboutObj.child_address,
            can_send_post: aboutObj.can_send_post,
            child_gender: aboutObj.child_gender,
            child_gender_birth: aboutObj.child_gender_birth,
            child_sexual_orientation: aboutObj.child_gender_birth,
            child_ethnicity: aboutObj.child_ethnicity,
            child_care_adult: aboutObj.child_care_adult,
            parent_name: aboutObj.parent[0].parent_name,
            parential_responsibility: aboutObj.parent[0].parential_responsibility,
            child_parent_relationship: aboutObj.parent[0].child_parent_relationship,
            parent_contact_number: aboutObj.parent[0].parent_contact_number,
            parent_email: aboutObj.parent[0].parent_email,
            parent_same_house: aboutObj.parent[0].parent_same_house,
            parent_address: aboutObj.parent[0].parent_address,
            legal_care_status: aboutObj.parent[0].legal_care_status,
          }
          const responseData = {
            userid: ctx.query.user_id,
            section1: eligibilityObj,
            section2Old: aboutObj,
            section2: section2Obj,
            section3: educationObj,
            section4: educationObj.referral[0],
            status: "ok",
            role: ctx.query.role
          }
          return ctx.body = responseData;

        }).catch((error) => {
          console.log("1")
          sequalizeErrorHandler.handleSequalizeError(ctx, error)
        });
      }).catch((error) => {
        console.log("2")
        sequalizeErrorHandler.handleSequalizeError(ctx, error)
      });

    }).catch((error) => {
      console.log(error)
      sequalizeErrorHandler.handleSequalizeError(ctx, error)
    });
  }

  else if (ctx.query.role == "parent") {
    console.log("3333333333333333333333333333333")
    return user.findOne({
      where: {
        uuid: ctx.query.user_id,
      },
    }).then((userObj) => {

      return user.findAll({
        include: [
          {
            model: ctx.orm().User,
            nested: true,
            as: 'parent',
            attributes: ['id', 'child_dob', 'registerd_gp']
          },
        ],
        where: {
          id: userObj.id,
        },
        attributes: ['id', 'uuid', 'need_interpreter', 'contact_parent', 'consent_child']
      }).then((elgibilityObj) => {
        //  return ctx.body = elgibilityObj[0];

        return user.findAll({
          include: [
            //childData
            {
              model: ctx.orm().User,
              nested: true,
              as: 'parent',
              attributes: ['id', 'child_NHS', 'child_name', 'child_email', 'child_contact_number', 'child_address', 'can_send_post', 'child_gender', 'child_gender_birth', 'child_sexual_orientation', 'child_ethnicity', 'child_care_adult']
            },
          ],
          where: {
            id: elgibilityObj[0].id,
          },
          attributes: ['id', 'parent_name', 'parential_responsibility', 'responsibility_parent_name', 'child_parent_relationship', 'parent_contact_number', 'parent_email', 'parent_same_house', 'parent_address', 'legal_care_status']
        }).then((aboutObj) => {
          return user.findAll({
            include: [
              //childData
              {
                model: ctx.orm().User,
                nested: true,
                as: 'parent',
                attributes: ['id', 'child_profession', 'child_education_place', 'child_EHCP', 'child_EHAT', 'child_socialworker', 'child_socialworker_contact']
              },
            ],
            where: {
              id: elgibilityObj[0].id,
            },
            attributes: ['id']
          }).then((edu_empObj) => {

            return user.findOne({

              include: [
                {
                  model: ctx.orm().Referral,
                  nested: true,
                  as: 'referral',
                },
              ],
              where: {
                id: elgibilityObj[0].id,
              },
              attributes: ['id']
            }).then((referralResult) => {

              const section1Obj = {
                child_dob: elgibilityObj[0].parent[0].child_dob,
                consent_child: elgibilityObj[0].consent_child,
                consent_parent: elgibilityObj[0].consent_parent,
                need_interpreter: elgibilityObj[0].need_interpreter,
                registerd_gp: elgibilityObj[0].parent[0].registerd_gp
              }
              const section2Obj = {
                child_NHS: aboutObj[0].parent[0].child_NHS,
                child_name: aboutObj[0].parent[0].child_name,
                child_email: aboutObj[0].parent[0].child_email,
                child_contact_number: aboutObj[0].parent[0].child_contact_number,
                child_address: aboutObj[0].parent[0].child_address,
                can_send_post: aboutObj[0].parent[0].can_send_post,
                child_gender: aboutObj[0].parent[0].child_gender,
                child_gender_birth: aboutObj[0].parent[0].child_gender_birth,
                child_sexual_orientation: aboutObj[0].parent[0].child_gender_birth,
                child_ethnicity: aboutObj[0].parent[0].child_ethnicity,
                child_care_adult: aboutObj[0].parent[0].child_care_adult,
                parent_name: aboutObj[0].parent_name,
                parential_responsibility: aboutObj[0].parential_responsibility,
                child_parent_relationship: aboutObj[0].child_parent_relationship,
                parent_contact_number: aboutObj[0].parent_contact_number,
                parent_email: aboutObj[0].parent_email,
                parent_same_house: aboutObj[0].parent_same_house,
                parent_address: aboutObj[0].parent_address,
                legal_care_status: aboutObj[0].legal_care_status,
              }

              const section3Obj = {
                child_profession: edu_empObj[0].parent[0].child_profession,
                child_education_place: edu_empObj[0].parent[0].child_education_place,
                child_EHCP: edu_empObj[0].parent[0].child_EHCP,
                child_EHAT: edu_empObj[0].parent[0].child_EHAT,
                child_socialworker: edu_empObj[0].parent[0].child_socialworker,
                child_socialworker_name: edu_empObj[0].parent[0].child_socialworker_name,
                child_socialworker_contact: edu_empObj[0].parent[0].child_socialworker_contact,
              }
              const responseData = {
                userid: ctx.request.body.userid,
                section1: section1Obj,
                section2: section2Obj,
                section3: section3Obj,
                section4: referralResult.referral[0],
                status: "ok",
                role: ctx.request.body.role
              }
              return ctx.body = responseData;
            })
          })
        })

      })

    })
  }
  else if (ctx.query.role == "professional") {


    return user.findOne({
      where: {
        uuid: ctx.query.user_id,
      },
    }).then((userObj) => {

      return user.findOne({

        include: [
          {
            model: ctx.orm().User,
            nested: true,
            as: 'professional',
            attributes: ['id', 'child_dob', 'registerd_gp']
          },
        ],
        where: {
          id: userObj.id,
        },
        attributes: ['id', 'uuid', 'professional_name', 'professional_email', 'professional_contact_number', 'consent_child', 'consent_parent']
      }).then((elgibilityObj) => {
        var childId = Number(elgibilityObj.professional[0].ChildProfessional.professionalId) + 2

        //  var childId = elgibilityObj[0].professional[0].ChildProfessional.UserId
        //  var parentId = Number(userResult[0].professional[0].ChildProfessional.professionalId) + 2
        return user.findAll({
          include: [
            //childData
            {
              model: ctx.orm().User,
              nested: true,
              as: 'parent',
              attributes: ['id', 'child_NHS', 'child_name', 'child_email', 'child_contact_number', 'child_address', 'can_send_post', 'child_gender', 'child_gender_birth', 'child_sexual_orientation', 'child_ethnicity', 'child_care_adult']
            },
          ],
          where: {
            id: childId,
          },
          attributes: ['id', 'parent_name', 'parential_responsibility', 'responsibility_parent_name', 'child_parent_relationship', 'parent_contact_number', 'parent_email', 'parent_same_house', 'parent_address', 'legal_care_status']
        }).then((aboutObj) => {

          return user.findAll({
            include: [
              //childData
              {
                model: ctx.orm().User,
                nested: true,
                as: 'professional',
                attributes: ['id', 'child_profession', 'child_education_place', 'child_EHCP', 'child_EHAT', 'child_socialworker', 'child_socialworker_name', 'child_socialworker_contact']
              },
            ],
            where: {
              id: elgibilityObj.id,
            },
            attributes: ['id']
          }).then((edu_empObj) => {

            return user.findOne({

              include: [
                {
                  model: ctx.orm().Referral,
                  nested: true,
                  as: 'referral',
                },
              ],
              where: {
                id: elgibilityObj.id,
              },
              attributes: ['id']
            }).then((referralResult) => {
              const section1Obj = {
                child_dob: elgibilityObj.professional[0].child_dob,
                consent_child: elgibilityObj.consent_child,
                consent_parent: elgibilityObj.consent_parent,
                professional_name: elgibilityObj.professional_name,
                professional_email: elgibilityObj.professional_email,
                professional_contact_number: elgibilityObj.professional_contact_number,
                registerd_gp: elgibilityObj.professional[0].registerd_gp
              }
              const section2Obj = {
                child_NHS: aboutObj[0].parent[0].child_NHS,
                child_name: aboutObj[0].parent[0].child_name,
                child_email: aboutObj[0].parent[0].child_email,
                child_contact_number: aboutObj[0].parent[0].child_contact_number,
                child_address: aboutObj[0].parent[0].child_address,
                can_send_post: aboutObj[0].parent[0].can_send_post,
                child_gender: aboutObj[0].parent[0].child_gender,
                child_gender_birth: aboutObj[0].parent[0].child_gender_birth,
                child_sexual_orientation: aboutObj[0].parent[0].child_gender_birth,
                child_ethnicity: aboutObj[0].parent[0].child_ethnicity,
                child_care_adult: aboutObj[0].parent[0].child_care_adult,
                parent_name: aboutObj[0].parent_name,
                parential_responsibility: aboutObj[0].parential_responsibility,
                child_parent_relationship: aboutObj[0].child_parent_relationship,
                parent_contact_number: aboutObj[0].parent_contact_number,
                parent_email: aboutObj[0].parent_email,
                parent_same_house: aboutObj[0].parent_same_house,
                parent_address: aboutObj[0].parent_address,
                legal_care_status: aboutObj[0].legal_care_status,
              }

              const section3Obj = {
                child_profession: edu_empObj[0].professional[0].child_profession,
                child_education_place: edu_empObj[0].professional[0].child_education_place,
                child_EHCP: edu_empObj[0].professional[0].child_EHCP,
                child_EHAT: edu_empObj[0].professional[0].child_EHAT,
                child_socialworker: edu_empObj[0].professional[0].child_socialworker,
                child_socialworker_name: edu_empObj[0].professional[0].child_socialworker_name,
                child_socialworker_contact: edu_empObj[0].professional[0].child_socialworker_contact,
              }

              //  return ctx.body = section1Obj;
              const responseData = {
                userid: ctx.request.body.userid,
                section1: section1Obj,
                section2: section2Obj,
                section3: edu_empObj[0].professional[0],
                section4: referralResult.referral[0],
                status: "ok",
                role: ctx.request.body.role
              }
              return ctx.body = responseData;
            })

          })
        })

      })

    })
  }

}

exports.saveReview = ctx => {
  console.log(ctx.request.body);
  const user = ctx.orm().User;
  const uniqueNo = uniqid().toUpperCase();
  return user.findOne({
    where: {
      reference_code: uniqueNo,
    },
  }).then((result) => {
    if (result == null) {
      return user.update({
        reference_code: uniqueNo,
        contact_preferences: ctx.request.body.contactPreference
      },
        {
          where:
            { uuid: ctx.request.body.userid }
        }
      ).then((childUserInfo) => {
        const responseData = {
          userid: ctx.request.body.userid,
          status: "ok",
          role: ctx.request.body.role,
          refNo: uniqueNo
        }
        return ctx.body = responseData;
      }).catch((error) => {
        console.log(error)
      });
    }
  })
}

function getrole(ctx) {

  const user = ctx.orm().User;
  return user.findOne({
    where: {
      uuid: ctx.query.user_id,
    },
    attributes: ['id', 'uuid']
  }).then((result) => {

    return user.findAll({
      include: [
        {
          model: ctx.orm().type,
          as: 'type',
        },
      ],
      where: {
        id: result.id,
      },
    }).then((userResult) => {

      console.log(userResult)

      //  return ctx.body = userResult;

    }).catch((error) => {
      console.log(error)
    });

  }).catch((error) => {
    console.log(error)
  });



}