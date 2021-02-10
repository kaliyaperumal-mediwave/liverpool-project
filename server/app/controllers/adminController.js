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

exports.deleteReferral = ctx => {
    return new Promise(async (resolve, reject) => {
        try {
            if (ctx.request.body.referral_id) {
                const referralModel = ctx.orm().Referral;
                const reasonModel = ctx.orm().Reason;
                let referrals = await referralModel.findAll({
                    where: {
                        uuid: ctx.request.body.referral_id
                    },
                    include: [
                        {
                            model: reasonModel,
                            as: 'referral_reason'
                        },
                        {
                            model: referralModel,
                            as: 'parent'
                        },
                        {
                            model: referralModel,
                            as: 'professional'
                        }
                    ]
                });
                referrals = JSON.parse(JSON.stringify(referrals));

                if (referrals && referrals.length) {
                    let referral_ids = [];
                    let reason_ids = [];
                    let referrals_length = referrals.length;
                    for (let index = 0; index < referrals_length; index++) {
                        referral_ids.push(referrals[index].id);
                        if (referrals[index].parent && referrals[index].parent.length) referral_ids.push(referrals[index].parent[0].id);
                        if (referrals[index].professional && referrals[index].professional.length) {
                            referral_ids.push(referrals[index].professional[0].id);
                            referral_ids.push(Number(referrals[index].professional[0].ChildProfessional.professionalId) + 2);
                        }
                        if (referrals[index].referral_reason && referrals[index].referral_reason.length) reason_ids.push(referrals[index].referral_reason[0].id);
                    }

                    await referralModel.destroy({
                        where: {
                            id: referral_ids
                        },
                    });
                    if (reason_ids.length) {
                        await reasonModel.destroy({
                            where: {
                                id: reason_ids
                            },
                        });
                    }
                    resolve(
                        ctx.res.ok({
                            message: reponseMessages[1015]
                        })
                    );
                } else {
                    resolve(
                        ctx.res.ok({
                            message: reponseMessages[1016]
                        })
                    );
                }
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

exports.archiveReferral = ctx => {
    return new Promise(async (resolve, reject) => {
        try {
            if (ctx.request.body.referral_id) {
                const referralModel = ctx.orm().Referral;
                let referrals = await referralModel.findAll({
                    where: {
                        uuid: ctx.request.body.referral_id
                    },
                    include: [
                        {
                            model: referralModel,
                            as: 'parent'
                        },
                        {
                            model: referralModel,
                            as: 'professional'
                        }
                    ]
                });
                referrals = JSON.parse(JSON.stringify(referrals));

                if (referrals && referrals.length) {
                    let referral_ids = [];
                    let referrals_length = referrals.length;
                    for (let index = 0; index < referrals_length; index++) {
                        referral_ids.push(referrals[index].id);
                        if (referrals[index].parent && referrals[index].parent.length) referral_ids.push(referrals[index].parent[0].id);
                        if (referrals[index].professional && referrals[index].professional.length) {
                            referral_ids.push(referrals[index].professional[0].id);
                            referral_ids.push(Number(referrals[index].professional[0].ChildProfessional.professionalId) + 2);
                        }
                    }

                    await referralModel.update(
                        {
                            archived: true
                        },
                        {
                            where: {
                                id: referral_ids
                            },
                        }
                    );
                    resolve(
                        ctx.res.ok({
                            message: reponseMessages[1001]
                        })
                    );
                } else {
                    resolve(
                        ctx.res.ok({
                            message: reponseMessages[1016]
                        })
                    );
                }
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