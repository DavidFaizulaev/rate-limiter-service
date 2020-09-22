const { expect } = require('chai');
const sinon = require('sinon');
const rateLimitMiddleware = require('../../../src/middlewares/rate-limiter-calculator');

const requestBody = {
    url: 'http://google.com'
};

let sandbox, next;

describe('Rate limiter calculator tests', function() {
    before(async function () {
        sandbox = sinon.createSandbox();
        next = sandbox.stub();
    });

    afterEach(function(){
        sandbox.restore();
    });

    it('Should return status code 200 with false value when rate limit is not exceeded', async () => {
        const REQUEST_RATE = 100;
        const REQUEST_INTERVAL = 50;
        const ctx = {
            request: {
                body: requestBody
            }
        };
        rateLimitMiddleware.init(REQUEST_RATE, REQUEST_INTERVAL);
        rateLimitMiddleware.rateLimiterCalculator(ctx, next);
        expect(ctx.rater_limiter_calculation).to.equal(false);
    });
    it('Should return status code 200 with true value when rate limit is exceeded', async () => {
        const REQUEST_RATE = 1;
        const REQUEST_INTERVAL = 3;
        const ctx = {
            request: {
                body: requestBody
            }
        };
        rateLimitMiddleware.init(REQUEST_RATE, REQUEST_INTERVAL);
        rateLimitMiddleware.rateLimiterCalculator(ctx, next);
        expect(ctx.rater_limiter_calculation).to.equal(true);
    });
});
