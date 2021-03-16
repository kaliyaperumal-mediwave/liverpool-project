var axios = require('axios');
const config = require('../config');
const _ = require('lodash');

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
        url: config.orcha_api + 'Review/SearchPagedReviews',
        headers: { 'authorization': 'Bearer ' + ctx.response.body.orchaToken },
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
        url: config.orcha_api + 'review/GetReview?reviewId=' + ctx.query.app_id,
        headers: { 'authorization': 'Bearer ' + ctx.response.body.orchaToken }
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

exports.getFilterDropDwnData = async (ctx) => {
    let capabilityList = await get_data(ctx, 'Capability/GetCapabilities');
    let designedForList = await get_data(ctx, 'DesignedFor/GetDesignedFor');
    let subCategoryList = await get_data(ctx, 'SubCategory/GetSubCategories');
    let platformList = await get_data(ctx, 'Platform/GetPlatforms');
    let costList = await get_data(ctx, 'Cost/GetCosts');
    let countryList = await get_data(ctx, 'Country/GetCountries');
    const filtersArray = {
        capability_payload: capabilityList,
        designedFor_payload: designedForList,
        subCategory_payload: subCategoryList,
        platform_payload: platformList,
        cost_payload: costList,
        country_payload: countryList
    }
    return ctx.res.ok({
        data: filtersArray,
        message: 'done'
    })
}


exports.getSearchData = async (ctx) => {
    try {
        console.log('-----------getFiltersAndApps-----------', ctx.request.body);
        let app_body = {
            searchTerm: "",
            pageNumber: 1,
            pageSize: 20,
            platformId: "",
            subCategoryId: "",
            costIds: [],
            capabilityIds: [],
            designedForIds: [],
            countryIds: []
        }

        if (ctx.request.body.country) {
            app_body.countryIds = ctx.request.body.country;
        }
        if (ctx.request.body.platform) {
            app_body.platformId = ctx.request.body.platform;
        }
        if (ctx.request.body.subCategory) {
            app_body.subCategoryId = ctx.request.body.subCategory;
        }
        if (ctx.request.body.capabilities) {
            app_body.capabilityIds = ctx.request.body.capabilities;
        }
        if (ctx.request.body.designedFor) {
            app_body.designedForIds = ctx.request.body.designedFor;
        }
        if (ctx.request.body.cost) {
            app_body.costIds = ctx.request.body.cost;
        }

        if (ctx.request.body.keyword) {
            app_body.searchTerm = ctx.request.body.keyword;
        }
        console.log(app_body)
        var appData = await get_apps(app_body, ctx.response.body.orchaToken)

        ctx.res.ok({
            data: appData
        })

    } catch (e) {
        console.log("\n\n\n error", e)
    }
}


async function get_data(ctx, url) {
    try {
        var option = {
            method: 'GET',
            url: config.orcha_api + url,
            headers: {
                'authorization': 'Bearer ' + ctx.response.body.orchaToken
            },
        };
        return await axios(option).then(apps => {
            return apps.data.result;
        }).catch(function (err) {
            return null
        });

    } catch (e) {
        console.log("\n\n\n error", e)
    }
}

/* GET apps from orcha */
async function get_apps(data, token) {
    try {
      console.log('---data----', data);
      var option = {
        method: 'POST',
        url: config.orcha_api + 'Review/SearchPagedReviews',
        data: data,
        headers: {
          'authorization': 'Bearer ' + token,
        },
      };
      return await axios(option)
        .then(apps => {
           console.log('------------', apps.data);
          return apps.data;
        })
        .catch(function (err) {
          console.log(err, "err=====1");
          // return ctx.res.badRequest({
          //   message: 'Failed to fetch data',
          // });
          return null
        });
  
    } catch (e) {
      console.log("\n\n\n error", e)
    }
  }
