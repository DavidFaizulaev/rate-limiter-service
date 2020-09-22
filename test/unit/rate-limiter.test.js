process.env.REQUEST_RATE = 100;
process.env.REQUEST_INTERVAL = 50;
const supertest = require('supertest');
const { expect, use } = require('chai');
const path = require('path');
const { chaiPlugin } = require('api-contract-validator');
const srcConfig = require('../../src/service/config');

const apiDefinitionsPath = path.join(__dirname, '../../docs/swagger.yaml');
use(chaiPlugin({ apiDefinitionsPath }));

let server;

const requestHeaders = {
    'content-type': 'application/json',
    'api-version': '1.3.0',
    accept: '*/*'
};

const requestBody = {
    url: 'http://google.com'
};

describe('Rate limiter tests', function() {
    before(async function () {
        server = (await recreateApp()).server;
    });

    after(function(){
        server && server.close(); // prevent to throw an error on undefined server when fail to start app
    });
    describe('Validation tests', function () {
        it('Should return status code 400 with error message when url in request body in not string', async () => {
            const invalidRequestBody = {
                url: 23123123
            };
            const checkLimitResponse = await supertest(server)
                .post('/visit')
                .send(invalidRequestBody)
                .set(requestHeaders);
            expect(checkLimitResponse.status).to.equal(400);
            expect(checkLimitResponse.body).to.deep.equal({
                message: '[\"body/url should be string\"]'
            });

            expect({
                path: '/visit',
                status: 400,
                method: 'post',
                body: checkLimitResponse.body,
                headers: {}
            }).to.matchApiSchema();
        });
        it('Should return status code 400 with error message when send empty request body', async () => {
            const checkLimitResponse = await supertest(server)
                .post('/visit')
                .send({})
                .set(requestHeaders);
            expect(checkLimitResponse.status).to.equal(400);
            expect(checkLimitResponse.body).to.deep.equal({
                message: "[\"body should have required property 'url'\"]"
            });

            expect({
                path: '/visit',
                status: 400,
                method: 'post',
                body: checkLimitResponse.body,
                headers: {}
            }).to.matchApiSchema();
        });
        it('Should return status code 404 when sending request to unknown path', async () => {
            const checkLimitResponse = await supertest(server)
                .post('/visitx')
                .send(requestBody)
                .set(requestHeaders);
            expect(checkLimitResponse.status).to.equal(404);
            expect(checkLimitResponse.body).to.deep.equal({
                message: 'Not Found'
            });
        });
    });
});

const recreateApp = async (testServer) => {
    Object.keys(require.cache).filter((x) => x.includes('home_assignment/src')).map(x => delete require.cache[x]); // cleanup all src
    testServer && testServer.close();
    const app = require('../../src/app');
    const testApp = await app();
    const newServer = testApp.listen(srcConfig.PORT);
    return { server: newServer };
};
