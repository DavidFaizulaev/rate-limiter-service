const Router = require('koa-router');
const validateInput = require('openapi-validator-middleware').validate;
const { rateLimiterCalculator } = require('../middlewares/rate-limiter-calculator');
const { rateLimiter } = require('../controllers/rate-limiter-controller');
const router = new Router();

router.post('/visit', validateInput, rateLimiterCalculator, rateLimiter);

module.exports = router;
