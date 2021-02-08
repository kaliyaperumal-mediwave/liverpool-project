var axios = require('axios');
exports.getAllApps = ctx => new Promise((resolve, reject) => {
    console.log("orcha controller landing")
    var data = {
        "searchTerm": "disorder",
        "pageNumber": 1,
        "pageSize": 12,
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
        headers: { 'authorization': 'Bearer ' + ctx.response.body.orchaToken, },
        data: data
    };
    axios(config).then(function (apps) {
       // console.log(apps.data)
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