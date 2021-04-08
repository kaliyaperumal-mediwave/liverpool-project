const Joi = require('joi');
const { referralRegisterValidation, registerValidation, loginValidation, forgotPasswordValidation, resetPasswordValidation, resetEmailValidation, changeEmailValidation, changePasswordValidation, feedbackValidation } = require('../validation/user');
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
            
            return user.update({
                session_token: token,
                session_token_expiry: new Date(new Date().getTime() + (24 * 60 * 60 * 1000)),
            },{
                where:
                  {  email: result.email, }
              }).then((sessionResult) => {
                  //console.log("----------------------------------update session ----------------------------------------------------")
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
                sequalizeErrorHandler.handleSequalizeError(ctx, error)
            })
        }).catch((error) => {
            //console.log(error)
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
            attributes: ['uuid', 'first_name', 'last_name', 'password', 'email', 'user_role', 'service_type']
        }).then(async (userResult) => {
            if (userResult) {
                console.log(userResult);
                const checkPassword = await bcrypt.compare(ctx.request.body.password, userResult.password)
                if (checkPassword) {
                    const payload = { email: userResult.email, id: userResult.uuid, role: userResult.user_role };
                    const secret = process.env.JWT_SECRET;
                    const token = jwt.sign(payload, secret);
                    return user.update({
                        session_token: token,
                        session_token_expiry: new Date(new Date().getTime() + (24 * 60 * 60 * 1000)),
                    },{
                        where:
                          {  email: userResult.email, }
                      }).then(async (sessionResult) => {
                        //console.log("----------------------------------update session ----------------------------------------------------");
                        let sendUserResult = {
                            loginId: userResult.uuid,
                            first_name: userResult.first_name,
                            last_name: userResult.last_name,
                            email: userResult.email,
                            role: userResult.user_role,
                            token: token,
                        }
                        if(userResult.user_role === 'service_admin') {
                            sendUserResult.service_admin_type = userResult.service_type;
                        }
                        if(userResult.user_role === 'professional') {
                            const Referral = ctx.orm().Referral;
                            const prof_referral = await Referral.findOne({
                                where: {
                                    login_id: userResult.uuid,
                                    referral_complete_status: 'completed'
                                },
                                order: [
                                    ['id', 'asc']
                                ]
                            });
                            if(prof_referral) {
                                sendUserResult.prof_data = {
                                    first_name: prof_referral.professional_firstname,
                                    last_name: prof_referral.professional_lastname,
                                    email: prof_referral.professional_email ? prof_referral.professional_email : '',
                                    contact_number: prof_referral.professional_contact_number ? prof_referral.professional_contact_number : '',
                                    profession: prof_referral.professional_profession ? prof_referral.professional_profession : '',
                                    address: prof_referral.professional_address ? prof_referral.professional_address : ''
                                };
                            }
                        }
                        const sendResponseData = {
                            sendUserResult
                        }
                        return ctx.res.ok({
                            status: "success",
                            data: sendResponseData,
                        });
                    }).catch((error) => {
                        sequalizeErrorHandler.handleSequalizeError(ctx, error)
                    })
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
                                //console.log(err, "err");
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
        }).catch(error => { sequalizeErrorHandler.handleSequalizeError(ctx, error); });
    } catch (e) {
        return sequalizeErrorHandler.handleSequalizeError(ctx, e);
    }
};

exports.changeEmail = async (ctx) => {
    const { error } = changeEmailValidation(ctx.request.body);
    if (error) {
        //console.log(error, "error");
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
            //console.log(user);
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
                        }).catch(error => { sequalizeErrorHandler.handleSequalizeError(ctx, error) });
                    }
                    return ctx.res.badRequest({
                        message: reponseMessages[1002],
                    });
                }).catch(error => {  sequalizeErrorHandler.handleSequalizeError(ctx, error) });
            }
            return ctx.res.badRequest({
                message: reponseMessages[1012],
            });
        }).catch(error => { sequalizeErrorHandler.handleSequalizeError(ctx, error) });



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
                    //console.log(emailStatus, "emailStatus=====");
                    return ctx.res.ok({
                        message: reponseMessages[1008],
                    });
                }).catch(error => {  sequalizeErrorHandler.handleSequalizeError(ctx, error) });
            }
            return ctx.res.ok({
                message: reponseMessages[1013],
            });
        }).catch(error => sequalizeErrorHandler.handleSequalizeError(ctx, error));
    } catch (e) {
        return sequalizeErrorHandler.handleSequalizeError(ctx, e);
    }
};



exports.resetPassword = (ctx) => {
    const { error } = resetPasswordValidation(ctx.request.body);
    if (error) {
        //console.log("error", error);
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

                            }).catch(error => { reject(sequalizeErrorHandler.handleSequalizeError(ctx, error)) });
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
        }).catch(error => {  sequalizeErrorHandler.handleSequalizeError(ctx, error) });
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
                    }).catch(error => {  reject(sequalizeErrorHandler.handleSequalizeError(ctx, error)) });
                });
            }
            return ctx.res.badRequest({
                message: reponseMessages[1009],
            });
        }).catch(error => { sequalizeErrorHandler.handleSequalizeError(ctx, error) });
    } catch (e) {
        return sequalizeErrorHandler.handleSequalizeError(ctx, e);
    }
};

exports.logOut = (ctx) => {
    ////console.log("ctx" + ctx.request.decryptedUser.email)
    //console.log(ctx.request.decryptedUser)
    const user = ctx.orm().User;
    return user.update({
        session_token: "",
        session_token_expiry:null
    },{
        where:
          {  email: ctx.request.decryptedUser.email, }
      }).then((sessionResult) => {
        return ctx.res.ok({
            message: reponseMessages[1001],
        });
      })
}

exports.verifyPasswordToken = (ctx) => {
    try {
        const {
            User,
        } = ctx.orm();

        return User.findOne({
            where: {
                password_verification_token: ctx.request.query.token,
            },
        }).then((user) => {
            if (user) {
                if (user && (((moment()).diff(moment(user.password_verification_expiry), 'days')) < 1)) {
                    return ctx.res.ok({
                        data: {token: user.password_verification_token}
                    });
                } else {
                    return ctx.res.ok({
                        message: reponseMessages[1009]
                    });
                }
            } else {
                return ctx.res.ok({
                    message: reponseMessages[1009]
                });
            }
        }).catch(error => {  sequalizeErrorHandler.handleSequalizeError(ctx, error) });
    } catch (e) {
        return sequalizeErrorHandler.handleSequalizeError(ctx, e);
    }
};

exports.sendFeedback = (ctx) => {
    const { error } = feedbackValidation(ctx.request.body);
    if (error) {
        console.log(error);
        return ctx.body = error;
    }
    try {
        return email.sendFeedbackMail(ctx).then((feedbackEmailStatus) => {
            return ctx.res.ok({
                message: reponseMessages[1014],
            });
        }).catch(error => {
            console.log(error, "error");
            sequalizeErrorHandler.handleSequalizeError(ctx, error)
        });
    } catch (e) {
        console.log(e)
        return sequalizeErrorHandler.handleSequalizeError(ctx, e);
    }
};

exports.verifyToken = async (ctx) => {
    const authorizationHeader = ctx.request.headers.authorization;
    if (authorizationHeader) {
        const token = ctx.request.headers.authorization.split(' ')[1];
        const user = ctx.orm().User;
        try {
            let result = await jwt.verify(token, process.env.JWT_SECRET);
            ctx.request.decryptedUser = result;
            return user.findOne({
                where: {
                    email: result.email,
                },
                attributes: ['email', 'session_token','session_token_expiry']
            }).then(async (userResult) => {
                if(userResult.session_token!=null && userResult.session_token==token){
                    return ctx.res.ok({
                        message: 'Token verified successfully',
                    });
                } else {
                    return ctx.res.unauthorizedError({
                        message: 'Session Expired',
                    });
                }
            });
        } catch (err) {
            return ctx.res.unauthorizedError({
                message: 'Token decryption failed',
            });
        }
    } else {
        return ctx.res.unauthorizedError({
            message: 'Token not found',
        });
    }
};

exports.referralSignup = async (ctx) => {
    const { error } = referralRegisterValidation(ctx.request.body);
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
            
            return user.update({
                session_token: token,
                session_token_expiry: new Date(new Date().getTime() + (24 * 60 * 60 * 1000)),
            },{
                where: {  email: result.email
                }
            }).then((sessionResult) => {
                const Referral = ctx.orm().Referral;
                return Referral.update(
                    {
                        login_id: result.uuid,
                    },
                    { where: {  reference_code: ctx.request.body.reference_code }
                }).then(async (referralResult) => {
                    //console.log("----------------------------------update referral ----------------------------------------------------")
                    var sendSignupResult = {
                        data: result,
                        token: token
                    }
                    if(result.user_role === 'professional') {
                        const prof_referral = await Referral.findOne({
                            where: {
                                login_id: result.uuid,
                                referral_complete_status: 'completed'
                            },
                            order: [
                                ['id', 'asc']
                            ]
                        });
                        if(prof_referral) {
                            sendSignupResult.prof_data = {
                                first_name: prof_referral.professional_firstname,
                                last_name: prof_referral.professional_lastname,
                                email: prof_referral.professional_email ? prof_referral.professional_email : '',
                                contact_number: prof_referral.professional_contact_number ? prof_referral.professional_contact_number : '',
                                profession: prof_referral.professional_profession ? prof_referral.professional_profession : '',
                                address: prof_referral.professional_address ? prof_referral.professional_address : ''
                            };
                        }
                    }
                    return ctx.res.ok({
                        status: "success",
                        message: reponseMessages[1005],
                        data: sendSignupResult,
                    });
                }).catch((error) => {
                    sequalizeErrorHandler.handleSequalizeError(ctx, error)
                })
            }).catch((error) => {
                sequalizeErrorHandler.handleSequalizeError(ctx, error)
            })
        }).catch((error) => {
            //console.log(error)
            sequalizeErrorHandler.handleSequalizeError(ctx, error)
        });

    }
}