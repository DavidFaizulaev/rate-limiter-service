const gracefulShutdown = require('http-graceful-shutdown');
const { logger } = require('./logger');

const registerShutdownEvent = (server) => {
    gracefulShutdown(server, {
        signals: 'SIGINT SIGTERM',
        onShutdown: cleanup,
        development: false
    });
};

const cleanup = async () => {
    logger.info('Gracefully shutting down');
};

module.exports = { registerShutdownEvent };
