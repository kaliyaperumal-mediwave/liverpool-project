const bcrypt = require('bcrypt');
const saltRounds = 10;
const sequalizeErrorHandler = require('../middlewares/errorHandler');
const reponseMessages = require('../middlewares/responseMessage');

exports.addAdminUsers = async (ctx) => {
    console.log('ctx-----------', ctx.request.decryptedUser);
    console.log('ctx-----------', ctx.request.body);

    try {

        if (ctx.request.decryptedUser.role !== 'admin') {
            return ctx.res.badRequest({
                message: reponseMessages[1018],
            });
        }

        const serviceAdminroles = [
            'Alder Hey - Liverpool CAMHS - EDYS',
            'YPAS',
            'MHST',
            'Seedlings',
            'Wellbeing Clinics',
            'Alder Hey - Sefton CAMHS - EDYS',
            'Venus',
            'Parenting 2000',
            'Other'
        ]

        const adminroles = [
            'admin',
            'service_admin'
        ]

        if (!adminroles.includes(ctx.request.body.user_role)) {
            return ctx.res.badRequest({
                message: reponseMessages[1019],
            });
        }

        if (ctx.request.body.user_role === 'service_admin' && serviceAdminroles.includes(ctx.request.body.user_role)) {
            return ctx.res.badRequest({
                message: reponseMessages[1019],
            });
        }
        const user = ctx.orm().User;

        const email = await user.findOne({
            where: {
                email: ctx.request.body.email,
            },
        });

        if (email != null) {
            return ctx.res.badRequest({
                message: reponseMessages[1003],
            });
        }

        const hashedPassword = await bcrypt.hash(ctx.request.body.password, saltRounds)
        const userEmail = (ctx.request.body.email).toLowerCase();

        let userDetails = {
            first_name: ctx.request.body.first_name,
            last_name: ctx.request.body.last_name,
            email: userEmail,
            password: hashedPassword,
            user_role: ctx.request.body.user_role,
        }

        if (ctx.request.body.user_role === 'service_admin') {
            userDetails.service_type = ctx.request.body.service_type;
        }

        const createUser = await user.create(userDetails);

        if (createUser) {
            return ctx.res.ok({
                status: "success",
                message: reponseMessages[1005],
                data: [],
            });
        } else {
            return ctx.res.badRequest({
                message: reponseMessages[1007],
            });
        }
    } catch (error) {
        sequalizeErrorHandler.handleSequalizeError(ctx, error)
    }
}
