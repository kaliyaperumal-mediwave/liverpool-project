const moment = require('moment');
const _ = require('lodash');
const sequalizeErrorHandler = require('../middlewares/errorHandler');
const reponseMessages = require('../middlewares/responseMessage');
const sequelize = require('sequelize');
const { req } = require('@kasa/koa-logging/lib/serializers');

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
            console.log('\n\nget referral queries-----------------------------------------\n', ctx.query, '\n\n');
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
                    'id', 'uuid', 'reference_code', 'child_dob', 'user_role', 'registerd_gp', 'updatedAt',
                    [sequelize.fn('CONCAT', sequelize.col('parent.child_name'), sequelize.col('professional.child_name'), sequelize.col('Referral.child_name')), 'name'],
                    [sequelize.fn('CONCAT', sequelize.col('Referral.registerd_gp'), sequelize.col('parent.registerd_gp'), sequelize.col('professional.registerd_gp')), 'gp_location'],
                    [sequelize.fn('CONCAT', sequelize.col('parent.child_dob'), sequelize.col('professional.child_dob'), sequelize.col('Referral.child_dob')), 'dob'],
                    [sequelize.fn('CONCAT', sequelize.col('Referral.child_name'), sequelize.col('Referral.professional_name'), sequelize.col('Referral.parent_name')), 'referrer_name'],
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
                        attributes: ['id', 'uuid', 'child_name', 'child_dob', 'registerd_gp',
                        ]
                    },
                    {
                        model: referralModel,
                        as: 'professional',
                        attributes: [
                            'id', 'uuid', 'child_name', 'child_dob', 'registerd_gp',
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
                    var referralObj = {
                        uuid: refObj.uuid,
                        name: refObj.name,
                        dob: refObj.dob ? moment(refObj.dob).format('DD/MM/YYYY') : '',
                        reference_code: refObj.reference_code,
                        referrer: refObj.referrer_name,
                        gp_location: '',
                        referrer_type: refObj.user_role.charAt(0).toUpperCase() + refObj.user_role.slice(1),
                        date: moment(refObj.updatedAt).format('DD/MM/YYYY')
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
                    if ((referralObj.name.toLowerCase()).includes(ctx.query.searchValue) ||
                        (referralObj.dob.toLowerCase()).includes(ctx.query.searchValue) ||
                        (referralObj.reference_code.toLowerCase()).includes(ctx.query.searchValue) ||
                        (referralObj.referrer.toLowerCase()).includes(ctx.query.searchValue) ||
                        (referralObj.gp_location.toLowerCase()).includes(ctx.query.searchValue) ||
                        (referralObj.referrer_type.toLowerCase()).includes(ctx.query.searchValue) ||
                        (referralObj.date.toLowerCase()).includes(ctx.query.searchValue)
                    ) {
                        filter_referrals.push(referralObj);
                    }
                });
                filteredReferrals = filter_referrals.length;
                referrals = filter_referrals;
                // without search
            } else {
                _.forEach(referrals, function (refObj, index) {
                    var referralObj = {
                        uuid: refObj.uuid,
                        name: refObj.name,
                        dob: refObj.dob ? moment(refObj.dob).format('DD/MM/YYYY') : '',
                        reference_code: refObj.reference_code,
                        referrer: refObj.referrer_name,
                        gp_location: '',
                        referrer_type: refObj.user_role.charAt(0).toUpperCase() + refObj.user_role.slice(1),
                        date: moment(refObj.updatedAt).format('DD/MM/YYYY')
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
                    referrals[index] = referralObj;
                });
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
            console.log(error);
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
            console.log(error);
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
        console.log(result);
        return ctx.body = result
    }).catch((error) => {
        sequalizeErrorHandler.handleSequalizeError(ctx, error)
    });
}