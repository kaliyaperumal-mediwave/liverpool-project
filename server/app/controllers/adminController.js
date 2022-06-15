const moment = require('moment');
const _ = require('lodash');
const sequalizeErrorHandler = require('../middlewares/errorHandler');
const reponseMessages = require('../middlewares/responseMessage');
const sequelize = require('sequelize');
const { req } = require('@kasa/koa-logging/lib/serializers');
const email = require('../utils/email');
const pdf = require('../utils/pdfgenerate');
const callIaptusApi = require('../utils/sendReferralByApi');
const convertToJson = require('../utils/convertCsvTOJson');
var axios = require('axios');
const config = require('../config');
const { update } = require('lodash');

const gpCodes = [
    {
        type: 'Liverpool',
        code: [
            'L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8', 'L9', 'L10', 'L11', 'L12', 'L13', 'L14', 'L15',
            'L16', 'L17', 'L18', 'L19', 'L24', 'L25', 'L27']
    },
    { type: 'Sefton', code: ['L20', 'L21', 'L22', 'L23', 'L29', 'L30', 'L31', 'L37', 'L38', 'PR8', 'PR9'] },
]

exports.getReferral = ctx => {
    //console.log('ctx---gdfsgdsgdsgds--------', ctx.request.decryptedUser);
    return new Promise(async (resolve, reject) => {
        try {
            // console.log('\n\nget referral queries-----------------------------------------\n', ctx.query, '\n\n');
            const referralModel = ctx.orm().Referral;
            const referralActivityModel = ctx.orm().referralActivity;
            // sorting
            var order = [];
            var query = {
                reference_code: {
                    [sequelize.Op.ne]: null
                },
                referral_complete_status: 'completed'
            }

            if (ctx.request.decryptedUser && ctx.request.decryptedUser.service_type) {
                query.referral_provider = ctx.request.decryptedUser.service_type;
                if (ctx.request.decryptedUser.service_type == "Alder Hey - Liverpool CAMHS") {
                    var inArray = [ctx.request.decryptedUser.service_type, 'Alder Hey - Liverpool EDYS']
                    query.referral_provider = {
                        [sequelize.Op.in]: inArray
                    }

                }
                else if (ctx.request.decryptedUser.service_type == "Alder Hey - Sefton CAMHS") {
                    var inArray = [ctx.request.decryptedUser.service_type, 'Alder Hey - Sefton EDYS']
                    query.referral_provider = {
                        [sequelize.Op.in]: inArray
                    }
                }
            }

            if (ctx.query && ctx.query.orderBy) {
                if (ctx.query.orderBy == '1') order.push([sequelize.literal('name'), ctx.query.orderType.toUpperCase()]);
                else if (ctx.query.orderBy == '2') order.push([sequelize.literal('dob'), ctx.query.orderType.toUpperCase()]);
                else if (ctx.query.orderBy == '3') order.push(['reference_code', ctx.query.orderType.toUpperCase()]);
                else if (ctx.query.orderBy == '4') order.push([sequelize.literal('referrer_name'), ctx.query.orderType.toUpperCase()]);
                else if (ctx.query.orderBy == '6') order.push(['user_role', ctx.query.orderType.toUpperCase()]);
                else if (ctx.query.orderBy == '7') order.push(['createdAt', ctx.query.orderType.toUpperCase()]);
                else if (ctx.query.orderBy == '8') order.push(['referral_provider', ctx.query.orderType.toUpperCase()]);
                else if (ctx.query.orderBy == '10') order.push(['updatedAt', ctx.query.orderType.toUpperCase()]);
                //console.log(order)
            }

            var referrals = await referralModel.findAll({
                attributes: [
                    'id', 'uuid', 'reference_code', 'child_dob', 'user_role', 'registered_gp', 'updatedAt', 'createdAt', 'referral_provider', 'referral_provider_other', 'referral_status', 'gp_school', 'registered_gp_postcode', 'referral_type',
                    [sequelize.fn('CONCAT', sequelize.col('parent.child_firstname'), sequelize.col('professional.child_firstname'), sequelize.col('Referral.child_firstname')), 'name'],
                    [sequelize.fn('CONCAT', sequelize.col('parent.child_lastname'), sequelize.col('professional.child_lastname'), sequelize.col('Referral.child_lastname')), 'lastname'],
                    [sequelize.fn('CONCAT', sequelize.col('parent.child_dob'), sequelize.col('professional.child_dob'), sequelize.col('Referral.child_dob')), 'dob'],
                    [sequelize.fn('CONCAT', sequelize.col('Referral.child_firstname'), sequelize.col('Referral.professional_firstname'), sequelize.col('Referral.parent_firstname')), 'referrer_name'],
                    [sequelize.fn('CONCAT', sequelize.col('Referral.child_lastname'), sequelize.col('Referral.professional_lastname'), sequelize.col('Referral.parent_lastname')), 'referrer_lastname'],
                    [sequelize.fn('CONCAT', sequelize.col('Referral.registered_gp'), sequelize.col('parent.registered_gp'), sequelize.col('professional.registered_gp')), 'gp_location'],
                    [sequelize.fn('CONCAT', sequelize.col('Referral.registered_gp_postcode'), sequelize.col('parent.registered_gp_postcode'), sequelize.col('professional.registered_gp_postcode')), 'gp_location_postcode'],
                    //[sequelize.fn('CONCAT', sequelize.col('family.child_firstname'), sequelize.col('professional.child_firstname'), sequelize.col('Referral.child_firstname')), 'name'],
                    //[sequelize.fn('CONCAT', sequelize.col('family.child_lastname'), sequelize.col('professional.child_lastname'), sequelize.col('Referral.child_lastname')), 'lastname'],
                    //[sequelize.fn('CONCAT', sequelize.col('family.child_dob'), sequelize.col('professional.child_dob'), sequelize.col('Referral.child_dob')), 'dob'],

                ],
                where: query,
                include: [
                    {
                        model: referralModel,
                        as: 'parent',
                        attributes: ['id', 'uuid', 'child_firstname', 'child_lastname', 'child_dob', 'registered_gp', 'registered_gp_postcode', 'referral_type'
                        ]
                    },
                    {
                        model: referralModel,
                        as: 'professional',
                        attributes: [
                            'id', 'uuid', 'child_firstname', 'child_lastname', 'child_dob', 'registered_gp', 'registered_gp_postcode', 'referral_type'
                        ]
                    },
                    {
                        model: referralModel,
                        as: 'family',
                        attributes: ['id', 'uuid', 'child_firstname', 'child_lastname', 'child_dob', 'registered_gp', 'registered_gp_postcode', 'referral_type'
                        ]
                    },
                    {
                        model: referralModel,
                        as: 'professional2',
                        attributes: [
                            'id', 'uuid', 'child_firstname', 'child_lastname', 'child_dob', 'registered_gp', 'registered_gp_postcode', 'referral_type'
                        ]
                    },
                ],
                order: order
            })
            var referralsActivity = await referralActivityModel.findAll({}).catch((err) => { console.log(err, "err") })
            var reftest = referrals
            var jsonStringTest = JSON.stringify(referrals)
            //referrals = JSON.parse(JSON.stringify(referrals));


            var totalReferrals = referrals.length;
            var filteredReferrals = referrals.length;
            var fullName;
            var dob
            var referralFullName;
            // with search
            if (ctx.query.searchValue) {
                ctx.query.searchValue = ctx.query.searchValue.toLowerCase();
                // console.log(ctx.query.searchValue)
                let filter_referrals = [];
                _.forEach(referrals, function (refObj, index) {

                    //console.log(refObj)
                    if (refObj.referral_provider == null) {
                        refObj.referral_provider = "Pending"
                    } else {
                        refObj.referral_provider = refObj.referral_provider
                    }

                    if (refObj.user_role == 'family') {
                        refObj.dataValues.name = refObj.family[0].child_firstname;
                        refObj.dataValues.lastname = refObj.family[0].child_lastname;
                        refObj.dataValues.dob = refObj.family[0].child_dob;
                        refObj.dataValues.gp_location = refObj.family[0].dataValues.registered_gp;
                        refObj.dataValues.gp_location_postcode = refObj.family[0].dataValues.registered_gp_postcode;

                    }
                    else if (refObj.user_role == 'professional') {
                        if (refObj.referral_type == "young") {
                            refObj.dataValues.name = refObj.professional2[0].child_firstname;
                            refObj.dataValues.lastname = refObj.professional2[0].child_lastname;
                            refObj.dataValues.dob = refObj.professional2[0].child_dob;
                            refObj.dataValues.gp_location = refObj.professional2[0].dataValues.registered_gp;
                            refObj.dataValues.gp_location_postcode = refObj.professional2[0].dataValues.registered_gp_postcode
                        }
                    }


                    var referralObj = {
                        uuid: refObj.uuid,
                        name: refObj.dataValues.name + " " + refObj.dataValues.lastname,
                        dob: refObj.dataValues.dob ? moment(refObj.dataValues.dob).format('DD/MM/YYYY') : '',
                        reference_code: refObj.reference_code,
                        referrer: refObj.dataValues.referrer_name + " " + refObj.dataValues.referrer_lastname,
                        gp_location: 'Local School',
                        referrer_type: refObj.user_role.charAt(0).toUpperCase() + refObj.user_role.slice(1),
                        date: moment(refObj.updatedAt).format('DD/MM/YYYY'),
                        refDate: moment(moment(refObj.createdAt).tz('Europe/London')).format('DD/MM/YYYY H:mm:ss'),
                        referral_provider: refObj.referral_provider,
                        referral_provider_other: refObj.referral_provider_other,
                        referral_status: refObj.referral_status,
                        referral_formType: refObj.dataValues.referral_type
                    }
                    if (refObj.dataValues.gp_location) {
                        if (refObj.dataValues.gp_location_postcode || refObj.dataValues.gp_location_postcode != '') {
                            if (refObj.dataValues.gp_location_postcode != "L14 0JE" && gpCodes[0].code.indexOf(refObj.dataValues.gp_location_postcode.split(' ')[0]) >= 0) {
                                referralObj.gp_location = gpCodes[0].type;
                            } else if (refObj.dataValues.gp_location_postcode != "L14 0JE" && gpCodes[1].code.indexOf(refObj.dataValues.gp_location_postcode.split(' ')[0]) >= 0) {
                                referralObj.gp_location = gpCodes[1].type;
                            }
                        }
                        else {
                            var splitLocation = refObj.dataValues.gp_location.split(',');
                            if (splitLocation.length > 1) {
                                if (splitLocation[1] != "L14 0JE" && gpCodes[0].code.indexOf(splitLocation[1].split(' ')[0]) >= 0) {
                                    referralObj.gp_location = gpCodes[0].type;
                                } else if (splitLocation[1] != "L14 0JE" && gpCodes[1].code.indexOf(splitLocation[1].split(' ')[0]) >= 0) {
                                    referralObj.gp_location = gpCodes[1].type;
                                }
                            }
                        }

                        //referralObj.name= "refObj.family[0].child_firstname" + " " + "refObj.family[0].child_lastname"
                    }
                    if ((referralObj.name.toLowerCase()).includes(ctx.query.searchValue) ||
                        (referralObj.dob.toLowerCase()).includes(ctx.query.searchValue) ||
                        (referralObj.reference_code.toLowerCase()).includes(ctx.query.searchValue) ||
                        (referralObj.referrer.toLowerCase()).includes(ctx.query.searchValue) ||
                        (referralObj.gp_location.toLowerCase()).includes(ctx.query.searchValue) ||
                        (referralObj.referrer_type.toLowerCase()).includes(ctx.query.searchValue) ||
                        (referralObj.date.toLowerCase()).includes(ctx.query.searchValue) ||
                        (referralObj.refDate.toLowerCase()).includes(ctx.query.searchValue)
                    ) {
                        filter_referrals.push(referralObj);
                    }
                });
                filteredReferrals = filter_referrals.length;
                referrals = filter_referrals;
                // without search
            } else {
                _.forEach(referrals, function (refObj, index) {
                    //console.log(refObj.dataValues.referral_type)
                    if (refObj.referral_provider == null) {
                        refObj.referral_provider = "Pending"
                    } else {
                        refObj.referral_provider = refObj.referral_provider
                    }

                    if (refObj.user_role == 'family') {
                        refObj.dataValues.name = refObj.family[0].child_firstname;
                        refObj.dataValues.lastname = refObj.family[0].child_lastname;
                        refObj.dataValues.dob = refObj.family[0].child_dob;
                        refObj.dataValues.gp_location = refObj.family[0].dataValues.registered_gp;
                        refObj.dataValues.gp_location_postcode = refObj.family[0].dataValues.registered_gp_postcode;

                    }
                    else if (refObj.user_role == 'professional') {
                        if (refObj.referral_type == "young") {
                            refObj.dataValues.name = refObj.professional2[0].child_firstname;
                            refObj.dataValues.lastname = refObj.professional2[0].child_lastname;
                            refObj.dataValues.dob = refObj.professional2[0].child_dob;
                            refObj.dataValues.gp_location = refObj.professional2[0].dataValues.registered_gp;
                            refObj.dataValues.gp_location_postcode = refObj.professional2[0].dataValues.registered_gp_postcode
                        }
                    }
                    var referralObj = {
                        uuid: refObj.uuid,
                        name: refObj.dataValues.name + " " + refObj.dataValues.lastname,
                        dob: refObj.dataValues.dob ? moment(refObj.dataValues.dob).format('DD/MM/YYYY') : '',
                        reference_code: refObj.reference_code,
                        referrer: refObj.dataValues.referrer_name + " " + refObj.dataValues.referrer_lastname,
                        gp_location: 'Local School',
                        referrer_type: refObj.user_role.charAt(0).toUpperCase() + refObj.user_role.slice(1),
                        date: moment(refObj.updatedAt).format('DD/MM/YYYY'),
                        refDate: moment(moment(refObj.createdAt).tz('Europe/London')).format('DD/MM/YYYY H:mm:ss'),
                        referral_provider: refObj.referral_provider,
                        referral_provider_other: refObj.referral_provider_other,
                        referral_status: refObj.referral_status,
                        referral_formType: refObj.dataValues.referral_type
                    }
                    if (refObj.dataValues.gp_location) {
                        if (refObj.dataValues.gp_location_postcode || refObj.dataValues.gp_location_postcode != '') {
                            if (refObj.dataValues.gp_location_postcode != "L14 0JE" && gpCodes[0].code.indexOf(refObj.dataValues.gp_location_postcode.split(' ')[0]) >= 0) {
                                referralObj.gp_location = gpCodes[0].type;
                            } else if (refObj.dataValues.gp_location_postcode != "L14 0JE" && gpCodes[1].code.indexOf(refObj.dataValues.gp_location_postcode.split(' ')[0]) >= 0) {
                                referralObj.gp_location = gpCodes[1].type;
                            }
                        }
                        else {
                            var splitLocation = refObj.dataValues.gp_location.split(',');
                            if (splitLocation.length > 1) {
                                if (splitLocation[1] != "L14 0JE" && gpCodes[0].code.indexOf(splitLocation[1].split(' ')[0]) >= 0) {
                                    referralObj.gp_location = gpCodes[0].type;
                                } else if (splitLocation[1] != "L14 0JE" && gpCodes[1].code.indexOf(splitLocation[1].split(' ')[0]) >= 0) {
                                    referralObj.gp_location = gpCodes[1].type;
                                }
                            }
                        }

                        //referralObj.name= "refObj.family[0].child_firstname" + " " + "refObj.family[0].child_lastname"
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
                        data: referrals,
                        reftest: reftest,
                        activity: referralsActivity
                    }
                })
            );
        } catch (error) {
            console.log(error);
            reject(
                sequalizeErrorHandler.handleSequalizeError(ctx, error)
            );
        }
    });
}


exports.getArchived = ctx => {
    return new Promise(async (resolve, reject) => {
        try {
            //////console.log()('\n\nget referral queries-----------------------------------------\n', ctx.query, '\n\n');
            const referralModel = ctx.orm().Referral;
            const referralActivityModel = ctx.orm().referralActivity;
            var query = {
                reference_code: {
                    [sequelize.Op.ne]: null
                },
                referral_complete_status: 'archived'
            }
            if (ctx.request.decryptedUser && ctx.request.decryptedUser.service_type) {
                query.referral_provider = ctx.request.decryptedUser.service_type;
            }

            // sorting
            var order = [];
            if (ctx.query && ctx.query.orderBy) {
                if (ctx.query.orderBy == '1') order.push([sequelize.literal('name'), ctx.query.orderType.toUpperCase()]);
                else if (ctx.query.orderBy == '2') order.push([sequelize.literal('dob'), ctx.query.orderType.toUpperCase()]);
                else if (ctx.query.orderBy == '3') order.push(['reference_code', ctx.query.orderType.toUpperCase()]);
                else if (ctx.query.orderBy == '4') order.push([sequelize.literal('referrer_name'), ctx.query.orderType.toUpperCase()]);
                else if (ctx.query.orderBy == '6') order.push(['user_role', ctx.query.orderType.toUpperCase()]);
                else if (ctx.query.orderBy == '7') order.push(['createdAt', ctx.query.orderType.toUpperCase()]);
                else if (ctx.query.orderBy == '8') order.push(['referral_provider', ctx.query.orderType.toUpperCase()]);
                else if (ctx.query.orderBy == '10') order.push(['updatedAt', ctx.query.orderType.toUpperCase()]);
            }

            var referrals = await referralModel.findAll({
                attributes: [
                    'id', 'uuid', 'reference_code', 'child_dob', 'user_role', 'registered_gp', 'updatedAt', 'createdAt', 'referral_provider', 'referral_provider_other', 'referral_status', 'gp_school', 'registered_gp_postcode', 'referral_type',
                    [sequelize.fn('CONCAT', sequelize.col('parent.child_firstname'), sequelize.col('professional.child_firstname'), sequelize.col('Referral.child_firstname')), 'name'],
                    [sequelize.fn('CONCAT', sequelize.col('parent.child_lastname'), sequelize.col('professional.child_lastname'), sequelize.col('Referral.child_lastname')), 'lastname'],
                    [sequelize.fn('CONCAT', sequelize.col('parent.child_dob'), sequelize.col('professional.child_dob'), sequelize.col('Referral.child_dob')), 'dob'],
                    [sequelize.fn('CONCAT', sequelize.col('Referral.child_firstname'), sequelize.col('Referral.professional_firstname'), sequelize.col('Referral.parent_firstname')), 'referrer_name'],
                    [sequelize.fn('CONCAT', sequelize.col('Referral.child_lastname'), sequelize.col('Referral.professional_lastname'), sequelize.col('Referral.parent_lastname')), 'referrer_lastname'],
                    [sequelize.fn('CONCAT', sequelize.col('Referral.registered_gp'), sequelize.col('parent.registered_gp'), sequelize.col('professional.registered_gp')), 'gp_location'],
                    [sequelize.fn('CONCAT', sequelize.col('Referral.registered_gp_postcode'), sequelize.col('parent.registered_gp_postcode'), sequelize.col('professional.registered_gp_postcode')), 'gp_location_postcode'],
                    //[sequelize.fn('CONCAT', sequelize.col('family.child_firstname'), sequelize.col('professional.child_firstname'), sequelize.col('Referral.child_firstname')), 'name'],
                    //[sequelize.fn('CONCAT', sequelize.col('family.child_lastname'), sequelize.col('professional.child_lastname'), sequelize.col('Referral.child_lastname')), 'lastname'],
                    //[sequelize.fn('CONCAT', sequelize.col('family.child_dob'), sequelize.col('professional.child_dob'), sequelize.col('Referral.child_dob')), 'dob'],

                ],
                where: query,
                include: [
                    {
                        model: referralModel,
                        as: 'parent',
                        attributes: ['id', 'uuid', 'child_firstname', 'child_lastname', 'child_dob', 'registered_gp', 'registered_gp_postcode', 'referral_type'
                        ]
                    },
                    {
                        model: referralModel,
                        as: 'professional',
                        attributes: [
                            'id', 'uuid', 'child_firstname', 'child_lastname', 'child_dob', 'registered_gp', 'registered_gp_postcode', 'referral_type'
                        ]
                    },
                    {
                        model: referralModel,
                        as: 'family',
                        attributes: ['id', 'uuid', 'child_firstname', 'child_lastname', 'child_dob', 'registered_gp', 'registered_gp_postcode', 'referral_type'
                        ]
                    },
                    {
                        model: referralModel,
                        as: 'professional2',
                        attributes: [
                            'id', 'uuid', 'child_firstname', 'child_lastname', 'child_dob', 'registered_gp', 'registered_gp_postcode', 'referral_type'
                        ]
                    },
                ],
                order: order
            });

            //referrals = JSON.parse(JSON.stringify(referrals));
            var totalReferrals = referrals.length;
            var filteredReferrals = referrals.length;
            // with search
            if (ctx.query.searchValue) {
                ctx.query.searchValue = ctx.query.searchValue.toLowerCase();
                let filter_referrals = [];
                _.forEach(referrals, function (refObj, index) {
                    if (refObj.referral_provider == null) {
                        refObj.referral_provider = "Archived"
                    } else {
                        refObj.referral_provider = refObj.referral_provider
                    }
                    if (refObj.user_role == 'family') {
                        refObj.dataValues.name = refObj.family[0].child_firstname;
                        refObj.dataValues.lastname = refObj.family[0].child_lastname;
                        refObj.dataValues.dob = refObj.family[0].child_dob;
                        refObj.dataValues.gp_location = refObj.family[0].dataValues.registered_gp;
                        refObj.dataValues.gp_location_postcode = refObj.family[0].dataValues.registered_gp_postcode;

                    }
                    else if (refObj.user_role == 'professional') {
                        if (refObj.referral_type == "young") {
                            refObj.dataValues.name = refObj.professional2[0].child_firstname;
                            refObj.dataValues.lastname = refObj.professional2[0].child_lastname;
                            refObj.dataValues.dob = refObj.professional2[0].child_dob;
                            refObj.dataValues.gp_location = refObj.professional2[0].dataValues.registered_gp;
                            refObj.dataValues.gp_location_postcode = refObj.professional2[0].dataValues.registered_gp_postcode
                        }
                    }
                    var referralObj = {
                        uuid: refObj.uuid,
                        name: refObj.dataValues.name + " " + refObj.dataValues.lastname,
                        dob: refObj.dataValues.dob ? moment(refObj.dataValues.dob).format('DD/MM/YYYY') : '',
                        reference_code: refObj.reference_code,
                        referrer: refObj.dataValues.referrer_name + " " + refObj.dataValues.referrer_lastname,
                        gp_location: 'Local School',
                        referrer_type: refObj.user_role.charAt(0).toUpperCase() + refObj.user_role.slice(1),
                        date: moment(refObj.updatedAt).format('DD/MM/YYYY'),
                        refDate: moment(moment(refObj.createdAt).tz('Europe/London')).format('DD/MM/YYYY H:mm:ss'),
                        referral_provider: refObj.referral_provider,
                        referral_provider_other: refObj.referral_provider_other,
                        referral_status: refObj.referral_status,
                        referral_formType: refObj.dataValues.referral_type
                    }
                    if (refObj.dataValues.gp_location) {
                        if (refObj.dataValues.gp_location_postcode || refObj.dataValues.gp_location_postcode != '') {
                            if (refObj.dataValues.gp_location_postcode != "L14 0JE" && gpCodes[0].code.indexOf(refObj.dataValues.gp_location_postcode.split(' ')[0]) >= 0) {
                                referralObj.gp_location = gpCodes[0].type;
                            } else if (refObj.dataValues.gp_location_postcode != "L14 0JE" && gpCodes[1].code.indexOf(refObj.dataValues.gp_location_postcode.split(' ')[0]) >= 0) {
                                referralObj.gp_location = gpCodes[1].type;
                            }
                        }
                        else {
                            var splitLocation = refObj.dataValues.gp_location.split(',');
                            if (splitLocation.length > 1) {
                                if (splitLocation[1] != "L14 0JE" && gpCodes[0].code.indexOf(splitLocation[1].split(' ')[0]) >= 0) {
                                    referralObj.gp_location = gpCodes[0].type;
                                } else if (splitLocation[1] != "L14 0JE" && gpCodes[1].code.indexOf(splitLocation[1].split(' ')[0]) >= 0) {
                                    referralObj.gp_location = gpCodes[1].type;
                                }
                            }
                        }

                        //referralObj.name= "refObj.family[0].child_firstname" + " " + "refObj.family[0].child_lastname"
                    }
                    //////console.log()(referralObj)
                    if ((referralObj.name.toLowerCase()).includes(ctx.query.searchValue) ||
                        (referralObj.dob.toLowerCase()).includes(ctx.query.searchValue) ||
                        (referralObj.reference_code.toLowerCase()).includes(ctx.query.searchValue) ||
                        (referralObj.referrer.toLowerCase()).includes(ctx.query.searchValue) ||
                        (referralObj.gp_location.toLowerCase()).includes(ctx.query.searchValue) ||
                        (referralObj.referrer_type.toLowerCase()).includes(ctx.query.searchValue) ||
                        (referralObj.date.toLowerCase()).includes(ctx.query.searchValue) ||
                        (referralObj.refDate.toLowerCase()).includes(ctx.query.searchValue)
                    ) {
                        filter_referrals.push(referralObj);
                    }
                });
                filteredReferrals = filter_referrals.length;
                referrals = filter_referrals;
                // without search
            } else {
                _.forEach(referrals, function (refObj, index) {
                    if (refObj.referral_provider == null) {
                        refObj.referral_provider = "Archived"
                    } else {
                        refObj.referral_provider = refObj.referral_provider
                    }

                    if (refObj.user_role == 'family') {
                        refObj.dataValues.name = refObj.family[0].child_firstname;
                        refObj.dataValues.lastname = refObj.family[0].child_lastname;
                        refObj.dataValues.dob = refObj.family[0].child_dob;
                        refObj.dataValues.gp_location = refObj.family[0].dataValues.registered_gp;
                        refObj.dataValues.gp_location_postcode = refObj.family[0].dataValues.registered_gp_postcode;

                    }
                    else if (refObj.user_role == 'professional') {
                        if (refObj.referral_type == "young") {
                            refObj.dataValues.name = refObj.professional2[0].child_firstname;
                            refObj.dataValues.lastname = refObj.professional2[0].child_lastname;
                            refObj.dataValues.dob = refObj.professional2[0].child_dob;
                            refObj.dataValues.gp_location = refObj.professional2[0].dataValues.registered_gp;
                            refObj.dataValues.gp_location_postcode = refObj.professional2[0].dataValues.registered_gp_postcode
                        }
                    }
                    var referralObj = {
                        uuid: refObj.uuid,
                        name: refObj.dataValues.name + " " + refObj.dataValues.lastname,
                        dob: refObj.dataValues.dob ? moment(refObj.dataValues.dob).format('DD/MM/YYYY') : '',
                        reference_code: refObj.reference_code,
                        referrer: refObj.dataValues.referrer_name + " " + refObj.dataValues.referrer_lastname,
                        gp_location: 'Local School',
                        referrer_type: refObj.user_role.charAt(0).toUpperCase() + refObj.user_role.slice(1),
                        date: moment(refObj.updatedAt).format('DD/MM/YYYY'),
                        refDate: moment(moment(refObj.createdAt).tz('Europe/London')).format('DD/MM/YYYY H:mm:ss'),
                        referral_provider: refObj.referral_provider,
                        referral_provider_other: refObj.referral_provider_other,
                        referral_status: refObj.referral_status,
                        referral_formType: refObj.dataValues.referral_type
                    }
                    if (refObj.dataValues.gp_location) {
                        if (refObj.dataValues.gp_location_postcode || refObj.dataValues.gp_location_postcode != '') {
                            if (refObj.dataValues.gp_location_postcode != "L14 0JE" && gpCodes[0].code.indexOf(refObj.dataValues.gp_location_postcode.split(' ')[0]) >= 0) {
                                referralObj.gp_location = gpCodes[0].type;
                            } else if (refObj.dataValues.gp_location_postcode != "L14 0JE" && gpCodes[1].code.indexOf(refObj.dataValues.gp_location_postcode.split(' ')[0]) >= 0) {
                                referralObj.gp_location = gpCodes[1].type;
                            }
                        }
                        else {
                            var splitLocation = refObj.dataValues.gp_location.split(',');
                            if (splitLocation.length > 1) {
                                if (splitLocation[1] != "L14 0JE" && gpCodes[0].code.indexOf(splitLocation[1].split(' ')[0]) >= 0) {
                                    referralObj.gp_location = gpCodes[0].type;
                                } else if (splitLocation[1] != "L14 0JE" && gpCodes[1].code.indexOf(splitLocation[1].split(' ')[0]) >= 0) {
                                    referralObj.gp_location = gpCodes[1].type;
                                }
                            }
                        }

                        //referralObj.name= "refObj.family[0].child_firstname" + " " + "refObj.family[0].child_lastname"
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
            console.log()(error);
            reject(
                sequalizeErrorHandler.handleSequalizeError(ctx, error)
            );
        }
    });
}


exports.updateReferral = ctx => {
    return new Promise(async (resolve, reject) => {
        const t = await ctx.orm().sequelize.transaction();
        try {
            if (ctx.request.body.referral_id && ctx.request.body.referral_id.length && ctx.request.body.status) {
                const referralModel = ctx.orm().Referral;
                const referralActivityModel = ctx.orm().referralActivity;

                await referralModel.update(
                    {
                        referral_complete_status: ctx.request.body.status,

                    },
                    {
                        where: {
                            uuid: ctx.request.body.referral_id
                        }
                    }, { transaction: t }
                ).then((referral) => {
                    // console.log(referral, "update====")
                });


                let activity = [];
                _.map(ctx.request.body.referral_id, function name(ref) {
                    let activityObj = {
                        activity: ctx.request.body.status == 'deleted' ? 'Referral Deleted' : ctx.request.body.status == 'archived' ? 'Referral Archived' : ctx.request.body.status == 'completed' ? 'Referral UnArchived' : '',
                        ReferralId: ref,
                        doneBy: ctx.request.decryptedUser.id
                    }
                    activity.push(activityObj)
                })
                const audit = await referralActivityModel.bulkCreate(activity, { transaction: t })
                resolve(
                    ctx.res.ok({
                        message: reponseMessages[1001]
                    })
                );
                await t.commit();

            } else {
                await t.rollback()
                resolve(
                    ctx.res.badRequest({
                        message: reponseMessages[1002]
                    })
                );
            }
        } catch (error) {
            await t.rollback()
            //////console.log()(error);
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
        //////console.log()(result);
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
            'id', 'uuid', 'reference_code', 'child_dob', 'user_role', 'registered_gp', 'updatedAt', 'child_name',
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
                [sequelize.fn('CONCAT', sequelize.col('parent.registered_gp'),), 'registered_gp'],
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
                    [sequelize.fn('CONCAT', sequelize.col('professional.registered_gp'),), 'registered_gp'],
                ],
            }).then((professionalResult) => {
                professionalArray = professionalResult
                resultArray = professionalArray.concat(parentArray, childArray)

                resultArray = JSON.parse(JSON.stringify(resultArray));
                for (var i = 0; i < resultArray.length; i++) {
                    //////console.log()(resultArray[i])
                    obj = {};
                    obj.uuid = resultArray[i].uuid;
                    obj.name = resultArray[i].child_name;
                    obj.child_dob = resultArray[i].child_dob;
                    obj.reference_code = resultArray[i].reference_code
                    obj.referrer = resultArray[i].referrer_name;
                    obj.referrer_type = resultArray[i].user_role;
                    obj.date = resultArray[i].updatedAt
                    if (resultArray[i].registered_gp) {
                        var splitLocation = resultArray[i].registered_gp.split(',');
                        if (splitLocation.length > 1) {
                            if (gpCodes[0].code.indexOf(splitLocation[1].split(' ')[0]) >= 0) {
                                obj.registered_gp = gpCodes[0].type;
                            } else if (gpCodes[1].code.indexOf(splitLocation[1].split(' ')[0]) >= 0) {
                                obj.registered_gp = gpCodes[1].type;
                            }
                            else {
                                obj.registered_gp = "thiru";
                            }
                        }
                    }
                    sendArray.push(obj);
                }
                //////console.log()("----------------------------------------------end")
                //array = [];
                return ctx.body = sendArray
            }).catch((error) => {
                //////console.log()(error)
                sequalizeErrorHandler.handleSequalizeError(ctx, error)
            });
        }).catch((error) => {
            //////console.log()(error)
            sequalizeErrorHandler.handleSequalizeError(ctx, error)
        });
    }).catch((error) => {
        //////console.log()(error)
        sequalizeErrorHandler.handleSequalizeError(ctx, error)
    });
}
exports.downloadReferral = async ctx => {
    let referralData = await getRefData(ctx.query.refID, ctx.query.refRole, ctx);
    ctx.request.body.referralData = referralData;
    try {
        return pdf.generatePdf(ctx).then((sendReferralStatus) => {
            //////console.log()(sendReferralStatus)
            return ctx.res.ok({
                data: sendReferralStatus,
                message: referralData,
            });
        }).catch(error => {
            //////console.log()(error);
            sequalizeErrorHandler.handleSequalizeError(ctx, error)
        });
    } catch (e) {
        //////console.log()(e);
        return sequalizeErrorHandler.handleSequalizeError(ctx, e);
    }
}

exports.sendReferral = async ctx => {
    console.log("ctx.request.body.referralData", ctx.query.refID + ',' + ctx.query.refRole + ',' + ctx.request.body.sendProf);
    let referralData = await getRefData(ctx.query.refID, ctx.query.refRole, ctx);
    ctx.request.body.referralData = referralData;
    ctx.request.body.emailToProvider = ctx.request.body.sendProf ? ctx.request.body.emailToProvider : ctx.query.selectedProvider;
    ctx.request.body.refCode = ctx.query.refCode;
    console.log(" admin control------------------------------------------------------")
    console.log(ctx.request.body.status)
    //   console.log(ctx.request.body)
    console.log(ctx.request.decryptedUsers)
    const flagTbl = ctx.orm().miscellaneousFlag;
    return flagTbl.findOne({
        attributes: ['flag', 'value'],

        where: {
            flag: 'useApiService',
        },
    }).then((result) => {
        if (result.dataValues.value == 'true' && (ctx.request.body.emailToProvider == 'YPAS' || ctx.request.body.emailToProvider == 'Venus')) {
            try {
                return callIaptusApi.sendReferralData(ctx).then((apiResponse) => {
                    console.log(" admin controller apiResponse")
                    console.log(ctx.res.successCodeApi)
                    if (ctx.request.body.emailToProvider == "Venus") {
                        apiToCall = config.mayden_api_venus;
                        //Mapping name title to match venus doc
                        if (ctx.request.body.referralData.section2.child_name_title == "1122655") {
                            ctx.request.body.referralData.section2.child_name_title = "Mr"
                        }
                        else if (ctx.request.body.referralData.section2.child_name_title == "1122657") {
                            ctx.request.body.referralData.section2.child_name_title = "Miss"
                        }
                        else if (ctx.request.body.referralData.section2.child_name_title == "1122658") {
                            ctx.request.body.referralData.section2.child_name_title = "Ms"
                        }
                        else if (ctx.request.body.referralData.section2.child_name_title == "1122656") {
                            ctx.request.body.referralData.section2.child_name_title = "Mrs"
                        }
                        else {
                            ctx.request.body.referralData.section2.child_name_title = "Mx"
                        }

                        //Mapping gender to match venus doc
                        if (ctx.request.body.referralData.section2.sex_at_birth == "1122901") {
                            ctx.request.body.referralData.section2.sex_at_birth = "Male"
                        }
                        else if (ctx.request.body.referralData.section2.sex_at_birth == "1122902") {
                            ctx.request.body.referralData.section2.sex_at_birth = "Female"
                        }
                        else {
                            ctx.request.body.referralData.section2.sex_at_birth = "Prefer not to say"
                        }
                    }
                    else {
                        apiToCall = config.mayden_api_ypas;
                        //Mapping name title to match ypas doc
                        if (ctx.request.body.referralData.section2.child_name_title == "1072718") {
                            ctx.request.body.referralData.section2.child_name_title = "Mr"
                        }
                        else if (ctx.request.body.referralData.section2.child_name_title == "1072720") {
                            ctx.request.body.referralData.section2.child_name_title = "Miss"
                        }
                        else if (ctx.request.body.referralData.section2.child_name_title == "1072721") {
                            ctx.request.body.referralData.section2.child_name_title = "Ms"
                        }
                        else if (ctx.request.body.referralData.section2.child_name_title == "1072719") {
                            ctx.request.body.referralData.section2.child_name_title = "Mrs"
                        }
                        else {
                            ctx.request.body.referralData.section2.child_name_title = "Mx"
                        }

                        //Mapping gender to match ypas doc
                        if (ctx.request.body.referralData.section2.sex_at_birth == "1072964") {
                            ctx.request.body.referralData.section2.sex_at_birth = "Male"
                        }
                        else if (ctx.request.body.referralData.section2.sex_at_birth == "1072965") {
                            ctx.request.body.referralData.section2.sex_at_birth = "Female"
                        }
                        else {
                            ctx.request.body.referralData.section2.sex_at_birth = "Prefer not to say"
                        }

                    }
                    if (ctx.res.successCodeApi == 200) {

                        return email.sendReferralWithData(ctx).then((sendReferralStatus) => {
                            const referralModel = ctx.orm().Referral;
                            return referralModel.update({
                                referral_provider: ctx.query.selectedProvider
                            },
                                {
                                    where:
                                        { uuid: ctx.query.refID }
                                }
                            ).then((result) => {

                                if (ctx.query.fromReferralPage) {
                                    return ctx.res.ok({
                                        data: {},
                                        message: reponseMessages[1017],
                                    });
                                }
                                else {
                                    console.log("iaptusApiDetail00000000000000000000000000000000000000000000000000")
                                    let updateValue = {
                                        activity: "Referral sent - " + ctx.query.selectedProvider,
                                        ReferralId: ctx.query.refID,
                                        doneBy: ctx.request.decryptedUser.id
                                    }
                                    console.log("🚀 ~ file: adminController.js ~ line 874 ~ ).then ~ updateValue", updateValue)
                                    const referralActivityLog = ctx.orm().referralActivity;
                                    return referralActivityLog.create(updateValue).then(() => {
                                        return ctx.res.ok({
                                            data: ctx.res.iaptusApiDetail,
                                            message: reponseMessages[1017],
                                        });
                                    }).catch((error) => {
                                        sequalizeErrorHandler.handleSequalizeError(ctx, error)
                                    });
                                }

                            }).catch(error => {
                                //////console.log()(error);
                                sequalizeErrorHandler.handleSequalizeError(ctx, error)
                            });

                        }).catch(error => {
                            //////console.log()(error, "error");
                            sequalizeErrorHandler.handleSequalizeError(ctx, error)
                        });
                    }
                    else {
                        return email.sendReferralWithData(ctx).then((sendReferralStatus) => {
                            //////console.log()(sendReferralStatus)
                            const referralModel = ctx.orm().Referral;
                            return referralModel.update({
                                referral_provider: ctx.query.selectedProvider
                            },
                                {
                                    where:
                                        { uuid: ctx.query.refID }
                                }
                            ).then((result) => {
                                if (ctx.query.fromReferralPage) {
                                    return ctx.res.ok({
                                        data: {},
                                        message: reponseMessages[1017],
                                    });
                                }
                                else {
                                    console.log("iaptusApiDetail00000000000000000000000000000000000000000000000000")
                                    let updateValue = {
                                        activity: "Referral sent - " + ctx.query.selectedProvider,
                                        ReferralId: ctx.query.refID,
                                        doneBy: ctx.request.decryptedUser.id
                                    }
                                    console.log("🚀 ~ file: adminController.js ~ line 874 ~ ).then ~ updateValue", updateValue)
                                    const referralActivityLog = ctx.orm().referralActivity;
                                    return referralActivityLog.create(updateValue).then(() => {
                                        return ctx.res.ok({
                                            data: ctx.res.iaptusApiDetail,
                                            message: reponseMessages[1017],
                                        });
                                    }).catch((error) => {
                                        sequalizeErrorHandler.handleSequalizeError(ctx, error)
                                    });
                                }
                            }).catch(error => {
                                //////console.log()(error);
                                sequalizeErrorHandler.handleSequalizeError(ctx, error)
                            });

                        }).catch(error => {
                            //////console.log()(error, "error");
                            sequalizeErrorHandler.handleSequalizeError(ctx, error)
                        });
                    }

                }).catch(error => {
                    console.log(" admin controller error")
                    console.log(error, "error");
                    sequalizeErrorHandler.handleSequalizeError(ctx, error)
                });
            } catch (e) {
                return sequalizeErrorHandler.handleSequalizeError(ctx, e);
            }
        }
        else {
            try {
                return email.sendReferralWithData(ctx).then((sendReferralStatus) => {
                    const referralModel = ctx.orm().Referral;
                    return referralModel.update({
                        referral_provider: ctx.query.selectedProvider
                    },
                        {
                            where:
                                { uuid: ctx.query.refID }
                        }
                    ).then((result) => {
                        if (ctx.query.fromReferralPage) {
                            return ctx.res.ok({
                                data: {},
                                message: reponseMessages[1017],
                            });
                        }
                        else {
                            console.log("iaptusApiDetail00000000000000000000000000000000000000000000000000")
                            let updateValue = {
                                activity: "Referral sent - " + ctx.query.selectedProvider,
                                ReferralId: ctx.query.refID,
                                doneBy: ctx.request.decryptedUser.id
                            }
                            console.log("🚀 ~ file: adminController.js ~ line 874 ~ ).then ~ updateValue", updateValue)
                            const referralActivityLog = ctx.orm().referralActivity;
                            return referralActivityLog.create(updateValue).then(() => {
                                return ctx.res.ok({
                                    data: ctx.res.iaptusApiDetail,
                                    message: reponseMessages[1017],
                                });
                            }).catch((error) => {
                                sequalizeErrorHandler.handleSequalizeError(ctx, error)
                            });
                        }
                    }).catch(error => {
                        //////console.log()(error);
                        sequalizeErrorHandler.handleSequalizeError(ctx, error)
                    });

                }).catch(error => {
                    //////console.log()(error, "error");
                    sequalizeErrorHandler.handleSequalizeError(ctx, error)
                });
            } catch (e) {
                return sequalizeErrorHandler.handleSequalizeError(ctx, e);
            }
        }
        // return ctx.body = result
    }).catch((error) => {
        console.log(error)
        sequalizeErrorHandler.handleSequalizeError(ctx, error)
    });

}


exports.sendReferralByApi = async ctx => {
    console.log("ctx.request.body.referralData", ctx.query.refID + ',' + ctx.query.refRole);
    let referralData = await getRefData(ctx.query.refID, ctx.query.refRole, ctx);
    ctx.request.body.referralData = referralData;
    ctx.request.body.emailToProvider = ctx.query.selectedProvider;
    ctx.request.body.refCode = ctx.query.refCode;
    try {
        return callIaptusApi.sendReferralData(ctx).then((apiResponse) => {
            console.log(" admin controller apiResponse")
            console.log(ctx.res.successCodeApi)
            if (ctx.res.successCodeApi == 200) {

                const referralModel = ctx.orm().Referral;
                return referralModel.update({
                    referral_provider: ctx.query.selectedProvider
                },
                    {
                        where:
                            { uuid: ctx.query.refID }
                    }
                ).then((result) => {
                    //---------------------here need add functionlaity for insert appoinment details
                    return ctx.res.ok({
                        message: reponseMessages[1017],
                    });
                }).catch(error => {
                    console.log(" admin controller apiResponse-error")
                    console.log(error);
                    sequalizeErrorHandler.handleSequalizeError(ctx, error)
                });
            }
            else {
                sequalizeErrorHandler.authorizationError()
            }

        }).catch(error => {
            console.log(" admin controller error")
            console.log(error, "error");
            sequalizeErrorHandler.handleSequalizeError(ctx, error)
        });
    } catch (e) {
        return sequalizeErrorHandler.handleSequalizeError(ctx, e);
    }
}

function getRefData(refID, refRole, ctx) {
    const user = ctx.orm().Referral;
    const referral = ctx.orm().Reason
    var includeModalName;
    console.log("---------------------", refID)
    console.log("---------------------", refRole)

    if (refRole == "Child" || refRole == "child" || refRole == "Young" || refRole == "young") {
        if (refRole == "Child" || refRole == "child") {
            includeModalName = "parent";
        }
        else {
            includeModalName = "family";
        }
        return user.findOne({
            where: {
                uuid: refID,
            },
            attributes: ['id', 'uuid', 'need_interpreter', 'child_dob', 'contact_parent', 'consent_child', 'registered_gp', 'registered_gp_postcode', 'contact_parent_camhs', 'reason_contact_parent_camhs', 'gp_school', 'contact_person', 'contact_preferences', 'reference_code', 'referral_type']
        }).then((eligibilityObj) => {

            return user.findOne({
                include: [
                    {
                        model: ctx.orm().Referral,
                        as: includeModalName,
                        attributes: ['id', 'parent_firstname', 'parent_lastname', 'parental_responsibility', 'responsibility_parent_firstname', 'child_parent_relationship', 'parent_contact_number', 'parent_email', 'parent_same_house', 'parent_address', 'parent_address_postcode', 'legal_care_status', 'parent_contact_type', 'parent_manual_address', 'responsibility_parent_lastname']
                    },
                ],
                where: {
                    id: eligibilityObj.id,
                },
                attributes: ['id', 'child_NHS', 'child_firstname', 'child_lastname', 'child_name_title', 'child_email', 'child_contact_number', 'child_address', 'child_address_postcode', 'can_send_post', 'child_gender', 'child_gender_birth', 'child_sexual_orientation', 'child_ethnicity', 'child_ethnicity_other', 'child_care_adult', 'household_member', 'child_contact_type', 'sex_at_birth', 'child_manual_address']
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
                    attributes: [['id', 'child_id'], 'child_profession', 'child_education_place', 'child_EHCP', 'child_EHAT', 'child_socialworker', 'child_socialworker_firstname', 'child_socialworker_lastname', 'child_socialworker_contact', 'child_socialworker_contact_type', 'child_education_manual_address', 'careLeaver']
                }).then((educationObj) => {

                    eligibilityObj.registered_gp = eligibilityObj.registered_gp_postcode ? eligibilityObj.registered_gp + ', ' + eligibilityObj.registered_gp_postcode : eligibilityObj.registered_gp;

                    var parentAddress;
                    parentAddres = aboutObj[includeModalName].length ? aboutObj[includeModalName][0].parent_address_postcode ? aboutObj[includeModalName][0].parent_address + ', ' + aboutObj[includeModalName][0].parent_address_postcode : aboutObj[includeModalName][0].parent_address : '';



                    const section2Obj = {
                        child_id: aboutObj.id,
                        child_NHS: aboutObj.child_NHS,
                        child_name: aboutObj.child_firstname,
                        child_lastname: aboutObj.child_lastname,
                        child_name_title: aboutObj.child_name_title,
                        child_email: aboutObj.child_email,
                        child_contact_number: aboutObj.child_contact_number,
                        child_address: aboutObj.child_address_postcode ? aboutObj.child_address + ', ' + aboutObj.child_address_postcode : aboutObj.child_address,
                        child_manual_address: aboutObj.child_manual_address,
                        can_send_post: aboutObj.can_send_post,
                        child_gender: aboutObj.child_gender,
                        child_gender_birth: aboutObj.child_gender_birth,
                        child_sexual_orientation: aboutObj.child_sexual_orientation,
                        child_ethnicity: aboutObj.child_ethnicity == 'Other Ethnic Groups' ? aboutObj.child_ethnicity_other : aboutObj.child_ethnicity,
                        child_care_adult: aboutObj.child_care_adult,
                        household_member: aboutObj.household_member,
                        child_contact_type: aboutObj.child_contact_type,
                        sex_at_birth: aboutObj.sex_at_birth,
                        parent_id: aboutObj[includeModalName] && aboutObj[includeModalName].length ? aboutObj[includeModalName][0].id : '',
                        parent_name: aboutObj[includeModalName] && aboutObj[includeModalName].length ? aboutObj[includeModalName][0].parent_firstname : '',
                        parent_lastname: aboutObj[includeModalName] && aboutObj[includeModalName].length ? aboutObj[includeModalName][0].parent_lastname : '',
                        parental_responsibility: aboutObj[includeModalName] && aboutObj[includeModalName].length ? aboutObj[includeModalName][0].parental_responsibility : '',
                        responsibility_parent_firstname: aboutObj[includeModalName] && aboutObj[includeModalName].length ? aboutObj[includeModalName][0].responsibility_parent_firstname : '',
                        responsibility_parent_lastname: aboutObj[includeModalName] && aboutObj[includeModalName].length ? aboutObj[includeModalName][0].responsibility_parent_lastname : '',
                        child_parent_relationship: aboutObj[includeModalName] && aboutObj[includeModalName].length ? aboutObj[includeModalName][0].child_parent_relationship : '',
                        parent_contact_number: aboutObj[includeModalName] && aboutObj[includeModalName].length ? aboutObj[includeModalName][0].parent_contact_number : '',
                        parent_email: aboutObj[includeModalName] && aboutObj[includeModalName].length ? aboutObj[includeModalName][0].parent_email : '',
                        parent_same_house: aboutObj[includeModalName] && aboutObj[includeModalName].length ? aboutObj[includeModalName][0].parent_same_house : '',
                        parent_address: parentAddres,
                        parent_manual_address: aboutObj[includeModalName] && aboutObj[includeModalName].length ? aboutObj[includeModalName][0].parent_manual_address : '',
                        parent_contact_type: aboutObj[includeModalName] && aboutObj[includeModalName].length ? aboutObj[includeModalName][0].parent_contact_type : '',
                        legal_care_status: aboutObj[includeModalName] && aboutObj[includeModalName].length ? aboutObj[includeModalName][0].legal_care_status : '',
                    }
                    var services;
                    var displayServicesPdf;
                    if (educationObj.referral_reason[0].local_services) {
                        if (educationObj.referral_reason[0].local_services.indexOf('Other') == -1) {
                            educationObj.referral_reason[0].local_services = educationObj.referral_reason[0].local_services
                            displayServicesPdf = educationObj.referral_reason[0].local_services;
                        } else {
                            var index = educationObj.referral_reason[0].local_services.indexOf('Other');
                            educationObj.referral_reason[0].local_services.splice(index, 1);
                            services = educationObj.referral_reason[0].services.map(function (it) {
                                //  //console.log(it)
                                return it.name
                            });
                            displayServicesPdf = educationObj.referral_reason[0].local_services.concat(services);
                        }
                    }

                    if (educationObj.referral_reason[0].other_eating_difficulties) {
                        if (Array.isArray(educationObj.referral_reason[0].eating_disorder_difficulties)) {
                            educationObj.referral_reason[0].eating_disorder_difficulties.push(educationObj.referral_reason[0].other_eating_difficulties);
                        } else {
                            educationObj.referral_reason[0].eating_disorder_difficulties = educationObj.referral_reason[0].eating_disorder_difficulties + _educationObj.referral_reason[0].other_eating_difficulties;
                        }
                    }


                    if (educationObj.referral_reason[0].other_reasons_referral) {
                        if (Array.isArray(educationObj.referral_reason[0].reason_for_referral)) {
                            educationObj.referral_reason[0].reason_for_referral.push(educationObj.referral_reason[0].other_reasons_referral);
                        } else {
                            educationObj.referral_reason[0].reason_for_referral = educationObj.referral_reason[0].reason_for_referral + _educationObj.referral_reason[0].other_reasons_referral;
                        }
                    }

                    educationObj.registered_gp = educationObj.registered_gp_postcode ? educationObj.registered_gp + ', ' + educationObj.registered_gp_postcode : educationObj.registered_gp

                    if (section2Obj.child_manual_address != null && section2Obj.child_manual_address[0] != null) {

                        section2Obj.child_address = section2Obj.child_manual_address[0].addressLine1 + ',' + (section2Obj.child_manual_address[0].addressLine2 ? section2Obj.child_manual_address[0].addressLine2 + ',' : '') + section2Obj.child_manual_address[0].city + ',' + (section2Obj.child_manual_address[0].country != '' ? section2Obj.child_manual_address[0].country + ',' : '') + section2Obj.child_manual_address[0].postCode

                        //Below code for iaptus api
                        section2Obj.pat_address1 = section2Obj.child_manual_address[0].addressLine1;
                        section2Obj.pat_address2 = section2Obj.child_manual_address[0].addressLine2;
                        section2Obj.pat_town_city = section2Obj.child_manual_address[0].city;
                        section2Obj.pat_county = section2Obj.child_manual_address[0].country;
                        section2Obj.pat_postcode = section2Obj.child_manual_address[0].postCode;
                    }
                    else {
                        var childAdrArray = [];
                        childAdrArray = (section2Obj.child_address).split(',')
                        console.log("--------------------------------------childAdrArray")
                        console.log(childAdrArray)
                        console.log("--------------------------------------childAdrArray")
                        //Below code for iaptus api
                        section2Obj.pat_address1 = childAdrArray[1];
                        section2Obj.pat_address2 = "";
                        section2Obj.pat_town_city = childAdrArray[0];
                        section2Obj.pat_county = "";
                        section2Obj.pat_postcode = childAdrArray[childAdrArray.length - 1];
                    }


                    if (section2Obj.parent_manual_address != null && section2Obj.parent_manual_address[0] != null) {
                        section2Obj.parent_address = section2Obj.parent_manual_address[0].addressLine1 + ',' + (section2Obj.parent_manual_address[0].addressLine2 ? section2Obj.parent_manual_address[0].addressLine2 + ',' : '') + section2Obj.parent_manual_address[0].city + ',' + (section2Obj.parent_manual_address[0].country != '' ? section2Obj.parent_manual_address[0].country + ',' : '') + section2Obj.parent_manual_address[0].postCode
                    }

                    if (educationObj.child_education_manual_address != null && educationObj.child_education_manual_address[0] != null) {
                        educationObj.child_education_place = educationObj.child_education_manual_address[0].school + ',' + educationObj.child_education_manual_address[0].addressLine1 + ',' + (educationObj.child_education_manual_address[0].addressLine2 != '' ? educationObj.child_education_manual_address[0].addressLine2 + ',' : '') + educationObj.child_education_manual_address[0].city + ',' + (educationObj.child_education_manual_address[0].country != '' ? educationObj.child_education_manual_address[0].country + ',' : '') + educationObj.child_education_manual_address[0].postCode
                    }



                    const responseData = {
                        userid: ctx.query.refID,
                        section1: eligibilityObj,
                        child_dob: convertDate(eligibilityObj.child_dob),
                        section2: section2Obj,
                        section3: educationObj,
                        section4: educationObj.referral_reason[0],
                        section4LocalService: displayServicesPdf,
                        status: "ok",
                        role: ctx.query.refRole
                    }
                    console.log(responseData)
                    return responseData;
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
            console.log()(error)
            sequalizeErrorHandler.handleSequalizeError(ctx, error)
        });
    }
    else if (refRole == "Parent" || refRole == "parent" || refRole == "Family" || refRole == "family") {

        console.log("123654")
        if (refRole == "Parent" || refRole == "parent") {
            includeModalName = "parent";
        }
        else {
            includeModalName = "family";
        }
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
                        as: includeModalName,
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
                            as: includeModalName,
                            aattributes: ['id', 'child_NHS', 'child_firstname', 'child_name_title', 'child_lastname', 'child_email', 'child_contact_number', 'child_address', 'child_address_postcode', 'can_send_post', 'child_gender', 'child_gender_birth', 'child_sexual_orientation', 'child_ethnicity', 'child_ethnicity_other', 'child_care_adult', 'household_member', 'child_contact_type', 'sex_at_birth', 'child_manual_address']
                        },
                    ],
                    where: {
                        id: elgibilityObj[0].id,
                    },
                    attributes: ['id', 'parent_firstname', 'parent_lastname', 'parental_responsibility', 'responsibility_parent_firstname', 'child_parent_relationship', 'parent_contact_number', 'parent_email', 'parent_same_house', 'parent_address', 'parent_address_postcode', 'legal_care_status', 'parent_contact_type', 'parent_manual_address', 'reference_code', 'contact_preferences', 'contact_person', 'responsibility_parent_lastname']
                }).then((aboutObj) => {
                    return user.findAll({
                        include: [
                            //childData
                            {
                                model: ctx.orm().Referral,
                                nested: true,
                                as: includeModalName,
                                attributes: ['id', 'child_profession', 'child_education_place', 'child_EHCP', 'child_EHAT', 'child_socialworker', 'child_socialworker_contact', 'child_socialworker_firstname', 'child_socialworker_lastname', 'child_socialworker_contact_type', 'child_education_manual_address', 'careLeaver']
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
                            var gploc;
                            var getChildAddress;
                            var getChildDob;

                            if (ctx.query.formType == 'child') {
                                gploc = elgibilityObj[0].parent[0].registered_gp_postcode ? elgibilityObj[0].parent[0].registered_gp + ", " + elgibilityObj[0].parent[0].registered_gp_postcode : elgibilityObj[0].parent[0].registered_gp
                                getChildAddress = aboutObj[0].parent[0].child_address_postcode ? aboutObj[0].parent[0].child_address + ", " + aboutObj[0].parent[0].child_address_postcode : aboutObj[0].parent[0].child_address
                                getChildDob = convertDate(elgibilityObj[0].parent[0].child_dob)

                            }
                            else {
                                gploc = elgibilityObj[0].family[0].registered_gp_postcode ? elgibilityObj[0].family[0].registered_gp + ", " + elgibilityObj[0].family[0].registered_gp_postcode : elgibilityObj[0].family[0].registered_gp
                                getChildAddress = aboutObj[0].family[0].child_address_postcode ? aboutObj[0].family[0].child_address + ", " + aboutObj[0].family[0].child_address_postcode : aboutObj[0].family[0].child_address
                                getChildDob = convertDate(elgibilityObj[0].family[0].child_dob)
                            }
                            let childEthnicity
                            if (refRole == "Parent" || refRole == "parent") {
                                if (aboutObj[0].parent) {
                                    childEthnicity = (aboutObj[0].parent[0].child_ethnicity == 'Other Ethnic Groups' ? aboutObj[0].parent[0].child_ethnicity_other : aboutObj[0].parent[0].child_ethnicity)
                                }
                            }
                            else if (refRole == "Family" || refRole == "family") {
                                if (aboutObj[0].family) {
                                    childEthnicity = (aboutObj[0].family[0].child_ethnicity == 'Other Ethnic Groups' ? aboutObj[0].family[0].child_ethnicity_other : aboutObj[0].family[0].child_ethnicity)
                                }
                            }

                            const section1Obj = {
                                child_id: elgibilityObj[0].parent ? elgibilityObj[0].parent[0].id : elgibilityObj[0].family[0].id,
                                child_dob: elgibilityObj[0].parent ? elgibilityObj[0].parent[0].child_dob : elgibilityObj[0].family[0].child_dob,
                                registered_gp: gploc,
                                parent_id: elgibilityObj[0].id,
                                consent_child: elgibilityObj[0].consent_child,
                                consent_parent: elgibilityObj[0].consent_parent,
                                need_interpreter: elgibilityObj[0].need_interpreter,
                                gp_school: elgibilityObj[0].parent ? elgibilityObj[0].parent[0].gp_school : elgibilityObj[0].family[0].gp_school
                            }
                            const section2Obj = {
                                child_id: aboutObj[0].parent ? aboutObj[0].parent[0].id : aboutObj[0].family[0].id,
                                child_NHS: aboutObj[0].parent ? aboutObj[0].parent[0].child_NHS : aboutObj[0].family[0].child_NHS,
                                child_name: aboutObj[0].parent ? aboutObj[0].parent[0].child_firstname : aboutObj[0].family[0].child_firstname,
                                child_lastname: aboutObj[0].parent ? aboutObj[0].parent[0].child_lastname : aboutObj[0].family[0].child_lastname,
                                child_name_title: aboutObj[0].parent ? aboutObj[0].parent[0].child_name_title : aboutObj[0].family[0].child_name_title,
                                child_email: aboutObj[0].parent ? aboutObj[0].parent[0].child_email : aboutObj[0].family[0].child_email,
                                child_contact_number: aboutObj[0].parent ? aboutObj[0].parent[0].child_contact_number : aboutObj[0].family[0].child_contact_number,
                                child_contact_type: aboutObj[0].parent ? aboutObj[0].parent[0].child_contact_type : aboutObj[0].family[0].child_contact_type,
                                child_address: getChildAddress,
                                child_manual_address: aboutObj[0].parent ? aboutObj[0].parent[0].child_manual_address : aboutObj[0].family[0].child_manual_address,
                                can_send_post: aboutObj[0].parent ? aboutObj[0].parent[0].can_send_post : aboutObj[0].family[0].can_send_post,
                                child_gender: aboutObj[0].parent ? aboutObj[0].parent[0].child_gender : aboutObj[0].family[0].child_gender,
                                child_gender_birth: aboutObj[0].parent ? aboutObj[0].parent[0].child_gender_birth : aboutObj[0].family[0].child_gender_birth,
                                child_sexual_orientation: aboutObj[0].parent ? aboutObj[0].parent[0].child_sexual_orientation : aboutObj[0].family[0].child_sexual_orientation,
                                child_ethnicity: childEthnicity,
                                // child_ethnicity : aboutObj[0].parent.child_ethnicity=='Other Ethnic Groups' ? aboutObj[0].parent.child_ethnicity_other : aboutObj[0].parent.child_ethnicity,
                                child_care_adult: aboutObj[0].parent ? aboutObj[0].parent[0].child_care_adult : aboutObj[0].family[0].child_care_adult,
                                household_member: aboutObj[0].parent ? aboutObj[0].parent[0].household_member : aboutObj[0].family[0].household_member,
                                contact_type: aboutObj[0].parent ? aboutObj[0].parent[0].child_care_adult : aboutObj[0].family[0].child_care_adult,
                                sex_at_birth: aboutObj[0].parent ? aboutObj[0].parent[0].sex_at_birth : aboutObj[0].family[0].sex_at_birth,
                                parent_id: aboutObj[0].id,
                                parent_name: aboutObj[0].parent_firstname,
                                parent_lastname: aboutObj[0].parent_lastname,
                                parental_responsibility: aboutObj[0].parental_responsibility,
                                responsibility_parent_firstname: aboutObj[0].responsibility_parent_firstname,
                                responsibility_parent_lastname: aboutObj[0].responsibility_parent_lastname,
                                child_parent_relationship: aboutObj[0].child_parent_relationship,
                                parent_contact_number: aboutObj[0].parent_contact_number,
                                parent_email: aboutObj[0].parent_email,
                                parent_same_house: aboutObj[0].parent_same_house,
                                parent_address: aboutObj[0].parent_address_postcode ? aboutObj[0].parent_address + ", " + aboutObj[0].parent_address_postcode : aboutObj[0].parent_address,
                                parent_manual_address: aboutObj[0].parent_manual_address,
                                parent_contact_type: aboutObj[0].parent_contact_type,
                                contact_person: aboutObj[0].contact_person,
                                contact_preferences: aboutObj[0].contact_preferences,
                                legal_care_status: aboutObj[0].legal_care_status,
                            }

                            const section3Obj = {
                                child_id: edu_empObj[0].parent ? edu_empObj[0].parent[0].id : edu_empObj[0].family[0].id,
                                child_profession: edu_empObj[0].parent ? edu_empObj[0].parent[0].child_profession : edu_empObj[0].family[0].child_profession,
                                child_education_place: edu_empObj[0].parent ? edu_empObj[0].parent[0].child_education_place : edu_empObj[0].family[0].child_education_place,
                                child_education_manual_address: edu_empObj[0].parent ? edu_empObj[0].parent[0].child_education_manual_address : edu_empObj[0].family[0].child_education_manual_address,
                                child_EHCP: edu_empObj[0].parent ? edu_empObj[0].parent[0].child_EHCP : edu_empObj[0].family[0].child_EHCP,
                                child_EHAT: edu_empObj[0].parent ? edu_empObj[0].parent[0].child_EHAT : edu_empObj[0].family[0].child_EHAT,
                                child_socialworker: edu_empObj[0].parent ? edu_empObj[0].parent[0].child_socialworker : edu_empObj[0].family[0].child_socialworker,
                                child_socialworker_firstname: edu_empObj[0].parent ? edu_empObj[0].parent[0].child_socialworker_firstname : edu_empObj[0].family[0].child_socialworker_firstname,
                                child_socialworker_lastname: edu_empObj[0].parent ? edu_empObj[0].parent[0].child_socialworker_lastname : edu_empObj[0].family[0].child_socialworker_lastname,
                                child_socialworker_contact: edu_empObj[0].parent ? edu_empObj[0].parent[0].child_socialworker_contact : edu_empObj[0].family[0].child_socialworker_contact,
                                child_socialworker_contact_type: edu_empObj[0].parent ? edu_empObj[0].parent[0].child_socialworker_contact_type : edu_empObj[0].family[0].child_socialworker_contact_type,
                                careLeaver: edu_empObj[0].parent ? edu_empObj[0].parent[0].careLeaver : edu_empObj[0].family[0].careLeaver,
                            }


                            var services;
                            var displayServicesPdf;
                            if (referralResult.referral_reason[0].local_services) {
                                if (referralResult.referral_reason[0].local_services.indexOf('Other') == -1) {
                                    referralResult.referral_reason[0].local_services = referralResult.referral_reason[0].local_services
                                    displayServicesPdf = referralResult.referral_reason[0].local_services;
                                } else {
                                    var index = referralResult.referral_reason[0].local_services.indexOf('Other');
                                    referralResult.referral_reason[0].local_services.splice(index, 1);
                                    services = referralResult.referral_reason[0].services.map(function (it) {
                                        //  //console.log(it)
                                        return it.name
                                    });
                                    displayServicesPdf = referralResult.referral_reason[0].local_services.concat(services);
                                }
                            }
                            if (referralResult.referral_reason[0].other_eating_difficulties) {
                                if (Array.isArray(referralResult.referral_reason[0].eating_disorder_difficulties)) {
                                    referralResult.referral_reason[0].eating_disorder_difficulties.push(referralResult.referral_reason[0].other_eating_difficulties);
                                } else {
                                    referralResult.referral_reason[0].eating_disorder_difficulties = referralResult.referral_reason[0].eating_disorder_difficulties + _referralResult.referral_reason[0].other_eating_difficulties;
                                }
                            }


                            if (referralResult.referral_reason[0].other_reasons_referral) {
                                if (Array.isArray(referralResult.referral_reason[0].reason_for_referral)) {
                                    referralResult.referral_reason[0].reason_for_referral.push(referralResult.referral_reason[0].other_reasons_referral);
                                } else {
                                    referralResult.referral_reason[0].reason_for_referral = referralResult.referral_reason[0].reason_for_referral + _educationObj.referral_reason[0].other_reasons_referral;
                                }
                            }

                            if (section2Obj.child_manual_address != null && section2Obj.child_manual_address[0] != null) {

                                section2Obj.child_address = section2Obj.child_manual_address[0].addressLine1 + ',' + (section2Obj.child_manual_address[0].addressLine2 ? section2Obj.child_manual_address[0].addressLine2 + ',' : '') + section2Obj.child_manual_address[0].city + ',' + (section2Obj.child_manual_address[0].country != '' ? section2Obj.child_manual_address[0].country + ',' : '') + section2Obj.child_manual_address[0].postCode
                                //Below code for iaptus api
                                section2Obj.pat_address1 = section2Obj.child_manual_address[0].addressLine1;
                                section2Obj.pat_address2 = section2Obj.child_manual_address[0].addressLine2;
                                section2Obj.pat_town_city = section2Obj.child_manual_address[0].city;
                                section2Obj.pat_county = section2Obj.child_manual_address[0].country;
                                section2Obj.pat_postcode = section2Obj.child_manual_address[0].postCode;
                            }
                            else {
                                var childAdrArray = [];
                                childAdrArray = (section2Obj.child_address).split(',')
                                console.log("--------------------------------------childAdrArray")
                                console.log(childAdrArray)
                                console.log("--------------------------------------childAdrArray")
                                //Below code for iaptus api
                                section2Obj.pat_address1 = childAdrArray[1];
                                section2Obj.pat_address2 = "";
                                section2Obj.pat_town_city = childAdrArray[0];
                                section2Obj.pat_county = "";
                                section2Obj.pat_postcode = childAdrArray[childAdrArray.length - 1];
                            }
                            if (section2Obj.parent_manual_address != null && section2Obj.parent_manual_address[0] != null) {
                                section2Obj.parent_address = section2Obj.parent_manual_address[0].addressLine1 + ',' + (section2Obj.parent_manual_address[0].addressLine2 ? section2Obj.parent_manual_address[0].addressLine2 + ',' : '') + section2Obj.parent_manual_address[0].city + ',' + (section2Obj.parent_manual_address[0].country != '' ? section2Obj.parent_manual_address[0].country + ',' : '') + section2Obj.parent_manual_address[0].postCode
                            }

                            if (section3Obj.child_education_manual_address != null && section3Obj.child_education_manual_address[0] != null) {
                                section3Obj.child_education_place = section3Obj.child_education_manual_address[0].school + ',' + section3Obj.child_education_manual_address[0].addressLine1 + ',' + (section3Obj.child_education_manual_address[0].addressLine2 != '' ? section3Obj.child_education_manual_address[0].addressLine2 + ',' : '') + section3Obj.child_education_manual_address[0].city + ',' + (section3Obj.child_education_manual_address[0].country != '' ? section3Obj.child_education_manual_address[0].country + ',' : '') + section3Obj.child_education_manual_address[0].postCode
                            }


                            const responseData = {
                                userid: refID,
                                section1: section1Obj,
                                section2: section2Obj,
                                section3: section3Obj,
                                child_dob: getChildDob,
                                section4: referralResult.referral_reason[0],
                                section4LocalService: displayServicesPdf,
                                status: "ok",
                                role: refRole
                            }
                            console.log(responseData);
                            return responseData;
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
    else if (refRole == "Professional" || refRole == "professional") {

        var includeRelationModal;
        var getChildYoungModal

        if (ctx.query.formType == 'child') {
            includeRelationModal = 'child_parent';
            includeModalName = 'professional';
            getChildYoungModal = "parent";

        }
        else {
            includeRelationModal = 'young_family';
            includeModalName = 'professional2';
            getChildYoungModal = "family";
        }
        return user.findOne({

            where: {
                uuid: refID,
            },
        }).then((userObj) => {

            return user.findOne({
                include: [{
                    model: ctx.orm().Referral,
                    as: includeModalName,
                    attributes: ['id', 'child_dob', 'registered_gp', 'gp_school', 'registered_gp_postcode'],
                    include: [{
                        model: ctx.orm().Referral,
                        as: includeRelationModal,
                    }]
                }],
                where: {
                    id: userObj.id,
                },
                attributes: ['id', 'uuid', 'professional_firstname', 'professional_lastname', 'professional_email', 'professional_contact_number', 'consent_child', 'consent_parent', 'professional_address', 'professional_address_postcode', 'professional_profession', 'service_location', 'selected_service', 'professional_contact_type', 'professional_manual_address', 'reference_code', 'contact_preferences', 'contact_person', 'referral_mode', 'referral_type']
            }).then((elgibilityObj) => {

                var childIdNew;
                var childId
                console.log(ctx.query.formType)
                if (ctx.query.formType == 'child') {
                    includeRelationModal = 'child_parent';
                    childIdNew = elgibilityObj.professional[0].child_parent[0].id;
                    childId = Number(elgibilityObj.professional[0].ChildProfessional.professionalId) + 2

                }
                else {
                    includeRelationModal = 'young_family'
                    childIdNew = elgibilityObj.professional2[0].young_family[0].id;
                    childId = Number(elgibilityObj.professional2[0].YoungProfessional.professionalId) + 2
                }

                return user.findAll({
                    include: [
                        //childData
                        {
                            model: ctx.orm().Referral,
                            nested: true,
                            as: getChildYoungModal,
                            attributes: ['id', 'child_NHS', 'child_firstname', 'child_name_title', 'child_lastname', 'child_email', 'child_contact_number', 'child_address', 'child_address_postcode', 'can_send_post', 'child_gender', 'child_gender_birth', 'child_sexual_orientation', 'child_ethnicity', 'child_ethnicity_other', 'child_care_adult', 'household_member', 'child_contact_type', 'sex_at_birth', 'child_manual_address', 'referral_mode']
                        },
                    ],
                    where: {
                        id: childIdNew,
                    },
                    attributes: ['id', 'parent_firstname', 'parent_lastname', 'parental_responsibility', 'responsibility_parent_firstname', 'child_parent_relationship', 'parent_contact_number', 'parent_email', 'parent_same_house', 'parent_address', 'parent_address_postcode', 'legal_care_status', 'parent_contact_type', 'parent_manual_address', 'responsibility_parent_lastname']
                }).then((aboutObj) => {

                    return user.findAll({
                        include: [
                            //childData
                            {
                                model: ctx.orm().Referral,
                                nested: true,
                                as: includeModalName,
                                attributes: [['id', 'child_id'], 'child_profession', 'child_education_place', 'child_EHCP', 'child_EHAT', 'child_socialworker', 'child_socialworker_firstname', 'child_socialworker_lastname', 'child_socialworker_contact', 'child_socialworker_contact_type', 'child_education_manual_address', 'careLeaver']
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

                            var section1Obj = {};
                            var section2Obj = {};
                            var section3Obj = {};
                            var getChildDob;
                            var getChildAge;

                            //  console.log('----------elgibilityObj--------------', elgibilityObj);

                            if (ctx.query.formType == 'child') {
                                section1Obj = {
                                    child_id: elgibilityObj.professional[0].id,
                                    child_dob: elgibilityObj.professional[0].child_dob,
                                    registered_gp: elgibilityObj.professional[0].registered_gp_postcode ? elgibilityObj.professional[0].registered_gp + ', ' + elgibilityObj.professional[0].registered_gp_postcode : elgibilityObj.professional[0].registered_gp,
                                    gp_school: elgibilityObj.professional[0].gp_school,
                                    professional_id: elgibilityObj.id,
                                    consent_child: elgibilityObj.consent_child,
                                    consent_parent: elgibilityObj.consent_parent,
                                    //this to send iaptus api by routine or urgent
                                    referral_mode: elgibilityObj.referral_mode == "1" ? "Routine" : elgibilityObj.referral_mode == "2" ? "Urgent" : "",
                                    //this to print in csv file which is sent to alderhey only in mail
                                    referral_priority: elgibilityObj.referral_mode,

                                    professional_name: elgibilityObj.professional_firstname,
                                    professional_lastname: elgibilityObj.professional_lastname,
                                    professional_email: elgibilityObj.professional_email,
                                    professional_contact_type: elgibilityObj.professional_contact_type,
                                    professional_contact_number: elgibilityObj.professional_contact_number,
                                    professional_address: elgibilityObj.professional_address_postcode ? elgibilityObj.professional_address + ',' + elgibilityObj.professional_address_postcode : elgibilityObj.professional_address,
                                    professional_manual_address: elgibilityObj.professional_manual_address,
                                    professional_profession: elgibilityObj.professional_profession,
                                    service_location: capitalizeFirstLetter(elgibilityObj.service_location),
                                    selected_service: elgibilityObj.selected_service,
                                    reference_code: elgibilityObj.reference_code,
                                    contact_preferences: elgibilityObj.contact_preferences,
                                    contact_person: elgibilityObj.contact_person,
                                    referral_type: elgibilityObj.referral_type

                                }
                                section2Obj = {
                                    child_id: aboutObj[0].parent[0].id,
                                    child_NHS: aboutObj[0].parent[0].child_NHS,
                                    child_name: aboutObj[0].parent[0].child_firstname,
                                    child_lastname: aboutObj[0].parent[0].child_lastname,
                                    child_name_title: aboutObj[0].parent[0].child_name_title,
                                    child_email: aboutObj[0].parent[0].child_email,
                                    child_contact_number: aboutObj[0].parent[0].child_contact_number,
                                    child_address: aboutObj[0].parent[0].child_address_postcode ? aboutObj[0].parent[0].child_address + ', ' + aboutObj[0].parent[0].child_address_postcode : aboutObj[0].parent[0].child_address,
                                    child_manual_address: aboutObj[0].parent[0].child_manual_address,
                                    can_send_post: aboutObj[0].parent[0].can_send_post,
                                    //referral_mode: aboutObj[0].parent[0].referral_mode == "1" ? "Routine" : aboutObj[0].parent[0].referral_mode == "2" ? "Urgent" : "",
                                    child_gender: aboutObj[0].parent[0].child_gender,
                                    child_gender_birth: aboutObj[0].parent[0].child_gender_birth,
                                    child_sexual_orientation: aboutObj[0].parent[0].child_sexual_orientation,
                                    // child_ethnicity: aboutObj[0].parent[0].child_ethnicity,
                                    child_ethnicity: aboutObj[0].parent[0].child_ethnicity == 'Other Ethnic Groups' ? aboutObj[0].parent[0].child_ethnicity_other : aboutObj[0].parent[0].child_ethnicity,
                                    child_care_adult: aboutObj[0].parent[0].child_care_adult,
                                    household_member: aboutObj[0].parent[0].household_member,
                                    child_contact_type: aboutObj[0].parent[0].child_contact_type,
                                    sex_at_birth: aboutObj[0].parent[0].sex_at_birth,
                                    parent_id: aboutObj[0].id,
                                    parent_name: aboutObj[0].parent_firstname,
                                    parent_lastname: aboutObj[0].parent_lastname,
                                    parental_responsibility: aboutObj[0].parental_responsibility,
                                    responsibility_parent_firstname: aboutObj[0].responsibility_parent_firstname,
                                    responsibility_parent_lastname: aboutObj[0].responsibility_parent_lastname,
                                    child_parent_relationship: aboutObj[0].child_parent_relationship,
                                    parent_contact_type: aboutObj[0].parent_contact_type,
                                    parent_contact_number: aboutObj[0].parent_contact_number,
                                    parent_email: aboutObj[0].parent_email,
                                    parent_same_house: aboutObj[0].parent_same_house,
                                    parent_address: aboutObj[0].parent_address_postcode ? aboutObj[0].parent_address + ', ' + aboutObj[0].parent_address_postcode : aboutObj[0].parent_address,
                                    parent_manual_address: aboutObj[0].parent_manual_address,
                                    legal_care_status: aboutObj[0].legal_care_status,
                                }

                                section3Obj = {
                                    child_id: edu_empObj[0].professional[0].id,
                                    child_profession: edu_empObj[0].professional[0].child_profession,
                                    child_education_place: edu_empObj[0].professional[0].child_education_place,
                                    child_education_manual_address: edu_empObj[0].professional[0].child_education_manual_address,
                                    child_EHCP: edu_empObj[0].professional[0].child_EHCP,
                                    child_EHAT: edu_empObj[0].professional[0].child_EHAT,
                                    child_socialworker: edu_empObj[0].professional[0].child_socialworker,
                                    child_socialworker_name: edu_empObj[0].professional[0].child_socialworker_name,
                                    child_socialworker_firstname: edu_empObj[0].professional[0].child_socialworker_firstname,
                                    child_socialworker_lastname: edu_empObj[0].professional[0].child_socialworker_lastname,
                                    child_socialworker_contact: edu_empObj[0].professional[0].child_socialworker_contact,
                                    child_socialworker_contact_type: edu_empObj[0].professional[0].child_socialworker_contact_type,
                                    careLeaver: edu_empObj[0].professional[0].careLeaver,
                                }

                                getChildDob = convertDate(elgibilityObj.professional[0].child_dob);
                                getChildAge = calculateAge(elgibilityObj.professional[0].child_dob);


                            }
                            else {
                                section1Obj = {
                                    child_id: elgibilityObj.professional2[0].id,
                                    child_dob: elgibilityObj.professional2[0].child_dob,
                                    registered_gp: elgibilityObj.professional2[0].registered_gp_postcode ? elgibilityObj.professional2[0].registered_gp + ', ' + elgibilityObj.professional2[0].registered_gp_postcode : elgibilityObj.professional2[0].registered_gp,
                                    gp_school: elgibilityObj.professional2[0].gp_school,
                                    professional_id: elgibilityObj.id,
                                    consent_child: elgibilityObj.consent_child,
                                    consent_parent: elgibilityObj.consent_parent,
                                    //this to send iaptus api by routine or urgent
                                    referral_mode: elgibilityObj.referral_mode == "1" ? "Routine" : elgibilityObj.referral_mode == "2" ? "Urgent" : "",
                                    //this to print in csv file which is sent to alderhey only in mail
                                    referral_priority: elgibilityObj.referral_mode,
                                    professional_name: elgibilityObj.professional_firstname,
                                    professional_lastname: elgibilityObj.professional_lastname,
                                    professional_email: elgibilityObj.professional_email,
                                    professional_contact_type: elgibilityObj.professional_contact_type,
                                    professional_contact_number: elgibilityObj.professional_contact_number,
                                    professional_address: elgibilityObj.professional_address_postcode ? elgibilityObj.professional_address + ',' + elgibilityObj.professional_address_postcode : elgibilityObj.professional_address,
                                    professional_manual_address: elgibilityObj.professional_manual_address,
                                    professional_profession: elgibilityObj.professional_profession,
                                    service_location: capitalizeFirstLetter(elgibilityObj.service_location),
                                    selected_service: elgibilityObj.selected_service,
                                    reference_code: elgibilityObj.reference_code,
                                    contact_preferences: elgibilityObj.contact_preferences,
                                    contact_person: elgibilityObj.contact_person,
                                    referral_type: elgibilityObj.referral_type
                                }
                                section2Obj = {
                                    child_id: aboutObj[0].family[0].id,
                                    child_NHS: aboutObj[0].family[0].child_NHS,
                                    child_name: aboutObj[0].family[0].child_firstname,
                                    child_lastname: aboutObj[0].family[0].child_lastname,
                                    child_name_title: aboutObj[0].family[0].child_name_title,
                                    child_email: aboutObj[0].family[0].child_email,
                                    child_contact_number: aboutObj[0].family[0].child_contact_number,
                                    child_address: aboutObj[0].family[0].child_address_postcode ? aboutObj[0].family[0].child_address + ', ' + aboutObj[0].family[0].child_address_postcode : aboutObj[0].family[0].child_address,
                                    child_manual_address: aboutObj[0].family[0].child_manual_address,
                                    can_send_post: aboutObj[0].family[0].can_send_post,
                                    //referral_mode: aboutObj[0].parent[0].referral_mode == "1" ? "Routine" : aboutObj[0].parent[0].referral_mode == "2" ? "Urgent" : "",
                                    child_gender: aboutObj[0].family[0].child_gender,
                                    child_gender_birth: aboutObj[0].family[0].child_gender_birth,
                                    child_sexual_orientation: aboutObj[0].family[0].child_sexual_orientation,
                                    // child_ethnicity: aboutObj[0].family[0].child_ethnicity,
                                    child_ethnicity: aboutObj[0].family[0].child_ethnicity == 'Other Ethnic Groups' ? aboutObj[0].family[0].child_ethnicity_other : aboutObj[0].family[0].child_ethnicity,
                                    child_care_adult: aboutObj[0].family[0].child_care_adult,
                                    household_member: aboutObj[0].family[0].household_member,
                                    child_contact_type: aboutObj[0].family[0].child_contact_type,
                                    sex_at_birth: aboutObj[0].family[0].sex_at_birth,
                                    parent_id: aboutObj[0].id,
                                    parent_name: aboutObj[0].parent_firstname,
                                    parent_lastname: aboutObj[0].parent_lastname,
                                    parental_responsibility: aboutObj[0].parental_responsibility,
                                    responsibility_parent_firstname: aboutObj[0].responsibility_parent_firstname,
                                    responsibility_parent_lastname: aboutObj[0].responsibility_parent_lastname,
                                    child_parent_relationship: aboutObj[0].child_parent_relationship,
                                    parent_contact_type: aboutObj[0].parent_contact_type,
                                    parent_contact_number: aboutObj[0].parent_contact_number,
                                    parent_email: aboutObj[0].parent_email,
                                    parent_same_house: aboutObj[0].parent_same_house,
                                    parent_address: aboutObj[0].parent_address_postcode ? aboutObj[0].parent_address + ', ' + aboutObj[0].parent_address_postcode : aboutObj[0].parent_address,
                                    parent_manual_address: aboutObj[0].parent_manual_address,
                                    legal_care_status: aboutObj[0].legal_care_status,
                                }

                                section3Obj = {
                                    child_id: edu_empObj[0].professional2[0].id,
                                    child_profession: edu_empObj[0].professional2[0].child_profession,
                                    child_education_place: edu_empObj[0].professional2[0].child_education_place,
                                    child_education_manual_address: edu_empObj[0].professional2[0].child_education_manual_address,
                                    child_EHCP: edu_empObj[0].professional2[0].child_EHCP,
                                    child_EHAT: edu_empObj[0].professional2[0].child_EHAT,
                                    child_socialworker: edu_empObj[0].professional2[0].child_socialworker,
                                    child_socialworker_name: edu_empObj[0].professional2[0].child_socialworker_name,
                                    child_socialworker_firstname: edu_empObj[0].professional2[0].child_socialworker_firstname,
                                    child_socialworker_lastname: edu_empObj[0].professional2[0].child_socialworker_lastname,
                                    child_socialworker_contact: edu_empObj[0].professional2[0].child_socialworker_contact,
                                    child_socialworker_contact_type: edu_empObj[0].professional2[0].child_socialworker_contact_type,
                                    careLeaver: edu_empObj[0].professional2[0].careLeaver,
                                }
                                getChildDob = convertDate(elgibilityObj.professional2[0].child_dob);
                                getChildAge = calculateAge(elgibilityObj.professional2[0].child_dob);
                            }


                            //  return ctx.body = section1Obj;
                            var services;
                            var displayServicesPdf;
                            if (referralResult.referral_reason[0].local_services) {
                                if (referralResult.referral_reason[0].local_services.indexOf('Other') == -1) {
                                    referralResult.referral_reason[0].local_services = referralResult.referral_reason[0].local_services;
                                    displayServicesPdf = referralResult.referral_reason[0].local_services;
                                } else {
                                    var index = referralResult.referral_reason[0].local_services.indexOf('Other');
                                    referralResult.referral_reason[0].local_services.splice(index, 1);
                                    services = referralResult.referral_reason[0].services.map(function (it) {
                                        //  //console.log(it)
                                        return it.name
                                    });
                                    displayServicesPdf = referralResult.referral_reason[0].local_services.concat(services);
                                }
                            }

                            if (referralResult.referral_reason[0].other_eating_difficulties) {
                                if (Array.isArray(referralResult.referral_reason[0].eating_disorder_difficulties)) {
                                    referralResult.referral_reason[0].eating_disorder_difficulties.push(referralResult.referral_reason[0].other_eating_difficulties);
                                } else {
                                    referralResult.referral_reason[0].eating_disorder_difficulties = referralResult.referral_reason[0].eating_disorder_difficulties + _referralResult.referral_reason[0].other_eating_difficulties;
                                }
                            }


                            if (referralResult.referral_reason[0].other_reasons_referral) {
                                if (Array.isArray(referralResult.referral_reason[0].reason_for_referral)) {
                                    referralResult.referral_reason[0].reason_for_referral.push(referralResult.referral_reason[0].other_reasons_referral);
                                } else {
                                    referralResult.referral_reason[0].reason_for_referral = referralResult.referral_reason[0].reason_for_referral + _educationObj.referral_reason[0].other_reasons_referral;
                                }
                            }

                            if (section2Obj.child_manual_address != null && section2Obj.child_manual_address[0] != null) {

                                section2Obj.child_address = section2Obj.child_manual_address[0].addressLine1 + ',' + (section2Obj.child_manual_address[0].addressLine2 ? section2Obj.child_manual_address[0].addressLine2 + ',' : '') + section2Obj.child_manual_address[0].city + ',' + (section2Obj.child_manual_address[0].country != '' ? section2Obj.child_manual_address[0].country + ',' : '') + section2Obj.child_manual_address[0].postCode

                                //Below code for iaptus api
                                section2Obj.pat_address1 = section2Obj.child_manual_address[0].addressLine1;
                                section2Obj.pat_address2 = section2Obj.child_manual_address[0].addressLine2;
                                section2Obj.pat_town_city = section2Obj.child_manual_address[0].city;
                                section2Obj.pat_county = section2Obj.child_manual_address[0].country;
                                section2Obj.pat_postcode = section2Obj.child_manual_address[0].postCode;
                            }
                            else {
                                var childAdrArray = [];
                                childAdrArray = (section2Obj.child_address).split(',')
                                console.log("--------------------------------------childAdrArray")
                                console.log(childAdrArray)
                                console.log("--------------------------------------childAdrArray")
                                //Below code for iaptus api
                                section2Obj.pat_address1 = childAdrArray[1];
                                section2Obj.pat_address2 = "";
                                section2Obj.pat_town_city = childAdrArray[0];
                                section2Obj.pat_county = "";
                                section2Obj.pat_postcode = childAdrArray[childAdrArray.length - 1];
                            }


                            if (section2Obj.parent_manual_address != null && section2Obj.parent_manual_address[0] != null) {
                                section2Obj.parent_address = section2Obj.parent_manual_address[0].addressLine1 + ',' + (section2Obj.parent_manual_address[0].addressLine2 ? section2Obj.parent_manual_address[0].addressLine2 + ',' : '') + section2Obj.parent_manual_address[0].city + ',' + (section2Obj.parent_manual_address[0].country != '' ? section2Obj.parent_manual_address[0].country + ',' : '') + section2Obj.parent_manual_address[0].postCode
                            }

                            if (section3Obj.child_education_manual_address != null && section3Obj.child_education_manual_address[0] != null) {
                                section3Obj.child_education_place = section3Obj.child_education_manual_address[0].school + ',' + section3Obj.child_education_manual_address[0].addressLine1 + ',' + (section3Obj.child_education_manual_address[0].addressLine2 != '' ? section3Obj.child_education_manual_address[0].addressLine2 + ',' : '') + section3Obj.child_education_manual_address[0].city + ',' + (section3Obj.child_education_manual_address[0].country != '' ? section3Obj.child_education_manual_address[0].country + ',' : '') + section3Obj.child_education_manual_address[0].postCode
                            }


                            if (section1Obj.professional_manual_address != null && section1Obj.professional_manual_address[0] != null) {


                                section1Obj.professional_address = section1Obj.professional_manual_address[0].addressLine1 + ',' + (section1Obj.professional_manual_address[0].addressLine2 ? section1Obj.professional_manual_address[0].addressLine2 + ',' : '') + section1Obj.professional_manual_address[0].city + ',' + (section1Obj.professional_manual_address[0].country != '' ? section1Obj.professional_manual_address[0].country + ',' : '') + section1Obj.professional_manual_address[0].postCode

                            }



                            const responseData = {
                                userid: refID,
                                section1: section1Obj,
                                section2: section2Obj,
                                child_dob: getChildDob,
                                child_age: getChildAge,
                                section3: section3Obj,
                                section4: referralResult.referral_reason[0],
                                section4LocalService: displayServicesPdf,
                                status: "ok",
                                role: refRole
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
                        sequalizeErrorHandler.handleSequalizeError(ctx, error)
                    });
            })
                .catch((error) => {
                    console.log(error)
                    sequalizeErrorHandler.handleSequalizeError(ctx, error)
                });
        }).catch((error) => {
            console.log(error)
            sequalizeErrorHandler.handleSequalizeError(ctx, error)
        });
    }
}

exports.referralStatusUpdate = async (ctx) => {
    const t = await ctx.orm().sequelize.transaction();
    console.log(ctx.request.body.status)
    console.log(ctx.request.body)
    console.log(ctx.request.decryptedUsers)
    try {
        const referralModel = ctx.orm().Referral;
        const referralActivityModel = ctx.orm().referralActivity;
        let updateValue = {
            referral_status: ctx.request.body.status
        }

        if (ctx.request.body.status === 'Referral to other team') {
            updateValue.referral_provider_other = ctx.request.body.other;
        }
        if (ctx.request.body.status && (ctx.request.body.status).substring(0, 8) === 'Accepted') {
            updateValue.referral_provider_other = ctx.request.decryptedUser.service_type
        }

        if (ctx.request.body.activity && ctx.request.body.activity.activity === 'Referral viewed') {
            updateValue.activity = {
                activity: 'Referral viewed',
                ReferralId: ctx.request.body.activity.referral,
                doneBy: ctx.request.decryptedUser.id
            }
            console.log(updateValue, "in");
        } else if (ctx.request.body.status) {
            updateValue.activity = {
                activity: "Status changed - " + ctx.request.body.status + ((ctx.request.body.other) ? ("-" + ctx.request.body.other) : ''),
                ReferralId: ctx.request.body.referral_id,
                doneBy: ctx.request.decryptedUser.id
            }
        } else {
            updateValue.activity = {
                activity: ctx.request.body.activity.activity,
                ReferralId: ctx.request.body.activity.referral,
                doneBy: ctx.request.decryptedUser.id
            }
        }
        // return false;
        const updatereferral = await referralModel.update(
            updateValue,
            { where: { uuid: ctx.request.body.referral_id } },
            { transaction: t }
        );
        const audit = await referralActivityModel.create(updateValue.activity, { transaction: t }).catch((err) => {
            console.log("error===", err);
        })
        if (updatereferral) {
            console.log('Update status success.......');
            await t.commit();
            ctx.res.ok({
                message: reponseMessages[1001]
            })
        } else {
            await t.commit();
            ctx.res.ok({
                message: reponseMessages[1002]
            })
        }
    } catch (error) {
        console.log(error, "error====");
        await t.rollback();
        sequalizeErrorHandler.handleSequalizeError(ctx, error)
    }

}

exports.sendReferralCopy = async ctx => {
    console.log(ctx.request.body)
    console.log("ctx.request.body.referralData", ctx.request.body.refPdfCode + ',' + ctx.request.body.role + ',' + ctx.request.body.professional_email);
    let referralData = await getRefData(ctx.request.body.refPdfCode, ctx.request.body.role, ctx);
    ctx.request.body.referralData = referralData;
    ctx.request.body.emailToProvider = ctx.request.body.professional_email;
    // ctx.request.body.referralCode = ctx.request.body.referralCode;
    ctx.request.body.sendProf = true;
    try {
        return email.sendReferralWithData(ctx).then((sendReferralStatus) => {
            console.log(sendReferralStatus)
            return ctx.res.ok({
                message: reponseMessages[1017],
            });
        }).catch(error => {
            console.log(error, "error");
            console.log("false")
            return false;
        });
    } catch (e) {
        return sequalizeErrorHandler.handleSequalizeError(ctx, e);
    }
}


function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function convertDate(date) {
    var yyyy = date.getFullYear().toString();
    var mm = (date.getMonth() + 1).toString();
    var dd = date.getDate().toString();
    var mmChars = mm.split('');
    var ddChars = dd.split('');
    return (ddChars[1] ? dd : "0" + ddChars[0]) + '-' + (mmChars[1] ? mm : "0" + mmChars[0]) + '-' + yyyy;
}

function calculateAge(birthDate) {
    birthDate = new Date(birthDate);
    otherDate = new Date();
    var years = (otherDate.getFullYear() - birthDate.getFullYear());
    if (otherDate.getMonth() < birthDate.getMonth() ||
        otherDate.getMonth() == birthDate.getMonth() && otherDate.getDate() < birthDate.getDate()) {
        years--;
    }
    return years;
}

exports.getActivity = async (ctx) => {
    const referralActivityModel = ctx.orm().referralActivity;
    const referralModel = ctx.orm().Referral;

    var query = {}
    console.log(ctx.query.referralType)
    console.log("🚀 ~ file: adminController.js ~ line 1964 ~ exports.getActivity= ~ ctx.query.referralType", ctx.query.referralType)
    if (ctx.query.fromDate && ctx.query.endDate) {
        query = {
            createdAt: {
                [sequelize.Op.gte]: moment(ctx.query.fromDate).startOf('day').toDate(),
                [sequelize.Op.lte]: moment(ctx.query.endDate).endOf('day').toDate(),
            }
        }
    }
    //console.log(query, "query========");
    return referralActivityModel.findAll({
        where: query,
        include: [
            { model: ctx.orm().User, as: 'userInfo' },
            {
                model: ctx.orm().Referral, as: 'referralInfo', attributes: [
                    'id', 'uuid', 'reference_code', 'child_dob', 'user_role', 'registered_gp', 'updatedAt', 'createdAt', 'referral_provider', 'referral_provider_other', 'referral_status', 'registered_gp_postcode', 'referral_complete_status', 'referral_type',
                    [sequelize.fn('CONCAT', sequelize.col('referralInfo.parent.child_firstname'), sequelize.col('referralInfo.professional.child_firstname'), sequelize.col('referralInfo.child_firstname')), 'name'],
                    [sequelize.fn('CONCAT', sequelize.col('referralInfo.parent.child_lastname'), sequelize.col('referralInfo.professional.child_lastname'), sequelize.col('referralInfo.child_lastname')), 'lastname'],
                    [sequelize.fn('CONCAT', sequelize.col('referralInfo.registered_gp'), sequelize.col('referralInfo.parent.registered_gp'), sequelize.col('referralInfo.professional.registered_gp')), 'gp_location'],
                    [sequelize.fn('CONCAT', sequelize.col('referralInfo.parent.child_dob'), sequelize.col('referralInfo.professional.child_dob'), sequelize.col('referralInfo.child_dob')), 'dob'],
                    [sequelize.fn('CONCAT', sequelize.col('referralInfo.child_firstname'), sequelize.col('referralInfo.professional_firstname'), sequelize.col('referralInfo.parent_firstname')), 'referrer_name'],
                    [sequelize.fn('CONCAT', sequelize.col('referralInfo.child_lastname'), sequelize.col('referralInfo.professional_lastname'), sequelize.col('referralInfo.parent_lastname')), 'referrer_lastname'],
                    [sequelize.fn('CONCAT', sequelize.col('referralInfo.registered_gp_postcode'), sequelize.col('referralInfo.parent.registered_gp_postcode'), sequelize.col('referralInfo.professional.registered_gp_postcode')), 'gp_location_postcode'],
                ],
                include: [
                    {
                        model: ctx.orm().Referral,
                        as: 'parent',
                        attributes: ['id', 'uuid', 'child_firstname', 'child_lastname', 'child_dob', 'registered_gp', 'registered_gp_postcode', 'referral_type',
                        ]
                    },
                    {
                        model: ctx.orm().Referral,
                        as: 'professional',
                        attributes: [
                            'id', 'uuid', 'child_firstname', 'child_lastname', 'child_dob', 'registered_gp', 'registered_gp_postcode', 'referral_type',
                        ]
                    },
                    {
                        model: referralModel,
                        as: 'family',
                        attributes: ['id', 'uuid', 'child_firstname', 'child_lastname', 'child_dob', 'registered_gp', 'registered_gp_postcode', 'referral_type'
                        ]
                    },
                    {
                        model: referralModel,
                        as: 'professional2',
                        attributes: [
                            'id', 'uuid', 'child_firstname', 'child_lastname', 'child_dob', 'registered_gp', 'registered_gp_postcode', 'referral_type'
                        ]
                    },
                ],
            },
        ],
        order: [['createdAt', 'DESC']]
    }).then(async (data) => {
        let filter_referrals = [];
        console.log(data, "data===");
        var query = {
            reference_code: {
                [sequelize.Op.ne]: null
            },
            referral_complete_status: ctx.query.referralType ? ctx.query.referralType : 'completed',
            createdAt: {
                [sequelize.Op.gte]: moment(ctx.query.fromDate).startOf('day').toDate(),
                [sequelize.Op.lte]: moment(ctx.query.endDate).endOf('day').toDate(),
            }
        }
        var referrals = await referralModel.findAll({
            attributes: [
                'id', 'uuid', 'reference_code', 'child_dob', 'user_role', 'registered_gp', 'updatedAt', 'createdAt', 'referral_provider', 'referral_provider_other', 'referral_status', 'gp_school', 'referral_complete_status', 'registered_gp_postcode', 'referral_type',
                [sequelize.fn('CONCAT', sequelize.col('parent.child_firstname'), sequelize.col('professional.child_firstname'), sequelize.col('Referral.child_firstname')), 'name'],
                [sequelize.fn('CONCAT', sequelize.col('parent.child_lastname'), sequelize.col('professional.child_lastname'), sequelize.col('Referral.child_lastname')), 'lastname'],
                [sequelize.fn('CONCAT', sequelize.col('parent.child_dob'), sequelize.col('professional.child_dob'), sequelize.col('Referral.child_dob')), 'dob'],
                [sequelize.fn('CONCAT', sequelize.col('Referral.child_firstname'), sequelize.col('Referral.professional_firstname'), sequelize.col('Referral.parent_firstname')), 'referrer_name'],
                [sequelize.fn('CONCAT', sequelize.col('Referral.child_lastname'), sequelize.col('Referral.professional_lastname'), sequelize.col('Referral.parent_lastname')), 'referrer_lastname'],
                [sequelize.fn('CONCAT', sequelize.col('Referral.registered_gp'), sequelize.col('parent.registered_gp'), sequelize.col('professional.registered_gp')), 'gp_location'],
                [sequelize.fn('CONCAT', sequelize.col('Referral.registered_gp_postcode'), sequelize.col('parent.registered_gp_postcode'), sequelize.col('professional.registered_gp_postcode')), 'gp_location_postcode'],

            ],
            where: query,
            include: [
                {
                    model: referralModel,
                    as: 'parent',
                    attributes: ['id', 'uuid', 'child_firstname', 'child_lastname', 'child_dob', 'registered_gp', 'registered_gp_postcode', 'referral_complete_status', 'referral_type'
                    ]
                },
                {
                    model: referralModel,
                    as: 'professional',
                    attributes: [
                        'id', 'uuid', 'child_firstname', 'child_lastname', 'child_dob', 'registered_gp', 'registered_gp_postcode', 'referral_complete_status', 'referral_type'
                    ]
                },
                {
                    model: referralModel,
                    as: 'family',
                    attributes: ['id', 'uuid', 'child_firstname', 'child_lastname', 'child_dob', 'registered_gp', 'registered_gp_postcode', 'referral_type'
                    ]
                },
                {
                    model: referralModel,
                    as: 'professional2',
                    attributes: [
                        'id', 'uuid', 'child_firstname', 'child_lastname', 'child_dob', 'registered_gp', 'registered_gp_postcode', 'referral_type'
                    ]
                },
            ],
        })
        // console.log(referrals.length, referrals);

        var referalActivityArray = data;
        let mappedReferralData = _.map(referrals, function (p) {
            return {
                ...p,
                ReferralId: p.uuid
            }
        });
        // const nonCommonValues = _.xorBy(mappedReferralData, referalActivityArray, 'ReferralId');
        // let ReceivedArray =[];
        // let mappedReferralData = _.map(referalActivityArray, function (p) {

        // });

        var allReferralData = _.concat(mappedReferralData, referalActivityArray)
        //console.log(allReferralData.length, referrals.length, data.length, "allReferralData")

        _.forEach(allReferralData, function (obj, index) {
            refObj = obj.referralInfo ? obj.referralInfo : obj

            if (refObj.referral_provider == null) {
                refObj.referral_provider = "Archived"
            } else {
                refObj.referral_provider = refObj.referral_provider
            }
            if (refObj.dataValues.user_role == 'family') {
                refObj.dataValues.name = refObj.family[0].child_firstname;
                refObj.dataValues.lastname = refObj.family[0].child_lastname;
                refObj.dataValues.dob = refObj.family[0].child_dob;
                refObj.dataValues.gp_location = refObj.family[0].dataValues.registered_gp;
                refObj.dataValues.gp_location_postcode = refObj.family[0].dataValues.registered_gp_postcode;

            }
            else if (refObj.dataValues.user_role == 'professional') {
                if (refObj.dataValues.referral_type == "young") {
                    refObj.dataValues.name = refObj.professional2[0].child_firstname;
                    refObj.dataValues.lastname = refObj.professional2[0].child_lastname;
                    refObj.dataValues.dob = refObj.professional2[0].child_dob;
                    refObj.dataValues.gp_location = refObj.professional2[0].dataValues.registered_gp;
                    refObj.dataValues.gp_location_postcode = refObj.professional2[0].dataValues.registered_gp_postcode
                }
            }


            var referralObj = {
                uuid: refObj.uuid,
                name: refObj.dataValues.name + " " + refObj.dataValues.lastname,
                dob: refObj.dataValues.dob ? moment(refObj.dataValues.dob).format('DD/MM/YYYY') : '',
                reference_code: refObj.dataValues.reference_code,
                referrer: refObj.dataValues.referrer_name + " " + refObj.dataValues.referrer_lastname,
                gp_location: 'Local School',
                referrer_type: refObj.dataValues.user_role.charAt(0).toUpperCase() + refObj.dataValues.user_role.slice(1),
                date: moment(moment(refObj.dataValues.updatedAt).tz('Europe/London')).format('DD/MM/YYYY'),
                refDate: moment(moment(refObj.dataValues.createdAt).tz('Europe/London')).format('DD/MM/YYYY H:mm:ss'),
                referral_provider: refObj.referral_provider,
                referral_provider_other: refObj.referral_provider_other,
                referral_status: refObj.dataValues.referral_status,
                referral_current_status: (refObj.dataValues.referral_complete_status == 'completed') ? 'active' : refObj.dataValues.referral_complete_status,
                activity_date: obj.referralInfo ? moment(moment(obj.createdAt).tz('Europe/London')).format('DD/MM/YYYY') : moment(moment(refObj.dataValues.createdAt).tz('Europe/London')).format('DD/MM/YYYY'),
                activity_time: obj.referralInfo ? moment(moment(obj.createdAt).tz('Europe/London')).format('H:mm:ss') : moment(moment(refObj.dataValues.createdAt).tz('Europe/London')).format('H:mm:ss'),
                activity_user: obj.referralInfo ? (obj.userInfo.first_name + ' ' + obj.userInfo.last_name) : '',
                activity_action: obj.referralInfo ? obj.activity : 'Referral received'
            }
            if (refObj.dataValues.gp_location) {
                if (refObj.dataValues.gp_location_postcode || refObj.dataValues.gp_location_postcode != '') {
                    if (refObj.dataValues.gp_location_postcode != "L14 0JE" && gpCodes[0].code.indexOf(refObj.dataValues.gp_location_postcode.split(' ')[0]) >= 0) {
                        referralObj.gp_location = gpCodes[0].type;
                    } else if (refObj.dataValues.gp_location_postcode != "L14 0JE" && gpCodes[1].code.indexOf(refObj.dataValues.gp_location_postcode.split(' ')[0]) >= 0) {
                        referralObj.gp_location = gpCodes[1].type;
                    }
                }
                else {
                    var splitLocation = refObj.dataValues.gp_location.split(',');
                    if (splitLocation.length > 1) {
                        if (splitLocation[1] != "L14 0JE" && gpCodes[0].code.indexOf(splitLocation[1].split(' ')[0]) >= 0) {
                            referralObj.gp_location = gpCodes[0].type;
                        } else if (splitLocation[1] != "L14 0JE" && gpCodes[1].code.indexOf(splitLocation[1].split(' ')[0]) >= 0) {
                            referralObj.gp_location = gpCodes[1].type;
                        }
                    }
                }
            }

            filter_referrals.push(referralObj);
        });
        return ctx.res.ok({
            status: "success",
            message: reponseMessages[1021],
            data: filter_referrals,
            data: {
                filter_referrals: filter_referrals,
                activity_referrals: data
            }
        });
    }).catch((error) => {
        console.log(error);
        sequalizeErrorHandler.handleSequalizeError(ctx, error)
    })
}

exports.toJson = async (ctx) => {

    try {
        return convertToJson.doConversionToJson(ctx).then((sendReferralStatus) => {

            console.log(ctx.res.JSONData)
            return ctx.res.ok({
                data: ctx.res.JSONData,
                message: reponseMessages[1017],
            });
        }).catch(error => {
            console.log(error, "error");
            console.log("false")
            return false;
        });
    } catch (e) {
        return sequalizeErrorHandler.handleSequalizeError(ctx, e);
    }

}

exports.updateApiValue = async (ctx) => {
    console.log(ctx.request.body)
    const flagTbl = ctx.orm().miscellaneousFlag;
    return flagTbl.update({
        value: ctx.request.body.updateValue
    },
        {
            where:
                { id: 1 }
        }
    ).then((result) => {
        //---------------------here need add functionlaity for insert appoinment details
        return ctx.res.ok({
            message: reponseMessages[1017],
        });
    }).catch(error => {
        console.log(" admin controller apiResponse-error")
        console.log(error);
        sequalizeErrorHandler.handleSequalizeError(ctx, error)
    });
}

exports.getApiService = async (ctx) => {

    try {
        const flagTbl = ctx.orm().miscellaneousFlag;

        return flagTbl.findOne({
            where: {
                id: 1,
            },
        }).then((data) => {
            console.log(data.value)
            if (data) {
                return ctx.res.ok({
                    data: { flagValue: data.dataValues.value }
                });
            } else {
                return ctx.res.ok({
                    message: reponseMessages[1009]
                });
            }
        }).catch(error => {
            console.log(error)
            sequalizeErrorHandler.handleSequalizeError(ctx, error)
        });
    } catch (e) {
        console.log(e)
        return sequalizeErrorHandler.handleSequalizeError(ctx, e);
    }
}

exports.getCount = async (ctx) => {
    console.log("-------------------------------------------------get count")
    const referralModel = ctx.orm().Referral;
    const userModel = ctx.orm().User;

    try {
        return userModel.count({

        }).then((userCount) => {
            console.log(userCount)

            try {
                return referralModel.count({
                    where:
                    {
                        referral_complete_status: {
                            [sequelize.Op.in]: ['completed', 'archived', 'deleted']
                        }
                    }
                }
                ).then((completedReferralCount) => {
                    console.log(completedReferralCount)
                    try {
                        return referralModel.count({
                            where:
                            {
                                referral_complete_status: {
                                    [sequelize.Op.in]: ['incomplete']
                                }
                            }
                        }
                        ).then((incompletedReferralCount) => {
                            console.log(incompletedReferralCount)

                            return ctx.res.ok({
                                data: {
                                    Complted_Referrals: completedReferralCount,
                                    Partial_Referrals: incompletedReferralCount,
                                    Total_Users: userCount
                                }
                            });

                        }).catch(error => {
                            console.log(error)
                            sequalizeErrorHandler.handleSequalizeError(ctx, error)
                        });
                    } catch (e) {
                        console.log(e)
                        return sequalizeErrorHandler.handleSequalizeError(ctx, e);
                    }

                }).catch(error => {
                    console.log(error)
                    sequalizeErrorHandler.handleSequalizeError(ctx, error)
                });
            } catch (e) {
                console.log(e)
                return sequalizeErrorHandler.handleSequalizeError(ctx, e);
            }

        }).catch(error => {
            console.log(error)
            sequalizeErrorHandler.handleSequalizeError(ctx, error)
        });
    } catch (e) {
        console.log(e)
        return sequalizeErrorHandler.handleSequalizeError(ctx, e);
    }
}







// appointments

exports.createAppointmentDetails = async (ctx) => {
    const referralModel = ctx.orm().Referral;
    console.log("==========================gettting in==============================")
    let appointmentData = {};
    console.log(ctx.request.body)
    if (ctx.request.status == "booking") {
        // send service and call saveAppointments
        //Appointment needed but 
        //saveAppointments(appointmentData)
        // return
    } else {
        console.log("========================================================")
        //console.log(ctx.request.body.time)
        var timeStr = ctx.request.body.time;
        var dateStr = ctx.request.body.date;
        var dateTime = dateStr + '' + dateTime;
        var timeAndDate = moment(dateStr + ' ' + timeStr);
        timeAndDate = timeAndDate.format("DD/MM/YYYY HH:mm");
        var dateTime = ctx.request.body.time;
        //var dateTime = convertTo24Hour(ctx.request.body.date,ctx.request.body.selectedTime,ctx.request.body.seletedDay,ctx.request.body.hrs,ctx.request.body.min);
        if (ctx.request.body.callHCC) {
            try {
                //ctx.request.body.ReferralId =  "8f73581c-4e0c-4c85-bb68-4c0c1e0e67ba"
                var referral = await referralModel.findOne({
                    attributes: [
                        'id', 'uuid', 'reference_code', 'child_dob', 'contact_preferences', 'user_role', 'updatedAt', 'createdAt', 'referral_provider', 'referral_provider_other', 'child_NHS', 'referral_type',
                        [sequelize.fn('CONCAT', sequelize.col('parent.child_name_title'), sequelize.col('professional.child_name_title'), sequelize.col('Referral.child_name_title')), 'child_name_title'],
                        [sequelize.fn('CONCAT', sequelize.col('parent.child_firstname'), sequelize.col('professional.child_firstname'), sequelize.col('Referral.child_firstname')), 'name'],
                        [sequelize.fn('CONCAT', sequelize.col('parent.child_lastname'), sequelize.col('professional.child_lastname'), sequelize.col('Referral.child_lastname')), 'lastname'],
                        [sequelize.fn('CONCAT', sequelize.col('parent.child_contact_number'), sequelize.col('professional.child_contact_number'), sequelize.col('Referral.child_contact_number')), 'child_contact_number'],
                        [sequelize.fn('CONCAT', sequelize.col('parent.child_email'), sequelize.col('professional.child_email'), sequelize.col('Referral.child_email')), 'child_email'],
                        [sequelize.fn('CONCAT', sequelize.col('parent.child_dob'), sequelize.col('professional.child_dob'), sequelize.col('Referral.child_dob')), 'dob'],

                        [sequelize.fn('CONCAT', sequelize.col('family.child_name_title'), sequelize.col('professional2.child_name_title'), sequelize.col('Referral.child_name_title')), 'child_name_title'],

                        [sequelize.fn('CONCAT', sequelize.col('family.child_firstname'), sequelize.col('professional2.child_firstname'), sequelize.col('Referral.child_firstname')), 'name'],
                        [sequelize.fn('CONCAT', sequelize.col('family.child_lastname'), sequelize.col('professional2.child_lastname'), sequelize.col('Referral.child_lastname')), 'lastname'],

                        [sequelize.fn('CONCAT', sequelize.col('family.child_contact_number'), sequelize.col('professional2.child_contact_number'), sequelize.col('Referral.child_contact_number')), 'child_contact_number'],
                        [sequelize.fn('CONCAT', sequelize.col('family.child_email'), sequelize.col('professional2.child_email'), sequelize.col('Referral.child_email')), 'child_email'],
                        [sequelize.fn('CONCAT', sequelize.col('family.child_dob'), sequelize.col('professional2.child_dob'), sequelize.col('Referral.child_dob')), 'dob'],
                        [sequelize.fn('CONCAT', sequelize.col('family.child_NHS'), sequelize.col('professional2.child_NHS'), sequelize.col('Referral.child_NHS')), 'child_NHS'],
                    ],
                    where: {
                        uuid: ctx.request.body.ReferralId
                    },
                    include: [
                        {
                            model: referralModel,
                            as: 'parent',
                            attributes: ['id', 'uuid', 'child_firstname', 'child_lastname', 'child_dob', 'child_name_title', 'child_contact_number', 'child_email', 'child_NHS', 'referral_type',
                            ]
                        },
                        {
                            model: referralModel,
                            as: 'professional',
                            attributes: [
                                'id', 'uuid', 'child_firstname', 'child_lastname', 'child_dob', 'child_name_title', 'child_contact_number', 'child_email', 'child_NHS', 'referral_type',
                            ]
                        },
                        {
                            model: referralModel,
                            as: 'family',
                            attributes: ['id', 'uuid', 'child_firstname', 'child_lastname', 'child_dob', 'child_name_title', 'child_contact_number', 'child_email', 'child_NHS', 'referral_type',
                            ]
                        },
                        {
                            model: referralModel,
                            as: 'professional2',
                            attributes: [
                                'id', 'uuid', 'child_firstname', 'child_lastname', 'child_dob', 'child_name_title', 'child_contact_number', 'child_email', 'child_NHS', 'referral_type',
                            ]
                        },
                    ],
                })
                //console.log(referral)
                if (referral.user_role == 'professional') {
                    if (referral.referral_type == "young") {
                        referral.dataValues.child_name_title = referral.professional2[0].child_name_title;
                        referral.dataValues.name = referral.professional2[0].child_firstname;
                        referral.dataValues.lastname = referral.professional2[0].child_lastname;
                        referral.dataValues.child_NHS = referral.professional2[0].child_NHS;
                        referral.dataValues.child_contact_number = referral.professional2[0].child_contact_number;
                        referral.dataValues.child_email = referral.professional2[0].child_email;
                        referral.dataValues.dob = referral.professional2[0].child_dob;
                    }
                    else {
                        referral.dataValues.child_name_title = referral.professional[0].child_name_title;
                        referral.dataValues.name = referral.professional[0].child_firstname;
                        referral.dataValues.lastname = referral.professional[0].child_lastname;
                        referral.dataValues.child_NHS = referral.professional[0].child_NHS;
                        referral.dataValues.child_contact_number = referral.professional[0].child_contact_number;
                        referral.dataValues.child_email = referral.professional[0].child_email;
                        referral.dataValues.dob = referral.professional[0].child_dob;
                    }
                }
                else if (referral.user_role == 'parent') {
                    referral.dataValues.child_name_title = referral.parent[0].child_name_title;
                    referral.dataValues.name = referral.parent[0].child_firstname;
                    referral.dataValues.lastname = referral.parent[0].child_lastname;
                    referral.dataValues.child_NHS = referral.parent[0].child_NHS;
                    referral.dataValues.child_contact_number = referral.parent[0].child_contact_number;
                    referral.dataValues.child_email = referral.parent[0].child_email;
                    referral.dataValues.dob = referral.parent[0].child_dob;
                }
                //console.log(referral.toJSON());
                var dob = moment(referral.dataValues.dob)
                var sendDobFmt = dob.format('DD/MM/YYYY')
                var fullNameWithTitle = referral.dataValues.child_name_title + '. ' + referral.dataValues.name + ' ' + referral.dataValues.lastname
                let obj = {
                    //"full_name": fullNameWithTitle,
                    "title": referral.dataValues.child_name_title,
                    "first_name": referral.dataValues.name,
                    "last_name": referral.dataValues.lastname,
                    "nhs_number": referral.dataValues.child_NHS,
                    "phone_number": referral.dataValues.child_contact_number,
                    "email": referral.dataValues.child_email ? referral.dataValues.child_email : null,
                    //"notifications_consent": referral.dataValues.contact_preferences ? referral.dataValues.contact_preferences : null,
                    "alderHey_number": ctx.request.body.alderheyNumber ? ctx.request.body.alderheyNumber : '',
                    "clinic_code": "CC1",
                    "selected_provider": ctx.request.body.service,
                    "appointment_detail": timeAndDate,
                    "DOB": sendDobFmt
                }
                let data = await axios({
                    method: 'post',
                    url: config.hccommsurl,
                    headers: { 'key': config.hccommskey, 'Content-Type': 'application/json' },
                    data: JSON.stringify(obj)
                })
                console.log('=====obj======', obj)
                // success
                console.log(data.data.response[0].code)
                if (data.data.response[0].code == 1002) {
                    let insertBookingdetails = await saveAppointments(ctx, ctx.request.body)
                    if (insertBookingdetails) {
                        return ctx.res.ok({
                            message: reponseMessages[1023],
                        });
                    }
                    else {
                        return ctx.res.ok({
                            message: reponseMessages[1024],
                        });
                    }
                }
                else {
                    return ctx.res.ok({
                        message: reponseMessages[1024],
                    });
                }
            } catch (error) {
                console.log(error)
            }

        }
        else {
            // saveAppointments   --Venus
            console.log("getting in else part")
            let insertBookingdetails = await saveAppointments(ctx, ctx.request.body)
            console.log(insertBookingdetails)
            if (insertBookingdetails) {
                return ctx.res.ok({
                    message: reponseMessages[1023],
                });
            }
            else {
                return ctx.res.ok({
                    message: reponseMessages[1024],
                });
            }
        }

    }
}


exports.getAppointmentDetails = async (ctx) => {
    // find  by refferal
}


exports.appointmentNeeded = async (ctx) => {
    console.log(ctx.request.body)
    console.log("ctx.request.body.referralData", ctx.request.body.ReferralId + ',' + ctx.request.body.role + ',' + ctx.request.body.service);
    ctx.query.refID = ctx.request.body.ReferralId;
    ctx.query.refRole = ctx.request.body.role;
    ctx.query.formType = ctx.request.body.formType;
    let referralData = await getRefData(ctx.query.refID, ctx.query.refRole, ctx);
    ctx.request.body.referralData = referralData;
    ctx.request.body.emailToProvider = ctx.request.body.service;
    ctx.request.body.referralCode = ctx.request.body.referranceCode;
    //ctx.request.body.sendProf = true;
    ctx.request.body.bookAppointment = true;
    try {
        return email.sendReferralWithData(ctx).then(async (sendReferralStatus) => {
            console.log(sendReferralStatus);
            let insertBookingdetails = await saveAppointments(ctx, ctx.request.body)
            if (insertBookingdetails) {
                return ctx.res.ok({
                    message: reponseMessages[1025],
                });
            }
            else {
                return ctx.res.ok({
                    message: reponseMessages[1024],
                });
            }
        }).catch(error => {
            return ctx.res.ok({
                message: reponseMessages[1024],
            });
        });
    } catch (e) {
        return sequalizeErrorHandler.handleSequalizeError(ctx, e);
    }
}

async function saveAppointments(ctx, appointmentData) {
    console.log("getting in appointmentData")
    console.log(appointmentData)
    appointmentData.alderhey_number = appointmentData.alderheyNumber
    console.log(appointmentData)
    const appointmentModel = ctx.orm().appointments;
    const referralModel = ctx.orm().Referral;
    console.log("appointmentModel :" + appointmentModel)
    try {
        const updateOrCreate = await appointmentModel.findOne(
            { where: { ReferralId: appointmentData.ReferralId }, }
        )
        if (!updateOrCreate) {
            const bookAppointment = await appointmentModel.create(appointmentData);
            if (bookAppointment) {
                const updateAppointmentTime = await referralModel.update({ appointment_detail: appointmentData.status }, { where: { uuid: appointmentData.ReferralId } });
            }
            console.log("Book Appointment: " + bookAppointment)
            return bookAppointment
        }
        else {
            const updateAppointment = await appointmentModel.update(appointmentData, {
                where: {
                    ReferralId: appointmentData.ReferralId,
                },
                returning: true,
            });
            if (updateAppointment) {
                const updateAppointmentTime = await referralModel.update({ appointment_detail: appointmentData.status }, { where: { uuid: appointmentData.ReferralId } });
            }
            return updateAppointment
        }

    } catch (error) {
        console.log("error===", error);
        // return error;
    }
}

function convertTo24Hour(date, selectedTime, modifier, hours, minutes) {
    console.log(selectedTime)
    console.log(modifier)
    console.log(hours)
    console.log(minutes)
    //const [time, modifier] = timeStr.split(' ');
    //var timeSplitArray = time.split(':');
    //let [hours, minutes] = selectedTime.split(':');
    // let hours =  timeSplitArray[0]
    //let minutes =  timeSplitArray[1]
    // console.log("0---0-0-0-0-")
    // console.log(hours.charAt(1))
    // console.log(minutes.charAt(1)
    if (hours === '12') {
        hours = '00';
    }
    if (modifier == 'PM') {
        hours = parseInt(hours, 10) + 12;
    }
    var modifiedDate = new Date(date)
    modifiedDate.setHours(hours);
    modifiedDate.setMinutes(minutes);
    console.log(modifiedDate)
    console.log(modifiedDate.getHours())
    console.log(modifiedDate.getMinutes())
    return modifiedDate;
    //return `${hours}:${minutes}`;


    // console.log(time)
    // var d = new Date(date),
    //     s = "01.25 PM",
    //     parts = s.match(/(\d+)\.(\d+) (\w+)/),
    //     hours = /am/i.test(parts[3]) ? parseInt(parts[1], 10) : parseInt(parts[1], 10) + 12,
    //     minutes = parseInt(parts[2], 10);

    // d.setHours(hours);
    // d.setMinutes(minutes)
    // return d;
}


exports.getActivityCSV = async (ctx) => {

    const referralActivityModel = ctx.orm().referralActivity;
    const referralModel = ctx.orm().Referral;
    var query = {};
    if (ctx.query.fromDate && ctx.query.endDate) {
        query = {
            createdAt: {
                [sequelize.Op.gte]: moment(ctx.query.fromDate)
                    .startOf("day")
                    .toDate(),
                [sequelize.Op.lte]: moment(ctx.query.endDate)
                    .endOf("day")
                    .toDate(),
            },
        };
    }
    return referralActivityModel
        .findAll({
            where: query,
            raw: true,
            nest: true,
            include: [
                { model: ctx.orm().User, as: "userInfo" },
                {
                    model: ctx.orm().Referral, as: 'referralInfo', attributes: [
                        'id', 'uuid', 'reference_code', 'child_dob', 'user_role', 'registered_gp', 'updatedAt', 'createdAt', 'referral_provider', 'referral_provider_other', 'referral_status', 'registered_gp_postcode', 'referral_complete_status', 'referral_type',
                        [sequelize.fn('CONCAT', sequelize.col('referralInfo.parent.child_firstname'), sequelize.col('referralInfo.professional.child_firstname'), sequelize.col('referralInfo.child_firstname')), 'name'],
                        [sequelize.fn('CONCAT', sequelize.col('referralInfo.parent.child_lastname'), sequelize.col('referralInfo.professional.child_lastname'), sequelize.col('referralInfo.child_lastname')), 'lastname'],
                        [sequelize.fn('CONCAT', sequelize.col('referralInfo.registered_gp'), sequelize.col('referralInfo.parent.registered_gp'), sequelize.col('referralInfo.professional.registered_gp')), 'gp_location'],
                        [sequelize.fn('CONCAT', sequelize.col('referralInfo.parent.child_dob'), sequelize.col('referralInfo.professional.child_dob'), sequelize.col('referralInfo.child_dob')), 'dob'],
                        [sequelize.fn('CONCAT', sequelize.col('referralInfo.child_firstname'), sequelize.col('referralInfo.professional_firstname'), sequelize.col('referralInfo.parent_firstname')), 'referrer_name'],
                        [sequelize.fn('CONCAT', sequelize.col('referralInfo.child_lastname'), sequelize.col('referralInfo.professional_lastname'), sequelize.col('referralInfo.parent_lastname')), 'referrer_lastname'],
                        [sequelize.fn('CONCAT', sequelize.col('referralInfo.registered_gp_postcode'), sequelize.col('referralInfo.parent.registered_gp_postcode'), sequelize.col('referralInfo.professional.registered_gp_postcode')), 'gp_location_postcode'],
                    ],
                    include: [
                        {
                            model: ctx.orm().Referral,
                            as: 'parent',
                            attributes: ['id', 'uuid', 'child_firstname', 'child_lastname', 'child_dob', 'registered_gp', 'registered_gp_postcode', 'referral_type',
                            ]
                        },
                        {
                            model: ctx.orm().Referral,
                            as: 'professional',
                            attributes: [
                                'id', 'uuid', 'child_firstname', 'child_lastname', 'child_dob', 'registered_gp', 'registered_gp_postcode', 'referral_type',
                            ]
                        },
                        {
                            model: referralModel,
                            as: 'family',
                            attributes: ['id', 'uuid', 'child_firstname', 'child_lastname', 'child_dob', 'registered_gp', 'registered_gp_postcode', 'referral_type'
                            ]
                        },
                        {
                            model: referralModel,
                            as: 'professional2',
                            attributes: [
                                'id', 'uuid', 'child_firstname', 'child_lastname', 'child_dob', 'registered_gp', 'registered_gp_postcode', 'referral_type'
                            ]
                        },
                    ],
                },
            ],
            order: [["createdAt", "DESC"]],
        })
        .then(async (data) => {
            let filter_referrals = [];
            var referalActivityArray = data;
            _.forEach(referalActivityArray, function (obj, index) {
                let refObj = obj
                if (refObj.referralInfo.referral_provider == null) {
                    refObj.referralInfo.referral_provider = "Archived";
                } else {
                    refObj.referralInfo.referral_provider = refObj.referral_provider;
                }
                if (refObj.referralInfo.user_role == 'family') {
                    console.log("🚀 ~ file: adminController.js ~ line 2816 ~ refObj", refObj.reference_code)
                    console.log("🚀 ~ file: adminController.js ~ line 2816 ~ refObj", refObj.referralInfo)
                    refObj.referralInfo.name = refObj.referralInfo.family.child_firstname;
                    refObj.referralInfo.lastname = refObj.referralInfo.family.child_lastname;
                    refObj.referralInfo.dob = refObj.referralInfo.family.child_dob;
                    refObj.referralInfo.gp_location = refObj.referralInfo.family.registered_gp;
                    refObj.referralInfo.gp_location_postcode = refObj.referralInfo.family.registered_gp_postcode;

                }
                else if (refObj.referralInfo.user_role == 'professional') {
                    if (refObj.referralInfo.referral_type == "young") {
                        console.log("🚀 ~ file: adminController.js ~ line 2826 ~ refObj", refObj.referralInfo.reference_code)
                        console.log("🚀 ~ file: adminController.js ~ line 2825 ~ refObj", refObj)
                        refObj.referralInfo.name = refObj.referralInfo.professional2.child_firstname;
                        refObj.referralInfo.lastname = refObj.referralInfo.professional2.child_lastname;
                        refObj.referralInfo.dob = refObj.referralInfo.professional2.child_dob;
                        refObj.referralInfo.gp_location = refObj.referralInfo.professional2.registered_gp;
                        refObj.referralInfo.gp_location_postcode = refObj.referralInfo.professional2.registered_gp_postcode
                    }
                }
                if (refObj.referralInfo.gp_location) {
                    var gpAddresArray = refObj.referralInfo.gp_location.split(",");
                    gploc = refObj.referralInfo.gp_location_postcode ? refObj.referralInfo.gp_location_postcode : gpAddresArray[1];
                    //this.elgibilityObj.profAddress = gpAddresArray[0] + "," + gpAddresArray[1];
                    if (gploc) {
                        if (gploc || gploc != "") {
                            if (
                                gpCodes[0].code.indexOf(gploc.split(" ")[0]) >= 0
                            ) {
                                refObj.referralInfo.gp_location = gpCodes[0].type;
                            } else if (
                                gpCodes[1].code.indexOf(gploc.split(" ")[0]) >= 0
                            ) {
                                refObj.referralInfo.gp_location = gpCodes[1].type;
                            }
                            else {
                                refObj.referralInfo.gp_location = "Local School"
                            }
                        } else {
                            var splitLocation = gploc.split(",");
                            if (splitLocation.length > 1) {
                                if (
                                    gpCodes[0].code.indexOf(splitLocation[1].split(" ")[0]) >= 0
                                ) {
                                    refObj.referralInfo.gp_location = gpCodes[0].type;
                                } else if (
                                    gpCodes[1].code.indexOf(splitLocation[1].split(" ")[0]) >= 0
                                ) {
                                    refObj.referralInfo.gp_location = gpCodes[1].type;
                                }
                                else {
                                    refObj.referralInfo.gp_location = "Local School"
                                }
                            }
                        }
                    }
                }



                var referralObj = {
                    uuid: refObj.referralInfo.uuid,
                    name: refObj.referralInfo.name + " " + refObj.referralInfo.lastname,
                    dob: refObj.referralInfo.dob
                        ? moment(refObj.referralInfo.dob).format("DD/MM/YYYY")
                        : "",
                    reference_code: refObj.referralInfo.reference_code,
                    referrer:
                        refObj.referralInfo.referrer_name +
                        " " +
                        refObj.referralInfo.referrer_lastname,
                    gp_location: refObj.referralInfo.gp_location ? refObj.referralInfo.gp_location : "Local School",
                    referrer_type:
                        refObj.referralInfo.user_role.charAt(0).toUpperCase() +
                        refObj.referralInfo.user_role.slice(1),
                    date: moment(
                        moment(refObj.referralInfo.updatedAt).tz("Europe/London")
                    ).format("DD/MM/YYYY"),
                    refDate: moment(
                        moment(refObj.referralInfo.createdAt).tz("Europe/London")
                    ).format("DD/MM/YYYY H:mm:ss"),
                    referral_provider: refObj.referralInfo.referral_provider,
                    referral_provider_other: refObj.referralInfo.referral_provider_other,
                    referral_status: refObj.referralInfo.referral_status,
                    referral_current_status:
                        refObj.referralInfo.referral_complete_status == "completed"
                            ? "active"
                            : refObj.referralInfo.referral_complete_status,
                    activity_date: obj
                        ? moment(moment(obj.createdAt).tz("Europe/London")).format(
                            "DD/MM/YYYY"
                        )
                        : moment(
                            moment(refObj.createdAt).tz("Europe/London")
                        ).format("DD/MM/YYYY"),
                    activity_time: obj
                        ? moment(moment(obj.createdAt).tz("Europe/London")).format(
                            "H:mm:ss"
                        )
                        : moment(
                            moment(refObj.createdAt).tz("Europe/London")
                        ).format("H:mm:ss"),
                    activity_user: obj.referralInfo
                        ? obj.userInfo.first_name + " " + obj.userInfo.last_name
                        : "",
                    activity_action: obj.referralInfo
                        ? obj.activity
                        : "Referral received",
                    activityDateTIme: obj.createdAt,
                    referralDate: refObj.referralInfo.createdAt
                };

                filter_referrals.push(referralObj);


            })
            _.orderBy(data, ['referralDate', 'activityDateTIme'], ['desc', 'asc']);

            groupedReferral = _.mapValues(_.groupBy(filter_referrals, "uuid"), function (data) {
                return _.orderBy(data, ['referralDate', 'activityDateTIme'], ['desc', 'asc']);
            });
            return ctx.res.ok({
                status: "success",
                message: reponseMessages[1021],
                data: filter_referrals,
                data: {
                    activity_referrals: groupedReferral,
                },
            });
        })
        .catch((error) => {
            console.log(error);
            sequalizeErrorHandler.handleSequalizeError(ctx, error);
        });
}