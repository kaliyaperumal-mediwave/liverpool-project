var axios = require('axios');
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
    var config = {
        method: 'post',
        url: 'https://app-library-builder-api.orchahealth.co.uk/api/orcha/v1/Review/SearchPagedReviews',
        headers: { 'authorization': 'Bearer ' + ctx.response.body.orchaToken},
        data: data
    };
    axios(config).then(function (apps) {
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
    var config = {
        method: 'get',
        url: 'https://app-library-builder-api.orchahealth.co.uk/api/orcha/v1/Review/GetReview?reviewId='+ctx.query.app_id,
        headers: { 'authorization': 'Bearer ' + ctx.response.body.orchaToken}
    };

    axios(config).then(function (apps) {
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