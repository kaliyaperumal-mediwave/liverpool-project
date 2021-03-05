const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const nodemailer = require('nodemailer');
const config = require('../config');
const nodemailerSendgrid = require('nodemailer-sendgrid');
require("dotenv").config();
const sgMail = require('@sendgrid/mail');
const logger = require('../logger');
var pdf = require('html-pdf');
sgMail.setApiKey(config.sendgrid_api_key);

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
    try {
        var pdfObj = {
            ratings: "2.5",
            comments: "test",
        }
        const template = fs.readFileSync(path.join(`${__dirname}/./templates/referralSendTemplate.html`), 'utf8');
        let htmlTemplate = _.template(template);
        htmlTemplate = htmlTemplate({
            body: pdfObj,
        });
        var opt = {
            format: 'A4',
            orientation: 'portrait',
            header: {
                "height": "5mm"
            },
            footer: {
                "height": "5mm"
            }
        };
        pdf.create(htmlTemplate, opt).toBuffer(function (err, buffer) {
//return ctx.body = buffer;
            if (buffer) {
                const data = {
                    from: config.email_from_address,
                    to: "thiru@mindwaveventures.com",
                    subject: 'LIVERPOOL CAMHS - Referral Details',
                    html: htmlTemplate,
                    attachments: [{
                        filename: `test.pdf`,
                        content: buffer,
                        contentType: 'application/pdf'
                    }]
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
        });
    } catch (e) {
        return resolve(ctx.res.internalServerError({
            data: 'Failed to sent mail',
        }));
    }
});
