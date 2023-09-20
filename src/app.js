const express = require('express');
const app = express();

const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');

// init middlewares
app.use(morgan('dev'));     // logger 
app.use(helmet());          // Helmet helps secure Express apps by setting HTTP response headers.
app.use(compression());     // nén dữ liệu trả ra

// init db
require('./dbs/init.mongodb');
const { checkOverload } = require('./helpers/check.connect');
checkOverload();

// init routes
app.get('/', (req, res, next) => {
    const strCompress = 'hello world'

    return res.status(200).json({
        msg: 'nodejs',
        metadata: strCompress.repeat(10000)
    })
})

// handling error

module.exports = app