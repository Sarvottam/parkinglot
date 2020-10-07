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
            filename: 'logger/logger.log',
            dataPattern: 'YYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
            level: process.env.LOG_LEVEL || 'info',
          }),
          new winston.transports.Console({
            level: process.env.LOG_LEVEL || 'info',
            format: logFormat,
          }),
        ],
      });
      // const logger = winston.createLogger({
      //   transports: [
      //     new winston.transports.Console({
      //       level: process.env.LOG_LEVEL || 'info',
      //       format: winston.format.combine(
      //         winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
      //         winston.format.colorize(),
      //         winston.format.simple(),
      //       ),
      //     }),
      //     new winston.transports.File({ filename: 'logger.log' }),
      //   ],
      // });
      global._logger = logger;
      _logger.info('done log config');
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = Logger;
