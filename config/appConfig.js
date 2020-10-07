
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const ExpressConfigModule = require('./expressConfig');

class AppConfig {
  constructor(app) {

    process.on('unhandledRejection', (reason, p) => {
      _logger.error("unhandles Rejection")
      // console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
    });
    this.app = app;
  }

  includeConfig() {
    this.loadAppLevelConfig();
    this.loadExpressConfig();
  }

  loadAppLevelConfig() {
    this.app.use(
      bodyParser.json(),
      bodyParser.urlencoded({ extended: true }),
      // expressLogger
    );
    this.app.use(
      express.static(__dirname + '/public'),
      cors(),
    );

    require("../responseHandler");
    this.app.use(async (req, res, next) => {
      if (req.headers['authorization']) {
        try {
          next();
        } catch (e) {
          return _handleResponse(req, res, e);
        }
      } else {
        next();
      }
    });

  }

  loadExpressConfig() {
    new ExpressConfigModule(this.app).setAppEngine();
  }
}
module.exports = AppConfig;
