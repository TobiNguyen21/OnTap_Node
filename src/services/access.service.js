'use strict'

const ShopModel = require('../models/shop.model');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

const keyTokenService = require('./keyToken.service');
const { createTokenPair } = require('../auth/authUtils');
const { getInfoData } = require('../utils/index');
const { ConflictRequestError, BadRequestError, AuthFailureError } = require('../core/error.response');

const { findByEmail } = require('../services/shop.service');

const roleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}

class AccessService {

    /* 
        1 - check email in dbs
        2 - match password
        3 - create AT vs RT  -> save
        4 - generate tokens
        5 - get data return login
    */
    static login = async ({ email, password, refreshToken = null }) => {

        // 1.
        const foundShop = await findByEmail({ email });
        if (!foundShop) throw new BadRequestError('Shop not registered');   // check email in dbs

        // 2.
        const match = bcrypt.compareSync(password, foundShop.password);     // match password
        if (!match) throw new AuthFailureError('Authentication error');

        // 3.
        // created privateKey, publicKey
        const privateKey = crypto.randomBytes(64).toString('hex');
        const publicKey = crypto.randomBytes(64).toString('hex');

        // 4. generate tokens
        const { _id: userId } = foundShop;
        const tokens = await createTokenPair({ userId: userId, email }, publicKey, privateKey);

        await keyTokenService.createKeyToken({
            userId: userId,
            refreshToken: tokens.refreshToken,
            privateKey,
            publicKey
        })

        return {
            shop: getInfoData({ fileds: ['_id', 'name', 'email'], object: foundShop }),
            tokens
        }
    }

    static signUp = async ({ name, email, password }) => {
        const hodelShop = await ShopModel.findOne({ email }).lean();
        if (hodelShop) {
            throw new BadRequestError('Error: Shop already registered!');
        }

        const newShop = await ShopModel.create({ name, email, password, roles: [roleShop.SHOP] });

        if (newShop) {
            // created privateKey, publicKey
            const privateKey = crypto.randomBytes(64).toString('hex');
            const publicKey = crypto.randomBytes(64).toString('hex')

            console.log({ privateKey, publicKey });

            // save collection keystore
            const keyStore = await keyTokenService.createKeyToken({
                userId: newShop._id,
                publicKey,
                privateKey
            });

            if (!keyStore) {
                throw new BadRequestError('keyStore error ');
            }

            // created token pair
            const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey);
            console.log(`Created Token Success::`, tokens);

            return {
                shop: getInfoData({ fileds: ['_id', 'name', 'email'], object: newShop }),
                tokens
            }
        }

        return null;
    }
}

module.exports = AccessService;