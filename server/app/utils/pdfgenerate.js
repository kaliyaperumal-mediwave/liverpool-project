
var pdf = require('html-pdf');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const config = require('../config');
exports.generatePdf = async ctx => new Promise((resolve, reject) => {
    var template;
    console.log("pdf gen")
    console.log(ctx.request.body.referralData)
    try {
        if (ctx.request.body.referralData.role == "Child" || ctx.request.body.referralData.role == "child") {
            template = fs.readFileSync(path.join(`${__dirname}/./templates/child_referralSendTemplate.html`), 'utf8');
        } else if (ctx.request.body.referralData.role == "Young" || ctx.request.body.referralData.role == "young") {
            template = fs.readFileSync(path.join(`${__dirname}/./templates/young_referralSendTemplate.html`), 'utf8');
        }
        else if (ctx.request.body.referralData.role == "Parent" || ctx.request.body.referralData.role == "parent") {
            template = fs.readFileSync(path.join(`${__dirname}/./templates/parent_referralSendTemplate.html`), 'utf8');
        }
        else if (ctx.request.body.referralData.role == "Family" || ctx.request.body.referralData.role == "family") {
            template = fs.readFileSync(path.join(`${__dirname}/./templates/family_referralSendTemplate.html`), 'utf8');
        }
        else if ((ctx.request.body.referralData.role == "Professional" || ctx.request.body.referralData.role == "professional") && ctx.request.body.referralData.section1.referral_type == "child") {
            template = fs.readFileSync(path.join(`${__dirname}/./templates/prof_referralSendTemplate.html`), 'utf8');
        }
        else if ((ctx.request.body.referralData.role == "Professional" || ctx.request.body.referralData.role == "professional") && ctx.request.body.referralData.section1.referral_type == "young") {
            template = fs.readFileSync(path.join(`${__dirname}/./templates/prof_young_referralSendTemplate.html`), 'utf8');
        }

        let htmlTemplate = _.template(template);
        htmlTemplate = htmlTemplate({
            body: ctx.request.body.referralData,
        });
        var opt = {
            format: 'A4',
            orientation: 'portrait',
            margin: '1cm',
            footer: {
                "height": "5mm"
            },
            border: {
                "top": "1in",            // default is 0, units: mm, cm, in, px
                "bottom": "0.5in",
            },
        };

        if (ctx.request.body.sendProf) {
            opt.header = {
                "height": "20mm",
                "contents": '<div style="color: #d0d0d0;font-size: 25pt;-webkit-transform: rotate(-30deg);-moz-transform: rotate(-45deg);position: absolute;width: 100%;height: 100%;margin: 0;z-index: -1;left: 50px;top: 300px;">Referrer copy of referral</div>'
            }
        }

        pdf.create(htmlTemplate, opt).toBuffer(function (err, buffer) {
            resolve(ctx.body = buffer);
        });
    } catch (e) {
        console.log(e)
        return resolve(ctx.res.internalServerError({
            data: 'Failed to sent mail',
        }));
    }
});