const Joi = require('joi');
const { registerValidation } = require('../validation/user');
const { loginValidation } = require('../validation/user');
const sequalizeErrorHandler = require('../middlewares/errorHandler');
const reponseMessages = require('../middlewares/responseMessage');
const bcrypt = require('bcrypt');
const saltRounds = 10;

exports.signup = async (ctx) => {
    var responseData = {}
    const { error } = registerValidation(ctx.request.body);
    if (error) {
        return ctx.res.badRequest({
            message: error.details[0].message,
          });
    } else {
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
        return user.create({
            first_name: ctx.request.body.first_name,
            last_name: ctx.request.body.last_name,
            email: ctx.request.body.email,
            password: hashedPassword
        }).then((result) => {
            return ctx.res.ok({
                status: "success",
                message: reponseMessages[1005],
              });
        }).catch((error) => {
            sequalizeErrorHandler.handleSequalizeError(ctx, error)
        });

    }
}
exports.login = async (ctx) => {
    const { error } = loginValidation(ctx.request.body);
    if (error) {
        return ctx.body = error;
    } else {
        const user = ctx.orm().User;
        return user.findOne({
            where: {
                email: ctx.request.body.email,
            },
            attributes: ['uuid', 'first_name', 'last_name','password','email']
        }).then( async (userResult) => {
         if(userResult)
         {
            const checkPassword = await bcrypt.compare(ctx.request.body.password,userResult.password)
            console.log("checkPassword",checkPassword)
            if(checkPassword)
            {
                const sendUserResult={
                    loginId:userResult.uuid,
                    first_name:userResult.first_name,
                    last_name:userResult.last_name,
                    email:userResult.email
                }
                const sendReferralResult={
                    loginId:userResult.uuid,
                    first_name:userResult.first_name,
                    last_name:userResult.last_name,
                    email:userResult.email
                }
                const sendResponseData={
                    sendUserResult:sendUserResult,
                    sendReferralResult:sendReferralResult
                }
                return ctx.res.ok({
                    status: "success",
                    data:sendResponseData,
                  });
            }
            else
            {
               return ctx.res.badRequest({
                   message: reponseMessages[1004],
               });
            }  
         }
         else
         {
            return ctx.res.badRequest({
                message: reponseMessages[1004],
            });
         }  

        }).catch((error) => {
            sequalizeErrorHandler.handleSequalizeError(ctx, error)
        });
    }

}

