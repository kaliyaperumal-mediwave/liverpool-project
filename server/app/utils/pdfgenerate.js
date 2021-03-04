
var pdf = require('html-pdf');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const config = require('../config');
exports.generatePdf = async ctx => new Promise((resolve, reject) => {
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
            resolve(ctx.body = buffer);
        });
    } catch (e) {
        console.log(e)
        return resolve(ctx.res.internalServerError({
            data: 'Failed to sent mail',
        }));
    }
});