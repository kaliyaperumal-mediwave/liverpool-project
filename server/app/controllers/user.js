const P = require("pino");
var uniqid = require('uniqid');


exports.eligibility = ctx => {

  const user = ctx.orm().User;
  var userid;

  console.log(ctx.request.body);

  if (ctx.request.body.role == "child") {
    if(ctx.request.body.editFlag!=null)
    {
      return user.update({
        need_interpreter: ctx.request.body.interpreter,
        child_dob: ctx.request.body.childDob,
        contact_parent: ctx.request.body.contactParent,
        consent_child:ctx.request.body.isInformation,
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
    else
    {
      return user.create({
        need_interpreter: ctx.request.body.interpreter,
        child_dob: ctx.request.body.childDob,
        contact_parent: ctx.request.body.contactParent,
        consent_child:ctx.request.body.isInformation,
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
    if(ctx.request.body.editFlag!=null)
    {
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
          }).then((childUserInfo)=> {
            return user.update({
              need_interpreter: ctx.request.body.interpreter,
              consent_child: ctx.request.body.isInformation,
            },
            {
              where:
              {uuid:ctx.request.body.uuid}
            },).then((parentUserInfo)=>{
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
    else
    {
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
    if(ctx.request.body.editFlag!=null)
    {

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
          }).then((childUserInfo)=> {
            return user.update({
              professional_name: ctx.request.body.profName,
              professional_email: ctx.request.body.profEmail,
              professional_contact_number: ctx.request.body.profContactNumber,
              consent_parent: ctx.request.body.contactProfParent,
              consent_child: ctx.request.body.parentConcernInformation,
            },
            {
              where:
              {uuid:ctx.request.body.uuid}
            },).then((parentUserInfo)=>{
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
    else
    {
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
  if(ctx.request.body.role=="child")
  {
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
 else if(ctx.request.body.role=="parent")
  {
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

  else if(ctx.request.body.role=="professional")
  {
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
  console.log(ctx.request.body);
  if (ctx.request.body.role == "child") {

    if(ctx.request.body.editFlag!=null)
    {
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

          var parentid= userResult[0].parent[0].ChildParents.parentId
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
              child_ethnicity: ctx.request.body.childEthnicity,
              child_household_name: ctx.request.body.houseHoldName,
              child_household_relationship: ctx.request.body.houseHoldRelationship,
              child_household_dob: ctx.request.body.childHouseHoldDob,
              child_household_profession: ctx.request.body.houseHoldProfession,
              child_care_adult: ctx.request.body.childCareAdult,
              user_section: 2
            },
            {
              where:
                { id: result.id }
            }
          ).then((result) => {
    
            return user.update(
              {
                parent_name: ctx.request.body.parentName,
                parential_responsibility: ctx.request.body.parentialResponsibility,
                child_parent_relationship: ctx.request.body.childParentRelationship,
                parent_contact_number: ctx.request.body.parentContactNumber,
                parent_email: ctx.request.body.parentEmail,
                parent_same_house: ctx.request.body.parentSameHouse,
                parent_address: ctx.request.body.parentAddress,
                legal_care_status: ctx.request.body.legalCareStatus,
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

    else
    {

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
          child_ethnicity: ctx.request.body.childEthnicity,
          child_household_name: ctx.request.body.houseHoldName,
          child_household_relationship: ctx.request.body.houseHoldRelationship,
          child_household_dob: ctx.request.body.childHouseHoldDob,
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
  
          console.log(userResult.id + "====>" + userResult.uuid);
          return user.create({
            parent_name: ctx.request.body.parentName,
            parential_responsibility: ctx.request.body.parentialResponsibility,
            child_parent_relationship: ctx.request.body.childParentRelationship,
            parent_contact_number: ctx.request.body.parentContactNumber,
            parent_email: ctx.request.body.parentEmail,
            parent_same_house: ctx.request.body.parentSameHouse,
            parent_address: ctx.request.body.parentAddress,
            legal_care_status: ctx.request.body.legalCareStatus,
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
            child_ethnicity: ctx.request.body.childEthnicity,
            child_household_name: ctx.request.body.houseHoldName,
            child_household_relationship: ctx.request.body.houseHoldRelationship,
            child_household_dob: ctx.request.body.houseHoldDOB,
            child_household_profession: ctx.request.body.houseHoldProfession,
            child_care_adult: ctx.request.body.childCareAdult,
          },
          {
            where:
              { id: childId }
          }
        ).then((updateResult) => {

          return user.update({
            parent_name: ctx.request.body.parentName,
            parential_responsibility: ctx.request.body.parentialResponsibility,
            child_parent_relationship: ctx.request.body.childParentRelationship,
            parent_contact_number: ctx.request.body.parentContactNumber,
            parent_email: ctx.request.body.parentEmail,
            parent_same_house: ctx.request.body.parentSameHouse,
            parent_address: ctx.request.body.parentAddress,
            legal_care_status: ctx.request.body.legalCareStatus,
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
    if(ctx.request.body.editFlag!=null)
    {
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
            child_name: ctx.request.body.childName,
            child_NHS: ctx.request.body.childNHS,
            child_email: ctx.request.body.childEmail,
            child_contact_number: ctx.request.body.childContactNumber,
            child_address: ctx.request.body.childAddress,
            can_send_post: ctx.request.body.sendPost,
            child_gender: ctx.request.body.childGender,
            child_gender_birth: ctx.request.body.childGenderBirth,
            child_sexual_orientation: ctx.request.body.childSexualOrientation,
            child_ethnicity: ctx.request.body.childEthnicity,
            child_household_name: ctx.request.body.houseHoldName,
            child_household_relationship: ctx.request.body.houseHoldRelationship,
            child_household_dob: ctx.request.body.houseHoldDOB,
            child_household_profession: ctx.request.body.houseHoldProfession,
            child_care_adult: ctx.request.body.childCareAdult,
          },
          {
            where:
              { id: childId }
          }
        ).then((updateResult) => {


          return user.findOne({
            where: {
              uuid: ctx.request.body.parentUUID,
            },
            attributes: ['id', 'uuid']
          }).then((result) => {

            return user.update({
              parent_name: ctx.request.body.parentName,
              parential_responsibility: ctx.request.body.parentialResponsibility,
              child_parent_relationship: ctx.request.body.childParentRelationship,
              parent_contact_number: ctx.request.body.parentContactNumber,
              parent_email: ctx.request.body.parentEmail,
              parent_same_house: ctx.request.body.parentSameHouse,
              parent_address: ctx.request.body.parentAddress,
              legal_care_status: ctx.request.body.legalCareStatus,
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
    else
    {
 
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
              child_name: ctx.request.body.childName,
              child_NHS: ctx.request.body.childNHS,
              child_email: ctx.request.body.childEmail,
              child_contact_number: ctx.request.body.childContactNumber,
              child_address: ctx.request.body.childAddress,
              can_send_post: ctx.request.body.sendPost,
              child_gender: ctx.request.body.childGender,
              child_gender_birth: ctx.request.body.childGenderBirth,
              child_sexual_orientation: ctx.request.body.childSexualOrientation,
              child_ethnicity: ctx.request.body.childEthnicity,
              child_household_name: ctx.request.body.houseHoldName,
              child_household_relationship: ctx.request.body.houseHoldRelationship,
              child_household_dob: ctx.request.body.houseHoldDOB,
              child_household_profession: ctx.request.body.houseHoldProfession,
              child_care_adult: ctx.request.body.childCareAdult,
            },
            {
              where:
                { id: childId }
            }
          ).then((updateResult) => {
  
            return user.create({
              parent_name: ctx.request.body.parentName,
              parential_responsibility: ctx.request.body.parentialResponsibility,
              child_parent_relationship: ctx.request.body.childParentRelationship,
              parent_contact_number: ctx.request.body.parentContactNumber,
              parent_email: ctx.request.body.parentEmail,
              parent_same_house: ctx.request.body.parentSameHouse,
              parent_address: ctx.request.body.parentAddress,
              legal_care_status: ctx.request.body.legalCareStatus,
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
  if(ctx.request.body.role=="child")
  {
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
 else if(ctx.request.body.role=="parent")
  {
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

  else if(ctx.request.body.role=="professional")
  {
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
        var parentId = Number(childResult[0].professional[0].ChildProfessional.professionalId) +2
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
            child_profession: ctx.request.body.childProfession,
            child_education_place: ctx.request.body.childEducationPlace,
            child_EHCP: ctx.request.body.childEHCP,
            child_EHAT: ctx.request.body.childEHAT,

            child_socialworker: ctx.request.body.isSocialWorker,
            child_socialworker_name: ctx.request.body.socialWorkerName,
            child_socialworker_contact: ctx.request.body.socialWorkerContactNumber,

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
  if(ctx.request.body.role=="child")
  {

    return user.findOne({
      where: {
        uuid: ctx.request.body.uuid,
      },
     
    }).then((result) => {
      return ctx.body = result;
    })
  }
  else if(ctx.request.body.role=="parent")
  {
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

  else if(ctx.request.body.role=="professional")
  {
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

    if(ctx.request.body.editFlag!=null)
    {
      return referral.update(
        {
          referral_type: ctx.request.body.referralData.support,
          is_covid: ctx.request.body.referralData.covid,
          mental_health_diagnosis: ctx.request.body.referralData.diagnosis,
          diagnosis:ctx.request.body.diagnosisList,//--------------------diagnosis list for both mental and eating
          diagnosis_other: ctx.request.body.referralData.diagnosisOther,
          symptoms_supportneeds:ctx.request.body.referralData.supportOrSymptoms,
          symptoms : ctx.request.body.problemsList,//--------------------symptoms list for both mental and eating 
          symptoms_other: ctx.request.body.referralData.problemsOther,
          referral_issues:ctx.request.body.referralData.referralInfo,
          has_anything_helped:ctx.request.body.referralData.hasAnythingInfo,
          any_particular_trigger:ctx.request.body.referralData.triggerInfo,
          disabilities:ctx.request.body.referralData.disabilityOrDifficulty,
          any_other_services:ctx.request.body.referralData.accessService,
          local_services:ctx.request.body.accessList,//---------->checkbox
          currently_accessing_services:ctx.request.body.referralData.isAccessingService,
          services:ctx.request.body.allAvailableService//------------->dynamic add service for only child
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
    else
    {
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
            diagnosis:ctx.request.body.diagnosisList,//--------------------diagnosis list for both mental and eating
            diagnosis_other: ctx.request.body.referralData.diagnosisOther,
            symptoms_supportneeds:ctx.request.body.referralData.supportOrSymptoms,
            symptoms : ctx.request.body.problemsList,//--------------------symptoms list for both mental and eating 
            symptoms_other: ctx.request.body.referralData.problemsOther,
            referral_issues:ctx.request.body.referralData.referralInfo,
            has_anything_helped:ctx.request.body.referralData.hasAnythingInfo,
            any_particular_trigger:ctx.request.body.referralData.triggerInfo,
            disabilities:ctx.request.body.referralData.disabilityOrDifficulty,
            any_other_services:ctx.request.body.referralData.accessService,
            local_services:ctx.request.body.accessList,//---------->checkbox
            currently_accessing_services:ctx.request.body.referralData.isAccessingService,
            services:ctx.request.body.allAvailableService//------------->dynamic add service for only child
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
    if(ctx.request.body.editFlag!=null)
    {
      return referral.update(
        {
          referral_type: ctx.request.body.referralData.support,
          is_covid: ctx.request.body.referralData.covid,
          mental_health_diagnosis: ctx.request.body.referralData.diagnosis,
          diagnosis:ctx.request.body.diagnosisList,//--------------------diagnosis list for both mental and eating
          diagnosis_other: ctx.request.body.referralData.diagnosisOther,
          symptoms_supportneeds:ctx.request.body.referralData.supportOrSymptoms,
          symptoms : ctx.request.body.problemsList,//--------------------symptoms list for both mental and eating 
          symptoms_other: ctx.request.body.referralData.problemsOther,
          referral_issues:ctx.request.body.referralData.referralInfo,
          has_anything_helped:ctx.request.body.referralData.hasAnythingInfo,
          any_particular_trigger:ctx.request.body.referralData.triggerInfo,
          disabilities:ctx.request.body.referralData.disabilityOrDifficulty,
          any_other_services:ctx.request.body.referralData.accessService,
          local_services:ctx.request.body.accessList,//---------->checkbox
          currently_accessing_services:ctx.request.body.referralData.isAccessingService,
          services:ctx.request.body.allAvailableService//------------->dynamic add service for only child
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
    else
    {
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
            diagnosis:ctx.request.body.diagnosisList,//--------------------diagnosis list for both mental and eating
            diagnosis_other: ctx.request.body.referralData.diagnosisOther,
            symptoms_supportneeds:ctx.request.body.referralData.supportOrSymptoms,
            symptoms : ctx.request.body.problemsList,//--------------------symptoms list for both mental and eating 
            symptoms_other: ctx.request.body.referralData.problemsOther,
            referral_issues:ctx.request.body.referralData.referralInfo,
            has_anything_helped:ctx.request.body.referralData.hasAnythingInfo,
            any_particular_trigger:ctx.request.body.referralData.triggerInfo,
            disabilities:ctx.request.body.referralData.disabilityOrDifficulty,
            any_other_services:ctx.request.body.referralData.accessService,
            local_services:ctx.request.body.accessList,//---------->checkbox
            currently_accessing_services:ctx.request.body.referralData.isAccessingService,
            services:ctx.request.body.allAvailableService//------------->dynamic add service for only child
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
    if(ctx.request.body.editFlag!=null)
    {
      return referral.update(
        {
          referral_type: ctx.request.body.referralData.support,
          is_covid: ctx.request.body.referralData.covid,
          mental_health_diagnosis: ctx.request.body.referralData.diagnosis,
          diagnosis:ctx.request.body.diagnosisList,//--------------------diagnosis list for both mental and eating
          diagnosis_other: ctx.request.body.referralData.diagnosisOther,
          symptoms_supportneeds:ctx.request.body.referralData.supportOrSymptoms,
          symptoms : ctx.request.body.problemsList,//--------------------symptoms list for both mental and eating 
          symptoms_other: ctx.request.body.referralData.problemsOther,
          referral_issues:ctx.request.body.referralData.referralInfo,
          has_anything_helped:ctx.request.body.referralData.hasAnythingInfo,
          any_particular_trigger:ctx.request.body.referralData.triggerInfo,
          disabilities:ctx.request.body.referralData.disabilityOrDifficulty,
          any_other_services:ctx.request.body.referralData.accessService,
          local_services:ctx.request.body.accessList,//---------->checkbox
          currently_accessing_services:ctx.request.body.referralData.isAccessingService,
          services:ctx.request.body.allAvailableService//------------->dynamic add service for only child
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
    else
    {
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
            diagnosis:ctx.request.body.diagnosisList,//--------------------diagnosis list for both mental and eating
            diagnosis_other: ctx.request.body.referralData.diagnosisOther,
            symptoms_supportneeds:ctx.request.body.referralData.supportOrSymptoms,
            symptoms : ctx.request.body.problemsList,//--------------------symptoms list for both mental and eating 
            symptoms_other: ctx.request.body.referralData.problemsOther,
            referral_issues:ctx.request.body.referralData.referralInfo,
            has_anything_helped:ctx.request.body.referralData.hasAnythingInfo,
            any_particular_trigger:ctx.request.body.referralData.triggerInfo,
            disabilities:ctx.request.body.referralData.disabilityOrDifficulty,
            any_other_services:ctx.request.body.referralData.accessService,
            local_services:ctx.request.body.accessList,//---------->checkbox
            currently_accessing_services:ctx.request.body.referralData.isAccessingService,
            services:ctx.request.body.allAvailableService//------------->dynamic add service for only child
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
       var refId=userResult[0].referral[0].id;
        
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

  if(ctx.request.body.role=="child")
  {

    //console.log("//Section 5//Section 5//Section 5//Section 5//Section 5");
    return user.findOne({
      where: {
        uuid: ctx.request.body.userid,
      },
    //  attributes: ['id', 'uuid']
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

        return referral.findOne({
          where: {
            id: userResult.id,
          },
          
        }).then((referralResult) => {

          const responseData = {
            userid: ctx.request.body.userid,
            childData: result,
            parentData:userResult.parent,
            referralData:referralResult,
            status: "ok",
            role: ctx.request.body.role
          }
          return ctx.body = responseData;

        })  
      })
  
    })
  }

  else if (ctx.request.body.role == "parent") {
    return user.findOne({
      where: {
        uuid: ctx.request.body.userid,
      },
    //  attributes: ['id', 'uuid']
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
     //   console.log(userResult[0].parent[0].ChildParents.parentId)
        var childId = userResult[0].parent[0].ChildParents.parentId
        return referral.findOne(
          {
            where: {
              id: childId,
            },
          },
        ).then((fetchResult) => {
         // result.setReferral(childId)
         const responseData = {
          userid: ctx.request.body.userid,
            parentData: result,
            childData:userResult[0].parent,
            referralData:fetchResult,
            status: "ok",
            role: ctx.request.body.role
        }
        return ctx.body = responseData;
        })

      })

    })
  }
  else if (ctx.request.body.role == "professional") {
    return user.findOne({
      where: {
        uuid: ctx.request.body.userid,
      },
    //  attributes: ['id', 'uuid']
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
     var parentId = Number(userResult[0].professional[0].ChildProfessional.professionalId) +2
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

     // return ctx.body = parentResult;
      var childId = userResult[0].professional[0].ChildProfessional.professionalId
      return referral.findOne(
        {
          where: {
            id: childId,
          },
        },
      ).then((fetchResult) => {
       // result.setReferral(childId)
       console.log("33");
       const responseData = {
        userid: ctx.request.body.userid,
          profData: userResult,
          childData:userResult[0].professional[0],
          parentData:parentResult,
          referralData:fetchResult,
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

exports.saveReview = ctx => {
  const user = ctx.orm().User;
  const uniqueNo = uniqid()
  return user.findOne({
    where: {
      reference_code: uniqueNo,
    },
  }).then((result) => {
    if(result==null)
    {
      return user.update({
        reference_code:uniqueNo
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
          refNo:uniqueNo
      }
      return ctx.body =responseData;
      }).catch((error) => {
    console.log(error)
      });
    }
  })
}