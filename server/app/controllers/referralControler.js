const P = require("pino");
var uniqid = require('uniqid');
const sequalizeErrorHandler = require('../middlewares/errorHandler');
const reponseMessages = require('../middlewares/responseMessage');
const Op = require('sequelize').Op;
exports.eligibility = ctx => {
  const user = ctx.orm().Referral;
  var userid;
  if (ctx.request.body.role == "child") {
    //checking update operation or not
    if (ctx.request.body.editFlag != null) {
      return user.update({
        need_interpreter: ctx.request.body.interpreter,
        child_dob: ctx.request.body.child_Dob,
        contact_parent: ctx.request.body.contactParent,
        consent_child: ctx.request.body.isInformation,
        registerd_gp: ctx.request.body.registerd_gp,
        contact_parent_camhs:ctx.request.body.contact_parent_camhs,
        reason_contact_parent_camhs:ctx.request.body.reason_contact_parent_camhs
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
        sequalizeErrorHandler.handleSequalizeError(ctx, error)
      });
    }
    else {
      console.log(ctx.request.body)
      return user.create({
        need_interpreter: ctx.request.body.interpreter,
        child_dob: ctx.request.body.child_Dob,
        contact_parent: ctx.request.body.contactParent,
        consent_child: ctx.request.body.isInformation,
        registerd_gp: ctx.request.body.registerd_gp,
        user_role: ctx.request.body.role,
        login_id: ctx.request.body.loginId,
        contact_parent_camhs:ctx.request.body.contact_parent_camhs,
        reason_contact_parent_camhs:ctx.request.body.reason_contact_parent_camhs,
        referral_progress: 20,
        referral_complete_status: 'incomplete'
      }).then((childUserInfo) => {
        childUserInfo.setType("1")
        const responseData = {
          userid: childUserInfo.uuid,
          status: "ok",
        }
        return ctx.body = responseData;
      }).catch((error) => {
        console.log(error)
        sequalizeErrorHandler.handleSequalizeError(ctx, error)
      });
    }

  }
  else if (ctx.request.body.role == "parent") {
    //checking update operation or not
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
              model: ctx.orm().Referral,
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
            child_dob: ctx.request.body.child_Dob,
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
        child_dob: ctx.request.body.child_Dob,
        registerd_gp: ctx.request.body.registerd_gp,
      }).then((childUserInfo) => {
        childUserInfo.setType("1")
        return user.create({
          need_interpreter: ctx.request.body.interpreter,
          consent_child: ctx.request.body.isInformation,
          user_role: ctx.request.body.role,
          referral_complete_status: 'incomplete',
          login_id: ctx.request.body.loginId,
          referral_progress: 20
        }).then((parentUserInfo) => {
          parentUserInfo.setType("2")
          parentUserInfo.setParent(childUserInfo.id)
          const responseData = {
            userid: parentUserInfo.uuid,
            status: "ok"
          }
          return ctx.body = responseData;
        }).catch((error) => {
          sequalizeErrorHandler.handleSequalizeError(ctx, error)
        });
      }).catch((error) => {
        sequalizeErrorHandler.handleSequalizeError(ctx, error)
      });

    }
  }

  else if (ctx.request.body.role == "professional") {
    //checking update operation or not
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
              model: ctx.orm().Referral,
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
            child_dob: ctx.request.body.prof_ChildDob,
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
        child_dob: ctx.request.body.prof_ChildDob,
        registerd_gp: ctx.request.body.profRegisterd_gp,
      }).then((childUserInfo) => {
        childUserInfo.setType("1")
        return user.create({
          professional_name: ctx.request.body.profName,
          professional_email: ctx.request.body.profEmail,
          professional_contact_number: ctx.request.body.profContactNumber,
          consent_parent: ctx.request.body.contactProfParent,
          consent_child: ctx.request.body.parentConcernInformation,
          login_id: ctx.request.body.loginId,
          user_role: ctx.request.body.role,
          referral_progress: 20,
          referral_complete_status: 'incomplete'
        }).then((professionalUserInfo) => {
          professionalUserInfo.setType("3")
          professionalUserInfo.setProfessional(childUserInfo.id)
          return user.create({
          }).then((parenetUserInfo) => {
            parenetUserInfo.setType("2")
            parenetUserInfo.setParent(childUserInfo.id)
            const responseData = {
              userid: professionalUserInfo.uuid,
              status: "ok"
            }
            return ctx.body = responseData;
          }).catch((error) => {
            sequalizeErrorHandler.handleSequalizeError(ctx, error)
          });

        }).catch((error) => {
          sequalizeErrorHandler.handleSequalizeError(ctx, error)
        });
      }).catch((error) => {
        sequalizeErrorHandler.handleSequalizeError(ctx, error)
      });
    }
  }
};


exports.fetchEligibility = ctx => {
  const user = ctx.orm().Referral;
  if (ctx.query.role == "child") {
    return user.findOne({
      where: {
        uuid: ctx.query.user_id,
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
        .catch((error) => {
          sequalizeErrorHandler.handleSequalizeError(ctx, error)
        });

    })
      .catch((error) => {
        sequalizeErrorHandler.handleSequalizeError(ctx, error)
      });
  }
  else if (ctx.query.role == "parent") {
    return user.findOne({
      where: {
        uuid: ctx.query.user_id,
      },
      attributes: ['id', 'uuid']
    }).then((result) => {

      return user.findAll({
        include: [
          {
            model: ctx.orm().Referral,
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
        .catch((error) => {
          sequalizeErrorHandler.handleSequalizeError(ctx, error)
        });

    })
  }

  else if (ctx.query.role == "professional") {
    return user.findOne({
      where: {
        uuid: ctx.query.user_id,
      },
      attributes: ['id', 'uuid']
    }).then((result) => {

      return user.findAll({
        include: [
          {
            model: ctx.orm().Referral,
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
        .catch((error) => {
          sequalizeErrorHandler.handleSequalizeError(ctx, error)
        });

    })
  }
}


exports.about = ctx => {
  const user = ctx.orm().Referral;
  if (ctx.request.body.role == "child") {
    //checking update operation or not
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
              model: ctx.orm().Referral,
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
              .catch((error) => {
                sequalizeErrorHandler.handleSequalizeError(ctx, error)
              });

          })
            .catch((error) => {
              sequalizeErrorHandler.handleSequalizeError(ctx, error)
            });
        })
          .catch((error) => {
            sequalizeErrorHandler.handleSequalizeError(ctx, error)
          });


      })
        .catch((error) => {
          sequalizeErrorHandler.handleSequalizeError(ctx, error)
        });
    }

    else {
      return user.findOne({
        where: {
          uuid: ctx.request.body.userid,
        },
        attributes: ['id', 'uuid']
      }).then((result) => {

        return user.update(
          {
            login_id: ctx.request.body.loginId,
            referral_progress: 40
          },
          {
            where:
              { id: result.id }
          }
        ).then((updateResult) => {

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
                sequalizeErrorHandler.handleSequalizeError(ctx, error)
              });

            }).catch((error) => {
              sequalizeErrorHandler.handleSequalizeError(ctx, error)
            });
          }).catch((error) => {
            sequalizeErrorHandler.handleSequalizeError(ctx, error)
          });

        })
      })
    }
  }
  else if (ctx.request.body.role == "parent") {
    return user.findOne({
      where: {
        uuid: ctx.request.body.userid,
      },
      attributes: ['id', 'uuid']
    }).then((result) => {

      return user.findAll({
        include: [
          {
            model: ctx.orm().Referral,
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
            household_member: ctx.request.body.allHouseHoldMembers,
            child_household_profession: ctx.request.body.aboutData.houseHoldProfession,
            child_care_adult: ctx.request.body.aboutData.childCareAdult,
          },
          {
            where:
              { id: childId }
          }
        ).then((updateResult) => {
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
            referral_progress: 40
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
            .catch((error) => {
              sequalizeErrorHandler.handleSequalizeError(ctx, error)
            });

        }).catch((error) => {
          sequalizeErrorHandler.handleSequalizeError(ctx, error)
        });
      }).catch((error) => {
        sequalizeErrorHandler.handleSequalizeError(ctx, error)
      });

    })
      .catch((error) => {
        sequalizeErrorHandler.handleSequalizeError(ctx, error)
      });
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
              model: ctx.orm().Referral,
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
              }).catch((error) => {
                sequalizeErrorHandler.handleSequalizeError(ctx, error)
              });

            })
              .catch((error) => {
                sequalizeErrorHandler.handleSequalizeError(ctx, error)
              });

          })
            .catch((error) => {
              sequalizeErrorHandler.handleSequalizeError(ctx, error)
            });
        })
          .catch((error) => {
            sequalizeErrorHandler.handleSequalizeError(ctx, error)
          });
      })
        .catch((error) => {
          sequalizeErrorHandler.handleSequalizeError(ctx, error)
        });
    }
    else {

      return user.findOne({
        where: {
          uuid: ctx.request.body.userid,
        },
        attributes: ['id', 'uuid']
      }).then((result) => {

        return user.update(
          {
            referral_progress: 40
          },
          {
            where:
              { id: result.id }
          }
        ).then((updateResult) => {
          return user.findAll({
            include: [
              {
                model: ctx.orm().Referral,
                nested: true,
                as: 'professional',
              },
            ],
            where: {
              id: result.id,
            },
          }).then((userResult) => {
            var childId = userResult[0].professional[0].ChildProfessional.professionalId
            var parentId = Number(userResult[0].professional[0].ChildProfessional.ReferralId)+1 
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
                household_member: ctx.request.body.allHouseHoldMembers,
                child_household_profession: ctx.request.body.aboutData.houseHoldProfession,
                child_care_adult: ctx.request.body.aboutData.childCareAdult,
              },
              {
                where:
                  { id: childId }
              }
            ).then((updateResult) => {
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
                  { id: parentId }
              }
              ).then((parentResult) => {

                // parentResult.setType("2")
                // parentResult.setParent(childId)

                const responseData = {
                  userid: ctx.request.body.userid,
                  status: "ok",
                  role: ctx.request.body.role
                }
                return ctx.body = responseData;
              }).catch((error) => {
                sequalizeErrorHandler.handleSequalizeError(ctx, error)
              });
            }).catch((error) => {
              sequalizeErrorHandler.handleSequalizeError(ctx, error)
            });
          }).catch((error) => {
            sequalizeErrorHandler.handleSequalizeError(ctx, error)
          });
        })
          .catch((error) => {
            sequalizeErrorHandler.handleSequalizeError(ctx, error)
          });

      }).catch((error) => {
        sequalizeErrorHandler.handleSequalizeError(ctx, error)
      });
    }
  }
};


exports.fetchAbout = ctx => {
  console.log("fetchAbout")
  const user = ctx.orm().Referral;
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
            model: ctx.orm().Referral,
            nested: true,
            as: 'parent',
          },
        ],
        where: {
          id: result.id,
        },
      }).then((userResult) => {
        return ctx.body = userResult;
      }).catch((error) => {
        sequalizeErrorHandler.handleSequalizeError(ctx, error)
      });
    }).catch((error) => {
      sequalizeErrorHandler.handleSequalizeError(ctx, error)
    });
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
            model: ctx.orm().Referral,
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
        .catch((error) => {
          sequalizeErrorHandler.handleSequalizeError(ctx, error)
        });

    })
      .catch((error) => {
        sequalizeErrorHandler.handleSequalizeError(ctx, error)
      });
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
            model: ctx.orm().Referral,
            nested: true,
            as: 'professional',
          },
          {
            model: ctx.orm().Referral,
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
              model: ctx.orm().Referral,
              nested: true,
              as: 'parent',
            },
          ],
          where: {
            id: parentId,
          },
        }).then((parentResult) => {

          return ctx.body = parentResult;

        }).catch((error) => {
          sequalizeErrorHandler.handleSequalizeError(ctx, error)
        });


      }).catch((error) => {
        sequalizeErrorHandler.handleSequalizeError(ctx, error)
      });

    })
      .catch((error) => {
        sequalizeErrorHandler.handleSequalizeError(ctx, error)
      });
  }
}



exports.profession = ctx => {

  if (ctx.request.body.role == "professional") {
    const user = ctx.orm().Referral;
    console.log(ctx.request.body)
    return user.findOne({
      where: {
        uuid: ctx.request.body.userid,
      },
      attributes: ['id', 'uuid']
    }).then((result) => {
      return user.update(
        {
          referral_progress: 60
        },
        {
          where:
            { id: result.id }
        }
      ).then((updateResult) => {
        return user.findAll({
          include: [
            {
              model: ctx.orm().Referral,
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
              sequalizeErrorHandler.handleSequalizeError(ctx, error)
            });
          }).catch((error) => {
            sequalizeErrorHandler.handleSequalizeError(ctx, error)
          });
        }).catch((error) => {
          sequalizeErrorHandler.handleSequalizeError(ctx, error)
        });
      }).catch((error) => {
        sequalizeErrorHandler.handleSequalizeError(ctx, error)
      });

    }).catch((error) => {
      sequalizeErrorHandler.handleSequalizeError(ctx, error)
    });
  }
  else if (ctx.request.body.role == "parent") {
    const user = ctx.orm().Referral;
    return user.findOne({
      where: {
        uuid: ctx.request.body.userid,
      },
      attributes: ['id', 'uuid']
    }).then((result) => {

      return user.findAll({
        include: [
          {
            model: ctx.orm().Referral,
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
            { referral_progress: 60 },
            { where: { id: result.id } }
          ).then((result) => {
            const responseData = {
              userid: ctx.request.body.userid,
              status: "ok",
              role: ctx.request.body.role
            }
            return ctx.body = responseData;
          }).catch((error) => {
            sequalizeErrorHandler.handleSequalizeError(ctx, error)
          });
        }).catch((error) => {
          sequalizeErrorHandler.handleSequalizeError(ctx, error)
        });
      })
        .catch((error) => {
          sequalizeErrorHandler.handleSequalizeError(ctx, error)
        });
    }).catch((error) => {
      sequalizeErrorHandler.handleSequalizeError(ctx, error)
    });
  }

  else if (ctx.request.body.role == "child") {
    const user = ctx.orm().Referral;
    return user.findOne({
      where: {
        uuid: ctx.request.body.userid,
      },
      attributes: ['id', 'uuid']
    }).then((result) => {

      return user.update(
        {
          referral_progress: 60
        },
        {
          where:
            { id: result.id }
        }
      ).then((updateResult) => {
        return user.update(
          {
            child_profession: ctx.request.body.educAndEmpData.position,
            child_education_place: ctx.request.body.educAndEmpData.attendedInfo,
            child_EHCP: ctx.request.body.educAndEmpData.haveEhcpPlan,
            child_EHAT: ctx.request.body.educAndEmpData.haveEhat,

            child_socialworker: ctx.request.body.educAndEmpData.haveSocialWorker,
            child_socialworker_name: ctx.request.body.educAndEmpData.socialWorkName,
            child_socialworker_contact: ctx.request.body.educAndEmpData.socialWorkContact,
            referral_progress: 60
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
        }).catch((error) => {
          sequalizeErrorHandler.handleSequalizeError(ctx, error)
        });
      })
        .catch((error) => {
          sequalizeErrorHandler.handleSequalizeError(ctx, error)
        });

    }).catch((error) => {
      sequalizeErrorHandler.handleSequalizeError(ctx, error)
    });
  }
}


exports.fetchProfession = ctx => {

  const user = ctx.orm().Referral;
  if (ctx.request.body.role == "child") {

    return user.findOne({
      where: {
        uuid: ctx.request.body.uuid,
      },

    }).then((result) => {
      return ctx.body = result;
    }).catch((error) => {
      sequalizeErrorHandler.handleSequalizeError(ctx, error)
    });
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
            model: ctx.orm().Referral,
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
      }).catch((error) => {
        sequalizeErrorHandler.handleSequalizeError(ctx, error)
      });
    }).catch((error) => {
      sequalizeErrorHandler.handleSequalizeError(ctx, error)
    });
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
            model: ctx.orm().Referral,
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

      }).catch((error) => {
        sequalizeErrorHandler.handleSequalizeError(ctx, error)
      });
    }).catch((error) => {
      sequalizeErrorHandler.handleSequalizeError(ctx, error)
    });
  }
}

//Section 4

exports.saveReferal = ctx => {

  const user = ctx.orm().Referral;
  const referral = ctx.orm().Reason
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
      }).catch((error) => {
        sequalizeErrorHandler.handleSequalizeError(ctx, error)
      });
    }
    else {
      return user.findOne({
        where: {
          uuid: ctx.request.body.userid,
        },
        attributes: ['id', 'uuid']
      }).then((result) => {

        return user.update(
          {
            referral_progress: 80
          },
          {
            where:
              { id: result.id }
          }
        ).then((updateResult) => {
          return user.findAll({
            include: [
              {
                model: ctx.orm().Referral,
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
              result.setReferral_reason(fetchResult.id)
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
              }).catch((error) => {
                sequalizeErrorHandler.handleSequalizeError(ctx, error)
              });
            }).catch((error) => {
              sequalizeErrorHandler.handleSequalizeError(ctx, error)
            });
          }).catch((error) => {
            sequalizeErrorHandler.handleSequalizeError(ctx, error)
          });
        })
          .catch((error) => {
            sequalizeErrorHandler.handleSequalizeError(ctx, error)
          });
      }).catch((error) => {
        sequalizeErrorHandler.handleSequalizeError(ctx, error)
      });
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
      }).catch((error) => {
        sequalizeErrorHandler.handleSequalizeError(ctx, error)
      });
    }
    else {
      return user.findOne({
        where: {
          uuid: ctx.request.body.userid,
        },
        attributes: ['id', 'uuid']
      }).then((result) => {
        return user.update(
          {
            referral_progress: 80
          },
          {
            where:
              { id: result.id }
          }
        ).then((updateResult) => {

          return user.findAll({
            include: [
              {
                model: ctx.orm().Referral,
                nested: true,
                as: 'parent',
              },
            ],
            where: {
              id: result.id,
            },
          }).then((userResult) => {
            //  console.log(userResult);
            //console.log("---------?"+userResult[0].parent[0].ChildParents.parentId)
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
              result.setReferral_reason(fetchResult.id)
              const responseData = {
                userid: ctx.request.body.userid,
                status: "ok",
                role: ctx.request.body.role
              }
              return ctx.body = responseData;
            }).catch((error) => {
              console.log(error)
              sequalizeErrorHandler.handleSequalizeError(ctx, error)
            });

          }).catch((error) => {
            sequalizeErrorHandler.handleSequalizeError(ctx, error)
          });
        })
          .catch((error) => {
            sequalizeErrorHandler.handleSequalizeError(ctx, error)
          });

      }).catch((error) => {
        sequalizeErrorHandler.handleSequalizeError(ctx, error)
      });
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
      }).catch((error) => {
        sequalizeErrorHandler.handleSequalizeError(ctx, error)
      });
    }
    else {
      return user.findOne({
        where: {
          uuid: ctx.request.body.userid,
        },
        attributes: ['id', 'uuid']
      }).then((result) => {

        return user.update(
          {
            referral_progress: 80
          },
          {
            where:
              { id: result.id }
          }
        ).then((updateResult) => {

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

            result.setReferral_reason(fetchResult.id)

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
            }).catch((error) => {
              sequalizeErrorHandler.handleSequalizeError(ctx, error)
            });
          }).catch((error) => {
            sequalizeErrorHandler.handleSequalizeError(ctx, error)
          });
        }).catch((error) => {
          sequalizeErrorHandler.handleSequalizeError(ctx, error)
        });

        //-------------------------------------------------------------------------------------------------
      }).catch((error) => {
        sequalizeErrorHandler.handleSequalizeError(ctx, error)
      });
    }
  }
}

exports.fetchReferral = ctx => {
  const user = ctx.orm().Referral;
  const referral = ctx.orm().Reason


  return user.findOne({
    where: {
      uuid: ctx.request.body.userid,
    },
    attributes: ['id', 'uuid']
  }).then((fetchResult) => {
    console.log(fetchResult)
    return user.findAll({
      include: [
        {
          model: ctx.orm().Reason,
          nested: true,
          as: 'referral_reason',
        },
      ],
      where: {
        id: fetchResult.id,
      },
    }).then((userResult) => {
      console.log(userResult);
      console.log(userResult[0].referral_reason[0].id)
      var refId = userResult[0].referral_reason[0].id;

      return referral.findOne({
        where: {
          id: refId,
        },

      }).then((referralResult) => {
        console.log(referralResult)
        return ctx.body = referralResult;
      }).catch((error) => {
        sequalizeErrorHandler.handleSequalizeError(ctx, error)
      });
    }).catch((error) => {
      console.log(error);
      sequalizeErrorHandler.handleSequalizeError(ctx, error)
    });

  }).catch((error) => {
    sequalizeErrorHandler.handleSequalizeError(ctx, error)
  });

  // else if (ctx.request.body.role == "parent") {
  // }
  // else if (ctx.request.body.role == "professional") {
  // }

}


//Section 5

exports.fetchReview = ctx => {

  const user = ctx.orm().Referral;
  const referral = ctx.orm().Reason
  console.log(ctx.query.user_id);
  if (ctx.query.role == "child") {
    return user.findOne({
      where: {
        uuid: ctx.query.user_id,
      },
      attributes: ['id', 'uuid', 'need_interpreter', 'child_dob', 'contact_parent', 'consent_child', 'registerd_gp','contact_parent_camhs','reason_contact_parent_camhs']
    }).then((eligibilityObj) => {

      return user.findOne({
        include: [
          {
            model: ctx.orm().Referral,
            as: 'parent',
            attributes: ['id', 'parent_name', 'parential_responsibility', 'responsibility_parent_name', 'child_parent_relationship', 'parent_contact_number', 'parent_email', 'parent_same_house', 'parent_address', 'legal_care_status']
          },
        ],
        where: {
          id: eligibilityObj.id,
        },
        attributes: ['id', 'child_NHS', 'child_name', 'child_email', 'child_contact_number', 'child_address', 'can_send_post', 'child_gender', 'child_gender_birth', 'child_sexual_orientation', 'child_ethnicity', 'child_care_adult', 'household_member']
      }).then((aboutObj) => {
        return user.findOne({
          include: [
            {
              model: ctx.orm().Reason,
              nested: true,
              as: 'referral_reason',
            },
          ],
          where: {
            id: eligibilityObj.id,
          },
          attributes: [['id', 'child_id'], 'child_profession', 'child_education_place', 'child_EHCP', 'child_EHAT', 'child_socialworker', 'child_socialworker_name', 'child_socialworker_contact']
        }).then((educationObj) => {


          const section2Obj = {
            child_id: aboutObj.id,
            child_NHS: aboutObj.child_NHS,
            child_name: aboutObj.child_name,
            child_email: aboutObj.child_email,
            child_contact_number: aboutObj.child_contact_number,
            child_address: aboutObj.child_address,
            can_send_post: aboutObj.can_send_post,
            child_gender: aboutObj.child_gender,
            child_gender_birth: aboutObj.child_gender_birth,
            child_sexual_orientation: aboutObj.child_sexual_orientation,
            child_ethnicity: aboutObj.child_ethnicity,
            child_care_adult: aboutObj.child_care_adult,
            household_member: aboutObj.household_member,
            parent_id: aboutObj.parent[0].id,
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
            section2: section2Obj,
            section3: educationObj,
            section4: educationObj.referral_reason[0],
            status: "ok",
            role: ctx.query.role
          }
          return ctx.body = responseData;

        }).catch((error) => {
          console.log("1")
          console.log(error)
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
    return user.findOne({
      where: {
        uuid: ctx.query.user_id,
      },
    }).then((userObj) => {

      return user.findAll({
        include: [
          {
            model: ctx.orm().Referral,
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
              model: ctx.orm().Referral,
              nested: true,
              as: 'parent',
              attributes: ['id', 'child_NHS', 'child_name', 'child_email', 'child_contact_number', 'child_address', 'can_send_post', 'child_gender', 'child_gender_birth', 'child_sexual_orientation', 'child_ethnicity', 'child_care_adult', 'household_member']
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
                model: ctx.orm().Referral,
                nested: true,
                as: 'parent',
                attributes: ['id', 'child_profession', 'child_education_place', 'child_EHCP', 'child_EHAT', 'child_socialworker', 'child_socialworker_contact', 'child_socialworker_name']
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
                  model: ctx.orm().Reason,
                  nested: true,
                  as: 'referral_reason',
                },
              ],
              where: {
                id: elgibilityObj[0].id,
              },
              attributes: ['id']
            }).then((referralResult) => {

              const section1Obj = {
                child_id: elgibilityObj[0].parent[0].id,
                child_dob: elgibilityObj[0].parent[0].child_dob,
                registerd_gp: elgibilityObj[0].parent[0].registerd_gp,
                parent_id: elgibilityObj[0].id,
                consent_child: elgibilityObj[0].consent_child,
                consent_parent: elgibilityObj[0].consent_parent,
                need_interpreter: elgibilityObj[0].need_interpreter,
              }
              const section2Obj = {
                child_id: aboutObj[0].parent[0].id,
                child_NHS: aboutObj[0].parent[0].child_NHS,
                child_name: aboutObj[0].parent[0].child_name,
                child_email: aboutObj[0].parent[0].child_email,
                child_contact_number: aboutObj[0].parent[0].child_contact_number,
                child_address: aboutObj[0].parent[0].child_address,
                can_send_post: aboutObj[0].parent[0].can_send_post,
                child_gender: aboutObj[0].parent[0].child_gender,
                child_gender_birth: aboutObj[0].parent[0].child_gender_birth,
                child_sexual_orientation: aboutObj[0].parent[0].child_sexual_orientation,
                child_ethnicity: aboutObj[0].parent[0].child_ethnicity,
                child_care_adult: aboutObj[0].parent[0].child_care_adult,
                household_member: aboutObj[0].parent[0].household_member,
                parent_id: aboutObj[0].id,
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
                child_id: edu_empObj[0].parent[0].id,
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
                section4: referralResult.referral_reason[0],
                status: "ok",
                role: ctx.request.body.role
              }
              return ctx.body = responseData;
            }).catch((error) => {
              sequalizeErrorHandler.handleSequalizeError(ctx, error)
            });
          }).catch((error) => {
            sequalizeErrorHandler.handleSequalizeError(ctx, error)
          });
        }).catch((error) => {
          sequalizeErrorHandler.handleSequalizeError(ctx, error)
        });

      }).catch((error) => {
        sequalizeErrorHandler.handleSequalizeError(ctx, error)
      });

    }).catch((error) => {
      sequalizeErrorHandler.handleSequalizeError(ctx, error)
    });
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
            model: ctx.orm().Referral,
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
              model: ctx.orm().Referral,
              nested: true,
              as: 'parent',
              attributes: ['id', 'child_NHS', 'child_name', 'child_email', 'child_contact_number', 'child_address', 'can_send_post', 'child_gender', 'child_gender_birth', 'child_sexual_orientation', 'child_ethnicity', 'child_care_adult', 'household_member']
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
                model: ctx.orm().Referral,
                nested: true,
                as: 'professional',
                attributes: [['id', 'child_id'], 'child_profession', 'child_education_place', 'child_EHCP', 'child_EHAT', 'child_socialworker', 'child_socialworker_name', 'child_socialworker_contact']
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
                  model: ctx.orm().Reason,
                  nested: true,
                  as: 'referral_reason',
                },
              ],
              where: {
                id: elgibilityObj.id,
              },
              attributes: ['id']
            }).then((referralResult) => {
              const section1Obj = {
                child_id: elgibilityObj.professional[0].id,
                child_dob: elgibilityObj.professional[0].child_dob,
                registerd_gp: elgibilityObj.professional[0].registerd_gp,
                professional_id: elgibilityObj.id,
                consent_child: elgibilityObj.consent_child,
                consent_parent: elgibilityObj.consent_parent,
                professional_name: elgibilityObj.professional_name,
                professional_email: elgibilityObj.professional_email,
                professional_contact_number: elgibilityObj.professional_contact_number,

              }
              const section2Obj = {
                child_id: aboutObj[0].parent[0].id,
                child_NHS: aboutObj[0].parent[0].child_NHS,
                child_name: aboutObj[0].parent[0].child_name,
                child_email: aboutObj[0].parent[0].child_email,
                child_contact_number: aboutObj[0].parent[0].child_contact_number,
                child_address: aboutObj[0].parent[0].child_address,
                can_send_post: aboutObj[0].parent[0].can_send_post,
                child_gender: aboutObj[0].parent[0].child_gender,
                child_gender_birth: aboutObj[0].parent[0].child_gender_birth,
                child_sexual_orientation: aboutObj[0].parent[0].child_sexual_orientation,
                child_ethnicity: aboutObj[0].parent[0].child_ethnicity,
                child_care_adult: aboutObj[0].parent[0].child_care_adult,
                household_member: aboutObj[0].parent[0].household_member,
                parent_id: aboutObj[0].id,
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
                child_id: edu_empObj[0].professional[0].id,
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
                section4: referralResult.referral_reason[0],
                status: "ok",
                role: ctx.request.body.role
              }
              return ctx.body = responseData;
            }).catch((error) => {
              sequalizeErrorHandler.handleSequalizeError(ctx, error)
            });

          }).catch((error) => {
            sequalizeErrorHandler.handleSequalizeError(ctx, error)
          });
        })
          .catch((error) => {
            sequalizeErrorHandler.handleSequalizeError(ctx, error)
          });
      })
        .catch((error) => {
          sequalizeErrorHandler.handleSequalizeError(ctx, error)
        });
    }).catch((error) => {
      sequalizeErrorHandler.handleSequalizeError(ctx, error)
    });
  }

}

exports.saveReview = ctx => {
  const user = ctx.orm().Referral;
  const uniqueNo = uniqid().toUpperCase();
  return user.findOne({
    where: {
      reference_code: uniqueNo,
    },
  }).then((result) => {
    if (result == null) {
      return user.update({
        referral_progress: 100,
        referral_complete_status: "completed",
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
        sequalizeErrorHandler.handleSequalizeError(ctx, error)
      });
    }
  })
}

exports.getRefNo = ctx => {
  const user = ctx.orm().Referral;
  return user.findOne({
    where: {
      uuid: ctx.query.user_id,
    },
    attributes: ['id', 'uuid', 'reference_code']
  }).then((result) => {
    return ctx.body = result;
  })
}
exports.updateAboutInfo = ctx => {
  const user = ctx.orm().Referral;
  return user.update({
    can_send_post: ctx.request.body.section2Data.can_send_post,
    child_NHS: ctx.request.body.section2Data.child_NHS,
    child_address: ctx.request.body.section2Data.child_address,
    child_care_adult: ctx.request.body.section2Data.child_care_adult,

    child_contact_number: ctx.request.body.section2Data.child_contact_number,
    child_email: ctx.request.body.section2Data.child_email,
    child_ethnicity: ctx.request.body.section2Data.child_ethnicity,
    child_gender: ctx.request.body.section2Data.child_gender,

    child_gender_birth: ctx.request.body.section2Data.child_gender_birth,
    child_name: ctx.request.body.section2Data.child_name,
    child_sexual_orientation: ctx.request.body.section2Data.child_sexual_orientation,
  },
    {
      where: {
        id: ctx.request.body.section2Data.child_id,
      }
    }).then((childUpdate) => {

      return user.update(
        {
          legal_care_status: ctx.request.body.section2Data.legal_care_status,
          parent_address: ctx.request.body.section2Data.parent_address,
          parent_contact_number: ctx.request.body.section2Data.parent_contact_number,
          parent_email: ctx.request.body.section2Data.parent_email,
          parent_name: ctx.request.body.section2Data.parent_name,
          parent_same_house: ctx.request.body.section2Data.parent_same_house,
          parential_responsibility: ctx.request.body.section2Data.parential_responsibility,
          child_parent_relationship: ctx.request.body.section2Data.child_parent_relationship,
        },
        {
          where: {
            id: ctx.request.body.section2Data.parent_id,
          },
        }
      ).then((parentUpdate) => {

        return user.findOne({
          where: {
            id: ctx.request.body.section2Data.child_id,
          },
          attributes: ['id', 'uuid', 'can_send_post', 'child_NHS', 'child_address', 'child_care_adult', 'child_contact_number', 'child_email', 'child_ethnicity', 'child_gender', 'child_gender_birth', 'child_name', 'child_parent_relationship', 'child_sexual_orientation','household_member']
        }).then((childResult) => {

          return user.findOne({
            where: {
              id: ctx.request.body.section2Data.parent_id,
            },
            attributes: ['id', 'uuid', 'legal_care_status', 'parent_address', 'parent_contact_number', 'parent_email', 'parent_name', 'parent_same_house', 'parential_responsibility','child_parent_relationship']
          }).then((parentResult) => {

            const section2Obj = {
              child_id: childResult.id,
              child_NHS: childResult.child_NHS,
              child_name: childResult.child_name,
              child_email: childResult.child_email,
              child_contact_number: childResult.child_contact_number,
              child_address: childResult.child_address,
              can_send_post: childResult.can_send_post,
              child_gender: childResult.child_gender,
              child_gender_birth: childResult.child_gender_birth,
              child_sexual_orientation: childResult.child_sexual_orientation,
              child_ethnicity: childResult.child_ethnicity,
              child_care_adult: childResult.child_care_adult,
              household_member: childResult.household_member,
              parent_id: parentResult.id,
              parent_name: parentResult.parent_name,
              parential_responsibility: parentResult.parential_responsibility,
              child_parent_relationship: parentResult.child_parent_relationship,
              parent_contact_number: parentResult.parent_contact_number,
              parent_email: parentResult.parent_email,
              parent_same_house: parentResult.parent_same_house,
              parent_address: parentResult.parent_address,
              legal_care_status: parentResult.legal_care_status,
            }
            return ctx.res.ok({
              data: section2Obj,
              message: reponseMessages[1001],
            });

          })
        })
      })
    })
}
exports.updateSec3Info = ctx => {
  const user = ctx.orm().Referral;
  return user.update({
    child_EHAT: ctx.request.body.section3Data.child_EHAT,
    child_EHCP: ctx.request.body.section3Data.child_EHCP,
    child_education_place: ctx.request.body.section3Data.child_education_place,
    child_profession: ctx.request.body.section3Data.child_profession,

    child_socialworker: ctx.request.body.section3Data.child_socialworker,
    child_socialworker_contact: ctx.request.body.section3Data.child_socialworker_contact,
    child_socialworker_name: ctx.request.body.section3Data.child_socialworker_name,
  },
    {
      where: {
        id: ctx.request.body.section3Data.child_id,
      }
    }).then((childResult) => {
      return user.findOne({
        where: {
          id: ctx.request.body.section3Data.child_id,
        },
        attributes: [['id', 'child_id'], 'uuid', 'child_EHAT', 'child_EHCP', 'child_education_place', 'child_profession', 'child_socialworker', 'child_socialworker_contact', 'child_socialworker_name']
      }).then((eduResult) => {
        return ctx.res.ok({
          data: eduResult,
          message: reponseMessages[1001]
        });
      })
    })
}

exports.updateSec4Info = ctx => {
  const reason = ctx.orm().Reason
  return reason.update({
    referral_type: ctx.request.body.section4Data.referral_type,
    is_covid: ctx.request.body.section4Data.is_covid,
    referral_issues: ctx.request.body.section4Data.referral_issues,
    has_anything_helped: ctx.request.body.section4Data.has_anything_helped,
    any_particular_trigger: ctx.request.body.section4Data.any_particular_trigger,
    disabilities: ctx.request.body.section4Data.disabilities,

    //   any_other_services: ctx.request.body.section4Data.any_other_services,
    //   any_particular_trigger: ctx.request.body.section4Data.any_particular_trigger,
    //   currently_accessing_services: ctx.request.body.section4Data.currently_accessing_services,
    //   diagnosis: ctx.request.body.section4Data.diagnosis,
    //  diagnosis_other: ctx.request.body.section4Data.diagnosis_other,
    //   disabilities: ctx.request.body.section4Data.disabilities,
    //   has_anything_helped: ctx.request.body.section4Data.has_anything_helped,
    //   is_covid: ctx.request.body.section4Data.is_covid,
    //   local_services: ctx.request.body.section4Data.local_services,
    //   mental_health_diagnosis: ctx.request.body.section4Data.mental_health_diagnosis,
    //   referral_issues: ctx.request.body.section4Data.referral_issues,
    //   referral_type: ctx.request.body.section4Data.referral_type,
    //   services: ctx.request.body.section4Data.services,
    //  symptoms: ctx.request.body.section4Data.symptoms,
    //  symptoms_other: ctx.request.body.section4Data.symptoms_other,
    //   symptoms_supportneeds: ctx.request.body.section4Data.symptoms_supportneeds,
  },
    {
      where: {
        id: ctx.request.body.section4Data.id,
      }
    }).then((referralUpdate) => {
      return reason.findOne({
        where: {
          id: ctx.request.body.section4Data.id,
        },
        attributes: ['id', 'any_other_services', 'any_particular_trigger', 'currently_accessing_services', 'diagnosis', 'diagnosis_other', 'disabilities', 'has_anything_helped', 'is_covid', 'local_services', 'mental_health_diagnosis', 'referral_issues', 'referral_type', 'services', 'symptoms', 'symptoms_other', 'symptoms_supportneeds']
      }).then((referralResult) => {
        return ctx.res.ok({
          data: referralResult,
          message: reponseMessages[1001]
        });
      }).catch((error) => {
        console.log(error)
        sequalizeErrorHandler.handleSequalizeError(ctx, error)
      });
    }).catch((error) => {
      sequalizeErrorHandler.handleSequalizeError(ctx, error)
    });
}

exports.updateEligibilityInfo = ctx => {
  const user = ctx.orm().Referral;
  return user.update({
    professional_name: ctx.request.body.section1Data.professional_name,
    professional_email: ctx.request.body.section1Data.professional_email,
    professional_contact_number: ctx.request.body.section1Data.professional_contact_number,
  },
    {
      where: {
        id: ctx.request.body.section1Data.professional_id,
      }
    }).then((childResult) => {
      return user.findOne({
        where: {
          id: ctx.request.body.section1Data.child_id,
        },
        attributes: ['id', 'child_dob', 'registerd_gp']
      }).then((elgibilityObj) => {
        return user.findOne({
          where: {
            id: ctx.request.body.section1Data.professional_id,
          },
          attributes: ['id', 'uuid', 'professional_name', 'professional_email', 'professional_contact_number', 'consent_child', 'consent_parent']
        }).then((professionalObj) => {
          const section1Obj = {
            child_id: ctx.request.body.section1Data.child_id,
            child_dob: elgibilityObj.child_dob,
            registerd_gp: elgibilityObj.registerd_gp,
            professional_id: ctx.request.body.section1Data.professional_id,
            consent_child: professionalObj.consent_child,
            consent_parent: professionalObj.consent_parent,
            professional_name: professionalObj.professional_name,
            professional_email: professionalObj.professional_email,
            professional_contact_number: professionalObj.professional_contact_number,
          }
          return ctx.res.ok({
            data: section1Obj,
            message: reponseMessages[1001]
          });

        })
      })
        .catch((error) => {
          sequalizeErrorHandler.handleSequalizeError(ctx, error)
        });
    })
}

//for login user

exports.getIncompleteReferral = ctx => {
  console.log("===>", ctx.request.decryptedUser)
  const userReferral = ctx.orm().Referral;
  const refId = [];
  const childDataId = [];
  const parentDataId = [];
  const professionalDataId = [];
  return userReferral.findAll({
    where: {
      login_id: ctx.query.loginId,
      user_role: ctx.query.userRole,
      referral_complete_status: "incomplete"
    },
    attributes: ['id', 'user_role']
  }).then((userData) => {
    //
    userData.forEach(
      (user) => {
        refId.push(user.dataValues.id)
      })
    // console.log(refId)
    if (ctx.query.userRole == "child") {
      return userReferral.findAll({
        where: {
          id: refId,
        },
        attributes: ['id']
      }).then((eligibilityData) => {

        userData.forEach(
          (user) => {
            childDataId.push(user.dataValues.id)
          })
        // return ctx.body = eligibilityObj;
        return userReferral.findAll({
          include: [
            {
              model: ctx.orm().Referral,
              as: 'parent',
              attributes: ['id', 'parent_name', 'parent_contact_number', 'parent_email']
            },
          ],
          where: {
            id: childDataId,
          },
          attributes: ['id', 'child_name', 'child_email', 'child_contact_number', 'referral_progress']
        }).then((aboutObj) => {
          return ctx.res.ok({
            data: aboutObj,
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
    else if (ctx.query.userRole == "parent") {
      return userReferral.findAll({
        where: {
          id: refId,
        },
        attributes: ['id']
      }).then((parentData) => {

        userData.forEach(
          (user) => {
            parentDataId.push(user.dataValues.id)
          })
        return userReferral.findAll({
          include: [
            {
              model: ctx.orm().Referral,
              as: 'parent',
              attributes: ['id', 'child_name', 'child_email', 'child_contact_number']
            },
          ],
          where: {
            id: parentDataId,
          },
          attributes: ['id', 'parent_name', 'parent_contact_number', 'parent_email', 'referral_progress']
        }).then((aboutObj) => {
          return ctx.res.ok({
            data: aboutObj,
          });

        }).catch((error) => {
          sequalizeErrorHandler.handleSequalizeError(ctx, error)
        });
      }).catch((error) => {
        sequalizeErrorHandler.handleSequalizeError(ctx, error)
      });

    }
    else if (ctx.query.userRole == "professional") {

      return userReferral.findAll({
        where: {
          id: refId,
        },
      }).then((userObj) => {

        userData.forEach(
          (user) => {
            professionalDataId.push(user.dataValues.id)
          })

        return userReferral.findAll({

          include: [
            {
              model: ctx.orm().Referral,
              nested: true,
              as: 'professional',
              attributes: ['id', 'child_name', 'child_email', 'child_contact_number']
            },
          ],
          where: {
            id: professionalDataId,
          },
          attributes: ['id', 'uuid', 'professional_name', 'professional_email', 'professional_contact_number', 'referral_progress']
        }).then((elgibilityObj) => {
          return ctx.res.ok({
            data: elgibilityObj,
          });
        })
          .catch((error) => {
            sequalizeErrorHandler.handleSequalizeError(ctx, error)
          });
      }).catch((error) => {
        sequalizeErrorHandler.handleSequalizeError(ctx, error)
      });
    }
  }).catch((error) => {
    console.log(error)
    sequalizeErrorHandler.handleSequalizeError(ctx, error)
  })
}
exports.getUserReferral = ctx => {
  const ref = ctx.orm().Referral;
  console.log(ctx.query)
  return ref.findAll({
    where: {
      login_id: ctx.query.loginId,
      referral_progress: {
        [Op.ne]: null
      },
      referral_complete_status: ctx.query.referralType
    },
    order: [
      ['createdAt', 'DESC'],
    ],
  }).then((result) => {

    let finalObj = {}
    let sendObj = {};
    let sendReferral = [];
    result.forEach((games, index) => {
      const date = convertDate(games.createdAt)
      result[index].date = date;
      if (finalObj[date]) {
        finalObj[date].push(games);
      } else {
        finalObj[date] = [games];
      }
    })

    return ctx.body = result
  })
}
function convertDate(date) {
  var yyyy = date.getFullYear().toString();
  var mm = (date.getMonth() + 1).toString();
  var dd = date.getDate().toString();
  var mmChars = mm.split('');
  var ddChars = dd.split('');
  return (ddChars[1] ? dd : "0" + ddChars[0]) + '-' + (mmChars[1] ? mm : "0" + mmChars[0]) + '-' + yyyy;
}