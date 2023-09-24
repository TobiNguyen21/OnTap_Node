'use strict'

const StatusCode = {
    FORBIDDEN: 403,
    CONFLICT: 409
}

const reasonStatusCode = {
    FORBIDDEN: 'Bad request error',
    CONFLICT: 'Conflict error'
}

class ErrorResponse extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}

class ConflictRequestError extends ErrorResponse {
    constructor(message = reasonStatusCode.CONFLICT, statusCode = StatusCode.CONFLICT) {
        super(message, statusCode);
    }
}

class BadRequestError extends ErrorResponse {
    constructor(message = reasonStatusCode.FORBIDDEN, statusCode = StatusCode.FORBIDDEN) {
        super(message, statusCode);
    }
}


const { ReasonPhrases, StatusCodes } = require('../utils/httpStatusCode')

class AuthFailureError extends ErrorResponse {
    constructor(message = ReasonPhrases.UNAUTHORIZED, statusCode = StatusCodes.UNAUTHORIZED) {
        super(message, statusCode);
    }
}

class NotFoundError extends ErrorResponse {
    constructor(message = ReasonPhrases.NOT_FOUND, statusCode = StatusCodes.NOT_FOUND) {
        super(message, statusCode);
    }
}


module.exports = {
    ConflictRequestError,
    BadRequestError,
    AuthFailureError,
    NotFoundError
};