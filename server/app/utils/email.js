const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const nodemailer = require('nodemailer');
const config = require('../config');
const nodemailerSendgrid = require('nodemailer-sendgrid');
require("dotenv").config();
const sgMail = require('@sendgrid/mail');
const logger = require('../logger');
const pdf = require('../utils/pdfgenerate');
sgMail.setApiKey(config.sendgrid_api_key);
const reponseMessages = require('../middlewares/responseMessage');
let mailService;
// Sendgrid disabled on SMTP requirement
if (process.env.USE_SENDGRID == 'true') {
    console.log('Sendgrid is active for mails.');
    mailService = nodemailer.createTransport(
        nodemailerSendgrid({
            apiKey: process.env.SENDGRID_API_KEY
        })
    );
} else {
    console.log('SMTP is active for mails.');
    mailService = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: process.env.EMAIL_SECURE, // use TLS
        ignoreTLS: true,
        auth: {
            user: process.env.EMAIL_AUTH_USERNAME,
            pass: process.env.EMAIL_AUTH_PASSWORD
        }
    });
}

exports.sendForgotPasswordMail = async ctx => new Promise((resolve, reject) => {
    try {
        const template = fs.readFileSync(path.join(`${__dirname}/./templates/forgotpassword.html`), 'utf8');
        let htmlTemplate = _.template(template);
        htmlTemplate = htmlTemplate({
            link: `${ctx.request.headers.domain_url}/users/resetpassword?token=${ctx.request.body.password_verification_token}`,
        });
        const data = {
            from: config.email_from_address,
            to: ctx.request.body.email,
            subject: 'Sefton & Liverpool CAMHS - Password Reset Instructions',
            html: htmlTemplate,
        };
        mailService.sendMail(data, (err, res) => {
            if (!err && res) {
                logger.info(res);
                ctx.res.ok({
                    message: 'Mail successfully sent',
                });
                resolve();
            } else {
                ctx.res.internalServerError({
                    message: 'Failed to sent mail',
                });
                reject();
            }
        });
    } catch (e) {
        return resolve(ctx.res.internalServerError({
            data: 'Failed to sent mail',
        }));
    }
});

exports.sendChangeMail = async ctx => new Promise((resolve, reject) => {
    try {
        const template = fs.readFileSync(path.join(`${__dirname}/./templates/changeemail.html`), 'utf8');
        let htmlTemplate = _.template(template);
        htmlTemplate = htmlTemplate({
            link: `${ctx.request.headers.domain_url}/account/confirmation_email?token=${ctx.request.body.email_verification_token}`,
        });
        const data = {
            from: config.email_from_address,
            to: ctx.request.body.email,
            subject: 'Sefton & Liverpool CAMHS - Email Reset Instructions',
            html: htmlTemplate,
        };
        mailService.sendMail(data, (err, res) => {
            if (!err && res) {
                logger.info(res);
                ctx.res.ok({
                    message: 'Mail successfully sent',
                });
                resolve();
            } else {
                ctx.res.internalServerError({
                    message: 'Failed to sent mail',
                });
                reject();
            }
        });
    } catch (e) {
        return resolve(ctx.res.internalServerError({
            data: 'forgot mail not sent',
        }));
    }
});

exports.sendFeedbackMail = async ctx => new Promise((resolve, reject) => {
    try {
        const template = fs.readFileSync(path.join(`${__dirname}/./templates/feedback.html`), 'utf8');
        let htmlTemplate = _.template(template);
        htmlTemplate = htmlTemplate({
            ratings: ctx.request.body.ratings,
            comments: ctx.request.body.comments,
        });
        var to_email = [];
        if (config.email_to_address) to_email = config.email_to_address.split(',');
        const data = {
            from: config.email_from_address,
            to: to_email,
            subject: 'Sefton & Liverpool CAMHS - Feedback',
            html: htmlTemplate,
        };
        mailService.sendMail(data, (err, res) => {
            if (!err && res) {
                logger.info(res);
                ctx.res.ok({
                    message: 'Feedback mail successfully sent',
                });
                resolve();
            } else {
                ctx.res.internalServerError({
                    message: 'Failed to sent feedback mail',
                });
                reject();
            }
        });
    } catch (e) {
        console.log(e)
        return resolve(ctx.res.internalServerError({
            data: 'Failed to sent feedback mail',
        }));
    }
});

exports.sendReferralConfirmationMail = async ctx => new Promise((resolve, reject) => {
    try {
        if (ctx.request.decryptedUser != undefined) {
            const data = {
                from:  config.email_from_address,
                to: ctx.request.decryptedUser.email,
                subject: 'Referral Confirmation',
                html: '<p> Your referral code is <strong>' + ctx.request.body.ref_code + '</strong><p>',
            };
            mailService.sendMail(data, (err, res) => {
                if (!err && res) {
                    logger.info(res);
                    ctx.res.ok({
                        data: { sendUserResult: ctx.request.body.ref_code }
                    });
                    resolve();
                } else {
                    ctx.res.internalServerError({
                        message: 'Failed to sent mail',
                    });
                    reject();
                }
            });
        } else {
            ctx.res.ok({
                data: { sendUserResult: ctx.request.body.ref_code }
            });
            resolve();
        }
    } catch (e) {
        return resolve(ctx.res.internalServerError({
            data: 'Failed to sent mail',
        }));
    }
});

exports.sendReferralWithData = async ctx => new Promise((resolve, reject) => {
    var toAddress;
    try {
        if (ctx.request.body.emailToProvider == "YPAS") {
            toAddress = config.ypas_email
        } else if (ctx.request.body.emailToProvider == "Venus") {
            toAddress = config.venus_email
        } else if (ctx.request.body.emailToProvider == "MHST") {
            toAddress = config.mhst_email
        } else if (ctx.request.body.emailToProvider == "Alder Hey - Liverpool CAMHS - EDYS" || ctx.request.body.emailToProvider == "Alder Hey - Sefton CAMHS - EDYS") {
            toAddress = config.alder_hey_email
        } else if (ctx.request.body.emailToProvider == "Parenting 2000") {
            toAddress = config.parenting_email
        } else if (ctx.request.body.emailToProvider == "IAPTUS") {
            toAddress = config.iaptus_email
        }
         else {
            toAddress = config.other_email
        }
        console.log('toAddress----------', toAddress);
        const template = fs.readFileSync(path.join(`${__dirname}/./templates/sendReferralTemplate.html`), 'utf8');
        let htmlTemplate = _.template(template);
        htmlTemplate = htmlTemplate({
            refCode: ctx.request.body.refCode,
        });
        return pdf.generatePdf(ctx).then((sendReferralStatus) => {
            if (sendReferralStatus) {
                const data = {
                    from: config.email_from_address,
                    to: toAddress,
                    subject: '[SECURE] Sefton & Liverpool CAMHS - Referral Details',
                    attachments: [{
                        filename: ctx.request.body.refCode + ".pdf",
                        content: sendReferralStatus,
                        contentType: 'application/pdf'
                    }],
                    html: htmlTemplate,
                };

                mailService.sendMail(data, (err, res) => {

                    if (!err && res) {
                        ctx.res.ok({
                            data: 'mail Successfully sent',
                        });
                        resolve();
                    } else {
                        logger.error('Mail error', err);
                        ctx.res.internalServerError({
                            data: 'mail not sent',
                        });
                        reject();
                    }
                });
            }

        }).catch(error => {
            console.log(error);
            sequalizeErrorHandler.handleSequalizeError(ctx, error)
        });
    } catch (e) {
        return sequalizeErrorHandler.handleSequalizeError(ctx, e);
    }

});


