const moment = require('moment');
const _ = require('lodash');
const sequalizeErrorHandler = require('../middlewares/errorHandler');
const reponseMessages = require('../middlewares/responseMessage');
const sequelize = require('sequelize');
const { req } = require('@kasa/koa-logging/lib/serializers');

const gpCodes = [
    {
        type: 'Liverpool',
        code: ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8', 'L9', 'L10', 'L11', 'L12', 'L13', 'L14', 'L15',
            'L16', 'L17', 'L18', 'L19', 'L24', 'L25', 'L26', 'L27', 'L28', 'L32', 'L33', 'L34', 'L35', 'L36', 'PR8', 'PR9']
    },
    { type: 'Sefton', code: ['L20', 'L21', 'L22', 'L23', 'L29', 'L30', 'L31', 'L37', 'L38'] },
]

exports.getReferral = ctx => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log('\n\nget referral queries-----------------------------------------\n', ctx.query, '\n\n');
            const referralModel = ctx.orm().Referral;

            // get total number of referrals
            const totalReferrals = await referralModel.count({
                where: {
                    reference_code: {
                        [sequelize.Op.ne]: null
                    },
                    referral_complete_status: 'completed'
                }
            });
            var filteredReferrals = totalReferrals;

            // condition
            var query = {
                reference_code: {
                    [sequelize.Op.ne]: null
                },
                referral_complete_status: 'completed',
            };

            // reference
            var include = [
                {
                    model: referralModel,
                    as: 'parent',
                    attributes: ['id', 'uuid', 'child_name', 'child_dob', 'registerd_gp']
                },
                {
                    model: referralModel,
                    as: 'professional',
                    attributes: ['id', 'uuid', 'child_name', 'child_dob', 'registerd_gp']
                },
            ];

            if (ctx.query.searchValue) {
                query = {
                    reference_code: {
                        [sequelize.Op.ne]: null
                    },
                    referral_complete_status: 'completed',
                    [sequelize.Op.or]: [
                        {
                            reference_code: {
                                [sequelize.Op.like]: '%' + ctx.query.searchValue + '%'
                            }
                        },
                        {
                            child_name: {
                                [sequelize.Op.like]: '%' + ctx.query.searchValue + '%'
                            }
                        },
                        {
                            parent_name: {
                                [sequelize.Op.like]: '%' + ctx.query.searchValue + '%'
                            }
                        },
                        {
                            professional_name: {
                                [sequelize.Op.like]: '%' + ctx.query.searchValue + '%'
                            }
                        }
                    ]
                }

                // get total number of filtered referrals
                filteredReferrals = await referralModel.count({ where: query });
            }

            // order by
            var order = [
                ["updatedAt", 'DESC']
            ];
            if (ctx.query && ctx.query.orderBy) {
                if (ctx.query.orderBy == '3') order = [['reference_code', ctx.query.orderType.toUpperCase()]];
                else if (ctx.query.orderBy == '6') order = [['user_role', ctx.query.orderType.toUpperCase()]];
                // else if(ctx.query.orderBy == '4') order = [['referrer_name', ctx.query.orderType.toUpperCase()]];
                else if (ctx.query.orderBy == '7') order = [['updatedAt', ctx.query.orderType.toUpperCase()]];
            }

            // get referrals as per the pagination
            var referrals = await referralModel.findAll({
                where: query,
                include: include,
                offset: ((Number(ctx.query.offset) - 1) * Number(ctx.query.limit)),
                limit: ctx.query.limit,
                attributes: [
                    'id', 'uuid', 'reference_code', 'child_name', 'parent_name', 'professional_name', 'child_dob', 'user_role', 'registerd_gp', 'updatedAt',
                    // [sequelize.literal(`CASE WHEN child_name IS NOT NULL THEN child_name WHEN parent_name IS NOT NULL THEN parent_name WHEN professional_name IS NOT NULL THEN professional_name END`), 'referrer_name'],
                ],
                order: order
            });

            referrals = JSON.parse(JSON.stringify(referrals));
            _.forEach(referrals, function (refObj, index) {
                var referralObj = {
                    uuid: refObj.uuid,
                    name: '',
                    dob: '',
                    reference_code: refObj.reference_code,
                    referrer: '',
                    gp_location: '',
                    referrer_type: refObj.user_role.charAt(0).toUpperCase() + refObj.user_role.slice(1),
                    date: moment(refObj.updatedAt).format('DD/MM/YYYY')
                }
                var gp_location = '';
                if (refObj.user_role.toLowerCase() == 'child') {
                    referralObj.name = refObj.child_name;
                    referralObj.dob = moment(refObj.child_dob).format('DD/MM/YYYY');
                    referralObj.referrer = refObj.child_name;
                    gp_location = refObj.registerd_gp;
                } else if ((refObj.user_role.toLowerCase() == 'parent') && refObj.parent && refObj.parent.length) {
                    referralObj.name = refObj.parent[0].child_name;
                    referralObj.dob = moment(refObj.parent[0].child_dob).format('DD/MM/YYYY');
                    referralObj.referrer = refObj.parent_name;
                    gp_location = refObj.parent[0].registerd_gp;
                } else if ((refObj.user_role.toLowerCase() == 'professional') && refObj.professional && refObj.professional.length) {
                    referralObj.name = refObj.professional[0].child_name;
                    referralObj.dob = moment(refObj.professional[0].child_dob).format('DD/MM/YYYY');
                    referralObj.referrer = refObj.professional_name;
                    gp_location = refObj.professional[0].registerd_gp;
                }
                if (gp_location) {
                    var splitLocation = gp_location.split(',');
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