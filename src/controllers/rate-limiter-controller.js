const { OK } = require('http-status-codes');
const rateLimiterModel = require('../models/rate-limiter-model');

module.exports = {
    rateLimiter
};

async function rateLimiter(ctx) {
    const response = await rateLimiterModel.rateLimiter(ctx);
    ctx.body = response;
    ctx.status = OK;
}
