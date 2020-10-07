const express = require('express');

const router = express.Router();
const controller = require('../controllers');

router.post('/register', controller.user.register);
router.get('/getAllUser', controller.user.getAllUser);

module.exports = router;
