'use strict'

const keyTokenModel = require('../models/keyToken.model');
const { Types } = require('mongoose');

class keyTokenService {
    static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {

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

        const tokens = await keyTokenModel.findOneAndUpdate(filter, update, options);

        return tokens ? tokens.publicKey : null;

    }

    static findByUserId = async (userId) => {
        return await keyTokenModel.findOne({ user: new Types.ObjectId(userId) }).lean();
    }

    static removeKeyById = async (id) => {
        return await keyTokenModel.deleteOne({ _id: id });
    }

    static findByRefreshTokenUsed = async (refreshToken) => {
        return await keyTokenModel.findOne({ refreshTokenUsed: refreshToken }).lean();
    }

    static findByRefreshToken = async (refreshToken) => {
        return await keyTokenModel.findOne({ refreshToken });
    }

    static deleteKeyById = async (userId) => {
        return await keyTokenModel.deleteOne({ user: new Types.ObjectId(userId) });
    }
}

module.exports = keyTokenService