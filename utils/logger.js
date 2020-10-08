/* eslint-disable no-underscore-dangle */
const winston = require('winston');
const WinstonDailyRotateFile = require('winston-daily-rotate-file');

class Logger {
  constructor() {
    try {
      const logFormat = winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
        winston.format.align(),
        winston.format.printf((info) => `${info.timestamp} ${info.level} ${info.message}`),

      );
      const logger = winston.createLogger({
        format: logFormat,
        transports: [
          // new winston.transports.File({ filename: 'logger.log' }),
          new WinstonDailyRotateFile({
            filename: 'logger/error_logger.log',
            dataPattern: 'YYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
            level: 'error',
          }),
          new WinstonDailyRotateFile({
            filename: 'logger/info_logger.log',
            dataPattern: 'YYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
            level: 'info',
          }),
          new winston.transports.Console({
            level: process.env.LOG_LEVEL || 'info',
            format: logFormat,
          }),
        ],
      });
      global._logger = logger;
      _logger.info('done log config');
    } catch (e) {
      _logger.error(`Error intialising Logger ${e}`);
    }
  }
}

module.exports = Logger;
