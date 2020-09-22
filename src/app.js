const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const { BAD_REQUEST } = require('http-status-codes');
const { requestLogger } = require('./middlewares/request-logger');
const { handleError } = require('./middlewares/error-handler');
const openApiValidator = require('openapi-validator-middleware');
const routes = require('./routes/rate-limiter-routes');
const config = require('./service/config');
const { SWAGGER_PATH } = require('./service/common');
const serviceConfig = require('./service/config');
const { logger } = require('./service/logger');
const rateLimiterCalculatorMiddleware = require('./middlewares/rate-limiter-calculator');

const validatorOptions = {
    framework: 'koa',
    beautifyErrors: true
};

module.exports = async () => {
    const app = new Koa();

    await openApiValidator.init(SWAGGER_PATH, validatorOptions);

    // northbound request logger
    app.use(requestLogger);
    // error handler
    app.use(handleError);

    rateLimiterCalculatorMiddleware.init(serviceConfig.REQUEST_RATE, serviceConfig.REQUEST_INTERVAL);

    // common middlewares
    app.use(bodyParser({
        enableTypes: ['json'],
        onerror: function (err, ctx) {
            logger.error({ error: err, request: ctx.request }, 'body parse error');
            ctx.throw(BAD_REQUEST, 'body parse error', { more_info: 'Request body must be valid json' });
        },
        jsonLimit: config.MAX_REQUEST_SIZE
    }));

    // routers
    app.use(routes.routes());

    return app;
};
