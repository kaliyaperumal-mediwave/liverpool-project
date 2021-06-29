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
        return pdf.generatePdf(ctx).then((sendReferralStatus) => {
            if (sendReferralStatus) {
                try {

                    const data = attachMailData(sendReferralStatus, ctx, toAddress);
                    mailService.sendMail(data, (err, res) => {

                        if (!err && res) {
                            ctx.res.ok({
                                message: 'mail Successfully sent',
                            });
                            resolve();
                        } else {
                            console.log(err)
                            logger.error('Mail error', err);
                            ctx.res.internalServerError({
                                message: 'mail not sent',
                            });
                            reject();
                        }
                    });
                } catch (error) {
                    return resolve(ctx.res.internalServerError({
                        message: 'Failed to sent mail',
                    }));
                }
            }

        }).catch(error => {
            sequalizeErrorHandler.handleSequalizeError(ctx, error)
        });
    } catch (e) {
        return sequalizeErrorHandler.handleSequalizeError(ctx, e);
    }

});


function attachMailData(pdfReferral, ctx, toAddress) {
    const template = fs.readFileSync(path.join(`${__dirname}/./templates/sendReferralTemplate.html`), 'utf8');
    let htmlTemplate = _.template(template);
    htmlTemplate = htmlTemplate({
        refCode: ctx.request.body.refCode,
    });
    var attachmentFiles = {};
    try {

        if (ctx.request.body.emailToProvider == "Alder Hey - Liverpool CAMHS - EDYS" || ctx.request.body.emailToProvider == "Alder Hey - Sefton CAMHS - EDYS") {
            //Attach pdf and csv for alderhey admins
            const csvHeader = ["Title", "Name"];
            const dataCsv = samplecsv(ctx);
            const csv = parse(dataCsv, csvHeader);
            attachmentFiles = {
                from: config.email_from_address,
                to: toAddress,
                subject: '[SECURE] Sefton & Liverpool CAMHS - Referral Details',
                attachments: [{
                    filename: ctx.request.body.refCode + ".pdf",
                    content: pdfReferral,
                    contentType: 'application/pdf'
                },
                {
                    filename: ctx.request.body.refCode + ".csv",
                    content: Buffer.from(csv).toString('base64'),
                },
                ],
                html: htmlTemplate,
            };
        }
        else {
            //Attach only pdf for other service admins
            attachmentFiles = {
                from: config.email_from_address,
                to: toAddress,
                subject: '[SECURE] Sefton & Liverpool CAMHS - Referral Details',
                attachments: [{
                    filename: ctx.request.body.refCode + ".pdf",
                    content: pdfReferral,
                    contentType: 'application/pdf'
                },],
                html: htmlTemplate,
            };
        }

        return attachmentFiles;

    } catch (error) {
        console.log(error)
    }
}


function getCSVData(ctx) {
    var csvData
    if (ctx.request.body.referralData.role == "Parent" || ctx.request.body.referralData.role == "parent") {
        var householdMembers = [];
        for (let index = 0; index < ctx.request.body.referralData.section2.household_member.length; index++) {
            var name = ctx.request.body.referralData.section2.household_member[index].name;
            var lastName = ctx.request.body.referralData.section2.household_member[index].lastName
            var fullName = name + " " + lastName
            householdMembers.push(fullName);
        }
        csvData = [
            { //Section 1
                "I am a": ctx.request.body.referralData.role,
                "Interpreter needed": ctx.request.body.referralData.section1.need_interpreter,
                "Child's D.O.B:": moment(ctx.request.body.referralData.section1.child_dob).format('DD/MM/YYYY'),
                "Consent given": ctx.request.body.referralData.section1.consent_child,
                "GP": ctx.request.body.referralData.section1.registered_gp,
                "Child school": ctx.request.body.referralData.section1.gp_school ? ctx.request.body.referralData.section1.gp_school : "-",
                //Section 2
                "NHS number": ctx.request.body.referralData.section2.child_NHS ? ctx.request.body.referralData.section2.child_NHS : "-",
                "Title": ctx.request.body.referralData.section2.child_name_title,
                "First name": ctx.request.body.referralData.section2.child_name,
                "Last name": ctx.request.body.referralData.section2.child_lastname,
                "E-mail:": ctx.request.body.referralData.section2.child_email ? ctx.request.body.referralData.section2.child_email : "-",
                "Contact type": ctx.request.body.referralData.section2.child_contact_type,
                "Contact number": ctx.request.body.referralData.section2.child_contact_number,
                "Address": ctx.request.body.referralData.section2.child_address,
                "Happy for post to be send": ctx.request.body.referralData.section2.can_send_post,
                "Gender": ctx.request.body.referralData.section2.child_gender,
                "Sex at birth": ctx.request.body.referralData.section2.sex_at_birth,
                "Identifies with gender of birth": ctx.request.body.referralData.section2.child_gender_birth,
                "Sexual orientation": ctx.request.body.referralData.section2.child_sexual_orientation ? ctx.request.body.referralData.section2.child_sexual_orientation : "-",
                "Ethnicity": ctx.request.body.referralData.section2.child_ethnicity ? ctx.request.body.referralData.section2.child_ethnicity : "-",
                "Cares for an adult": ctx.request.body.referralData.section2.child_care_adult,

                "Household member": checkArray(householdMembers),
                "Parent / carer’s first name": ctx.request.body.referralData.section2.parent_name,
                "Parent / carer’s last name:": ctx.request.body.referralData.section2.parent_lastname,
                "Have a parental responsibility": ctx.request.body.referralData.section2.parental_responsibility,
                "Relationship": ctx.request.body.referralData.section2.child_parent_relationship,
                "Parent contact type": ctx.request.body.referralData.section2.parent_contact_type,
                "Parent contact number": ctx.request.body.referralData.section2.parent_contact_number,
                "Parent email address": ctx.request.body.referralData.section2.parent_email ? ctx.request.body.referralData.section2.parent_email : "-",
                "Lives in same house": ctx.request.body.referralData.section2.parent_same_house,
                "Parent address": ctx.request.body.referralData.section2.parent_address ? ctx.request.body.referralData.section2.parent_address : "-",
                //Section3
                "Education / employment": ctx.request.body.referralData.section3.child_profession,
                "School/college": ctx.request.body.referralData.section3.child_education_place ? ctx.request.body.referralData.section3.child_education_place : "-",
                "EHCP plan": ctx.request.body.referralData.section3.child_EHCP,
                "Open to EHAT": ctx.request.body.referralData.section3.child_EHAT,
                "Social worker": ctx.request.body.referralData.section3.child_socialworker,
                "Social worker first name": ctx.request.body.referralData.section3.child_socialworker_firstname ? ctx.request.body.referralData.section3.child_socialworker_firstname : "-",
                "Social worker last name": ctx.request.body.referralData.section3.child_socialworker_lastname ? ctx.request.body.referralData.section3.child_socialworker_lastname : "-",
                "Social worker contact type": ctx.request.body.referralData.section3.child_socialworker_contact_type ? ctx.request.body.referralData.section3.child_socialworker_contact_type : "-",
                "Social worker contact number": ctx.request.body.referralData.section3.child_socialworker_contact ? ctx.request.body.referralData.section3.child_socialworker_contact : "-",
                //section4
                "Support needs": ctx.request.body.referralData.section4.referral_type,
                "Covid related": ctx.request.body.referralData.section4.is_covid,
                "Main eating disorder difficult:": checkArray(ctx.request.body.referralData.section4.eating_disorder_difficulties),
                "Food/fluid intake": ctx.request.body.referralData.section4.food_fluid_intake ? ctx.request.body.referralData.section4.food_fluid_intake : "-",
                "Height": ctx.request.body.referralData.section4.height ? ctx.request.body.referralData.section4.height : "-",
                "Weight": ctx.request.body.referralData.section4.weight ? ctx.request.body.referralData.section4.weight : "-",
                "Main reason for making referral ": ctx.request.body.referralData.section4.reason_for_referral ? ctx.request.body.referralData.section4.reason_for_referral.toString() : "-",
                "Info about issue:": ctx.request.body.referralData.section4.referral_issues ? ctx.request.body.referralData.section4.referral_issues.toString() : "-",
                "Has anything helped": ctx.request.body.referralData.section4.has_anything_helped ? ctx.request.body.referralData.section4.has_anything_helped : "-",
                "Triggers": ctx.request.body.referralData.section4.any_particular_trigger ? ctx.request.body.referralData.section4.any_particular_trigger : "-",
                "Disabilities / difficulties": ctx.request.body.referralData.section4.disabilities ? ctx.request.body.referralData.section4.disabilities : "-",
                "Accessed services": ctx.request.body.referralData.section4LocalService ? ctx.request.body.referralData.section4LocalService.toString() : "-",
                //Section5
                "Contact person": ctx.request.body.referralData.section2.contact_person,
                "Contact through": ctx.request.body.referralData.section2.contact_preferences.toString(),
            },
        ];
    }
    else if (ctx.request.body.referralData.role == "Child" || ctx.request.body.referralData.role == "child") {
        var householdMembers = [];
        for (let index = 0; index < ctx.request.body.referralData.section2.household_member.length; index++) {
            var name = ctx.request.body.referralData.section2.household_member[index].name;
            var lastName = ctx.request.body.referralData.section2.household_member[index].lastName
            var fullName = name + " " + lastName

            householdMembers.push(fullName);

        }
        csvData = [
            { //Section 1
                "I am a": ctx.request.body.referralData.role,
                "Interpreter needed": ctx.request.body.referralData.section1.need_interpreter,
                "Child's D.O.B:": moment(ctx.request.body.referralData.section1.child_dob).format('DD/MM/YYYY'),
                "Consent given": ctx.request.body.referralData.section1.consent_child,
                "Any reason parent/carer cannot be contacted": ctx.request.body.referralData.section1.contact_parent_camhs ? ctx.request.body.referralData.section1.contact_parent_camhs : "-",
                "Reason for no contact": ctx.request.body.referralData.section1.reason_contact_parent_camhs ? ctx.request.body.referralData.section1.reason_contact_parent_camhs : "-",
                "GP": ctx.request.body.referralData.section1.registered_gp,
                "Child school": ctx.request.body.referralData.section1.gp_school ? ctx.request.body.referralData.section1.gp_school : "-",
                //Section 2
                "NHS number": ctx.request.body.referralData.section2.child_NHS ? ctx.request.body.referralData.section2.child_NHS : "-",
                "Title": ctx.request.body.referralData.section2.child_name_title,
                "First name": ctx.request.body.referralData.section2.child_name,
                "Last name": ctx.request.body.referralData.section2.child_lastname,
                "E-mail:": ctx.request.body.referralData.section2.child_email ? ctx.request.body.referralData.section2.child_email : "-",
                "Contact type": ctx.request.body.referralData.section2.child_contact_type,
                "Contact number": ctx.request.body.referralData.section2.child_contact_number,
                "Address": ctx.request.body.referralData.section2.child_address,
                "Happy for post to be send": ctx.request.body.referralData.section2.can_send_post,
                "Gender": ctx.request.body.referralData.section2.child_gender,
                "Sex at birth": ctx.request.body.referralData.section2.sex_at_birth,
                "Identifies with gender of birth": ctx.request.body.referralData.section2.child_gender_birth,
                "Sexual orientation": ctx.request.body.referralData.section2.child_sexual_orientation ? ctx.request.body.referralData.section2.child_sexual_orientation : "-",
                "Ethnicity": ctx.request.body.referralData.section2.child_ethnicity ? ctx.request.body.referralData.section2.child_ethnicity : "-",
                "Cares for an adult": ctx.request.body.referralData.section2.child_care_adult,
                "Household member": checkArray(householdMembers),
                "Parent / carer’s first name": ctx.request.body.referralData.section2.parent_name,
                "Parent / carer’s last name:": ctx.request.body.referralData.section2.parent_lastname,
                "Have a parental responsibility": ctx.request.body.referralData.section2.parental_responsibility,
                "Relationship": ctx.request.body.referralData.section2.child_parent_relationship,
                "Parent contact type": ctx.request.body.referralData.section2.parent_contact_type,
                "Parent contact number": ctx.request.body.referralData.section2.parent_contact_number,
                "Parent email address": ctx.request.body.referralData.section2.parent_email ? ctx.request.body.referralData.section2.parent_email : "-",
                "Lives in same house": ctx.request.body.referralData.section2.parent_same_house,
                "Parent address": ctx.request.body.referralData.section2.parent_address ? ctx.request.body.referralData.section2.parent_address : "-",
                // //Section3
                "Education / employment": ctx.request.body.referralData.section3.child_profession,
                "School/college": ctx.request.body.referralData.section3.child_education_place ? ctx.request.body.referralData.section3.child_education_place : "-",
                "EHCP plan": ctx.request.body.referralData.section3.child_EHCP,
                "Open to EHAT": ctx.request.body.referralData.section3.child_EHAT,
                "Social worker": ctx.request.body.referralData.section3.child_socialworker,
                "Social worker first name": ctx.request.body.referralData.section3.child_socialworker_firstname ? ctx.request.body.referralData.section3.child_socialworker_firstname : "-",
                "Social worker last name": ctx.request.body.referralData.section3.child_socialworker_lastname ? ctx.request.body.referralData.section3.child_socialworker_lastname : "-",
                "Social worker contact type": ctx.request.body.referralData.section3.child_socialworker_contact_type ? ctx.request.body.referralData.section3.child_socialworker_contact_type : "-",
                "Social worker contact number": ctx.request.body.referralData.section3.child_socialworker_contact ? ctx.request.body.referralData.section3.child_socialworker_contact : "-",
                // //section4
                "Support needs": ctx.request.body.referralData.section4.referral_type,
                "Covid related": ctx.request.body.referralData.section4.is_covid,
                "Main eating disorder difficult:": checkArray(ctx.request.body.referralData.section4.eating_disorder_difficulties),
                "Food/fluid intake": ctx.request.body.referralData.section4.food_fluid_intake ? ctx.request.body.referralData.section4.food_fluid_intake : "-",
                "Height": ctx.request.body.referralData.section4.height ? ctx.request.body.referralData.section4.height : "-",
                "Weight": ctx.request.body.referralData.section4.weight ? ctx.request.body.referralData.section4.weight : "-",
                "Main reason for making referral ": ctx.request.body.referralData.section4.reason_for_referral ? ctx.request.body.referralData.section4.reason_for_referral : "-",
                "Info about issue:": ctx.request.body.referralData.section4.referral_issues ? ctx.request.body.referralData.section4.referral_issues.toString() : "-",
                "Has anything helped": ctx.request.body.referralData.section4.has_anything_helped ? ctx.request.body.referralData.section4.has_anything_helped : "-",
                "Triggers": ctx.request.body.referralData.section4.any_particular_trigger ? ctx.request.body.referralData.section4.any_particular_trigger : "-",
                "Disabilities / difficulties": ctx.request.body.referralData.section4.disabilities ? ctx.request.body.referralData.section4.disabilities : "-",
                "Accessed services": ctx.request.body.referralData.section4LocalService ? ctx.request.body.referralData.section4LocalService.toString() : "-",
                // //Section5
                "Contact person": ctx.request.body.referralData.section1.contact_person,
                "Contact through": ctx.request.body.referralData.section1.contact_preferences.toString(),
            },
        ];
    }
    else {
        var householdMembers = [];
        for (let index = 0; index < ctx.request.body.referralData.section2.household_member.length; index++) {
            var name = ctx.request.body.referralData.section2.household_member[index].name;
            var lastName = ctx.request.body.referralData.section2.household_member[index].lastName
            var fullName = name + " " + lastName
            householdMembers.push(fullName);

        }
        csvData = [
            { //Section 1
                "I am a": ctx.request.body.referralData.role,
                "Service location": ctx.request.body.referralData.section1.service_location,
                "Selected service": ctx.request.body.referralData.section1.selected_service,
                "Professional First name": ctx.request.body.referralData.section1.professional_name,
                "Professional Last name": ctx.request.body.referralData.section1.professional_lastname,
                "Professional E-mail": ctx.request.body.referralData.section1.professional_email ? ctx.request.body.referralData.section1.professional_email : "-",
                "Professional Contact_type": ctx.request.body.referralData.section1.professional_contact_type,
                "Professional Contact number": ctx.request.body.referralData.section1.professional_contact_number,
                "Professional Address": ctx.request.body.referralData.section1.professional_address,
                "Profession": ctx.request.body.referralData.section1.professional_profession,
                "Child's D.O.B:": moment(ctx.request.body.referralData.section1.child_dob).format('DD/MM/YYYY'),
                "Consent given by child": ctx.request.body.referralData.section1.consent_child,
                "Consent given by parent": ctx.request.body.referralData.section1.consent_parent ? ctx.request.body.referralData.section1.consent_parent : "-",
                "GP": ctx.request.body.referralData.section1.registered_gp,
                "Child school": ctx.request.body.referralData.section1.gp_school ? ctx.request.body.referralData.section1.gp_school : "-",
                //Section 2
                "NHS number": ctx.request.body.referralData.section2.child_NHS ? ctx.request.body.referralData.section2.child_NHS : "-",
                "Title": ctx.request.body.referralData.section2.child_name_title,
                "First name": ctx.request.body.referralData.section2.child_name,
                "Last name": ctx.request.body.referralData.section2.child_lastname,
                "E-mail:": ctx.request.body.referralData.section2.child_email ? ctx.request.body.referralData.section2.child_email : "-",
                "Contact type": ctx.request.body.referralData.section2.child_contact_type,
                "Contact number": ctx.request.body.referralData.section2.child_contact_number,
                "Address": ctx.request.body.referralData.section2.child_address,
                "Happy for post to be send": ctx.request.body.referralData.section2.can_send_post,
                "Gender": ctx.request.body.referralData.section2.child_gender,
                "Sex at birth": ctx.request.body.referralData.section2.sex_at_birth,
                "Identifies with gender of birth": ctx.request.body.referralData.section2.child_gender_birth,
                "Sexual orientation": ctx.request.body.referralData.section2.child_sexual_orientation ? ctx.request.body.referralData.section2.child_sexual_orientation : "-",
                "Ethnicity": ctx.request.body.referralData.section2.child_ethnicity ? ctx.request.body.referralData.section2.child_ethnicity : "-",
                "Cares for an adult": ctx.request.body.referralData.section2.child_care_adult,
                "Household member": checkArray(householdMembers),
                "Parent / carer’s first name": ctx.request.body.referralData.section2.parent_name,
                "Parent / carer’s last name:": ctx.request.body.referralData.section2.parent_lastname,
                "Have a parental responsibility": ctx.request.body.referralData.section2.parental_responsibility,
                "Relationship": ctx.request.body.referralData.section2.child_parent_relationship,
                "Parent contact type": ctx.request.body.referralData.section2.parent_contact_type,
                "Parent contact number": ctx.request.body.referralData.section2.parent_contact_number,
                "Parent email address": ctx.request.body.referralData.section2.parent_email ? ctx.request.body.referralData.section2.parent_email : "-",
                "Lives in same house": ctx.request.body.referralData.section2.parent_same_house,
                "Parent address": ctx.request.body.referralData.section2.parent_address ? ctx.request.body.referralData.section2.parent_address : "-",
                // //Section3
                "Education / employment": ctx.request.body.referralData.section3.child_profession,
                "School/college": ctx.request.body.referralData.section3.child_education_place ? ctx.request.body.referralData.section3.child_education_place : "-",
                "EHCP plan": ctx.request.body.referralData.section3.child_EHCP,
                "Open to EHAT": ctx.request.body.referralData.section3.child_EHAT,
                "Social worker": ctx.request.body.referralData.section3.child_socialworker,
                "Social worker first name": ctx.request.body.referralData.section3.child_socialworker_firstname ? ctx.request.body.referralData.section3.child_socialworker_firstname : "-",
                "Social worker last name": ctx.request.body.referralData.section3.child_socialworker_lastname ? ctx.request.body.referralData.section3.child_socialworker_lastname : "-",
                "Social worker contact type": ctx.request.body.referralData.section3.child_socialworker_contact_type ? ctx.request.body.referralData.section3.child_socialworker_contact_type : "-",
                "Social worker contact number": ctx.request.body.referralData.section3.child_socialworker_contact ? ctx.request.body.referralData.section3.child_socialworker_contact : "-",
                // //section4
                "Support needs": ctx.request.body.referralData.section4.referral_type,
                "Covid related": ctx.request.body.referralData.section4.is_covid,
                "Main eating disorder difficult:": checkArray(ctx.request.body.referralData.section4.eating_disorder_difficulties),
                "Food/fluid intake": ctx.request.body.referralData.section4.food_fluid_intake ? ctx.request.body.referralData.section4.food_fluid_intake : "-",
                "Height": ctx.request.body.referralData.section4.height ? ctx.request.body.referralData.section4.height : "-",
                "Weight": ctx.request.body.referralData.section4.weight ? ctx.request.body.referralData.section4.weight : "-",
                "Main reason for making referral ": ctx.request.body.referralData.section4.reason_for_referral ? ctx.request.body.referralData.section4.reason_for_referral.toString() : "-",
                "Info about issue:": ctx.request.body.referralData.section4.referral_issues ? ctx.request.body.referralData.section4.referral_issues : "-",
                "Has anything helped": ctx.request.body.referralData.section4.has_anything_helped ? ctx.request.body.referralData.section4.has_anything_helped : "-",
                "Triggers": ctx.request.body.referralData.section4.any_particular_trigger ? ctx.request.body.referralData.section4.any_particular_trigger : "-",
                "Disabilities / difficulties": ctx.request.body.referralData.section4.disabilities ? ctx.request.body.referralData.section4.disabilities : "-",
                "Accessed services": ctx.request.body.referralData.section4LocalService ? ctx.request.body.referralData.section4LocalService.toString() : "-",
                // //Section5
                "Contact person": ctx.request.body.referralData.section1.contact_person,
                "Contact through": ctx.request.body.referralData.section1.contact_preferences.toString(),
            },
        ];
    }
    return csvData;
}

function checkArray(array) {
    if (Array.isArray(array) && array.length) {
        return array.toString();
    }
    else {
        return "-";
    }
}


function samplecsv(ctx)
{
    console.log(ctx.request.body.referralData.section1.contact_preferences)
    csvData = [
        { //Section 1
            "00a_referrer": ctx.request.body.referralData.role,
            "00b_referral_type": ctx.request.body.referralData.section4.referral_type,
            "06_professional_referral_service_selection": ctx.request.body.referralData.section1.service_location + " - " + ctx.request.body.referralData.section1.selected_service,
            "07a_professional_name": ctx.request.body.referralData.section1.professional_name + " - " + ctx.request.body.referralData.section1.professional_lastname + " - " + ctx.request.body.referralData.section1.professional_profession,
            "Professional E-mail": ctx.request.body.referralData.section1.professional_email ? ctx.request.body.referralData.section1.professional_email : "-",
            "07c_professional_contact_number": ctx.request.body.referralData.section1.professional_contact_type + " - " + ctx.request.body.referralData.section1.professional_contact_number,
            "07b_professional_address": ctx.request.body.referralData.section1.professional_address,
            "pat_dob:": moment(ctx.request.body.referralData.section1.child_dob).format('DD/MM/YYYY'),
            "01_consent_from_child_to_share_with_camhs_partners": ctx.request.body.referralData.section1.consent_child,
            "02_consent_from_parent_or_carer_to_share_with_camhs_partners": ctx.request.body.referralData.section1.consent_parent ? ctx.request.body.referralData.section1.consent_parent : "-",
            "04_registered_gp": ctx.request.body.referralData.section1.registered_gp,
            "05_registered_school": ctx.request.body.referralData.section1.gp_school ? ctx.request.body.referralData.section1.gp_school : "-",
            //Section 2
            "09_nhs_number_provided": ctx.request.body.referralData.section2.child_NHS ? ctx.request.body.referralData.section2.child_NHS : "-",
            "pat_title": ctx.request.body.referralData.section2.child_name_title,
            "pat_firstname": ctx.request.body.referralData.section2.child_name,
            "pat_lastname": ctx.request.body.referralData.section2.child_lastname,
            "pat_email": ctx.request.body.referralData.section2.child_email ? ctx.request.body.referralData.section2.child_email : "-",
            "pat_home_tel": ctx.request.body.referralData.section2.child_contact_type + " - " + ctx.request.body.referralData.section2.child_contact_number,
            "pat_address1": ctx.request.body.referralData.section2.child_address,
            "10_consent_to_contact_via_post": ctx.request.body.referralData.section2.can_send_post,
            "08a_gender_child_indentifies_as": ctx.request.body.referralData.section2.child_gender,
            "pat_gender": ctx.request.body.referralData.section2.sex_at_birth,
            "08b_does_child_identify_with_birth_gender": ctx.request.body.referralData.section2.child_gender_birth,
            "08c_sexual_orientation": ctx.request.body.referralData.section2.child_sexual_orientation ? ctx.request.body.referralData.section2.child_sexual_orientation : "-",
            "08d_ethnicity": ctx.request.body.referralData.section2.child_ethnicity ? ctx.request.body.referralData.section2.child_ethnicity : "-",
            "13_is_a_carer_for_an_adult": ctx.request.body.referralData.section2.child_care_adult,
            //"12_household_members": checkArray(householdMembers),
            "14a_parent_or_carer_details_with_parental_responsibility": ctx.request.body.referralData.section2.parent_name +" - " +ctx.request.body.referralData.section2.parent_lastname +"-"+ ctx.request.body.referralData.section2.child_parent_relationship,
            "14b_parent_or_carer_contact_number": ctx.request.body.referralData.section2.parent_contact_type + " - " + ctx.request.body.referralData.section2.parent_contact_number,
            "14c_parent_or_carer_email": ctx.request.body.referralData.section2.parent_email ? ctx.request.body.referralData.section2.parent_email : "-",
            "14d_parent_or_carer_lives_at_childs_address": ctx.request.body.referralData.section2.parent_same_house,
            "14e_parent_or_carer_address": ctx.request.body.referralData.section2.parent_address ? ctx.request.body.referralData.section2.parent_address : "-",
            // //Section3
            "17_profession_or_education_status": ctx.request.body.referralData.section3.child_profession,
            "18_place_of_education": ctx.request.body.referralData.section3.child_education_place ? ctx.request.body.referralData.section3.child_education_place : "-",
            "19a_education_and_health_care_plan_EHCP": ctx.request.body.referralData.section3.child_EHCP,
            "19b_early_help_assessment_tool_EHAT": ctx.request.body.referralData.section3.child_EHAT,
            "20_social_worker_information": ctx.request.body.referralData.section3.child_socialworker+" - " + ctx.request.body.referralData.section3.child_socialworker_firstname ? ctx.request.body.referralData.section3.child_socialworker_firstname : "nil" + " - " +ctx.request.body.referralData.section3.child_socialworker_lastname ? ctx.request.body.referralData.section3.child_socialworker_lastname : "nil" + " - " + ctx.request.body.referralData.section3.child_socialworker_contact_type ? ctx.request.body.referralData.section3.child_socialworker_contact_type : "nil" + " - "+ ctx.request.body.referralData.section3.child_socialworker_contact ? ctx.request.body.referralData.section3.child_socialworker_contact : "nil",
            // //section4
            //"Support needs": ctx.request.body.referralData.section4.referral_type,
            "21_referral_related_to_covid": ctx.request.body.referralData.section4.is_covid,
            "27_problem_eating_disorder_difficulties": checkArray(ctx.request.body.referralData.section4.eating_disorder_difficulties),
            "28_problem_food_and_fluid_intake": ctx.request.body.referralData.section4.food_fluid_intake ? ctx.request.body.referralData.section4.food_fluid_intake : "-",
            "29a_problem_height": ctx.request.body.referralData.section4.height ? ctx.request.body.referralData.section4.height : "-",
            "29b_problem_weight": ctx.request.body.referralData.section4.weight ? ctx.request.body.referralData.section4.weight : "-",
            "22a_reason_for_referral": ctx.request.body.referralData.section4.reason_for_referral ? ctx.request.body.referralData.section4.reason_for_referral.toString() : "-",
            "22b_reason_for_referral": ctx.request.body.referralData.section4.referral_issues ? ctx.request.body.referralData.section4.referral_issues : "-",
            "23_has_anything_helped": ctx.request.body.referralData.section4.has_anything_helped ? ctx.request.body.referralData.section4.has_anything_helped : "-",
            "24_problem_any_particular_trigger": ctx.request.body.referralData.section4.any_particular_trigger ? ctx.request.body.referralData.section4.any_particular_trigger : "-",
            "25_any_disabilities_difficulties_health_conditions_or_challenging_behaviours": ctx.request.body.referralData.section4.disabilities ? ctx.request.body.referralData.section4.disabilities : "-",
            "26_previously_accessed_services": ctx.request.body.referralData.section4LocalService ? ctx.request.body.referralData.section4LocalService.toString() : "-",
            // //Section5
            "11_who_and_how_to_be_contacted_about_referral": ctx.request.body.referralData.section1.contact_person +" - "+ ctx.request.body.referralData.section1.contact_preferences.toString(),
        },
    ];

    console.log(csvData);
    return;
}
