const { createEnvObject, mandatory } = require('envboss');

const environmentVariables = createEnvObject({
    APP_NAME: { default: 'rate-limiter' },
    LOG_LEVEL: { default: 'info' },
    PORT: { wrappingFunction: Number, default: 3000 },
    REQUEST_RATE: { wrappingFunction: Number, mandatory },
    REQUEST_INTERVAL: { wrappingFunction: Number, mandatory },
    MAX_REQUEST_SIZE: { default: '1mb' }

});

module.exports = environmentVariables;
