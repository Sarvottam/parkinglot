/* eslint-disable no-underscore-dangle */
const winston = require('winston');

class Logger {
  constructor() {
    const logger = winston.createLogger({
      transports: [
        new winston.transports.Console({
          level: process.env.LOG_LEVEL || 'info',
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple(),
          ),
        }),
        new winston.transports.File({ filename: 'logger.log' }),
      ],
    });
    global._logger = logger;
    _logger.info('done log config');
  }
}

module.exports = Logger;
