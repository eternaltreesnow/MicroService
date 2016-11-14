'use strict'

const Q = require('q');
const mysql = require('mysql');
const Logger = require('../log/logger');

const DBConfig = {
    database: 'service_registration',
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
            defer.reject(err);
        } else {
            defer.resolve(connection);
        }
    });
    return defer.promise;
};

module.exports = DBPool;
