'use strict'

const mongoose = require('mongoose');
const _MAXPOOL = 50;

const mongoUrl = ''

// Singleton design partern: chỉ khởi tạo một kết nối, gọi 1 lần, những lần sau sẽ dùng cái đã có 
// || tạo 1 object từ 1 class và chắc chắn rằng chỉ có 1 object đc tạo từ nó
class Database {
    constructor() {
        this.connect();
    }

    connect(type = 'mongodb') {
        if (1 === 1) {
            mongoose.set('debug', true);
            mongoose.set('debug', { color: true });
        }

        mongoose.connect(mongoUrl, {
            maxPoolSize: _MAXPOOL
        }).then(_ => console.log('Connected Mongodb Success')).catch(err => console.log('Error Connect!'));
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
}

module.exports = Database.getInstance();