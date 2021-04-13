const nodemailer = require('nodemailer');
const nodemailerSendgrid = require('nodemailer-sendgrid');
const P = require('pino');
let mailService;

// Sndgrid disabled on SMTP requirement
if (process.env.USE_SENDGRID == 'true') {
     mailService = nodemailer.createTransport(
        nodemailerSendgrid({
            apiKey: process.env.SENDGRID_API_KEY
        })
    );
}
else {
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


exports.sendReferralConfirmation = ctx => {

    if (ctx.request.decryptedUser != undefined) {
        //console.log(ctx.request.decryptedUser.email)
        const data = {
            from: 'info@mindwaveventures.com',
            //to: req.body.email,
            to: ctx.request.decryptedUser.email,
            subject: 'Referral Confirmation',
            html: '<p> Your referral code is <strong>' + ctx.request.body.ref_code + '</strong><p>',
        };
        mailService.sendMail(data, (err, emailres, ctx) => {
            if (err) {
                //console.log(err);
            }
            else {
                ////console.log(emailres)
            }
        });
        const sendResponseData = {
            sendUserResult: ctx.query.refCode,
        }
        return ctx.res.ok({
            status: "success",
            data: sendResponseData
        });
    }
    else {
        const sendResponseData = {
            sendUserResult: ctx.query.refCode,
        }
        return ctx.res.ok({
            status: "success",
            data: sendResponseData
        });
    }

}