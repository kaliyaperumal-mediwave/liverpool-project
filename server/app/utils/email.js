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
let Transport;

Transport = nodemailer.createTransport(
    nodemailerSendgrid({
        apiKey: config.sendgrid_api_key
    })
);

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
            subject: 'LIVERPOOL CAMHS - Password Reset Instructions',
            html: htmlTemplate,
        };
        Transport.sendMail(data, (err, res) => {
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
            subject: 'LIVERPOOL CAMHS - Email Reset Instructions',
            html: htmlTemplate,
        };
        Transport.sendMail(data, (err, res) => {
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
            subject: 'LIVERPOOL CAMHS - Feedback',
            html: htmlTemplate,
        };
        Transport.sendMail(data, (err, res) => {
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
        return resolve(ctx.res.internalServerError({
            data: 'Failed to sent feedback mail',
        }));
    }
});

exports.sendReferralConfirmationMail = async ctx => new Promise((resolve, reject) => {
    try {
        if (ctx.request.decryptedUser != undefined) {
            const data = {
                from: 'info@mindwaveventures.com',
                to: ctx.request.decryptedUser.email,
                subject: 'Referral Confirmation',
                html: '<p> Your referral code is <strong>' + ctx.request.body.ref_code + '</strong><p>',
            };
            Transport.sendMail(data, (err, res) => {
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
        console.log( ctx.request.body.emailToProvider)
        if(ctx.request.body.emailToProvider == "YPAS")
        {
            toAddress = config.ypas_email
        }
        else if (ctx.request.body.emailToProvider == "Venus")
        {
            toAddress = config.venus_email
        }
        else if (ctx.request.body.emailToProvider == "IAPTUS")
        {
            toAddress = config.iaptus_email
        }
        else if (ctx.request.body.emailToProvider == "Other")
        {
            toAddress = config.other_email
        }
        const template = fs.readFileSync(path.join(`${__dirname}/./templates/sendReferralTemplate.html`), 'utf8');
        let htmlTemplate = _.template(template);
        htmlTemplate = htmlTemplate({
            refCode: ctx.request.body.refCode,
        });

        return pdf.generatePdf(ctx).then((sendReferralStatus) => {
            console.log(sendReferralStatus)
            if (sendReferralStatus) {
                const data = {
                    from: config.email_from_address,
                    to: toAddress,
                    subject: 'LIVERPOOL CAMHS - Referral Details',
                    attachments: [{
                        filename: ctx.request.body.refCode,
                        content: sendReferralStatus,
                        contentType: 'application/pdf'
                    }],
                    html: htmlTemplate,
                };

                Transport.sendMail(data, (err, res) => {
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
        console.log(e);
        return sequalizeErrorHandler.handleSequalizeError(ctx, e);
    }

});
