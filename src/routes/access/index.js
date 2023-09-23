'use strict'

const express = require('express');
const router = express.Router();

const mainController = require('../../controllers/access.controller');
const asyncHandler = require('../../middleware/async');

router.post('/shop/signup', asyncHandler(mainController.signUp));

module.exports = router;