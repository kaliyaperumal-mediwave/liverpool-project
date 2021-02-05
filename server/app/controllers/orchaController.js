var axios = require('axios');

exports.generateTkn = ctx => new Promise((resolve, reject) => {
    console.log("orcha controller landing")
    var data = {
        "username": "merseycare",
        "password": "Y6?Lp#F6nD?!PQrn"
    }

    var config = {
        method: 'post',
        url: 'https://app-library-builder-api.orchahealth.co.uk/api/orcha/v1/Token/Authenticate',
        headers: {},
        data: data
    };
    axios(config).then((response) => {
        ctx.res.ok({
            data: response.data
        });
        resolve();
    }).catch((error) => {
        ctx.res.internalServerError({
            message: 'gdfgsgfg',
        });
        reject();
    })

});

exports.getAllApps = ctx => new Promise((resolve, reject) => {
    console.log("orcha controller landing")
    var data = {
        "username": "merseycare",
        "password": "Y6?Lp#F6nD?!PQrn"
    }
    var config = {
        method: 'post',
        url: 'https://app-library-builder-api.orchahealth.co.uk/api/orcha/v1/Token/Authenticate',
        headers: {},
        data: data
    };
    axios(config).then((response) => {
       // console.log(response)
        var data = {
            "searchTerm": "depression",
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
            headers: {'authorization': 'Bearer ' + response.data.result.accessToken,},
            data: data
        };
//console.log(config)
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
            });
    }).catch((error) => {
        ctx.res.internalServerError({
            message: 'gdfgsgfg',
        });
        reject();
    })
})