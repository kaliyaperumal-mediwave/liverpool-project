
var pdf = require('html-pdf');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const config = require('../config');
exports.generatePdf = async ctx => new Promise((resolve, reject) => {
    var template;
    try {
        console.log(ctx.request.body.referralData)
        var pdfObj = {
            ratings: "2.5",
            comments: "test",
        }
        if(ctx.request.body.referralData.role == "Child")
        {
             template = fs.readFileSync(path.join(`${__dirname}/./templates/child_referralSendTemplate.html`), 'utf8');
        }
        else if(ctx.request.body.referralData.role == "Parent")
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
            margin: {
                top: '50px',
                left: '20px'
              }
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