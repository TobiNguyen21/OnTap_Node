'use strict'

const express = require('express');
const router = express.Router();

router.use('/v1/api', require('./access'));

// router.get('/', (req, res, next) => {
//     const strCompress = 'hello world'

//     return res.status(200).json({
//         msg: 'nodejs',
//         metadata: strCompress.repeat(10000)
//     })
// })

module.exports = router;