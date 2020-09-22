
const { APP_NAME, LOG_LEVEL } = require('../service/config');
const bunyan = require('bunyan');

const logger = bunyan.createLogger({
    name: APP_NAME,
    src: false,
    streams: [
        {
            level: LOG_LEVEL,
            stream: process.stdout
        },
        {
            level: 'error',
            stream: process.stderr
        }
    ]
});

module.exports = {
    logger
};
