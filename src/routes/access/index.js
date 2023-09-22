'use strict'

const express = require('express');
const router = express.Router();

const mainController = require('../../controllers/access.controller');

router.post('/shop/signup', mainController.signUp);

module.exports = router;