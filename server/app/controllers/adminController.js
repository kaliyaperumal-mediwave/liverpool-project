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
                        nested: true,
                        as: 'parent',
                        attributes: ['id', 'uuid', 'child_name', 'child_dob', 'registerd_gp']
                    },
                    {
                        model: referralModel,
                        nested: true,
                        as: 'professional',
                        attributes: ['id', 'uuid', 'child_name', 'child_dob', 'registerd_gp']
                      },
                ],
                attributes: ['id', 'uuid', 'reference_code', 'child_name', 'parent_name', 'professional_name', 'child_dob', 'user_role', 'registerd_gp', 'createdAt']
            });

            let referralsObj = [];
            let referrals_length = referrals.length;
            for(let index = 0; index < referrals_length; index++) {
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
                if(referrals[index].user_role.toLowerCase() == 'child') {
                    referralObj.name = referrals[index].child_name;
                    referralObj.dob = moment(referrals[index].child_dob, 'YYYY-MM-DD HH:MM;SS').format('DD/MM/YYYY');
                    referralObj.referrer = referrals[index].child_name;
                    referralObj.referrer_type = 'Child';
                    referralObj.date = moment(referrals[index].createdAt, 'YYYY-MM-DD HH:MM;SS').format('DD/MM/YYYY');
                    referralObj.gp_location = (referrals[index].registerd_gp.split(',')[1][0].toUpperCase() == 'L') ? 'Liverpool' : 'Sefton';
                } else if(referrals[index].user_role.toLowerCase() == 'parent') {
                    referralObj.name = referrals[index].parent[0].child_name;
                    referralObj.dob = moment(referrals[index].parent[0].child_dob, 'YYYY-MM-DD HH:MM;SS').format('DD/MM/YYYY');
                    referralObj.referrer = referrals[index].parent_name;
                    referralObj.referrer_type = 'Parent';
                    referralObj.date = moment(referrals[index].createdAt, 'YYYY-MM-DD HH:MM;SS').format('DD/MM/YYYY');
                    referralObj.gp_location = (referrals[index].parent[0].registerd_gp.split(',')[1][0].toUpperCase() == 'L') ? 'Liverpool' : 'Sefton';
                } else if(referrals[index].user_role.toLowerCase() == 'professional') {
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
        } catch(error) {
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
            const referralModel = ctx.orm().Referral;
            let referral = await referralModel.findOne({
                where: {
                    uuid: ctx.params.uuid
                },
                include: [
                    {
                        model: ctx.orm().Referral,
                        nested: true,
                        as: 'parent',
                        attributes: ['id', 'uuid']
                    },
                    {
                        model: ctx.orm().Referral,
                        nested: true,
                        as: 'professional',
                        attributes: ['id', 'uuid']
                    }
                ],
                attributes: ['id', 'uuid']
            });

            if(referral) {
                console.log(referral.dataValues);
                if(referral.dataValues.parent.length) {
                    
                }
                console.log(referral.dataValues.parent[0].dataValues);
                resolve(
                    ctx.res.ok({
                        message: 'Deleted successfully'
                    })
                );
            } else {
                resolve(
                    ctx.res.ok({
                        message: 'uuid not found'
                    })
                );
            }
        } catch(error) {
            console.log(error);
            reject(
                sequalizeErrorHandler.handleSequalizeError(ctx, error)
            );
        }
    });
}