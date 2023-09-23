'use strict'

const shopModel = require('../models/shop.model');

module.exports = {
    findByEmail: async ({ email, select = { email: 1, password: 1, name: 1, status: 1, roles: 1 } }) => {
        return await shopModel.findOne({ email }).select(select).lean();
    }
}