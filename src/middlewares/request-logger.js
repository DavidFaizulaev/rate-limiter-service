const { logger } = require('../service/logger');
const northboundLogger = logger.child({ type: 'northbound' });
const LOG_MESSAGE = 'Incoming message';
const LOG_TYPE = 'northbound';

const ROUTES = ['/visit'];

async function requestLogger(ctx, next) {
    if (ROUTES.includes(ctx.url)) {
        const startTime = new Date();
        const request = buildRequestObject(ctx, startTime);
        await next();
        const endTime = new Date();
        const response = buildResponseObject(ctx, startTime, endTime);
        northboundLogger.info({ request: request, response: response }, LOG_MESSAGE);
    } else {
        await next();
    }
}

function buildRequestObject(ctx, startTime) {
    return {
        method: ctx.method,
        body: ctx.request.body,
        path: ctx.host,
        'utc-timestamp': startTime.toISOString(),
        url: ctx.url,
        headers: ctx.headers,
        type: LOG_TYPE
    };
}

function buildResponseObject(ctx, startTime, endTime) {
    return {
        status_code: ctx.status,
        headers: ctx.response.headers,
        body: ctx.body,
        'utc-timestamp': endTime.toISOString(),
        elapsed: endTime.getTime() - startTime.getTime()
    };
}
module.exports = {
    requestLogger: requestLogger
};
