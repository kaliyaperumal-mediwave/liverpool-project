const sequalizeErrorHandler = require('../middlewares/errorHandler');
const reponseMessages = require('../middlewares/responseMessage');
const Op = require('sequelize').Op;
const moment = require('moment');

exports.getReferral = ctx => {
    return new Promise(async (resolve, reject) => {
        try {
            const referralModel = ctx.orm().Referral;
            let referrals = await referralModel.findAll({
                where: {
                    reference_code: {
                        [Op.ne]: null
                    },
                },
                include: [
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
                ],
                attributes: ['id', 'uuid', 'reference_code', 'child_name', 'parent_name', 'professional_name', 'child_dob', 'user_role', 'registerd_gp', 'createdAt'],
                offset: ((Number(ctx.query.offset) - 1) * Number(ctx.query.limit)),
                limit: ctx.query.limit,
                order: [
                    ['createdAt', 'DESC'],
                ]
            });

            let referralsObj = [];
            let referrals_length = referrals.length;
            for (let index = 0; index < referrals_length; index++) {
                let referralObj = {
                    uuid: referrals[index].uuid,
                    name: "",
                    dob: "",
                    reference_code: referrals[index].reference_code,
                    referrer: "",
                    gp_location: "",
                    referrer_type: "",
                    date: "",
                    status: ""
                }
                if (referrals[index].user_role.toLowerCase() == 'child') {
                    referralObj.name = referrals[index].child_name;
                    referralObj.dob = moment(referrals[index].child_dob, 'YYYY-MM-DD HH:MM;SS').format('DD/MM/YYYY');
                    referralObj.referrer = referrals[index].child_name;
                    referralObj.referrer_type = 'Child';
                    referralObj.date = moment(referrals[index].createdAt, 'YYYY-MM-DD HH:MM;SS').format('DD/MM/YYYY');
                    referralObj.gp_location = (referrals[index].registerd_gp.split(',')[1][0].toUpperCase() == 'L') ? 'Liverpool' : 'Sefton';
                } else if ((referrals[index].user_role.toLowerCase() == 'parent') && referrals[index].parent && referrals[index].parent.length) {
                    referralObj.name = referrals[index].parent[0].child_name;
                    referralObj.dob = moment(referrals[index].parent[0].child_dob, 'YYYY-MM-DD HH:MM;SS').format('DD/MM/YYYY');
                    referralObj.referrer = referrals[index].parent_name;
                    referralObj.referrer_type = 'Parent';
                    referralObj.date = moment(referrals[index].createdAt, 'YYYY-MM-DD HH:MM;SS').format('DD/MM/YYYY');
                    referralObj.gp_location = (referrals[index].parent[0].registerd_gp.split(',')[1][0].toUpperCase() == 'L') ? 'Liverpool' : 'Sefton';
                } else if ((referrals[index].user_role.toLowerCase() == 'professional') && referrals[index].professional && referrals[index].professional.length) {
                    referralObj.name = referrals[index].professional[0].child_name;
                    referralObj.dob = moment(referrals[index].professional[0].child_dob, 'YYYY-MM-DD HH:MM;SS').format('DD/MM/YYYY');
                    referralObj.referrer = referrals[index].professional_name;
                    referralObj.referrer_type = 'Professional';
                    referralObj.date = moment(referrals[index].createdAt, 'YYYY-MM-DD HH:MM;SS').format('DD/MM/YYYY');
                    referralObj.gp_location = (referrals[index].professional[0].registerd_gp.split(',')[1][0].toUpperCase() == 'L') ? 'Liverpool' : 'Sefton';
                }
                referralsObj.push(referralObj);
            }

            resolve(
                ctx.res.ok({
                    data: referralsObj
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
                let status = 'archived';
                if(ctx.request.body.status == 'delete') status = 'deleted';

                await referralModel.update(
                    {
                        referral_complete_status: status
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