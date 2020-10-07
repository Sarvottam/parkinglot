const path = require('path');
const express = require('express');

class ExpressConfig {
  constructor(app) {
    this.app = app;
  }

  setAppEngine() {
    this.app.set('view engine', 'pug');
  }
}
module.exports = ExpressConfig;
