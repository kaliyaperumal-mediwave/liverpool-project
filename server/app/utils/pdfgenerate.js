
var pdf = require('html-pdf');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const config = require('../config');
exports.generatePdf = async ctx => new Promise((resolve, reject) => {
    var template;
    console.log("pdf gen")
    console.log( ctx.request.body.referralData)
    try {
        if(ctx.request.body.referralData.role == "Child" || ctx.request.body.referralData.role == "child" || ctx.request.body.referralData.role == "Young" || ctx.request.body.referralData.role == "young")
        {
             template = fs.readFileSync(path.join(`${__dirname}/./templates/child_referralSendTemplate.html`), 'utf8');
        }
        else if(ctx.request.body.referralData.role == "Parent" || ctx.request.body.referralData.role == "parent" ||   ctx.request.body.referralData.role == "Family" || ctx.request.body.referralData.role == "family")
        {
            template = fs.readFileSync(path.join(`${__dirname}/./templates/parent_referralSendTemplate.html`), 'utf8');
        }
        else
        {
            template = fs.readFileSync(path.join(`${__dirname}/./templates/prof_referralSendTemplate.html`), 'utf8');
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