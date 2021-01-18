const nodemailer = require('nodemailer');
const nodemailerSendgrid = require('nodemailer-sendgrid');
const P = require('pino');
const mailService = nodemailer.createTransport(
    nodemailerSendgrid({
        apiKey: process.env.SENDGRID_API_KEY
    })
);

exports.sendReferralConfirmation = ctx => {
    const data = {
        from: 'info@mindwaveventures.com',
        //to: req.body.email,
        to: ctx.query.email,
        subject: 'Referral Confirmation',
        html: '<p> Your referral code is <strong>' + ctx.query.refCode + '</strong><p>',
    };
    mailService.sendMail(data, (err, emailres,ctx) => {
        if (err) {
            console.log(err);
        }  
    });
    const sendResponseData={
        sendUserResult:ctx.query.refCode,
    }
    return ctx.res.ok({
        status: "success",
        data:sendResponseData
      });

}