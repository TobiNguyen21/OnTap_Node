'use strict'

const mongoose = require('mongoose'); // Erase if already required


const DOCUMENT_NAME = 'Key';
const COLLECTION_NAME = 'Keys';


// Declare the Schema of the Mongo model
var keyTokenSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Shop'
    },
    publicKey: {
        type: String,
        required: true
    },
    privateKey: {
        type: String,
        required: true
    },
    refreshTokenUsed: {
        type: Array,
        default: []  //  nhung RT da dc dung
    },
    refreshToken: {
        type: String,
        require: true
    }
}, {
    collection: COLLECTION_NAME,
    timestamps: true
});

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, keyTokenSchema);