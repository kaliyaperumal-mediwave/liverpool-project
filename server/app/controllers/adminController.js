const sequalizeErrorHandler = require('../middlewares/errorHandler');
const reponseMessages = require('../middlewares/responseMessage');
const Op = require('sequelize').Op;

exports.getReferral = ctx => {
    return new Promise(async (resolve, reject) => {
        try {
            const referralModel = ctx.orm().Referral;
            let referals = await referralModel.findAll({
                where: {
                    reference_code: {
                        [Op.ne]: null
                    },
                },
                include: [
                    {
                        model: ctx.orm().Referral,
                        nested: true,
                        as: 'parent',
                        attributes: ['id', 'uuid', 'reference_code', 'child_name', 'parent_name', 'child_dob', 'user_role', 'registerd_gp', 'createdAt']
                    },
                    {
                        model: ctx.orm().Referral,
                        nested: true,
                        as: 'professional',
                        attributes: ['id', 'uuid', 'reference_code', 'child_name', 'parent_name', 'child_dob', 'user_role', 'registerd_gp', 'createdAt']
                      },
                ],
                attributes: ['id', 'uuid', 'reference_code', 'child_name', 'parent_name', 'child_dob', 'user_role', 'registerd_gp', 'createdAt']
            });
            
            resolve(
                ctx.res.ok({
                    data: referals
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