const express = require('express');
const app = express();

const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');

// init middlewares
app.use(morgan('dev'));     // logger 
app.use(helmet());          // Helmet helps secure Express apps by setting HTTP response headers.
app.use(compression());     // nén dữ liệu trả ra
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}))

// init db
require('./dbs/init.mongodb');
// const { checkOverload } = require('./helpers/check.connect');
// checkOverload();

// init routes
app.use('/', require('./routes/index'));


// handling error
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    const statusCode = error.status || 500;
    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        message: error.message || 'Internal Server Error'
    })
})

module.exports = app