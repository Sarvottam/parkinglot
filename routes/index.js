/* eslint-disable global-require */
const express = require('express');

class Routes {
  constructor(app) {
    this.app = app;
  }

  /* creating app Routes starts */
  appRoutes() {
    const v1 = express.Router();
    this.app.use('/api', v1);
    v1.use('/ps', require('./parkingSlot'));
    v1.use('/user', require('./user'));
  }

  routesConfig() {
    this.appRoutes();
  }
}
module.exports = Routes;
