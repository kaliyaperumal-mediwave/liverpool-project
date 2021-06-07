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
const { parse } = require('json2csv');
const moment = require('moment');
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
        secure: false, // use TLS
        logger: true,
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
                from: config.email_from_address,
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
        if (ctx.request.body.emailToProvider == "Alder Hey - Liverpool CAMHS - EDYS") {
            toAddress = config.alder_hey_liverpol
        } else if (ctx.request.body.emailToProvider == "YPAS") {
            toAddress = config.ypas_email
        } else if (ctx.request.body.emailToProvider == "MHST Liverpool") {
            toAddress = config.liverpool_mhst_email
        } else if (ctx.request.body.emailToProvider == "Seedlings") {
            toAddress = config.seedlings_email
        } else if (ctx.request.body.emailToProvider == "Wellbeing Clinics") {
            toAddress = config.wellbeing_clinics_email
        } else if (ctx.request.body.emailToProvider == "Alder Hey - Sefton CAMHS - EDYS") {
            toAddress = config.alder_hey_sefton
        } else if (ctx.request.body.emailToProvider == "Venus") {
            toAddress = config.venus_email
        } else if (ctx.request.body.emailToProvider == "MHST Sefton") {
            toAddress = config.sefton_mhst_email
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
                console.log(ctx.request.body.referralData.section4)
                const csvHeader = ["Title", "Name"];
                const dataCsv = [
                    { //Section 1
                        "I am a": ctx.request.body.referralData.role,
                        "Interpreter needed": ctx.request.body.referralData.section1.need_interpreter,
                        "Child's D.O.B:": moment(ctx.request.body.referralData.section1.child_dob).format('DD/MM/YYYY'),
                        "Consent given": ctx.request.body.referralData.section1.consent_child,
                        "GP": ctx.request.body.referralData.section1.registered_gp,
                        //Section 2
                        "NHS number": ctx.request.body.referralData.section2.child_NHS,
                        "Title": ctx.request.body.referralData.section2.child_name_title,
                        "First name": ctx.request.body.referralData.section2.child_name,
                        "Last name": ctx.request.body.referralData.section2.child_lastname,
                        "E-mail:": ctx.request.body.referralData.section2.child_email,
                        "Contact number": ctx.request.body.referralData.section2.child_contact_number,
                        "Address": ctx.request.body.referralData.section2.child_address,
                        "Happy for post to be send": ctx.request.body.referralData.section2.can_send_post,
                        "Gender": ctx.request.body.referralData.section2.child_gender,
                        "Sex at birth": ctx.request.body.referralData.section2.sex_at_birth,
                        "Identifies with gender of birth": ctx.request.body.referralData.section2.child_gender_birth,
                        "Sexual orientation": ctx.request.body.referralData.section2.child_sexual_orientation,
                        "Ethnicity": ctx.request.body.referralData.section2.child_ethnicity,
                        "Cares for an adult": ctx.request.body.referralData.section2.child_care_adult,
                        "Parent / carer’s first name": ctx.request.body.referralData.section2.parent_name,
                        "Parent / carer’s last name:": ctx.request.body.referralData.section2.parent_lastname,
                        "Have a parental responsibility": ctx.request.body.referralData.section2.parental_responsibility,
                        "Relationship": ctx.request.body.referralData.section2.child_parent_relationship,
                        "Parent contact number": ctx.request.body.referralData.section2.parent_contact_number,
                        "Parent email address": ctx.request.body.referralData.section2.parent_email,
                        "Lives in same house": ctx.request.body.referralData.section2.parent_same_house,
                        "Parent address": ctx.request.body.referralData.section2.parent_address,
                        //Section3
                        "Education / employment": ctx.request.body.referralData.section3.child_profession,
                        "EHCP plan": ctx.request.body.referralData.section3.child_EHCP,
                        "Open to EHAT": ctx.request.body.referralData.section3.child_EHAT,
                        "Social worker": ctx.request.body.referralData.section3.child_socialworker,
                        //section4
                        "Support needs": ctx.request.body.referralData.section4.referral_type,
                        "Covid related": ctx.request.body.referralData.section4.is_covid,
                        "Main eating disorder difficultie:": ctx.request.body.referralData.section4.eating_disorder_difficulties,
                        "Food/fluid intake": ctx.request.body.referralData.section4.food_fluid_intake,
                        "Height": ctx.request.body.referralData.section4.height,
                        "Weight": ctx.request.body.referralData.section4.weight,
                        "Main reason for making referral ": ctx.request.body.referralData.section4.reason_for_referral,
                        "Info about issue:": ctx.request.body.referralData.section4.referral_issues,
                        "Has anything helped": ctx.request.body.referralData.section4.has_anything_helped,
                        "Triggers": ctx.request.body.referralData.section4.any_particular_trigger,
                        "Disabilities / difficulties": ctx.request.body.referralData.section4.disabilities,
                        //Section5
                        "Contact person": ctx.request.body.referralData.section2.contact_person,
                        "Contact through": ctx.request.body.referralData.section2.contact_preferences.toString(),
                    },
                ];
                const csv = parse(dataCsv, csvHeader);
                console.log(csv)

                const data = {
                    from: config.email_from_address,
                    to: toAddress,
                    subject: 'SAMPLE- [SECURE] Sefton & Liverpool CAMHS - Referral Details',
                    attachments: [{
                        filename: ctx.request.body.refCode + ".pdf",
                        content: sendReferralStatus,
                        contentType: 'application/pdf'
                    }, {
                        filename: ctx.request.body.refCode+".csv",
                        content: Buffer.from(csv).toString('base64'),
                    },],
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


