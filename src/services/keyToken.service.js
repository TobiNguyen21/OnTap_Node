'use strict'

const { filter, update } = require('lodash');
const keyTokenModel = require('../models/keyToken.model');

class keyTokenService {
    static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
        try {
            // level 0
            // const tokens = await keyTokenModel.create({
            //     user: userId,
            //     publicKey: publicKey,
            //     privateKey: privateKey
            // });

            // return tokens ? tokens.publicKey : null;

            // level xxx
            const filter = { user: userId };
            const update = { publicKey, privateKey, refreshTokenUsed: [], refreshToken };
            const options = { upsert: true, new: true };

            const tokens = await keyTokenModel.findByIdAndUpdate(filter, update, options);

            return tokens ? tokens.publicKey : null;
        } catch (error) {
            return error
        }
    }
}

module.exports = keyTokenService