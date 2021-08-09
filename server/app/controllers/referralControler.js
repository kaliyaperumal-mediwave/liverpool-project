const P = require("pino");
var uniqid = require('uniqid');
const sequalizeErrorHandler = require('../middlewares/errorHandler');
const reponseMessages = require('../middlewares/responseMessage');
const email = require('../utils/email');
const Op = require('sequelize').Op;
const adminCtrl = require('./adminController');
exports.eligibility = ctx => {
  ////console.log(ctx.request.body)
  const user = ctx.orm().Referral;
  ////console.log(ctx.request.decryptedUser)
  if (ctx.request.body.role == "child") {
    //checking update operation or not
    if (ctx.request.body.editFlag != null) {
      return user.update({
        need_interpreter: ctx.request.body.interpreter,
        child_dob: ctx.request.body.child_Dob,
        contact_parent: ctx.request.body.contactParent,
        consent_child: ctx.request.body.isInformation,
        registered_gp: ctx.request.body.registered_gp,
        contact_parent_camhs: ctx.request.body.contact_parent_camhs,
        reason_contact_parent_camhs: ctx.request.body.reason_contact_parent_camhs,
        gp_school: ctx.request.body.gpSchool,
        registered_gp_postcode: ctx.request.body.registered_gp_postcode
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
      //for logined user
      if (ctx.request.decryptedUser != undefined) {
        //////console.log(ctx.request.body)
        return user.create({
          need_interpreter: ctx.request.body.interpreter,
          child_dob: ctx.request.body.child_Dob,
          contact_parent: ctx.request.body.contactParent,
          consent_child: ctx.request.body.isInformation,
          registered_gp: ctx.request.body.registered_gp,
          user_role: ctx.request.body.role,
          login_id: ctx.request.decryptedUser.id,
          contact_parent_camhs: ctx.request.body.contact_parent_camhs,
          reason_contact_parent_camhs: ctx.request.body.reason_contact_parent_camhs,
          gp_school: ctx.request.body.gpSchool,
          referral_progress: 20,
          referral_complete_status: 'incomplete',
          registered_gp_postcode: ctx.request.body.registered_gp_postcode
        }).then((childUserInfo) => {
          childUserInfo.setType("1")
          const responseData = {
            userid: childUserInfo.uuid,
            user_role: childUserInfo.user_role,
            status: "ok",
          }
          return ctx.body = responseData;
        }).catch((error) => {
          ////console.log(error)
          sequalizeErrorHandler.handleSequalizeError(ctx, error)
        });
      }
      //for normal user
      else {
        return user.create({
          need_interpreter: ctx.request.body.interpreter,
          child_dob: ctx.request.body.child_Dob,
          contact_parent: ctx.request.body.contactParent,
          consent_child: ctx.request.body.isInformation,
          registered_gp: ctx.request.body.registered_gp,
          user_role: ctx.request.body.role,
          contact_parent_camhs: ctx.request.body.contact_parent_camhs,
          reason_contact_parent_camhs: ctx.request.body.reason_contact_parent_camhs,
          gp_school: ctx.request.body.gpSchool,
          referral_progress: 20,
          referral_complete_status: 'incomplete',
          registered_gp_postcode: ctx.request.body.registered_gp_postcode
        }).then((childUserInfo) => {
          childUserInfo.setType("1")
          const responseData = {
            userid: childUserInfo.uuid,
            user_role: childUserInfo.user_role,
            status: "ok",
          }
          return ctx.body = responseData;
        }).catch((error) => {
          ////console.log(error)
          sequalizeErrorHandler.handleSequalizeError(ctx, error)
        });
      }
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
            registered_gp: ctx.request.body.registered_gp,
            gp_school: ctx.request.body.gpSchool,
            registered_gp_postcode: ctx.request.body.registered_gp_postcode
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
      if (ctx.request.decryptedUser != undefined) {
        return user.create({
          child_dob: ctx.request.body.child_Dob,
          registered_gp: ctx.request.body.registered_gp,
          gp_school: ctx.request.body.gpSchool,
          registered_gp_postcode: ctx.request.body.registered_gp_postcode
        }).then((childUserInfo) => {
          childUserInfo.setType("1")
          return user.create({
            need_interpreter: ctx.request.body.interpreter,
            consent_child: ctx.request.body.isInformation,
            user_role: ctx.request.body.role,
            referral_complete_status: 'incomplete',
            login_id: ctx.request.decryptedUser.id,
            referral_progress: 20
          }).then((parentUserInfo) => {
            parentUserInfo.setType("2")
            parentUserInfo.setParent(childUserInfo.id)
            const responseData = {
              userid: parentUserInfo.uuid,
              user_role: parentUserInfo.user_role,
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
      else {
        return user.create({
          child_dob: ctx.request.body.child_Dob,
          registered_gp: ctx.request.body.registered_gp,
          gp_school: ctx.request.body.gpSchool,
          registered_gp_postcode: ctx.request.body.registered_gp_postcode
        }).then((childUserInfo) => {
          childUserInfo.setType("1")
          return user.create({
            need_interpreter: ctx.request.body.interpreter,
            consent_child: ctx.request.body.isInformation,
            user_role: ctx.request.body.role,
            referral_complete_status: 'incomplete',
            referral_progress: 20
          }).then((parentUserInfo) => {
            parentUserInfo.setType("2")
            parentUserInfo.setParent(childUserInfo.id)
            const responseData = {
              userid: parentUserInfo.uuid,
              user_role: parentUserInfo.user_role,
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
  }

  else if (ctx.request.body.role == "professional") {
    console.log(ctx.request.body)
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
            registered_gp: ctx.request.body.profregistered_gp,
            gp_school: ctx.request.body.gpSchool,
            registered_gp_postcode: ctx.request.body.profRegistered_gp_postcode
          },
            {
              where:
                { id: childId }
            }).then((childUserInfo) => {
              return user.update({
                professional_firstname: ctx.request.body.profFirstName,
                professional_lastname: ctx.request.body.proflastName,
                professional_email: ctx.request.body.profEmail,
                professional_contact_number: ctx.request.body.profContactNumber,
                professional_contact_type: ctx.request.body.professional_contact_type,
                professional_address: ctx.request.body.profAddress,
                professional_address_postcode: ctx.request.body.profAddress_postcode,
                professional_profession: ctx.request.body.profProfession,
                professional_manual_address: ctx.request.body.professionalManualAddress,
                consent_parent: ctx.request.body.contactProfParent,
                consent_child: ctx.request.body.parentConcernInformation,
                service_location: ctx.request.body.profDirectService,
                selected_service: ctx.request.body.selectedService,
                referral_provider: ctx.request.body.selectedService
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
      if (ctx.request.decryptedUser != undefined) {

        return user.create({
          child_dob: ctx.request.body.prof_ChildDob,
          registered_gp: ctx.request.body.profregistered_gp,
          gp_school: ctx.request.body.gpSchool,
          registered_gp_postcode: ctx.request.body.profRegistered_gp_postcode
        }).then((childUserInfo) => {
          childUserInfo.setType("1")
          return user.create({
            professional_firstname: ctx.request.body.profFirstName,
            professional_lastname: ctx.request.body.proflastName,
            professional_email: ctx.request.body.profEmail,
            professional_contact_type: ctx.request.body.professional_contact_type,
            professional_contact_number: ctx.request.body.profContactNumber,
            professional_address: ctx.request.body.profAddress,
            professional_address_postcode: ctx.request.body.profAddress_postcode,
            professional_profession: ctx.request.body.profProfession,
            professional_manual_address: ctx.request.body.professionalManualAddress,
            service_location: ctx.request.body.profDirectService,
            selected_service: ctx.request.body.selectedService,
            referral_provider: ctx.request.body.selectedService,
            consent_parent: ctx.request.body.contactProfParent,
            consent_child: ctx.request.body.parentConcernInformation,
            login_id: ctx.request.decryptedUser.id,
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
                user_role: professionalUserInfo.user_role,
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
      else {
        return user.create({
          child_dob: ctx.request.body.prof_ChildDob,
          registered_gp: ctx.request.body.profregistered_gp,
          gp_school: ctx.request.body.gpSchool,
          registered_gp_postcode: ctx.request.body.profRegistered_gp_postcode
        }).then((childUserInfo) => {
          childUserInfo.setType("1")
          return user.create({
            professional_firstname: ctx.request.body.profFirstName,
            professional_lastname: ctx.request.body.proflastName,
            professional_email: ctx.request.body.profEmail,
            professional_contact_number: ctx.request.body.profContactNumber,
            professional_contact_type: ctx.request.body.professional_contact_type,
            professional_address: ctx.request.body.profAddress,
            professional_address_postcode: ctx.request.body.profAddress_postcode,
            professional_manual_address: ctx.request.body.professionalManualAddress,
            professional_profession: ctx.request.body.profProfession,
            service_location: ctx.request.body.profDirectService,
            selected_service: ctx.request.body.selectedService,
            referral_provider: ctx.request.body.selectedService,
            consent_parent: ctx.request.body.contactProfParent,
            consent_child: ctx.request.body.parentConcernInformation,
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
                user_role: professionalUserInfo.user_role,
                status: "ok"
              }
              return ctx.body = responseData;
            }).catch((error) => {
              //////console.log(error);
              sequalizeErrorHandler.handleSequalizeError(ctx, error)
            });

          }).catch((error) => {
            // ////console.log(error);
            sequalizeErrorHandler.handleSequalizeError(ctx, error)
          });
        }).catch((error) => {
          ////console.log(error);
          sequalizeErrorHandler.handleSequalizeError(ctx, error)
        });
      }
    }
  }
};


exports.fetchEligibility = ctx => {

  ////console.log(ctx.query)
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

        return user.update(
          {
            referral_progress: ctx.request.body.aboutData.referral_progress
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

            var parentid = userResult[0].parent[0].ChildParents.parentId
            return user.update(
              {
                child_firstname: ctx.request.body.aboutData.childFirstName,
                child_lastname: ctx.request.body.aboutData.childLastName,
                child_name_title: ctx.request.body.aboutData.childNameTitle,
                child_NHS: ctx.request.body.aboutData.nhsNumber,
                child_email: ctx.request.body.aboutData.childEmail,
                child_contact_number: ctx.request.body.aboutData.childContactNumber,
                child_address: ctx.request.body.aboutData.childAddress,
                child_address_postcode: ctx.request.body.aboutData.childAddressPostcode,
                child_manual_address: ctx.request.body.aboutData.childManualAddress,
                can_send_post: ctx.request.body.aboutData.sendPost,
                child_gender: ctx.request.body.aboutData.childGender,
                child_gender_birth: ctx.request.body.aboutData.childIdentity,
                child_sexual_orientation: ctx.request.body.aboutData.childSexualOrientation,
                child_ethnicity: ctx.request.body.aboutData.childEthnicity,
                household_member: ctx.request.body.allHouseHoldMembers,
                child_household_profession: ctx.request.body.aboutData.houseHoldProfession,
                child_care_adult: ctx.request.body.aboutData.childCareAdult,
                child_contact_type: ctx.request.body.aboutData.contactMode,
                sex_at_birth: ctx.request.body.aboutData.sexAssignedAtBirth,
              },
              {
                where:
                  { id: result.id }
              }
            ).then((result) => {

              return user.update(
                {
                  parent_firstname: ctx.request.body.aboutData.parentFirstName,
                  parent_lastname: ctx.request.body.aboutData.parentLastName,
                  parental_responsibility: ctx.request.body.aboutData.parentialResponsibility,
                  responsibility_parent_firstname: ctx.request.body.aboutData.parentCarerFirstName,
                  responsibility_parent_lastname: ctx.request.body.aboutData.parentCarerLastName,
                  child_parent_relationship: ctx.request.body.aboutData.relationshipToYou,
                  parent_contact_type: ctx.request.body.aboutData.parentContactMode,
                  parent_contact_number: ctx.request.body.aboutData.contactNumber,
                  parent_email: ctx.request.body.aboutData.emailAddress,
                  parent_same_house: ctx.request.body.aboutData.sameHouse,
                  parent_address: ctx.request.body.aboutData.parentOrCarrerAddress,
                  parent_address_postcode: ctx.request.body.aboutData.parentOrCarrerAddressPostcode,
                  parent_manual_address: ctx.request.body.aboutData.parentManualAddress,
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
            referral_progress: ctx.request.body.aboutData.referral_progress
          },
          {
            where:
              { id: result.id }
          }
        ).then((updateResult) => {

          return user.update(
            {
              child_firstname: ctx.request.body.aboutData.childFirstName,
              child_lastname: ctx.request.body.aboutData.childLastName,
              child_name_title: ctx.request.body.aboutData.childNameTitle,
              child_NHS: ctx.request.body.aboutData.nhsNumber,
              child_email: ctx.request.body.aboutData.childEmail,
              child_contact_number: ctx.request.body.aboutData.childContactNumber,
              child_address_postcode: ctx.request.body.aboutData.childAddressPostcode,
              child_address: ctx.request.body.aboutData.childAddress,
              child_manual_address: ctx.request.body.aboutData.childManualAddress,
              can_send_post: ctx.request.body.aboutData.sendPost,
              child_gender: ctx.request.body.aboutData.childGender,
              child_gender_birth: ctx.request.body.aboutData.childIdentity,
              child_sexual_orientation: ctx.request.body.aboutData.childSexualOrientation,
              child_ethnicity: ctx.request.body.aboutData.childEthnicity,
              household_member: ctx.request.body.allHouseHoldMembers,
              child_household_profession: ctx.request.body.aboutData.houseHoldProfession,
              child_care_adult: ctx.request.body.aboutData.childCareAdult,
              child_contact_type: ctx.request.body.aboutData.contactMode,
              sex_at_birth: ctx.request.body.aboutData.sexAssignedAtBirth,
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

              ////console.log(userResult.id + "====>" + userResult.uuid);
              return user.create({
                parent_firstname: ctx.request.body.aboutData.parentFirstName,
                parent_lastname: ctx.request.body.aboutData.parentLastName,
                parental_responsibility: ctx.request.body.aboutData.parentialResponsibility,
                responsibility_parent_firstname: ctx.request.body.aboutData.parentCarerFirstName,
                responsibility_parent_lastname: ctx.request.body.aboutData.parentCarerLastName,
                child_parent_relationship: ctx.request.body.aboutData.relationshipToYou,
                parent_contact_number: ctx.request.body.aboutData.contactNumber,
                parent_contact_type: ctx.request.body.aboutData.parentContactMode,
                parent_email: ctx.request.body.aboutData.emailAddress,
                parent_same_house: ctx.request.body.aboutData.sameHouse,
                parent_address: ctx.request.body.aboutData.parentOrCarrerAddress,
                parent_address_postcode: ctx.request.body.aboutData.parentOrCarrerAddressPostcode,
                parent_manual_address: ctx.request.body.aboutData.parentManualAddress,
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
        ////console.log(ctx.request.body.allHouseHoldMembers)
        return user.update(
          {
            child_firstname: ctx.request.body.aboutData.childFirstName,
            child_lastname: ctx.request.body.aboutData.childLastName,
            child_name_title: ctx.request.body.aboutData.childNameTitle,
            child_NHS: ctx.request.body.aboutData.nhsNumber,
            child_email: ctx.request.body.aboutData.childEmail,
            child_contact_number: ctx.request.body.aboutData.childContactNumber,
            child_address: ctx.request.body.aboutData.childAddress,
            child_address_postcode: ctx.request.body.aboutData.childAddressPostcode,
            child_manual_address: ctx.request.body.aboutData.childManualAddress,
            can_send_post: ctx.request.body.aboutData.sendPost,
            child_gender: ctx.request.body.aboutData.childGender,
            child_gender_birth: ctx.request.body.aboutData.childIdentity,
            child_sexual_orientation: ctx.request.body.aboutData.childSexualOrientation,
            child_ethnicity: ctx.request.body.aboutData.childEthnicity,
            parental_responsibility: ctx.request.body.aboutData.parentialResponsibility,
            household_member: ctx.request.body.allHouseHoldMembers,
            child_household_profession: ctx.request.body.aboutData.houseHoldProfession,
            child_care_adult: ctx.request.body.aboutData.childCareAdult,
            child_contact_type: ctx.request.body.aboutData.contactMode,
            sex_at_birth: ctx.request.body.aboutData.sexAssignedAtBirth,
          },
          {
            where:
              { id: childId }
          }
        ).then((updateResult) => {
          return user.update({
            parent_firstname: ctx.request.body.aboutData.parentFirstName,
            parent_lastname: ctx.request.body.aboutData.parentLastName,
            child_name_title: ctx.request.body.aboutData.childNameTitle,
            parental_responsibility: ctx.request.body.aboutData.parentialResponsibility,
            responsibility_parent_firstname: ctx.request.body.aboutData.parentCarerFirstName,
            responsibility_parent_lastname: ctx.request.body.aboutData.parentCarerLastName,
            child_parent_relationship: ctx.request.body.aboutData.relationshipToYou,
            parent_contact_number: ctx.request.body.aboutData.contactNumber,
            parent_contact_type: ctx.request.body.aboutData.parentContactMode,
            parent_email: ctx.request.body.aboutData.emailAddress,
            parent_same_house: ctx.request.body.aboutData.sameHouse,
            parent_address: ctx.request.body.aboutData.parentOrCarrerAddress,
            parent_address_postcode: ctx.request.body.aboutData.parentOrCarrerAddressPostcode,
            parent_manual_address: ctx.request.body.aboutData.parentManualAddress,
            legal_care_status: ctx.request.body.aboutData.legalCareStatus,
            referral_progress: ctx.request.body.aboutData.referral_progress
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
    //  ////console.log(ctx.request.body)
    if (ctx.request.body.editFlag != null) {
      //   ////console.log(ctx.request.body)
      // return ctx.body = ctx.request.body;
      return user.findOne({
        where: {
          uuid: ctx.request.body.userid,
        },
        attributes: ['id', 'uuid']
      }).then((result) => {
        return user.update(
          {
            referral_progress: ctx.request.body.aboutData.referral_progress
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
            return user.update(
              {
                child_firstname: ctx.request.body.aboutData.childFirstName,
                child_lastname: ctx.request.body.aboutData.childLastName,
                child_name_title: ctx.request.body.aboutData.childNameTitle,
                child_NHS: ctx.request.body.aboutData.nhsNumber,
                child_email: ctx.request.body.aboutData.childEmail,
                child_contact_number: ctx.request.body.aboutData.childContactNumber,
                child_address: ctx.request.body.aboutData.childAddress,
                child_address_postcode: ctx.request.body.aboutData.childAddressPostcode,
                child_manual_address: ctx.request.body.aboutData.childManualAddress,
                can_send_post: ctx.request.body.aboutData.sendPost,
                child_gender: ctx.request.body.aboutData.childGender,
                child_gender_birth: ctx.request.body.aboutData.childIdentity,
                child_sexual_orientation: ctx.request.body.aboutData.childSexualOrientation,
                child_ethnicity: ctx.request.body.aboutData.childEthnicity,
                parental_responsibility: ctx.request.body.aboutData.parentialResponsibility,
                household_member: ctx.request.body.allHouseHoldMembers,
                child_household_profession: ctx.request.body.aboutData.houseHoldProfession,
                child_care_adult: ctx.request.body.aboutData.childCareAdult,
                child_contact_type: ctx.request.body.aboutData.contactMode,
                sex_at_birth: ctx.request.body.aboutData.sexAssignedAtBirth,
                referral_mode: ctx.request.body.aboutData.referral_mode
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
                  parent_firstname: ctx.request.body.aboutData.parentFirstName,
                  parent_lastname: ctx.request.body.aboutData.parentLastName,
                  parental_responsibility: ctx.request.body.aboutData.parentialResponsibility,
                  responsibility_parent_firstname: ctx.request.body.aboutData.parentCarerFirstName,
                  responsibility_parent_lastname: ctx.request.body.aboutData.parentCarerLastName,
                  child_parent_relationship: ctx.request.body.aboutData.relationshipToYou,
                  parent_contact_number: ctx.request.body.aboutData.contactNumber,
                  parent_contact_type: ctx.request.body.aboutData.parentContactMode,
                  parent_email: ctx.request.body.aboutData.emailAddress,
                  parent_same_house: ctx.request.body.aboutData.sameHouse,
                  parent_address: ctx.request.body.aboutData.parentOrCarrerAddress,
                  parent_address_postcode: ctx.request.body.aboutData.parentOrCarrerAddressPostcode,
                  parent_manual_address: ctx.request.body.aboutData.parentManualAddress,
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
            referral_progress: ctx.request.body.referral_progress
          },
          {
            where:
              { id: result.id }
          }
        ).then((updateResult) => {
          return user.findAll({
            include: [{
              model: ctx.orm().Referral,
              as: 'professional',
              include: [{
                model: ctx.orm().Referral,
                as: 'child_parent',
              }]
            }],
            where: {
              id: result.id,
            },
          }).then((userResult) => {
            var childId = userResult[0].professional[0].ChildProfessional.professionalId
            var parentIdNew = userResult[0].professional[0].child_parent[0].id;
            var parentId = Number(userResult[0].professional[0].ChildProfessional.ReferralId) + 1
            return user.update(
              {
                child_firstname: ctx.request.body.aboutData.childFirstName,
                child_lastname: ctx.request.body.aboutData.childLastName,
                child_name_title: ctx.request.body.aboutData.childNameTitle,
                child_NHS: ctx.request.body.aboutData.nhsNumber,
                child_email: ctx.request.body.aboutData.childEmail,
                child_contact_number: ctx.request.body.aboutData.childContactNumber,
                child_address: ctx.request.body.aboutData.childAddress,
                child_address_postcode: ctx.request.body.aboutData.childAddressPostcode,
                child_manual_address: ctx.request.body.aboutData.childManualAddress,
                can_send_post: ctx.request.body.aboutData.sendPost,
                child_gender: ctx.request.body.aboutData.childGender,
                child_gender_birth: ctx.request.body.aboutData.childIdentity,
                child_sexual_orientation: ctx.request.body.aboutData.childSexualOrientation,
                child_ethnicity: ctx.request.body.aboutData.childEthnicity,
                household_member: ctx.request.body.allHouseHoldMembers,
                child_household_profession: ctx.request.body.aboutData.houseHoldProfession,
                child_care_adult: ctx.request.body.aboutData.childCareAdult,
                child_contact_type: ctx.request.body.aboutData.contactMode,
                sex_at_birth: ctx.request.body.aboutData.sexAssignedAtBirth,
                referral_mode: ctx.request.body.aboutData.referral_mode
              },
              {
                where:
                  { id: childId }
              }
            ).then((updateResult) => {
              return user.update({
                parent_firstname: ctx.request.body.aboutData.parentFirstName,
                parent_lastname: ctx.request.body.aboutData.parentLastName,
                parental_responsibility: ctx.request.body.aboutData.parentialResponsibility,
                responsibility_parent_firstname: ctx.request.body.aboutData.parentCarerFirstName,
                responsibility_parent_lastname: ctx.request.body.aboutData.parentCarerLastName,
                child_parent_relationship: ctx.request.body.aboutData.relationshipToYou,
                parent_contact_type: ctx.request.body.aboutData.parentContactMode,
                parent_contact_number: ctx.request.body.aboutData.contactNumber,
                parent_email: ctx.request.body.aboutData.emailAddress,
                parent_same_house: ctx.request.body.aboutData.sameHouse,
                parent_address: ctx.request.body.aboutData.parentOrCarrerAddress,
                parent_address_postcode: ctx.request.body.aboutData.parentOrCarrerAddressPostcode,
                parent_manual_address: ctx.request.body.aboutData.parentManualAddress,
                legal_care_status: ctx.request.body.aboutData.legalCareStatus,
              },
                {
                  where:
                    { id: parentIdNew }
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
  ////console.log("fetchAbout")
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
          console.log(error)
          sequalizeErrorHandler.handleSequalizeError(ctx, error)
        });

    })
      .catch((error) => {
        console.log(error)
        sequalizeErrorHandler.handleSequalizeError(ctx, error)
      });
  }

  else if (ctx.request.body.role == "professional") {
    return user.findOne({
      where: {
        uuid: ctx.request.body.uuid,
      },
      attributes: ['id', 'uuid', 'referral_progress']
    }).then((professionalResult) => {

      return user.findAll({
        include: [{
          model: ctx.orm().Referral,
          as: 'professional',
          include: [{
            model: ctx.orm().Referral,
            as: 'child_parent',
          }]
        }],
        where: {
          id: professionalResult.id,
        },
      }).then((childResult) => {
        var parentId = Number(childResult[0].professional[0].ChildProfessional.professionalId) + 2
        var parentIdNew = childResult[0].professional[0].child_parent[0].id;
        //  var parentId = Number(childResult[0].professional[0].ChildProfessional.professionalId) + 2
        // return ctx.body = childResult;
        ////console.log(parentId)
        return user.findAll({
          include: [
            {
              model: ctx.orm().Referral,
              nested: true,
              as: 'parent',
            },
          ],
          where: {
            id: parentIdNew,
          },
        }).then((parentResult) => {
          parentResult = JSON.parse(JSON.stringify(parentResult))
          parentResult[0].prof_referral_progress = professionalResult.referral_progress;
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
          referral_progress: ctx.request.body.educAndEmpData.referral_progress
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

          ////console.log(userResult[0].professional[0].ChildProfessional.professionalId)

          var childId = userResult[0].professional[0].ChildProfessional.professionalId

          return user.update(
            {
              child_profession: ctx.request.body.educAndEmpData.position,
              child_education_place: ctx.request.body.educAndEmpData.attendedInfo,
              child_education_place_postcode: ctx.request.body.educAndEmpData.child_education_place_postcode,
              child_education_manual_address: ctx.request.body.educAndEmpData.childEducationManualAddress,
              child_EHCP: ctx.request.body.educAndEmpData.haveEhcpPlan,
              child_EHAT: ctx.request.body.educAndEmpData.haveEhat,

              child_socialworker: ctx.request.body.educAndEmpData.haveSocialWorker,
              child_socialworker_firstname: ctx.request.body.educAndEmpData.socialWorkName,
              child_socialworker_lastname: ctx.request.body.educAndEmpData.socialWorkLastName,
              child_socialworker_contact: ctx.request.body.educAndEmpData.socialWorkContact,
              child_socialworker_contact_type: ctx.request.body.educAndEmpData.socialWorkContactType,
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
              console.log(error);
              sequalizeErrorHandler.handleSequalizeError(ctx, error)
            });
          }).catch((error) => {
            console.log(error);
            sequalizeErrorHandler.handleSequalizeError(ctx, error)
          });
        }).catch((error) => {
          console.log(error);
          sequalizeErrorHandler.handleSequalizeError(ctx, error)
        });
      }).catch((error) => {
        console.log(error);
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
        //  ////console.log(userResult);
        ////console.log(userResult[0].parent[0].ChildParents.parentId)
        var childId = userResult[0].parent[0].ChildParents.parentId

        return user.update(
          {
            child_profession: ctx.request.body.educAndEmpData.position,
            child_education_place: ctx.request.body.educAndEmpData.attendedInfo,
            child_education_manual_address: ctx.request.body.educAndEmpData.childEducationManualAddress,
            child_education_place_postcode: ctx.request.body.educAndEmpData.child_education_place_postcode,
            child_EHCP: ctx.request.body.educAndEmpData.haveEhcpPlan,
            child_EHAT: ctx.request.body.educAndEmpData.haveEhat,

            child_socialworker: ctx.request.body.educAndEmpData.haveSocialWorker,
            child_socialworker_firstname: ctx.request.body.educAndEmpData.socialWorkName,
            child_socialworker_lastname: ctx.request.body.educAndEmpData.socialWorkLastName,
            child_socialworker_contact: ctx.request.body.educAndEmpData.socialWorkContact,
            child_socialworker_contact_type: ctx.request.body.educAndEmpData.socialWorkContactType,

          },
          {
            where:
              { id: childId }
          }
        ).then((updateResult) => {

          return user.update(
            { referral_progress: ctx.request.body.educAndEmpData.referral_progress },
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

      // return user.update(
      //   {
      //     referral_progress: 60
      //   },
      //   {
      //     where:
      //       { id: result.id }
      //   }
      // ).then((updateResult) => {
      return user.update(
        {
          child_profession: ctx.request.body.educAndEmpData.position,
          child_education_place: ctx.request.body.educAndEmpData.attendedInfo,
          child_education_place_postcode: ctx.request.body.educAndEmpData.child_education_place_postcode,
          child_education_manual_address: ctx.request.body.educAndEmpData.childEducationManualAddress,
          child_EHCP: ctx.request.body.educAndEmpData.haveEhcpPlan,
          child_EHAT: ctx.request.body.educAndEmpData.haveEhat,

          child_socialworker: ctx.request.body.educAndEmpData.haveSocialWorker,
          child_socialworker_firstname: ctx.request.body.educAndEmpData.socialWorkName,
          child_socialworker_lastname: ctx.request.body.educAndEmpData.socialWorkLastName,
          child_socialworker_contact: ctx.request.body.educAndEmpData.socialWorkContact,
          referral_progress: ctx.request.body.educAndEmpData.referral_progress,
          child_socialworker_contact_type: ctx.request.body.educAndEmpData.socialWorkContactType
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
      // })
      //   .catch((error) => {
      //     sequalizeErrorHandler.handleSequalizeError(ctx, error)
      //   });

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
        //  ////console.log(userResult);
        return ctx.body = userResult;
        ////console.log(userResult[0].parent[0].ChildParents.parentId)
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
        //  ////console.log(userResult);
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

  ////console.log(ctx.request.body)
  if (ctx.request.body.role == "professional") {

    if (ctx.request.body.editFlag != null) {
      return referral.update(
        {
          referral_type: ctx.request.body.referralData.support,
          is_covid: ctx.request.body.referralData.covid,

          eating_disorder_difficulties: ctx.request.body.eatingDifficulties,
          reason_for_referral: ctx.request.body.reasonForReferral,
          other_reasons_referral: ctx.request.body.referralData.otherReasonsReferral,
          food_fluid_intake: ctx.request.body.referralData.dailyIntakes,
          height: ctx.request.body.referralData.height,
          weight: ctx.request.body.referralData.weight,
          other_eating_difficulties: ctx.request.body.referralData.otherEatingDifficulties,

          //   mental_health_diagnosis: ctx.request.body.referralData.diagnosis,
          //  diagnosis: ctx.request.body.diagnosisList,//--------------------diagnosis list for both mental and eating
          // diagnosis_other: ctx.request.body.referralData.diagnosisOther,
          //  symptoms_supportneeds: ctx.request.body.referralData.supportOrSymptoms,
          //  symptoms: ctx.request.body.problemsList,//--------------------symptoms list for both mental and eating 
          //   symptoms_other: ctx.request.body.referralData.problemsOther,
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

            //  ////console.log(userResult[0].professional[0].ChildProfessional.professionalId)

            var childId = userResult[0].professional[0].ChildProfessional.professionalId

            return referral.create(
              {
                referral_type: ctx.request.body.referralData.support,
                is_covid: ctx.request.body.referralData.covid,

                eating_disorder_difficulties: ctx.request.body.eatingDifficulties,
                reason_for_referral: ctx.request.body.reasonForReferral,
                other_reasons_referral: ctx.request.body.referralData.otherReasonsReferral,
                food_fluid_intake: ctx.request.body.referralData.dailyIntakes,
                height: ctx.request.body.referralData.height,
                weight: ctx.request.body.referralData.weight,
                other_eating_difficulties: ctx.request.body.referralData.otherEatingDifficulties,
                // mental_health_diagnosis: ctx.request.body.referralData.diagnosis,
                // diagnosis: ctx.request.body.diagnosisList,//--------------------diagnosis list for both mental and eating
                // diagnosis_other: ctx.request.body.referralData.diagnosisOther,
                // symptoms_supportneeds: ctx.request.body.referralData.supportOrSymptoms,
                // symptoms: ctx.request.body.problemsList,//--------------------symptoms list for both mental and eating 
                // symptoms_other: ctx.request.body.referralData.problemsOther,
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

          eating_disorder_difficulties: ctx.request.body.eatingDifficulties,
          reason_for_referral: ctx.request.body.reasonForReferral,
          other_reasons_referral: ctx.request.body.referralData.otherReasonsReferral,
          food_fluid_intake: ctx.request.body.referralData.dailyIntakes,
          height: ctx.request.body.referralData.height,
          weight: ctx.request.body.referralData.weight,
          other_eating_difficulties: ctx.request.body.referralData.otherEatingDifficulties,
          // mental_health_diagnosis: ctx.request.body.referralData.diagnosis,
          // diagnosis: ctx.request.body.diagnosisList,//--------------------diagnosis list for both mental and eating
          // diagnosis_other: ctx.request.body.referralData.diagnosisOther,
          // symptoms_supportneeds: ctx.request.body.referralData.supportOrSymptoms,
          // symptoms: ctx.request.body.problemsList,//--------------------symptoms list for both mental and eating 
          // symptoms_other: ctx.request.body.referralData.problemsOther,
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
            //  ////console.log(userResult);
            //////console.log("---------?"+userResult[0].parent[0].ChildParents.parentId)
            var childId = userResult[0].parent[0].ChildParents.parentId
            return referral.create(
              {
                referral_type: ctx.request.body.referralData.support,
                is_covid: ctx.request.body.referralData.covid,

                eating_disorder_difficulties: ctx.request.body.eatingDifficulties,
                reason_for_referral: ctx.request.body.reasonForReferral,
                other_reasons_referral: ctx.request.body.referralData.otherReasonsReferral,
                food_fluid_intake: ctx.request.body.referralData.dailyIntakes,
                height: ctx.request.body.referralData.height,
                weight: ctx.request.body.referralData.weight,
                other_eating_difficulties: ctx.request.body.referralData.otherEatingDifficulties,
                // mental_health_diagnosis: ctx.request.body.referralData.diagnosis,
                // diagnosis: ctx.request.body.diagnosisList,//--------------------diagnosis list for both mental and eating
                // diagnosis_other: ctx.request.body.referralData.diagnosisOther,
                // symptoms_supportneeds: ctx.request.body.referralData.supportOrSymptoms,
                // symptoms: ctx.request.body.problemsList,//--------------------symptoms list for both mental and eating 
                // symptoms_other: ctx.request.body.referralData.problemsOther,
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
              ////console.log(error)
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

          eating_disorder_difficulties: ctx.request.body.eatingDifficulties,
          reason_for_referral: ctx.request.body.reasonForReferral,
          other_reasons_referral: ctx.request.body.referralData.otherReasonsReferral,
          food_fluid_intake: ctx.request.body.referralData.dailyIntakes,
          height: ctx.request.body.referralData.height,
          weight: ctx.request.body.referralData.weight,
          other_eating_difficulties: ctx.request.body.referralData.otherEatingDifficulties,
          // mental_health_diagnosis: ctx.request.body.referralData.diagnosis,
          // diagnosis: ctx.request.body.diagnosisList,//--------------------diagnosis list for both mental and eating
          // diagnosis_other: ctx.request.body.referralData.diagnosisOther,
          // symptoms_supportneeds: ctx.request.body.referralData.supportOrSymptoms,
          // symptoms: ctx.request.body.problemsList,//--------------------symptoms list for both mental and eating 
          // symptoms_other: ctx.request.body.referralData.problemsOther,
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

              eating_disorder_difficulties: ctx.request.body.eatingDifficulties,
              reason_for_referral: ctx.request.body.reasonForReferral,
              other_reasons_referral: ctx.request.body.referralData.otherReasonsReferral,
              food_fluid_intake: ctx.request.body.referralData.dailyIntakes,
              height: ctx.request.body.referralData.height,
              weight: ctx.request.body.referralData.weight,
              other_eating_difficulties: ctx.request.body.referralData.otherEatingDifficulties,

              // mental_health_diagnosis: ctx.request.body.referralData.diagnosis,
              // diagnosis: ctx.request.body.diagnosisList,//--------------------diagnosis list for both mental and eating
              // diagnosis_other: ctx.request.body.referralData.diagnosisOther,
              // symptoms_supportneeds: ctx.request.body.referralData.supportOrSymptoms,
              // symptoms: ctx.request.body.problemsList,//--------------------symptoms list for both mental and eating 
              // symptoms_other: ctx.request.body.referralData.problemsOther,
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
    ////console.log(fetchResult)
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
      if (userResult[0].referral_reason[0] != undefined) {
        var refId = userResult[0].referral_reason[0].id;

        return referral.findOne({
          where: {
            id: refId,
          },

        }).then((referralResult) => {
          ////console.log(referralResult)
          return ctx.body = referralResult;
        }).catch((error) => {
          sequalizeErrorHandler.handleSequalizeError(ctx, error)
        });
      }
      else {
        const responseData = {
          userid: ctx.request.body.userid,
          status: "fail",
        }
        return ctx.body = responseData;
      }
      //  ////console.log(userResult[0].referral_reason[0].id)
    }).catch((error) => {
      ////console.log(error);
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
  if (ctx.query.role == "child") {
    return user.findOne({
      where: {
        uuid: ctx.query.user_id,
      },
      attributes: ['id', 'uuid', 'need_interpreter', 'child_dob', 'contact_parent', 'consent_child', 'registered_gp', 'registered_gp_postcode', 'contact_parent_camhs', 'reason_contact_parent_camhs', 'gp_school']
    }).then((eligibilityObj) => {

      return user.findOne({
        include: [
          {
            model: ctx.orm().Referral,
            as: 'parent',
            attributes: ['id', 'parent_firstname', 'parent_lastname', 'parental_responsibility', 'responsibility_parent_firstname', 'child_parent_relationship', 'parent_contact_number', 'parent_email', 'parent_same_house', 'parent_address', 'legal_care_status', 'parent_contact_type', 'parent_manual_address', 'parent_address_postcode']
          },
        ],
        where: {
          id: eligibilityObj.id,
        },
        attributes: ['id', 'child_NHS', 'child_firstname', 'child_lastname', 'child_name_title', 'child_email', 'child_contact_number', 'child_address', 'can_send_post', 'child_gender', 'child_gender_birth', 'child_sexual_orientation', 'child_ethnicity', 'child_care_adult', 'household_member', 'child_contact_type', 'sex_at_birth', 'child_manual_address', 'child_address_postcode']
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
          attributes: [['id', 'child_id'], 'child_profession', 'child_education_place', 'child_EHCP', 'child_EHAT', 'child_socialworker', 'child_socialworker_firstname', 'child_socialworker_lastname', 'child_socialworker_contact', 'child_socialworker_contact_type', 'child_education_manual_address']
        }).then((educationObj) => {

          eligibilityObj.registered_gp = eligibilityObj.registered_gp_postcode ? eligibilityObj.registered_gp + ', ' + eligibilityObj.registered_gp_postcode : eligibilityObj.registered_gp;
          ////console.log(aboutObj)
          const section2Obj = {
            child_id: aboutObj.id,
            child_NHS: aboutObj.child_NHS,
            child_name: aboutObj.child_firstname,
            child_lastname: aboutObj.child_lastname,
            child_name_title: aboutObj.child_name_title,
            child_email: aboutObj.child_email,
            child_contact_number: aboutObj.child_contact_number,
            child_address: aboutObj.child_address_postcode ? aboutObj.child_address + ',' + aboutObj.child_address_postcode : aboutObj.child_address,
            child_manual_address: aboutObj.child_manual_address,
            can_send_post: aboutObj.can_send_post,
            child_gender: aboutObj.child_gender,
            child_gender_birth: aboutObj.child_gender_birth,
            child_sexual_orientation: aboutObj.child_sexual_orientation,
            child_ethnicity: aboutObj.child_ethnicity,
            child_care_adult: aboutObj.child_care_adult,
            household_member: aboutObj.household_member,
            child_contact_type: aboutObj.child_contact_type,
            sex_at_birth: aboutObj.sex_at_birth,
            parent_id: aboutObj.parent[0].id,
            parent_name: aboutObj.parent[0].parent_firstname,
            parent_lastname: aboutObj.parent[0].parent_lastname,
            parental_responsibility: aboutObj.parent[0].parental_responsibility,
            child_parent_relationship: aboutObj.parent[0].child_parent_relationship,
            parent_contact_number: aboutObj.parent[0].parent_contact_number,
            parent_email: aboutObj.parent[0].parent_email,
            parent_same_house: aboutObj.parent[0].parent_same_house,
            parent_address: +aboutObj.parent[0].parent_address_postcode ? aboutObj.parent[0].parent_address + ',' + aboutObj.parent[0].parent_address_postcode : aboutObj.parent[0].parent_address,
            parent_manual_address: aboutObj.parent[0].parent_manual_address,
            parent_contact_type: aboutObj.parent[0].parent_contact_type,
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
          ////console.log("1")
          console.log(error)
          sequalizeErrorHandler.handleSequalizeError(ctx, error)
        });
      }).catch((error) => {
        console.log(error)
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
            attributes: ['id', 'child_dob', 'registered_gp', 'gp_school', 'registered_gp_postcode']
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
              attributes: ['id', 'child_NHS', 'child_firstname', 'child_name_title', 'child_lastname', 'child_email', 'child_contact_number', 'child_address', 'child_address_postcode', 'can_send_post', 'child_gender', 'child_gender_birth', 'child_sexual_orientation', 'child_ethnicity', 'child_care_adult', 'household_member', 'child_contact_type', 'sex_at_birth', 'child_manual_address']
            },
          ],
          where: {
            id: elgibilityObj[0].id,
          },
          attributes: ['id', 'parent_firstname', 'parent_lastname', 'parental_responsibility', 'responsibility_parent_firstname', 'child_parent_relationship', 'parent_contact_number', 'parent_email', 'parent_same_house', 'parent_address', 'parent_address_postcode', 'legal_care_status', 'parent_contact_type', 'parent_manual_address']
        }).then((aboutObj) => {
          return user.findAll({
            include: [
              //childData
              {
                model: ctx.orm().Referral,
                nested: true,
                as: 'parent',
                attributes: ['id', 'child_profession', 'child_education_place', 'child_EHCP', 'child_EHAT', 'child_socialworker', 'child_socialworker_contact', 'child_socialworker_firstname', 'child_socialworker_lastname', 'child_socialworker_contact_type', 'child_education_manual_address']
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

              ////console.log(aboutObj)

              const section1Obj = {
                child_id: elgibilityObj[0].parent[0].id,
                child_dob: elgibilityObj[0].parent[0].child_dob,
                registered_gp: elgibilityObj[0].parent[0].registered_gp_postcode ? elgibilityObj[0].parent[0].registered_gp + ',' + elgibilityObj[0].parent[0].registered_gp_postcode : elgibilityObj[0].parent[0].registered_gp,
                parent_id: elgibilityObj[0].id,
                consent_child: elgibilityObj[0].consent_child,
                consent_parent: elgibilityObj[0].consent_parent,
                need_interpreter: elgibilityObj[0].need_interpreter,
                gp_school: elgibilityObj[0].parent[0].gp_school
              }
              const section2Obj = {
                child_id: aboutObj[0].parent[0].id,
                child_NHS: aboutObj[0].parent[0].child_NHS,
                child_name: aboutObj[0].parent[0].child_firstname,
                child_lastname: aboutObj[0].parent[0].child_lastname,
                child_name_title: aboutObj[0].parent[0].child_name_title,
                child_email: aboutObj[0].parent[0].child_email,
                child_contact_number: aboutObj[0].parent[0].child_contact_number,
                child_contact_type: aboutObj[0].parent[0].child_contact_type,
                child_address: aboutObj[0].parent[0].child_address_postcode ? aboutObj[0].parent[0].child_address + ',' + aboutObj[0].parent[0].child_address_postcode : aboutObj[0].parent[0].child_address,
                child_manual_address: aboutObj[0].parent[0].child_manual_address,
                can_send_post: aboutObj[0].parent[0].can_send_post,
                child_gender: aboutObj[0].parent[0].child_gender,
                child_gender_birth: aboutObj[0].parent[0].child_gender_birth,
                child_sexual_orientation: aboutObj[0].parent[0].child_sexual_orientation,
                child_ethnicity: aboutObj[0].parent[0].child_ethnicity,
                child_care_adult: aboutObj[0].parent[0].child_care_adult,
                household_member: aboutObj[0].parent[0].household_member,
                contact_type: aboutObj[0].parent[0].child_care_adult,
                sex_at_birth: aboutObj[0].parent[0].sex_at_birth,
                parent_id: aboutObj[0].id,
                parent_name: aboutObj[0].parent_firstname,
                parent_lastname: aboutObj[0].parent_lastname,
                parental_responsibility: aboutObj[0].parental_responsibility,
                child_parent_relationship: aboutObj[0].child_parent_relationship,
                parent_contact_number: aboutObj[0].parent_contact_number,
                parent_email: aboutObj[0].parent_email,
                parent_same_house: aboutObj[0].parent_same_house,
                parent_address: aboutObj[0].parent_address_postcode ? aboutObj[0].parent_address + ", " + aboutObj[0].parent_address_postcode : aboutObj[0].parent_address,
                parent_manual_address: aboutObj[0].parent_manual_address,
                parent_contact_type: aboutObj[0].parent_contact_type,
                legal_care_status: aboutObj[0].legal_care_status,
              }

              const section3Obj = {
                child_id: edu_empObj[0].parent[0].id,
                child_profession: edu_empObj[0].parent[0].child_profession,
                child_education_place: edu_empObj[0].parent[0].child_education_place,
                child_education_manual_address: edu_empObj[0].parent[0].child_education_manual_address,
                child_EHCP: edu_empObj[0].parent[0].child_EHCP,
                child_EHAT: edu_empObj[0].parent[0].child_EHAT,
                child_socialworker: edu_empObj[0].parent[0].child_socialworker,
                child_socialworker_firstname: edu_empObj[0].parent[0].child_socialworker_firstname,
                child_socialworker_lastname: edu_empObj[0].parent[0].child_socialworker_lastname,
                child_socialworker_contact: edu_empObj[0].parent[0].child_socialworker_contact,
                child_socialworker_contact_type: edu_empObj[0].parent[0].child_socialworker_contact_type,
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
              console.log(error)
              sequalizeErrorHandler.handleSequalizeError(ctx, error)
            });
          }).catch((error) => {
            console.log(error)
            sequalizeErrorHandler.handleSequalizeError(ctx, error)
          });
        }).catch((error) => {
          console.log(error)
          sequalizeErrorHandler.handleSequalizeError(ctx, error)
        });

      }).catch((error) => {
        console.log(error)
        sequalizeErrorHandler.handleSequalizeError(ctx, error)
      });

    }).catch((error) => {
      console.log(error)
      sequalizeErrorHandler.handleSequalizeError(ctx, error)
    });
  }
  else if (ctx.query.role == "professional") {

    ////console.log("uuid" + ctx.query.user_id,)
    return user.findOne({

      where: {
        uuid: ctx.query.user_id,
      },
    }).then((userObj) => {

      return user.findOne({
        include: [{
          model: ctx.orm().Referral,
          as: 'professional',
          attributes: ['id', 'child_dob', 'registered_gp', 'gp_school', 'registered_gp_postcode'],
          include: [{
            model: ctx.orm().Referral,
            as: 'child_parent',
          }]
        }],
        where: {
          id: userObj.id,
        },
        attributes: ['id', 'uuid', 'professional_firstname', 'professional_lastname', 'professional_email', 'professional_contact_number', 'consent_child', 'consent_parent', 'professional_address', 'professional_profession', 'service_location', 'selected_service', 'professional_contact_type', 'professional_manual_address', 'professional_address_postcode']
      }).then((elgibilityObj) => {
        //return ctx.body = elgibilityObj.professional[0].child_parent[0];
        var childIdNew = elgibilityObj.professional[0].child_parent[0].id;
        var childId = Number(elgibilityObj.professional[0].ChildProfessional.professionalId) + 2
        ////console.log(childIdNew);
        ////console.log(childId);

        //  var childId = elgibilityObj[0].professional[0].ChildProfessional.UserId
        //  var parentId = Number(userResult[0].professional[0].ChildProfessional.professionalId) + 2
        return user.findAll({
          include: [
            //childData
            {
              model: ctx.orm().Referral,
              nested: true,
              as: 'parent',
              attributes: ['id', 'child_NHS', 'child_firstname', 'child_name_title', 'child_lastname', 'child_email', 'child_contact_number', 'child_address', 'can_send_post', 'child_gender', 'child_gender_birth', 'child_sexual_orientation', 'child_ethnicity', 'child_care_adult', 'household_member', 'child_contact_type', 'sex_at_birth', 'child_manual_address', 'child_address_postcode', 'referral_mode']
            },
          ],
          where: {
            id: childIdNew,
          },
          attributes: ['id', 'parent_firstname', 'parent_lastname', 'parental_responsibility', 'responsibility_parent_firstname', 'child_parent_relationship', 'parent_contact_number', 'parent_email', 'parent_same_house', 'parent_address', 'legal_care_status', 'parent_contact_type', 'parent_manual_address', 'parent_address_postcode']
        }).then((aboutObj) => {

          return user.findAll({
            include: [
              //childData
              {
                model: ctx.orm().Referral,
                nested: true,
                as: 'professional',
                attributes: [['id', 'child_id'], 'child_profession', 'child_education_place', 'child_EHCP', 'child_EHAT', 'child_socialworker', 'child_socialworker_firstname', 'child_socialworker_lastname', 'child_socialworker_contact', 'child_socialworker_contact_type', 'child_education_manual_address']
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
              // if (elgibilityObj.selected_service == 'MHST') {
              //   elgibilityObj.selected_service = 'Mental Health Support Team'
              // }
              // if (elgibilityObj.selected_service == 'MHST Liverpool') {
              //   elgibilityObj.selected_service = 'Liverpool - Mental Health Support Team'
              // }
              // if (elgibilityObj.selected_service == 'MHST Sefton') {
              //   elgibilityObj.selected_service = 'Sefton - Mental Health Support Team'
              // }
              const section1Obj = {
                child_id: elgibilityObj.professional[0].id,
                child_dob: elgibilityObj.professional[0].child_dob,
                registered_gp: elgibilityObj.professional[0].registered_gp_postcode ? elgibilityObj.professional[0].registered_gp + ',' + elgibilityObj.professional[0].registered_gp_postcode : elgibilityObj.professional[0].registered_gp,
                gp_school: elgibilityObj.professional[0].gp_school,
                professional_id: elgibilityObj.id,
                consent_child: elgibilityObj.consent_child,
                consent_parent: elgibilityObj.consent_parent,
                professional_name: elgibilityObj.professional_firstname,
                professional_lastname: elgibilityObj.professional_lastname,
                professional_email: elgibilityObj.professional_email,
                professional_contact_type: elgibilityObj.professional_contact_type,
                professional_contact_number: elgibilityObj.professional_contact_number,
                professional_address: elgibilityObj.professional_address_postcode ? elgibilityObj.professional_address + ', ' + elgibilityObj.professional_address_postcode : elgibilityObj.professional_address,
                professional_manual_address: elgibilityObj.professional_manual_address,
                professional_profession: elgibilityObj.professional_profession,
                service_location: elgibilityObj.service_location,
                selected_service: elgibilityObj.selected_service,

              }
              const section2Obj = {
                child_id: aboutObj[0].parent[0].id,
                child_NHS: aboutObj[0].parent[0].child_NHS,
                child_name: aboutObj[0].parent[0].child_firstname,
                child_lastname: aboutObj[0].parent[0].child_lastname,
                child_name_title: aboutObj[0].parent[0].child_name_title,
                child_email: aboutObj[0].parent[0].child_email,
                child_contact_number: aboutObj[0].parent[0].child_contact_number,
                child_address: aboutObj[0].parent[0].child_address_postcode ? aboutObj[0].parent[0].child_address + ',' + aboutObj[0].parent[0].child_address_postcode : aboutObj[0].parent[0].child_address,
                child_manual_address: aboutObj[0].parent[0].child_manual_address,
                can_send_post: aboutObj[0].parent[0].can_send_post,
                child_gender: aboutObj[0].parent[0].child_gender,
                child_gender_birth: aboutObj[0].parent[0].child_gender_birth,
                child_sexual_orientation: aboutObj[0].parent[0].child_sexual_orientation,
                child_ethnicity: aboutObj[0].parent[0].child_ethnicity,
                child_care_adult: aboutObj[0].parent[0].child_care_adult,
                household_member: aboutObj[0].parent[0].household_member,
                child_contact_type: aboutObj[0].parent[0].child_contact_type,
                sex_at_birth: aboutObj[0].parent[0].sex_at_birth,
                parent_id: aboutObj[0].id,
                parent_name: aboutObj[0].parent_firstname,
                parent_lastname: aboutObj[0].parent_lastname,
                parental_responsibility: aboutObj[0].parental_responsibility,
                child_parent_relationship: aboutObj[0].child_parent_relationship,
                parent_contact_type: aboutObj[0].parent_contact_type,
                parent_contact_number: aboutObj[0].parent_contact_number,
                parent_email: aboutObj[0].parent_email,
                parent_same_house: aboutObj[0].parent_same_house,
                parent_address: aboutObj[0].parent_address_postcode ? aboutObj[0].parent_address + ', ' + aboutObj[0].parent_address_postcode : aboutObj[0].parent_address,
                parent_manual_address: aboutObj[0].parent_manual_address,
                legal_care_status: aboutObj[0].legal_care_status,
                referral_mode: aboutObj[0].parent[0].referral_mode
              }

              const section3Obj = {
                child_id: edu_empObj[0].professional[0].id,
                child_profession: edu_empObj[0].professional[0].child_profession,
                child_education_place: edu_empObj[0].professional[0].child_education_place,
                child_education_manual_address: edu_empObj[0].professional[0].child_education_manual_address,
                child_EHCP: edu_empObj[0].professional[0].child_EHCP,
                child_EHAT: edu_empObj[0].professional[0].child_EHAT,
                child_socialworker: edu_empObj[0].professional[0].child_socialworker,
                child_socialworker_name: edu_empObj[0].professional[0].child_socialworker_name,
                child_socialworker_firstname: edu_empObj[0].professional[0].child_firstname,
                child_socialworker_lastname: edu_empObj[0].professional[0].child_lastname,
                child_socialworker_contact: edu_empObj[0].professional[0].child_socialworker_contact,
                child_socialworker_contact_type: edu_empObj[0].professional[0].child_socialworker_contact_type,
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
              console.log(error)
              sequalizeErrorHandler.handleSequalizeError(ctx, error)
            });

          }).catch((error) => {
            console.log(error)
            sequalizeErrorHandler.handleSequalizeError(ctx, error)
          });
        })
          .catch((error) => {
            console.log(error)
            ////console.log(error)
            sequalizeErrorHandler.handleSequalizeError(ctx, error)
          });
      })
        .catch((error) => {
          console.log(error)
          sequalizeErrorHandler.handleSequalizeError(ctx, error)
        });
    }).catch((error) => {
      console.log(error)
      ////console.log(error);
      sequalizeErrorHandler.handleSequalizeError(ctx, error)
    });
  }

}

exports.saveReview = ctx => {
  const user = ctx.orm().Referral;
  var provider;
  ////console.log('\nSave Review Payload == ', ctx.request.body);
  //console.log("fdadfafafafafda " + ctx.request.body.referral_provider)

  return genetrateUniqueCode(ctx).then((uniqueNo) => {
    return user.update({
      referral_progress: 100,
      referral_complete_status: "completed",
      reference_code: uniqueNo,
      contact_preferences: ctx.request.body.contactPreference,
      contact_person: ctx.request.body.contact_person,
      referral_provider: "Pending",
      createdAt: new Date()
    },
      {
        where:
          { uuid: ctx.request.body.userid }
      }
    ).then((childUserInfo) => {
      ctx.request.body.ref_code = uniqueNo;
      return email.sendReferralConfirmationMail(ctx).then((mailStatus) => {
        const responseData = {
          userid: ctx.request.body.userid,
          status: "ok",
          role: ctx.request.body.role,
          refNo: uniqueNo
        }

        // if (ctx.request.body.role != 'professional'  && ctx.request.body.gp_school) {
        //   ctx.query.selectedProvider = "MHST";
        // }
        if (ctx.request.body.referral_provider != "") {
          console.log("ref ----------------------------------------------------- " + ctx.request.body.referral_provider)
          if (ctx.request.body.referral_provider == "Mental Health Support Team") {
            ctx.query.selectedProvider = "MHST";
          }
          else {
            ctx.query.selectedProvider = ctx.request.body.referral_provider;
          }

          ctx.query.refCode = uniqueNo;
          ctx.query.refID = ctx.request.body.userid;
          ctx.query.refRole = ctx.request.body.role;
          if (ctx.request.body.referral_provider == "YPAS" || ctx.request.body.referral_provider == "Venus") {
            return adminCtrl.sendReferralByApi(ctx).then((providermailStatus) => {
              return user.update({
                referral_provider: ctx.query.selectedProvider
              },
                {
                  where:
                    { uuid: ctx.request.body.userid }
                }
              ).then((result) => {
                return ctx.body = responseData;
              }).catch(error => {
                //////console.log()(error);
                sequalizeErrorHandler.handleSequalizeError(ctx, error)
              });
            }).catch((error) => {
              sequalizeErrorHandler.handleSequalizeError(ctx, error)
            });
          }
          else {
            return adminCtrl.sendReferral(ctx).then((providermailStatus) => {
              return user.update({
                referral_provider: ctx.query.selectedProvider
              },
                {
                  where:
                    { uuid: ctx.request.body.userid }
                }
              ).then((result) => {
                return ctx.body = responseData;
              }).catch(error => {
                //////console.log()(error);
                sequalizeErrorHandler.handleSequalizeError(ctx, error)
              });
            }).catch((error) => {
              sequalizeErrorHandler.handleSequalizeError(ctx, error)
            });
          }
        }
        else {
          return ctx.body = responseData;
        }
      }).catch((error) => {
        console.log('\n\n\nERROR - check code: ', error);
        sequalizeErrorHandler.handleSequalizeError(ctx, error)
      });
    }).catch((error) => {
      console.log('\n\n\nERROR - update code: ', error);
      sequalizeErrorHandler.handleSequalizeError(ctx, error)
    });
  }).catch((error) => {
    console.log('\n\n\nERROR - check code: ', error);
    sequalizeErrorHandler.handleSequalizeError(ctx, error)
  });
}

const genetrateUniqueCode = (ctx) => new Promise(async (resolve, reject) => {
  try {
    const user = ctx.orm().Referral;
    var uniqueNo = uniqid().toUpperCase();
    ////console.log('\n1. Reference Code - ', uniqueNo);
    uniqueNo = uniqueNo.substr(uniqueNo.length - 12);
    ////console.log(uniqueNo);
    let user_response = user.findOne({
      where: {
        reference_code: uniqueNo,
      },
    });
    if (user_response) {
      uniqueNo = uniqid().toUpperCase();
      ////console.log('\n2. Reference Code - ', uniqueNo);
      uniqueNo = uniqueNo.substr(uniqueNo.length - 12);
      ////console.log(uniqueNo);
    }
    resolve(uniqueNo);
  } catch (error) {
    reject(error);
  }
});

exports.getRefNo = ctx => {
  const user = ctx.orm().Referral;
  return user.findOne({
    where: {
      uuid: ctx.query.user_id,
    },
    attributes: ['id', 'uuid', 'reference_code', 'user_role', 'professional_email']
  }).then((result) => {
    return ctx.body = result;
  })
}
exports.updateAboutInfo = ctx => {
  const user = ctx.orm().Referral;
  return user.update({
    can_send_post: ctx.request.body.section2Data.can_send_post,
    child_NHS: ctx.request.body.section2Data.child_NHS,
    //child_address: ctx.request.body.section2Data.child_address,
    child_manual_address: ctx.request.body.section2Data.child_manual_address,
    child_care_adult: ctx.request.body.section2Data.child_care_adult,

    child_contact_number: ctx.request.body.section2Data.child_contact_number,
    child_contact_type: ctx.request.body.section2Data.child_contact_type,
    child_email: ctx.request.body.section2Data.child_email,
    child_ethnicity: ctx.request.body.section2Data.child_ethnicity,
    child_gender: ctx.request.body.section2Data.child_gender,

    child_gender_birth: ctx.request.body.section2Data.child_gender_birth,
    child_firstname: ctx.request.body.section2Data.child_name,
    child_lastname: ctx.request.body.section2Data.child_lastname,
    child_name_title: ctx.request.body.section2Data.child_name_title,
    child_sexual_orientation: ctx.request.body.section2Data.child_sexual_orientation,

    contact_type: ctx.request.body.section2Data.contact_type,
    sex_at_birth: ctx.request.body.section2Data.sex_at_birth,
    referral_mode: ctx.request.body.section2Data.referral_mode,
  },
    {
      where: {
        id: ctx.request.body.section2Data.child_id,
      }
    }).then((childUpdate) => {

      return user.update(
        {
          legal_care_status: ctx.request.body.section2Data.legal_care_status,
          //parent_address: ctx.request.body.section2Data.parent_address,
          parent_manual_address: ctx.request.body.section2Data.parent_manual_address,
          parent_contact_type: ctx.request.body.section2Data.parent_contact_type,
          parent_contact_number: ctx.request.body.section2Data.parent_contact_number,
          parent_email: ctx.request.body.section2Data.parent_email,
          parent_firstname: ctx.request.body.section2Data.parent_name,
          parent_lastname: ctx.request.body.section2Data.parent_lastname,
          parent_same_house: ctx.request.body.section2Data.parent_same_house,
          parental_responsibility: ctx.request.body.section2Data.parental_responsibility,
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
          attributes: ['id', 'uuid', 'can_send_post', 'child_NHS', 'child_address', 'child_care_adult', 'child_contact_number', 'child_email', 'child_ethnicity', 'child_gender', 'child_gender_birth', 'child_firstname', 'child_lastname', 'child_parent_relationship', 'child_sexual_orientation', 'household_member', 'child_name_title', 'child_contact_type', 'sex_at_birth', 'child_manual_address', 'child_address_postcode', 'referral_mode']
        }).then((childResult) => {


          return user.findOne({
            where: {
              id: ctx.request.body.section2Data.parent_id,
            },
            attributes: ['id', 'uuid', 'legal_care_status', 'parent_address', 'parent_contact_number', 'parent_email', 'parent_firstname', 'parent_lastname', 'parent_same_house', 'parental_responsibility', 'child_parent_relationship', 'parent_contact_type', 'parent_manual_address', 'parent_address_postcode']
          }).then((parentResult) => {

            const section2Obj = {
              child_id: childResult.id,
              child_NHS: childResult.child_NHS,
              child_name: childResult.child_firstname,
              child_lastname: childResult.child_lastname,
              child_email: childResult.child_email,
              child_contact_number: childResult.child_contact_number,
              child_address: childResult.child_address_postcode ? childResult.child_address + ',' + childResult.child_address_postcode : childResult.child_address,
              child_manual_address: childResult.child_manual_address,
              can_send_post: childResult.can_send_post,
              child_gender: childResult.child_gender,
              child_gender_birth: childResult.child_gender_birth,
              child_sexual_orientation: childResult.child_sexual_orientation,
              child_ethnicity: childResult.child_ethnicity,
              child_care_adult: childResult.child_care_adult,
              household_member: childResult.household_member,
              child_name_title: childResult.child_name_title,
              child_contact_type: childResult.child_contact_type,
              sex_at_birth: childResult.sex_at_birth,
              parent_id: parentResult.id,
              parent_name: parentResult.parent_firstname,
              parent_lastname: parentResult.parent_lastname,
              parental_responsibility: parentResult.parental_responsibility,
              child_parent_relationship: parentResult.child_parent_relationship,
              parent_contact_type: parentResult.parent_contact_type,
              parent_contact_number: parentResult.parent_contact_number,
              parent_email: parentResult.parent_email,
              parent_same_house: parentResult.parent_same_house,
              parent_address: parentResult.parent_address_postcode ? parentResult.parent_address + ',' + parentResult.parent_address_postcode : parentResult.parent_address,
              parent_manual_address: parentResult.parent_manual_address,
              legal_care_status: parentResult.legal_care_status,
              referral_mode: childResult.referral_mode,
            }
            console.log(section2Obj)
            return ctx.res.ok({
              data: section2Obj,
              message: reponseMessages[1001],
            });

          })
        }).catch((error) => {
          // console.log('\n\n\nERROR - check code: ', error);
          sequalizeErrorHandler.handleSequalizeError(ctx, error)
        });
      }).catch((error) => {
        // console.log('\n\n\nERROR - check code: ', error);
        sequalizeErrorHandler.handleSequalizeError(ctx, error)
      });
    }).catch((error) => {
      //console.log('\n\n\nERROR - check code: ', error);
      sequalizeErrorHandler.handleSequalizeError(ctx, error)
    });
}
exports.updateSec3Info = ctx => {
  const user = ctx.orm().Referral;
  return user.update({
    child_EHAT: ctx.request.body.section3Data.child_EHAT,
    child_EHCP: ctx.request.body.section3Data.child_EHCP,
    child_education_place: ctx.request.body.section3Data.child_education_place,
    child_education_manual_address: ctx.request.body.section3Data.child_education_manual_address,
    child_profession: ctx.request.body.section3Data.child_profession,

    child_socialworker: ctx.request.body.section3Data.child_socialworker,
    child_socialworker_contact: ctx.request.body.section3Data.child_socialworker_contact,
    child_socialworker_firstname: ctx.request.body.section3Data.child_socialworker_firstname,
    child_socialworker_lastname: ctx.request.body.section3Data.child_socialworker_lastname,
    child_socialworker_contact_type: ctx.request.body.section3Data.child_socialworker_contact_type,
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
        attributes: [['id', 'child_id'], 'uuid', 'child_EHAT', 'child_EHCP', 'child_education_place', 'child_profession', 'child_socialworker', 'child_socialworker_contact', 'child_socialworker_firstname', 'child_socialworker_lastname', 'child_socialworker_contact_type', 'child_education_manual_address']
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
    other_reasons_referral: ctx.request.body.section4Data.other_reasons_referral,
    food_fluid_intake: ctx.request.body.section4Data.food_fluid_intake,
    height: ctx.request.body.section4Data.height,
    weight: ctx.request.body.section4Data.weight,
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
      }).then((referralResult) => {
        return ctx.res.ok({
          data: referralResult,
          message: reponseMessages[1001]
        });
      }).catch((error) => {
        ////console.log(error)
        sequalizeErrorHandler.handleSequalizeError(ctx, error)
      });
    }).catch((error) => {
      sequalizeErrorHandler.handleSequalizeError(ctx, error)
    });
}

exports.updateEligibilityInfo = ctx => {
  const user = ctx.orm().Referral;
  return user.update({
    professional_firstname: ctx.request.body.section1Data.professional_name,
    professional_lastname: ctx.request.body.section1Data.professional_lastname,
    professional_email: ctx.request.body.section1Data.professional_email,
    professional_contact_number: ctx.request.body.section1Data.professional_contact_number,
    professional_profession: ctx.request.body.section1Data.professional_profession,
    professional_contact_type: ctx.request.body.section1Data.professional_contact_type
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
        attributes: ['id', 'child_dob', 'registered_gp', 'registered_gp_postcode', 'gp_school']
      }).then((elgibilityObj) => {
        return user.findOne({
          where: {
            id: ctx.request.body.section1Data.professional_id,
          },
          attributes: ['id', 'uuid', 'professional_firstname', 'professional_lastname', 'professional_email', 'professional_contact_number', 'consent_child', 'consent_parent', 'professional_profession', 'professional_address', 'professional_contact_type', 'professional_manual_address', 'service_location', 'selected_service', 'professional_address_postcode']
        }).then((professionalObj) => {
          // if (professionalObj.selected_service == 'MHST Liverpool') {
          //   professionalObj.selected_service = 'Liverpool - Mental Health Support Team'
          // }
          // if (professionalObj.selected_service == 'MHST Sefton') {
          //   professionalObj.selected_service = 'Sefton - Mental Health Support Team'
          // }
          const section1Obj = {
            child_id: ctx.request.body.section1Data.child_id,
            child_dob: elgibilityObj.child_dob,
            registered_gp: elgibilityObj.registered_gp_postcode ? elgibilityObj.registered_gp + ',' + elgibilityObj.registered_gp_postcode : elgibilityObj.registered_gp,
            gp_school: elgibilityObj.gp_school,
            professional_id: ctx.request.body.section1Data.professional_id,
            consent_child: professionalObj.consent_child,
            consent_parent: professionalObj.consent_parent,
            professional_name: professionalObj.professional_firstname,
            professional_lastname: professionalObj.professional_lastname,
            professional_email: professionalObj.professional_email,
            professional_contact_number: professionalObj.professional_contact_number,
            professional_contact_type: professionalObj.professional_contact_type,
            professional_address: professionalObj.professional_address_postcode ? professionalObj.professional_address + ',' + professionalObj.professional_address_postcode : professionalObj.professional_address,
            professional_manual_address: professionalObj.professional_manual_address,
            professional_profession: professionalObj.professional_profession,
            service_location: professionalObj.service_location,
            selected_service: professionalObj.selected_service,
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
  ////console.log("===>", ctx.request.decryptedUser)
  const userReferral = ctx.orm().Referral;
  const refId = [];
  const childDataId = [];
  const parentDataId = [];
  const professionalDataId = [];
  return userReferral.findAll({
    where: {
      login_id: ctx.request.decryptedUser.id,
      user_role: ctx.request.decryptedUser.role,
      referral_complete_status: "incomplete"
    },
    attributes: ['id', 'user_role']
  }).then((userData) => {
    //
    userData.forEach(
      (user) => {
        refId.push(user.dataValues.id)
      })
    // ////console.log(refId)
    if (ctx.request.decryptedUser.role == "child") {
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
          ////console.log("2")
          sequalizeErrorHandler.handleSequalizeError(ctx, error)
        });

      }).catch((error) => {
        ////console.log(error)
        sequalizeErrorHandler.handleSequalizeError(ctx, error)
      });
    }
    else if (ctx.request.decryptedUser.role == "parent") {
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
    else if (ctx.request.decryptedUser.role == "professional") {

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
    ////console.log(error)
    sequalizeErrorHandler.handleSequalizeError(ctx, error)
  })
}
exports.getUserReferral = ctx => {
  const ref = ctx.orm().Referral;
  var query = {
    referral_progress: {
      [Op.ne]: null
    },
    referral_complete_status: ctx.query.referralType
  }
  if (ctx.request.decryptedUser) {
    query.login_id = ctx.request.decryptedUser.id;
  }
  return ref.findAll({
    where: query,
    order: [
      ['updatedAt', 'DESC'],
    ],
  }).then((result) => {
    let finalObj = {}
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


exports.getReferalByCode = ctx => {

  ////console.log("==getReferalByCode=>", ctx.request.decryptedUser);
  ////console.log(ctx.query.reqCode);

  const ref = ctx.orm().Referral;
  if (!ctx.request.decryptedUser) //checking login user or not.for logged user we must fetch referrals made by them. 
  {
    return ref.findAll({
      where: {
        reference_code: {
          [Op.like]: '%' + ctx.query.reqCode + '%'
        },
        referral_complete_status: 'completed'
      },
      order: [
        ['createdAt', 'DESC'],
      ],
    }).then((result) => {
      ////console.log(result);
      return ctx.body = result
    }).catch((error) => {
      sequalizeErrorHandler.handleSequalizeError(ctx, error)
    });
  }
  else {
    return ref.findAll({
      where: {
        login_id: ctx.request.decryptedUser.id,

        reference_code: {
          [Op.like]: '%' + ctx.query.reqCode + '%'
        },
        referral_complete_status: 'completed'
      },
      order: [
        ['createdAt', 'DESC'],
      ],
    }).then((result) => {
      ////console.log(result);
      return ctx.body = result
    }).catch((error) => {
      sequalizeErrorHandler.handleSequalizeError(ctx, error)
    });
  }

}

exports.searchReferalByCode = ctx => {
  const ref = ctx.orm().Referral;
  if (!ctx.request.decryptedUser) //checking login user or not.for logged user we must fetch referrals made by them. 
  {
    return ref.findAll({
      where: {
        reference_code: ctx.query.reqCode,
        referral_complete_status: 'completed'
      },
    }).then((result) => {
      ////console.log(result);
      return ctx.body = result
    }).catch((error) => {
      sequalizeErrorHandler.handleSequalizeError(ctx, error)
    });
  }
  else {
    return ref.findAll({
      where: {
        reference_code: ctx.query.reqCode,
        login_id: ctx.request.decryptedUser.id,
        referral_complete_status: 'completed'
      },
    }).then((result) => {
      ////console.log(result);
      return ctx.body = result
    }).catch((error) => {
      sequalizeErrorHandler.handleSequalizeError(ctx, error)
    });
  }

}

exports.getProfReferral = async (ctx) => {
  try {
    const { Referral } = ctx.orm();
    const prof_data = await Referral.findOne({
      where: {
        login_id: ctx.request.decryptedUser.id,
        referral_complete_status: 'completed',
      },
      order: [
        ['id', 'asc']
      ]
    });
    if (prof_data) {
      return ctx.body = {
        data: {
          first_name: prof_data.professional_firstname,
          last_name: prof_data.professional_lastname,
          email: prof_data.professional_email ? prof_data.professional_email : '',
          contact_number: prof_data.professional_contact_number ? prof_data.professional_contact_number : '',
          profession: prof_data.professional_profession ? prof_data.professional_profession : '',
          address: prof_data.professional_address ? prof_data.professional_address : '',
          professional_manual_address: prof_data.professional_manual_address ? prof_data.professional_manual_address : '',
          professional_contact_type: prof_data.professional_contact_type ? prof_data.professional_contact_type : 'mobile'
        }
      }
    }
    return ctx.body = { data: {} };
  } catch (e) {
    return sequalizeErrorHandler.handleSequalizeError(ctx, e);
  }
}

exports.sendReferralToMe = ctx => {

  console.log("ctx.body------------------------------------------------------")
  console.log(ctx.request.body)


  return adminCtrl.sendReferralCopy(ctx).then((providermailStatus) => {
    console.log("----------------------------------------------providermailStatus")
    console.log(providermailStatus)
    if (providermailStatus == false) {
      ctx.res.internalServerError({
        message: reponseMessages[1002],
      });
    }
    else {
      return ctx.res.ok({
        message: reponseMessages[1017],
      });
    }
  }).catch((error) => {
    console.log("hit here")
    sequalizeErrorHandler.handleSequalizeError(ctx, error)
  });;

}
