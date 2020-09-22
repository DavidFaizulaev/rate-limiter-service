const { expect } = require('chai');
const sinon = require('sinon');
const { rateLimiter } = require('../../../src/controllers/rate-limiter-controller');

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
        const ctx = {
            request: {
                body: requestBody
            },
            rater_limiter_calculation: true
        };
        await rateLimiter(ctx, next);
        expect(ctx.status).to.deep.equal(200);
        expect(ctx.body).to.deep.equal({
            throttled: true
        });
    });
});
