'use strict';
const { InputValidationError } = require('openapi-validator-middleware');
const httpStatusCodes = require('http-status-codes');
const { BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR, getStatusText } = httpStatusCodes;
const NOT_FOUND_ERROR_MESSAGE = getStatusText(NOT_FOUND);
const { logger } = require('../service/logger');

module.exports.handleError = async function (ctx, next) {
    try {
        await next();
        if (ctx.status === httpStatusCodes.NOT_FOUND && !ctx.body) {
            ctx.throw(NOT_FOUND, { details: NOT_FOUND_ERROR_MESSAGE });
        }
    } catch (error) {
        await _handleError(error, ctx);
    }
};

const _handleError = function (error, ctx) {
    let statusCode;
    let responseBody;
    const errorStatus = error.statusCode || error.status;

    if (errorStatus) {
        statusCode = errorStatus;
        responseBody = {
            message: error.message
        };
    } else if (error instanceof InputValidationError) {
        responseBody = {
            message: JSON.stringify(error.errors)
        };
        statusCode = BAD_REQUEST;
    } else if (error instanceof SyntaxError) {
        responseBody = {
            message: 'SyntaxError'
        };
        statusCode = BAD_REQUEST;
        logger.error('malformed json: ', error);
    } else {
        // unexpected errors
        statusCode = INTERNAL_SERVER_ERROR;
        responseBody = {
            message: error.message || getStatusText(INTERNAL_SERVER_ERROR)
        };
    }

    logger.error({
        statusCode,
        path: ctx.href,
        request_headers: JSON.stringify(ctx.headers),
        request_body: JSON.stringify(ctx.body)
    });

    ctx.status = statusCode;
    ctx.body = responseBody;
};
