'use strict'

const ShopModel = require('../models/shop.model');
const crypto = require('crypto');

const keyTokenService = require('./keyToken.service');
const { createTokenPair } = require('../auth/authUtils');
const { getInfoData } = require('../utils/index');
const { ConflictRequestError, BadRequestError } = require('../core/error.response');

const roleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}

class AccessService {
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
                code: 201,
                metadata: {
                    shop: getInfoData({ fileds: ['_id', 'name', 'email'], object: newShop }),
                    tokens
                }
            }
        }

        return {
            code: 200,
            metadata: null
        }
    }
}

module.exports = AccessService;