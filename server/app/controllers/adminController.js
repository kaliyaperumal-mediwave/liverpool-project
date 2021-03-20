const moment = require('moment');
const _ = require('lodash');
const sequalizeErrorHandler = require('../middlewares/errorHandler');
const reponseMessages = require('../middlewares/responseMessage');
const sequelize = require('sequelize');
const { req } = require('@kasa/koa-logging/lib/serializers');
const email = require('../utils/email');
const pdf = require('../utils/pdfgenerate');

const gpCodes = [
    {
        type: 'Liverpool',
        code: [
            'L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8', 'L9', 'L10', 'L11', 'L12', 'L13', 'L14', 'L15',
            'L16', 'L17', 'L18', 'L19', 'L20', 'L24', 'L25', 'L26', 'L27', 'L28', 'L32', 'L33', 'L34', 'L35', 'L36', 'PR8', 'PR9'
        ]
    },
    { type: 'Sefton', code: ['L21', 'L22', 'L23', 'L29', 'L30', 'L31', 'L37', 'L38'] },
]

exports.getReferral = ctx => {
    return new Promise(async (resolve, reject) => {
        try {
            ////console.log()('\n\nget referral queries-----------------------------------------\n', ctx.query, '\n\n');
            const referralModel = ctx.orm().Referral;

            // sorting
            var order = [];
            if (ctx.query && ctx.query.orderBy) {
                if (ctx.query.orderBy == '1') order.push([sequelize.literal('name'), ctx.query.orderType.toUpperCase()]);
                else if (ctx.query.orderBy == '2') order.push([sequelize.literal('dob'), ctx.query.orderType.toUpperCase()]);
                else if (ctx.query.orderBy == '3') order.push(['reference_code', ctx.query.orderType.toUpperCase()]);
                else if (ctx.query.orderBy == '4') order.push([sequelize.literal('referrer_name'), ctx.query.orderType.toUpperCase()]);
                else if (ctx.query.orderBy == '6') order.push(['user_role', ctx.query.orderType.toUpperCase()]);
                else if (ctx.query.orderBy == '7') order.push(['updatedAt', ctx.query.orderType.toUpperCase()]);
            }

            var referrals = await referralModel.findAll({
                attributes: [
                    'id', 'uuid', 'reference_code', 'child_dob', 'user_role', 'registerd_gp', 'updatedAt','referral_provider',
                    [sequelize.fn('CONCAT', sequelize.col('parent.child_firstname'), sequelize.col('professional.child_firstname'), sequelize.col('Referral.child_firstname')), 'name'],
                    [sequelize.fn('CONCAT', sequelize.col('parent.child_lastname'), sequelize.col('professional.child_lastname'), sequelize.col('Referral.child_lastname')), 'lastname'],
                    [sequelize.fn('CONCAT', sequelize.col('Referral.registerd_gp'), sequelize.col('parent.registerd_gp'), sequelize.col('professional.registerd_gp')), 'gp_location'],
                    [sequelize.fn('CONCAT', sequelize.col('parent.child_dob'), sequelize.col('professional.child_dob'), sequelize.col('Referral.child_dob')), 'dob'],
                    [sequelize.fn('CONCAT', sequelize.col('Referral.child_firstname'), sequelize.col('Referral.professional_firstname'), sequelize.col('Referral.parent_firstname')), 'referrer_name'],
                    [sequelize.fn('CONCAT', sequelize.col('Referral.child_lastname'), sequelize.col('Referral.professional_lastname'), sequelize.col('Referral.parent_lastname')), 'referrer_lastname'],
                ],
                where: {
                    reference_code: {
                        [sequelize.Op.ne]: null
                    },
                    referral_complete_status: 'completed'
                },
                include: [
                    {
                        model: referralModel,
                        as: 'parent',
                        attributes: ['id', 'uuid', 'child_firstname', 'child_lastname', 'child_dob', 'registerd_gp',
                        ]
                    },
                    {
                        model: referralModel,
                        as: 'professional',
                        attributes: [
                            'id', 'uuid', 'child_firstname', 'child_lastname', 'child_dob', 'registerd_gp',
                        ]
                    },
                ],
                order: order
            });

            referrals = JSON.parse(JSON.stringify(referrals));
            var totalReferrals = referrals.length;
            var filteredReferrals = referrals.length;
            // with search
            if (ctx.query.searchValue) {
                ctx.query.searchValue = ctx.query.searchValue.toLowerCase();
                let filter_referrals = [];
                _.forEach(referrals, function (refObj, index) {
                    if(refObj.referral_provider==null) {
                        refObj.referral_provider = "Pending"
                    } else {
                        refObj.referral_provider = refObj.referral_provider
                    }
                    var referralObj = {
                        uuid: refObj.uuid,
                        name: refObj.name + refObj.lastname,
                        dob: refObj.dob ? moment(refObj.dob).format('DD/MM/YYYY') : '',
                        reference_code: refObj.reference_code,
                        referrer: refObj.referrer_name + refObj.referrer_lastname,
                        gp_location: '',
                        referrer_type: refObj.user_role.charAt(0).toUpperCase() + refObj.user_role.slice(1),
                        date: moment(refObj.updatedAt).format('DD/MM/YYYY'),
                        referral_provider: refObj.referral_provider
                    }
                    if (refObj.gp_location) {
                        var splitLocation = refObj.gp_location.split(',');
                        if (splitLocation.length > 1) {
                            if (gpCodes[0].code.indexOf(splitLocation[1].split(' ')[0]) >= 0) {
                                referralObj.gp_location = gpCodes[0].type;
                            } else if (gpCodes[1].code.indexOf(splitLocation[1].split(' ')[0]) >= 0) {
                                referralObj.gp_location = gpCodes[1].type;
                            }
                        }
                    }
                    ////console.log()(referralObj)
                    if ((referralObj.name.toLowerCase()).includes(ctx.query.searchValue) ||
                        (referralObj.dob.toLowerCase()).includes(ctx.query.searchValue) ||
                        (referralObj.reference_code.toLowerCase()).includes(ctx.query.searchValue) ||
                        (referralObj.referrer.toLowerCase()).includes(ctx.query.searchValue) ||
                        (referralObj.gp_location.toLowerCase()).includes(ctx.query.searchValue) ||
                        (referralObj.referrer_type.toLowerCase()).includes(ctx.query.searchValue) ||
                        (referralObj.date.toLowerCase()).includes(ctx.query.searchValue) ||
                        (referralObj.referral_provider.toLowerCase()).includes(ctx.query.searchValue)
                    ) {
                        filter_referrals.push(referralObj);
                    }
                });
                filteredReferrals = filter_referrals.length;
                referrals = filter_referrals;
                // without search
            } else {
                _.forEach(referrals, function (refObj, index) {
                    if(refObj.referral_provider==null) {
                        refObj.referral_provider = "Pending"
                    } else {
                        refObj.referral_provider = refObj.referral_provider
                    }
                    var referralObj = {
                        uuid: refObj.uuid,
                        name: refObj.name + refObj.lastname,
                        dob: refObj.dob ? moment(refObj.dob).format('DD/MM/YYYY') : '',
                        reference_code: refObj.reference_code,
                        referrer: refObj.referrer_name + refObj.referrer_lastname,
                        gp_location: 'Liverpool',
                        referrer_type: refObj.user_role.charAt(0).toUpperCase() + refObj.user_role.slice(1),
                        date: moment(refObj.updatedAt).format('DD/MM/YYYY'),
                        referral_provider: refObj.referral_provider
                    }
                    if (refObj.gp_location) {
                        var splitLocation = refObj.gp_location.split(',');
                        if (splitLocation.length > 1) {
                            if (gpCodes[0].code.indexOf(splitLocation[1].split(' ')[0]) >= 0) {
                                // Liverpool
                                referralObj.gp_location = gpCodes[0].type;
                            } else if (gpCodes[1].code.indexOf(splitLocation[1].split(' ')[0]) >= 0) {
                                // Sefton
                                referralObj.gp_location = gpCodes[1].type;
                            }
                        }
                    }
                    referrals[index] = referralObj;
                });
            }

            if (ctx.query && ctx.query.orderBy == '5') {
                referrals = _.orderBy(referrals, 'gp_location', ctx.query.orderType);
            }

            // pagination
            referrals = referrals.slice((Number(ctx.query.offset) - 1) * Number(ctx.query.limit), Number(ctx.query.offset) * Number(ctx.query.limit));

            resolve(
                ctx.res.ok({
                    data: {
                        totalReferrals: totalReferrals,
                        filteredReferrals: filteredReferrals,
                        data: referrals
                    }
                })
            );
        } catch (error) {
            //console.log()(error);
            reject(
                sequalizeErrorHandler.handleSequalizeError(ctx, error)
            );
        }
    });
}

exports.updateReferral = ctx => {
    return new Promise(async (resolve, reject) => {
        try {
            if (ctx.request.body.referral_id && ctx.request.body.referral_id.length && ctx.request.body.status) {
                const referralModel = ctx.orm().Referral;

                await referralModel.update(
                    {
                        referral_complete_status: ctx.request.body.status
                    },
                    {
                        where: {
                            uuid: ctx.request.body.referral_id
                        }
                    }
                );

                resolve(
                    ctx.res.ok({
                        message: reponseMessages[1001]
                    })
                );
            } else {
                resolve(
                    ctx.res.badRequest({
                        message: reponseMessages[1002]
                    })
                );
            }
        } catch (error) {
            ////console.log()(error);
            reject(
                sequalizeErrorHandler.handleSequalizeError(ctx, error)
            );
        }
    });
}

exports.getReferalBySearch = ctx => {
    const ref = ctx.orm().Referral;
    return ref.findAll({
        where: {
            referral_complete_status: 'completed',
            [sequelize.Op.or]: [
                {
                    reference_code: {
                        [sequelize.Op.like]: '%' + ctx.query.reqCode + '%'
                    }
                },
                {
                    child_name: {
                        [sequelize.Op.like]: '%' + ctx.query.reqCode + '%'
                    }
                },
            ],
        },
        order: [
            ['updatedAt', 'DESC'],
        ],
    }).then((result) => {
        ////console.log()(result);
        return ctx.body = result
    }).catch((error) => {
        sequalizeErrorHandler.handleSequalizeError(ctx, error)
    });
}


exports.getAllReferral = ctx => {
    var childArray = [];
    var parentArray = [];
    var professionalArray = [];
    var resultArray = []
    var sendArray = [];
    var obj = [];
    const ref = ctx.orm().Referral;
    return ref.findAll({
        where: {
            reference_code: {
                [sequelize.Op.ne]: null
            },
            user_role: 'child'
        },
        attributes: [
            'id', 'uuid', 'reference_code', 'child_dob', 'user_role', 'registerd_gp', 'updatedAt', 'child_name',
            [sequelize.fn('CONCAT', sequelize.col('child_name'),), 'referrer_name'],
        ],
    }).then((childResult) => {
        childArray = childResult;

        return ref.findAll({
            include: [
                {
                    model: ctx.orm().Referral,
                    as: 'parent',
                },
            ],
            where: {
                reference_code: {
                    [sequelize.Op.ne]: null
                },
                user_role: 'parent'
            },
            attributes: [
                'id', 'uuid', 'reference_code', 'user_role', 'updatedAt', ['parent_name', 'referrer_name'],
                [sequelize.fn('CONCAT', sequelize.col('parent.child_name'),), 'child_name'],
                [sequelize.fn('CONCAT', sequelize.col('parent.child_dob'),), 'child_dob'],
                [sequelize.fn('CONCAT', sequelize.col('parent.registerd_gp'),), 'registerd_gp'],
            ],
        }).then((parentResult) => {
            // childArray = childResult;
            parentArray = parentResult

            return ref.findAll({
                include: [
                    {
                        model: ctx.orm().Referral,
                        as: 'professional',
                    },
                ],
                where: {
                    reference_code: {
                        [sequelize.Op.ne]: null
                    },
                    user_role: 'professional'
                },
                attributes: [
                    'id', 'uuid', 'reference_code', 'user_role', 'updatedAt', ['professional_name', 'referrer_name'],
                    [sequelize.fn('CONCAT', sequelize.col('professional.child_name'),), 'child_name'],
                    [sequelize.fn('CONCAT', sequelize.col('professional.child_dob'),), 'child_dob'],
                    [sequelize.fn('CONCAT', sequelize.col('professional.registerd_gp'),), 'registerd_gp'],
                ],
            }).then((professionalResult) => {
                professionalArray = professionalResult
                resultArray = professionalArray.concat(parentArray, childArray)

                resultArray = JSON.parse(JSON.stringify(resultArray));
                for (var i = 0; i < resultArray.length; i++) {
                    ////console.log()(resultArray[i])
                    obj = {};
                    obj.uuid = resultArray[i].uuid;
                    obj.name = resultArray[i].child_name;
                    obj.child_dob = resultArray[i].child_dob;
                    obj.reference_code = resultArray[i].reference_code
                    obj.referrer = resultArray[i].referrer_name;
                    obj.referrer_type = resultArray[i].user_role;
                    obj.date = resultArray[i].updatedAt
                    if (resultArray[i].registerd_gp) {
                        var splitLocation = resultArray[i].registerd_gp.split(',');
                        if (splitLocation.length > 1) {
                            if (gpCodes[0].code.indexOf(splitLocation[1].split(' ')[0]) >= 0) {
                                obj.registerd_gp = gpCodes[0].type;
                            } else if (gpCodes[1].code.indexOf(splitLocation[1].split(' ')[0]) >= 0) {
                                obj.registerd_gp = gpCodes[1].type;
                            }
                            else {
                                obj.registerd_gp = "thiru";
                            }
                        }
                    }
                    sendArray.push(obj);
                }
                ////console.log()("----------------------------------------------end")
                //array = [];
                return ctx.body = sendArray
            }).catch((error) => {
                ////console.log()(error)
                sequalizeErrorHandler.handleSequalizeError(ctx, error)
            });
        }).catch((error) => {
            ////console.log()(error)
            sequalizeErrorHandler.handleSequalizeError(ctx, error)
        });
    }).catch((error) => {
        ////console.log()(error)
        sequalizeErrorHandler.handleSequalizeError(ctx, error)
    });
}
exports.downloadReferral = async ctx => {
    let referralData = await getRefData(ctx.query.refID, ctx.query.refRole, ctx);
    ctx.request.body.referralData = referralData;
    try {
        return pdf.generatePdf(ctx).then((sendReferralStatus) => {
            ////console.log()(sendReferralStatus)
            return ctx.res.ok({
                data: sendReferralStatus,
                message: reponseMessages[1017],
            });
        }).catch(error => {
            ////console.log()(error);
            sequalizeErrorHandler.handleSequalizeError(ctx, error)
        });
    } catch (e) {
        ////console.log()(e);
        return sequalizeErrorHandler.handleSequalizeError(ctx, e);
    }
}

exports.sendReferral = async ctx => {
    //console.log("ctx.request.body.referralData");
    let referralData = await getRefData(ctx.query.refID, ctx.query.refRole, ctx);
    ctx.request.body.referralData = referralData;
    ctx.request.body.emailToProvider = ctx.query.selectedProvider;
    ctx.request.body.refCode = ctx.query.refCode;
    ////console.log("referralData",ctx.request.body.referralData);
    ////console.log("emailToProvider" ,ctx.request.body.emailToProvider);
    ////console.log("refCode",ctx.request.body.refCode);
    try {
        return email.sendReferralWithData(ctx).then((sendReferralStatus) => {
            ////console.log()(sendReferralStatus)
            const referralModel = ctx.orm().Referral;
            return referralModel.update({
                referral_provider: "Sent to " + ctx.query.selectedProvider
              },
                {
                  where:
                    { uuid: ctx.query.refID }
                }
              ).then((result) => {
                return ctx.res.ok({
                    message: reponseMessages[1017],
                });
              }).catch(error => {
                ////console.log()(error);
                sequalizeErrorHandler.handleSequalizeError(ctx, error)
            });

        }).catch(error => {
            ////console.log()(error, "error");
            sequalizeErrorHandler.handleSequalizeError(ctx, error)
        });
    } catch (e) {
        return sequalizeErrorHandler.handleSequalizeError(ctx, e);
    }
}

function getRefData(refID, refRole, ctx) {
    //console.log("refID", refID)
    //console.log("refRole",refRole)
    const user = ctx.orm().Referral;
    const referral = ctx.orm().Reason
    if (refRole == "Child") {
        return user.findOne({
            where: {
                uuid: refID,
            },
            attributes: ['id', 'uuid', 'need_interpreter', 'child_dob', 'contact_parent', 'consent_child', 'registerd_gp', 'contact_parent_camhs', 'reason_contact_parent_camhs']
        }).then((eligibilityObj) => {

            return user.findOne({
                include: [
                    {
                        model: ctx.orm().Referral,
                        as: 'parent',
                        attributes: ['id', 'parent_firstname', 'parent_lastname', 'parential_responsibility', 'responsibility_parent_firstname', 'child_parent_relationship', 'parent_contact_number', 'parent_email', 'parent_same_house', 'parent_address', 'legal_care_status']
                    },
                ],
                where: {
                    id: eligibilityObj.id,
                },
                attributes: ['id', 'child_NHS', 'child_firstname', 'child_lastname', 'child_email', 'child_contact_number', 'child_address', 'can_send_post', 'child_gender', 'child_gender_birth', 'child_sexual_orientation', 'child_ethnicity', 'child_care_adult', 'household_member']
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
                    attributes: [['id', 'child_id'], 'child_profession', 'child_education_place', 'child_EHCP', 'child_EHAT', 'child_socialworker', 'child_socialworker_firstname', 'child_socialworker_lastname', 'child_socialworker_contact']
                }).then((educationObj) => {
                    const section2Obj = {
                        child_id: aboutObj.id,
                        child_NHS: aboutObj.child_NHS,
                        child_name: aboutObj.child_firstname,
                        child_lastname: aboutObj.child_lastname,
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
                        parent_name: aboutObj.parent[0].parent_firstname,
                        parent_lastname: aboutObj.parent[0].parent_lastname,
                        parential_responsibility: aboutObj.parent[0].parential_responsibility,
                        child_parent_relationship: aboutObj.parent[0].child_parent_relationship,
                        parent_contact_number: aboutObj.parent[0].parent_contact_number,
                        parent_email: aboutObj.parent[0].parent_email,
                        parent_same_house: aboutObj.parent[0].parent_same_house,
                        parent_address: aboutObj.parent[0].parent_address,
                        legal_care_status: aboutObj.parent[0].legal_care_status,
                    }

                    var services;
                    var displayServicesPdf;
                    if (educationObj.referral_reason[0].local_services) {
                        if (educationObj.referral_reason[0].local_services.indexOf('Other') == -1) {
                            educationObj.referral_reason[0].local_services =educationObj.referral_reason[0].local_services
                        } else {
                            var index = educationObj.referral_reason[0].local_services.indexOf('Other');
                            educationObj.referral_reason[0].local_services.splice(index, 1);
                            services = educationObj.referral_reason[0].services.map(function (it) {
                              //  console.log(it)
                                return it.name
                            });
                            displayServicesPdf = educationObj.referral_reason[0].local_services.concat(services);
                        }
                    }
                    
                    const responseData = {
                        userid: ctx.query.refID,
                        section1: eligibilityObj,
                        child_dob: convertDate(eligibilityObj.child_dob),
                        section2: section2Obj,
                        section3: educationObj,
                        section4: educationObj.referral_reason[0],
                        section4LocalService:displayServicesPdf,
                        status: "ok",
                        role: ctx.query.refRole
                    }
                    return responseData;
                }).catch((error) => {
                    ////console.log()("1")
                    ////console.log()(error)
                    sequalizeErrorHandler.handleSequalizeError(ctx, error)
                });
            }).catch((error) => {
                ////console.log()("2")
                sequalizeErrorHandler.handleSequalizeError(ctx, error)
            });

        }).catch((error) => {
            ////console.log()(error)
            sequalizeErrorHandler.handleSequalizeError(ctx, error)
        });
    }
    else if (refRole == "Parent") {
        return user.findOne({
            where: {
                uuid: refID,
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
                            attributes: ['id', 'child_NHS', 'child_firstname', 'child_lastname', 'child_email', 'child_contact_number', 'child_address', 'can_send_post', 'child_gender', 'child_gender_birth', 'child_sexual_orientation', 'child_ethnicity', 'child_care_adult', 'household_member']
                        },
                    ],
                    where: {
                        id: elgibilityObj[0].id,
                    },
                    attributes: ['id', 'parent_firstname', 'parent_lastname', 'parential_responsibility', 'responsibility_parent_firstname', 'child_parent_relationship', 'parent_contact_number', 'parent_email', 'parent_same_house', 'parent_address', 'legal_care_status']
                }).then((aboutObj) => {
                    return user.findAll({
                        include: [
                            //childData
                            {
                                model: ctx.orm().Referral,
                                nested: true,
                                as: 'parent',
                                attributes: ['id', 'child_profession', 'child_education_place', 'child_EHCP', 'child_EHAT', 'child_socialworker', 'child_socialworker_contact', 'child_socialworker_firstname', 'child_socialworker_lastname']
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

                            ////console.log()(aboutObj)

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
                                child_name: aboutObj[0].parent[0].child_firstname,
                                child_lastname: aboutObj[0].parent[0].child_lastname,
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
                                parent_name: aboutObj[0].parent_firstname,
                                parent_lastname: aboutObj[0].parent_lastname,
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
                                child_socialworker_firstname: edu_empObj[0].parent[0].child_socialworker_firstname,
                                child_socialworker_lastname: edu_empObj[0].parent[0].child_socialworker_lastname,
                                child_socialworker_contact: edu_empObj[0].parent[0].child_socialworker_contact,
                            }


                            var services;
                            var displayServicesPdf;
                            if (referralResult.referral_reason[0].local_services) {
                                if (referralResult.referral_reason[0].local_services.indexOf('Other') == -1) {
                                    referralResult.referral_reason[0].local_services =referralResult.referral_reason[0].local_services
                                } else {
                                    var index = referralResult.referral_reason[0].local_services.indexOf('Other');
                                    referralResult.referral_reason[0].local_services.splice(index, 1);
                                    services = referralResult.referral_reason[0].services.map(function (it) {
                                      //  console.log(it)
                                        return it.name
                                    });
                                    displayServicesPdf = referralResult.referral_reason[0].local_services.concat(services);
                                }
                            }

                            const responseData = {
                                userid: refID,
                                section1: section1Obj,
                                section2: section2Obj,
                                section3: section3Obj,
                                child_dob: convertDate(elgibilityObj[0].parent[0].child_dob),
                                section4: referralResult.referral_reason[0],
                                section4LocalService:displayServicesPdf,
                                status: "ok",
                                role: refRole
                            }
                            return responseData;
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
    else if (refRole == "Professional") {
        return user.findOne({

            where: {
                uuid: refID,
            },
        }).then((userObj) => {

            return user.findOne({
                include: [{
                    model: ctx.orm().Referral,
                    as: 'professional',
                    attributes: ['id', 'child_dob', 'registerd_gp'],
                    include: [{
                        model: ctx.orm().Referral,
                        as: 'child_parent',
                    }]
                }],
                where: {
                    id: userObj.id,
                },
                attributes: ['id', 'uuid', 'professional_firstname', 'professional_lastname', 'professional_email', 'professional_contact_number', 'consent_child', 'consent_parent', 'professional_address', 'professional_profession']
            }).then((elgibilityObj) => {
                //return ctx.body = elgibilityObj.professional[0].child_parent[0];
                var childIdNew = elgibilityObj.professional[0].child_parent[0].id;
                var childId = Number(elgibilityObj.professional[0].ChildProfessional.professionalId) + 2
                ////console.log()(childIdNew);
                ////console.log()(childId);

                //  var childId = elgibilityObj[0].professional[0].ChildProfessional.UserId
                //  var parentId = Number(userResult[0].professional[0].ChildProfessional.professionalId) + 2
                return user.findAll({
                    include: [
                        //childData
                        {
                            model: ctx.orm().Referral,
                            nested: true,
                            as: 'parent',
                            attributes: ['id', 'child_NHS', 'child_firstname', 'child_lastname', 'child_email', 'child_contact_number', 'child_address', 'can_send_post', 'child_gender', 'child_gender_birth', 'child_sexual_orientation', 'child_ethnicity', 'child_care_adult', 'household_member']
                        },
                    ],
                    where: {
                        id: childIdNew,
                    },
                    attributes: ['id', 'parent_firstname', 'parent_lastname', 'parential_responsibility', 'responsibility_parent_firstname', 'child_parent_relationship', 'parent_contact_number', 'parent_email', 'parent_same_house', 'parent_address', 'legal_care_status']
                }).then((aboutObj) => {

                    return user.findAll({
                        include: [
                            //childData
                            {
                                model: ctx.orm().Referral,
                                nested: true,
                                as: 'professional',
                                attributes: [['id', 'child_id'], 'child_profession', 'child_education_place', 'child_EHCP', 'child_EHAT', 'child_socialworker', 'child_socialworker_firstname', 'child_socialworker_lastname', 'child_socialworker_contact']
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
                                child_dob:elgibilityObj.professional[0].child_dob,
                                registerd_gp: elgibilityObj.professional[0].registerd_gp,
                                professional_id: elgibilityObj.id,
                                consent_child: elgibilityObj.consent_child,
                                consent_parent: elgibilityObj.consent_parent,
                                professional_name: elgibilityObj.professional_firstname,
                                professional_lastname: elgibilityObj.professional_lastname,
                                professional_email: elgibilityObj.professional_email,
                                professional_contact_number: elgibilityObj.professional_contact_number,
                                professional_address: elgibilityObj.professional_address,
                                professional_profession: elgibilityObj.professional_profession,

                            }
                            const section2Obj = {
                                child_id: aboutObj[0].parent[0].id,
                                child_NHS: aboutObj[0].parent[0].child_NHS,
                                child_name: aboutObj[0].parent[0].child_firstname,
                                child_lastname: aboutObj[0].parent[0].child_lastname,
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
                                parent_name: aboutObj[0].parent_firstname,
                                parent_lastname: aboutObj[0].parent_lastname,
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
                                child_socialworker_firstname: edu_empObj[0].professional[0].child_firstname,
                                child_socialworker_lastname: edu_empObj[0].professional[0].child_lastname,
                                child_socialworker_contact: edu_empObj[0].professional[0].child_socialworker_contact,
                            }

                            //  return ctx.body = section1Obj;
                            var services;
                            var displayServicesPdf;
                            if (referralResult.referral_reason[0].local_services) {
                                if (referralResult.referral_reason[0].local_services.indexOf('Other') == -1) {
                                    referralResult.referral_reason[0].local_services =referralResult.referral_reason[0].local_services
                                } else {
                                    var index = referralResult.referral_reason[0].local_services.indexOf('Other');
                                    referralResult.referral_reason[0].local_services.splice(index, 1);
                                    services = referralResult.referral_reason[0].services.map(function (it) {
                                      //  console.log(it)
                                        return it.name
                                    });
                                    displayServicesPdf = referralResult.referral_reason[0].local_services.concat(services);
                                }
                            }


                     
                            const responseData = {
                                userid: refID,
                                section1: section1Obj,
                                section2: section2Obj,
                                child_dob: convertDate(elgibilityObj.professional[0].child_dob),
                                section3: edu_empObj[0].professional[0],
                                section4: referralResult.referral_reason[0],
                                section4LocalService:displayServicesPdf,
                                status: "ok",
                                role: refRole
                            }
                           // console.log(responseData)
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

function convertDate(date) {
    var yyyy = date.getFullYear().toString();
    var mm = (date.getMonth() + 1).toString();
    var dd = date.getDate().toString();
    var mmChars = mm.split('');
    var ddChars = dd.split('');
    return (ddChars[1] ? dd : "0" + ddChars[0]) + '-' + (mmChars[1] ? mm : "0" + mmChars[0]) + '-' + yyyy;
}