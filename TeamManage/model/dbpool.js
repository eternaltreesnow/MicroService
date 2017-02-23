'use strict'

const Q = require('q');
const mysql = require('mysql');
const Logger = require('../util/logger');

const DBConfig = {
    database: 'ecg_auth',
    host: 'localhost',
    user: 'root',
    password: 'root',
    port: 3306
};

let mysqlPool = mysql.createPool(DBConfig);

let DBPool = {};

DBPool.getConnection = function() {
    var defer = Q.defer();
    mysqlPool.getConnection(function(err, connection) {
        if(err) {
            Logger.console(err);
            defer.reject(err);
        } else {
            Logger.console('Mysql get connection successfully.');
            defer.resolve(connection);
        }
    });
    return defer.promise;
};

module.exports = DBPool;
