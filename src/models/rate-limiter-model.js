async function rateLimiter(ctx) {
    const rateLimiterCalculation = ctx.rater_limiter_calculation;

    const response = {
        throttled: rateLimiterCalculation
    };

    return response;
}

module.exports = {
    rateLimiter
};