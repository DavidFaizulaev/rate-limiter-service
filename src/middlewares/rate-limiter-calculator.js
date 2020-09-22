
const { logger } = require('../service/logger');
let requestCounter = 0;
const requestsArray = [];

let REQUEST_RATE;
let REQUEST_INTERVAL;

function init (requestRate, interval) {
    REQUEST_RATE = requestRate;
    REQUEST_INTERVAL = interval;

    setInterval(function() {
        const now = Date.now();
        const limitOn = calcRateLimit(now);

        if (!limitOn) {
            if (requestsArray.length > 0){
                const oldestRequestObject = requestsArray.shift();
                requestCounter--;

                const buff = Buffer.from(oldestRequestObject.url, 'base64');
                const oldestRequestUrl = buff.toString('utf-8');
                oldestRequestObject.url = oldestRequestUrl;

                logger.info(oldestRequestObject, 'request rate dropped, removing oldest request');
            }
        }
    }, REQUEST_INTERVAL);
}

async function rateLimiterCalculator(ctx, next) {
    const now = Date.now();
    const requestBody = ctx.request.body;

    ctx.rater_limiter_calculation = false; // set by default to false, value will change only in case of rate limit exceeded
    requestCounter++;

    const buff = Buffer.from(requestBody.url);
    const requestUrl = buff.toString('base64');

    const requestObj = {
        url: requestUrl,
        request_time: now
    };
    requestsArray.push(requestObj);

    const rateLimitCalculationResult = calcRateLimit(now);

    if (rateLimitCalculationResult) {
        logger.info(requestObj, 'rate limit was exceeded');
    }

    ctx.rater_limiter_calculation = rateLimitCalculationResult;

    await next();
}

function calcRateLimit(currentRequestTime) {
    if (requestCounter >= REQUEST_RATE) {
        // get the oldest request time and examine it
        const oldestRequestObj = requestsArray[0];
        const oldestRequestTime = oldestRequestObj.request_time;
        if (currentRequestTime - oldestRequestTime <= REQUEST_INTERVAL) {
            return true;
        }
    }

    return false;
}

module.exports = {
    init,
    rateLimiterCalculator
};