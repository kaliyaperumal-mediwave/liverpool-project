var axios = require('axios');
const config = require('../config');

console.log(config.orcha_api)

console.log(config.orcha_user)

console.log(config.orcha_pass)
exports.getAllApps = ctx => new Promise((resolve, reject) => {
    console.log(ctx.request.body)
    var data = {
        "searchTerm": ctx.request.body.searchCategory,
        "pageNumber": 1,
        "pageSize": 50,
        "platformId": "",
        "subCategoryId": "",
        "costIds": [],
        "capabilityIds": [],
        "designedForIds": [],
        "countryIds": []
    };
    var config_api = {
        method: 'post',
        url: config.orcha_api+'Review/SearchPagedReviews',
        headers: { 'authorization': 'Bearer ' + ctx.response.body.orchaToken},
        data: data
    };
    axios(config_api).then(function (apps) {
        console.log(apps.data)
        ctx.res.ok({
            data: apps.data
        });
        resolve();
    })
        .catch(function (error) {
            ctx.res.internalServerError({
                message: 'gdfgsgfg',
            });
            reject();
        });
})

exports.getApp = ctx => new Promise((resolve, reject) => {
    console.log("orcha app");
    console.log(ctx.query.app_id);
    var config_api = {
        method: 'get',
        url:  config.orcha_api+'review/GetReview?reviewId='+ctx.query.app_id,
        headers: { 'authorization': 'Bearer ' + ctx.response.body.orchaToken}
    };

    axios(config_api).then(function (apps) {
       //  console.log(apps.data)
         ctx.res.ok({
             data: apps.data
         });
         resolve();
     })
         .catch(function (error) {
             ctx.res.internalServerError({
                 message: 'gdfgsgfg',
             });
             reject();
         });
})