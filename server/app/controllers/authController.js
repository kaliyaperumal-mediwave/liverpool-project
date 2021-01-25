const Joi = require('joi');
const { registerValidation, loginValidation, forgotPasswordValidation, resetPasswordValidation, resetEmailValidation, changeEmailValidation, changePasswordValidation } = require('../validation/user');
const sequalizeErrorHandler = require('../middlewares/errorHandler');
const email = require('../utils/email');
var moment = require("moment");
const reponseMessages = require('../middlewares/responseMessage');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const Op = require('sequelize').Op;
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
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
        const userEmail = (ctx.request.body.email).toLowerCase();
        return user.create({
            first_name: ctx.request.body.first_name,
            last_name: ctx.request.body.last_name,
            email: userEmail,
            password: hashedPassword,
            user_role: ctx.request.body.role,
        }).then((result) => {
            const payload = { email: result.email, id: result.uuid, role: result.user_role };
            const secret = process.env.JWT_SECRET;
            const token = jwt.sign(payload, secret);
            const sendSignupResult = {
                data: result,
                token: token
            }
            return ctx.res.ok({
                status: "success",
                message: reponseMessages[1005],
                data: sendSignupResult,
            });
        }).catch((error) => {
            console.log(error)
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
        const userEmail = (ctx.request.body.email).toLowerCase();
        return user.findOne({
            where: {
                email: userEmail,
            },
            attributes: ['uuid', 'first_name', 'last_name', 'password', 'email', 'user_role']
        }).then(async (userResult) => {
            if (userResult) {
                const checkPassword = await bcrypt.compare(ctx.request.body.password, userResult.password)
                if (checkPassword) {
                    const payload = { email: userResult.email, id: userResult.uuid, role: userResult.user_role };
                    const secret = process.env.JWT_SECRET;
                    const token = jwt.sign(payload, secret);
                    const sendUserResult = {
                        loginId: userResult.uuid,
                        first_name: userResult.first_name,
                        last_name: userResult.last_name,
                        email: userResult.email,
                        role: userResult.user_role,
                        token: token

                    }

                    const sendResponseData = {
                        sendUserResult: sendUserResult,
                    }
                    return ctx.res.ok({
                        status: "success",
                        data: sendResponseData,
                    });
                }
                else {
                    return ctx.res.badRequest({
                        message: reponseMessages[1004],
                    });
                }
            }
            else {
                return ctx.res.badRequest({
                    message: reponseMessages[1006],
                });
            }

        }).catch((error) => {
            sequalizeErrorHandler.handleSequalizeError(ctx, error)
        });
    }

}

exports.changePassword = async (ctx) => {
    const { error } = changePasswordValidation(ctx.request.body);
    if (error) {
        return ctx.body = error;
    }
    try {
        const {
            User,
        } = ctx.orm();
        return User.findOne({
            where: {
                uuid: ctx.request.decryptedUser.id,
            },
            attributes: ['password', 'id'],
        }).then((user) => {
            if (user) {
                return new Promise((resolve, reject) => {
                    bcrypt.compare(ctx.request.body.oldPassword, user.password).then(async (res, err) => {
                        if (res) {
                            await bcrypt.hash(ctx.request.body.newPassword, saltRounds).then((hash) => {
                                if (!hash) {
                                    return reject(ctx.res.unauthorizedError({
                                        message: reponseMessages[1007],
                                    }));
                                }
                                ctx.request.body.newPassword = hash;
                                user.update({
                                    password: ctx.request.body.newPassword,
                                });
                                return resolve(ctx.res.ok({
                                    message: reponseMessages[1001],
                                }));
                            }).catch((err) => {
                                console.log(err, "err");
                                reject(ctx.res.unauthorizedError({
                                    message: reponseMessages[1007],
                                }))
                            });
                        } else {
                            return resolve(ctx.res.badRequest({
                                message: reponseMessages[1011],
                            }));
                        }
                        return ctx;
                    }).catch(() => reject(ctx.res.badRequest({
                        message: reponseMessages[1007],
                    })));
                });
            }
            return ctx.res.unauthorizedError({
                message: reponseMessages[1007],
            });
        }).catch(error => { sequalizeErrorHandler.handleSequalizeError(ctx, error); console.log(error, "errorghj") });
    } catch (e) {
        return sequalizeErrorHandler.handleSequalizeError(ctx, e);
    }
};

exports.changeEmail = async (ctx) => {
    const { error } = changeEmailValidation(ctx.request.body);
    if (error) {
        console.log(error, "error");
        return ctx.body = error;
    }

    try {
        const {
            User,
        } = ctx.orm();
        return User.findOne({
            where: {
                email: ctx.request.body.newEmail,
            }
        }).then((user) => {
            console.log(user);
            if (!user) {
                return User.findOne({
                    where: {
                        email: ctx.request.decryptedUser.email,
                    },
                }).then((user) => {
                    if (user) {
                        const token = Math.floor(Math.random() * 90000) + 10000;
                        return user.update({
                            secondary_email: ctx.request.body.newEmail,
                            email_verification_token: token,
                            email_verification_expiry: new Date(new Date().getTime() + (24 * 60 * 60 * 1000)),
                        }).then(async () => {
                            ctx.request.body.email_verification_token = token;
                            ctx.request.body.email = ctx.request.decryptedUser.email;
                            let emailStatus = await email.sendChangeMail(ctx);
                        }).catch(error => { console.log(error, "error"); sequalizeErrorHandler.handleSequalizeError(ctx, error) });
                    }
                    return ctx.res.badRequest({
                        message: reponseMessages[1002],
                    });
                }).catch(error => { console.log(error, "error"); sequalizeErrorHandler.handleSequalizeError(ctx, error) });
            }
            return ctx.res.badRequest({
                message: reponseMessages[1012],
            });
        }).catch(error => { console.log(error, "error"); sequalizeErrorHandler.handleSequalizeError(ctx, error) });



    } catch (e) {
        return sequalizeErrorHandler.handleSequalizeError(ctx, e);
    }
};

exports.forgotPassword = async (ctx) => {
    const { error } = forgotPasswordValidation(ctx.request.body);
    if (error) {
        return ctx.body = error;
    }
    try {
        const {
            User,
        } = ctx.orm();
        return User.findOne({
            where: {
                email: ctx.request.body.email,
            },
        }).then((user) => {
            if (user) {
                const token = Math.floor(Math.random() * 90000) + 10000;
                return user.update({
                    password_verification_token: token,
                    password_verification_expiry: new Date(new Date().getTime() + (24 * 60 * 60 * 1000)),
                }).then(async () => {
                    ctx.request.body.password_verification_token = token;
                    let emailStatus = await email.sendForgotPasswordMail(ctx);
                    console.log(emailStatus, "emailStatus=====");
                    return ctx.res.ok({
                        message: reponseMessages[1008],
                    });
                }).catch(error => { console.log(error, "errorerror"); sequalizeErrorHandler.handleSequalizeError(ctx, error) });
            }
            return ctx.res.ok({
                message: reponseMessages[1008],
            });
        }).catch(error => sequalizeErrorHandler.handleSequalizeError(ctx, error));
    } catch (e) {
        return sequalizeErrorHandler.handleSequalizeError(ctx, e);
    }
};



exports.resetPassword = (ctx) => {
    const { error } = resetPasswordValidation(ctx.request.body);
    if (error) {
        console.log("error", error);
        return ctx.body = error;
    }
    try {
        const {
            User,
        } = ctx.orm();

        return User.findOne({
            where: {
                password_verification_token: ctx.request.body.token,
            },
        }).then((user) => {
            if (user) {
                return new Promise((resolve, reject) => {
                    if (user && (((moment()).diff(moment(user.password_verification_expiry), 'days')) < 1)) {
                        bcrypt.hash(ctx.request.body.new_password, saltRounds).then((hash) => {
                            if (!hash) {
                                ctx.res.serverError({
                                    message: reponseMessages[1002],
                                });
                                resolve();
                            }
                            ctx.request.body.password = hash;
                            ctx.request.body.password_verification_token = null;

                            ctx.request.body.password_verification_expiry = null;
                            delete ctx.request.body.new_password;
                            delete ctx.request.body.confirm_password;

                            user.update(ctx.request.body).then((users) => {
                                resolve(ctx.res.ok({
                                    message: reponseMessages[1010],
                                }));

                            }).catch(error => { console.log(error, "errorerror"); reject(sequalizeErrorHandler.handleSequalizeError(ctx, error)) });
                        });
                    } else {
                        resolve(ctx.res.ok({
                            message: reponseMessages[1009],
                        }));
                    }
                });
            }
            return ctx.res.badRequest({
                message: reponseMessages[1028],
            });
        }).catch(error => { console.log(error, "error"); sequalizeErrorHandler.handleSequalizeError(ctx, error) });
    } catch (e) {
        return sequalizeErrorHandler.handleSequalizeError(ctx, e);
    }
};

exports.resetEmail = (ctx) => {
    const { error } = resetEmailValidation(ctx.request.body);
    if (error) {
        return ctx.body = error;
    }

    try {
        const {
            User,
        } = ctx.orm();

        return User.findOne({
            where: {
                email_verification_token: ctx.request.body.token,
            },
        }).then((user) => {
            if (user && (((moment()).diff(moment(user.email_verification_expiry), 'days')) < 1)) {

                return new Promise((resolve, reject) => {
                    ctx.request.body.email = user.secondary_email;
                    ctx.request.body.secondary_email = null;
                    ctx.request.body.email_verification_token = null;
                    ctx.request.body.email_verification_expiry = null;

                    user.update(ctx.request.body).then((users) => {
                        resolve(ctx.res.ok({
                            message: reponseMessages[1001],
                        }));
                    }).catch(error => { console.log(error, "error"); reject(sequalizeErrorHandler.handleSequalizeError(ctx, error)) });
                });
            }
            return ctx.res.badRequest({
                message: reponseMessages[1009],
            });
        }).catch(error => { console.log(error, "error"); sequalizeErrorHandler.handleSequalizeError(ctx, error) });
    } catch (e) {
        return sequalizeErrorHandler.handleSequalizeError(ctx, e);
    }
};