/* eslint-disable no-console */
const express = require('express');
const http = require('http');
const AppConfig = require('./config/appConfig');
const Routes = require('./routes');
const Logger = require("./utils/logger")

class Server {
  constructor() {
    this.app = express();
    // this.app.use(cors());
    this.http = http.Server(this.app);
    // eslint-disable-next-line no-underscore-dangle
    global._server = this.app;
  }

  appConfig() {
    new AppConfig(this.app).includeConfig();
    new Logger()
  }

  /* Including app Routes starts */
  includeRoutes() {
    new Routes(this.app).routesConfig();
  }

  /* Including app Routes ends */

  startTheServer() {
    this.appConfig();
    const port = process.env.NODE_ENV === 'dev' ? process.env.PORT_DEV : process.env.PORT_PROD || 4000;
    const host = process.env.NODE_ENV === 'dev' ? process.env.NODE_SERVER_LOCAL : process.env.NODE_SERVER_HOST_PROD || '0.0.0.0';

    this.http.listen(port, host, () => {
      _logger.info(`Listening on http://${host}:${port}`);
    });

    this.includeRoutes();
  }
}

module.exports = new Server();
