const sequelize = require('sequelize');
const sequalizeErrorHandler = require('../middlewares/errorHandler');
var axios = require('axios');
const jwt_decode = require('jwt-decode');
module.exports.checkOrchaToken = (ctx, next) => new Promise(async (resolve) => {
    try {
        const { Orcha } = ctx.orm();
        ctx.response.body = ctx.response.body ? ctx.response.body : {};
        await Orcha.findOne().then(async (orchaTokens) => {
            if (!orchaTokens.auth_token) {

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
                    var token = response.data.result.accessToken
                    return Orcha.update({
                        auth_token: token
                    }, {
                        where:
                            { id: 1 }
                    }).then(() => {
                        ctx.response.body.orchaToken = token;
                        return next().then(() => {
                            resolve();
                          });

                    }).catch(error => { console.log(error, "error"); sequalizeErrorHandler.handleSequalizeError(ctx, error) });
                    resolve();
                }).catch((error) => {
                    ctx.res.internalServerError({
                        message: 'gdfgsgfg',
                    });
                    reject();
                })
            }
            else {
                let orchaTknData = jwt_decode(orchaTokens.auth_token)
                if (new Date().getTime() < orchaTknData.exp) {
                    ctx.response.body.orchaToken = orchaTokens.auth_token;
                }
                else {
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

                    axios(config).then(async (response) => {
                        var token = response.data.result.accessToken
                        const { Orcha } = ctx.orm();
                        return Orcha.update({
                            auth_token: token
                        }, {
                            where:
                                { id: 1 }
                        }).then(async () => {
                            ctx.response.body.orchaToken = orchaTokens.auth_token;
                            return next().then(() => {
                                resolve();
                              });
                        }).catch(error => { console.log(error, "error"); sequalizeErrorHandler.handleSequalizeError(ctx, error) });
                    }).catch((error) => {
                        ctx.res.internalServerError({
                            message: 'gdfgsgfg',
                        });
                        reject();
                    })
                }
            }
        }).catch((err) => {
            console.log(err)
            return_unauthorizedError(ctx);
            return next();
        });
    } catch (e) {
        return_unauthorizedError(ctx);
        return next();
    }
});
function return_unauthorizedError(ctx) {
    return ctx.res.unauthorizedError({
        message: 'Protected resource, unauthorized user.',
    });
}