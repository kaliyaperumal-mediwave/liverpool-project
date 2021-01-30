const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const nodemailer = require('nodemailer');
const config = require('../config');
const nodemailerSendgrid = require('nodemailer-sendgrid');
require("dotenv").config();
const sgMail = require('@sendgrid/mail');
const logger = require('../logger');

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
                    message: 'Mail Successfully sent',
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
                    message: 'mail Successfully sent',
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