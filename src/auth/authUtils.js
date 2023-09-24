'use strict'
const JWT = require('jsonwebtoken');

const keyTokenService = require('../services/keyToken.service');

const asyncHandler = require('../middleware/async');

const { AuthFailureError, NotFoundError } = require('../core/error.response');

const HEADER = require('../configs/header');

const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        // accessToken
        const accessToken = JWT.sign(payload, publicKey, {
            expiresIn: '2 days'
        });

        const refreshToken = JWT.sign(payload, privateKey, {
            expiresIn: '7 days'
        });

        JWT.verify(accessToken, publicKey, (error, decode) => {
            if (error) {
                console.log(`error verify::`, error);
            } else {
                console.log(`decode verify::`, decode);
            }
        })
        return { accessToken, refreshToken };
    } catch (error) {
        console.log(error);
    }
}

const authentication = asyncHandler(async (req, res, next) => {
    /* 
        1 -  check userId missing??
        2 - get accessToken
        3 - verify Token
        4 - check user in dbs
        5 - check keyStore whith
    */
    const userId = req.headers[HEADER.CLIENT_ID];
    if (!userId) throw new AuthFailureError('Invalid Request');


    // 2.
    const keyStore = await keyTokenService.findByUserId(userId);
    if (!keyStore) throw new NotFoundError('Not found keyStore');

    console.log(keyStore);

    // 3.
    const accessToken = req.headers[HEADER.AUTHORIZATION];
    if (!accessToken) throw new AuthFailureError('Invalid Request');

    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
        if (userId !== decodeUser.userId) throw new AuthFailureError('Invalid UserID');
        req.keyStore = keyStore;
        console.log("keystore: ", req.keyStore);
        return next();
    } catch (error) {
        throw error;
    }
})

module.exports = {
    createTokenPair,
    authentication
}