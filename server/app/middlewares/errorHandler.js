const logger = require('../logger');

// const sequelize = require('sequelize');
const {
    UNKNOWN_ENDPOINT,
    UNKNOWN_ERROR,
} = require('../constants/error');
const reponseMessages = require('./responseMessage');
/**
 * Return middleware that handle exceptions in Koa.
 * Dispose to the first middleware.
 *
 * @return {function} Koa middleware.
 */
function errorHandler() {
    return async(ctx, next) => {
        try {
            await next();

            // Respond 404 Not Found for unhandled request
            if (!ctx.body && (!ctx.status || ctx.status === 404)) ctx.res.notFound(UNKNOWN_ENDPOINT);
        } catch (err) {
            ctx.res.internalServerError(UNKNOWN_ERROR);

            // Recommended for centralized error reporting,
            // retaining the default behaviour in Koa
            ctx.app.emit('error', err, ctx);
        }
    };
}

function authorizationError() {
    return async(ctx, next) => {
        await next().catch((err) => {
            if (err.status === 403) {
                ctx.status = 403;
                ctx.body = 'Protected resource, use Authorization header to get access\n';
            } else {
                throw err;
            }
        });
    };
}

function handleSequalizeError(ctx, error) {
    logger.info('\n\n\n--------------SequalizeError---------------\n\n\n\n', error, '\n\n\n\n\n');

    return ctx.res.badRequest({
        message: reponseMessages[1024],
    });
}


function iaptusUnauthorizedError(ctx, error,payload) {
    logger.info('\n\n\n--------------iaptusUnauthorizedError---------------\n\n\n\n', error, '\n\n\n\n\n');

    return ctx.res.badRequest({
        data:payload,
        message: reponseMessages[1024],
    });
}

module.exports = {
    errorHandler,
    authorizationError,
    handleSequalizeError,
    iaptusUnauthorizedError,
};
