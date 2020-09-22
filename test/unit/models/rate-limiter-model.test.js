const { expect } = require('chai');
const sinon = require('sinon');
const { rateLimiter } = require('../../../src/models/rate-limiter-model');

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
        const response = await rateLimiter(ctx, next);
        expect(response).to.deep.equal({
            throttled: true
        });
    });
});
