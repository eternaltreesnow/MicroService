'use strict'

const Config = require('../config');
const Q = require('q');
const mysql = require('mysql');
const Logger = require('../log/logger');

let mysqlPool = mysql.createPool(Config.DBConfig);

let DBPool = {};

DBPool.getConnection = function() {
    var defer = Q.defer();
    mysqlPool.getConnection(function(err, connection) {
        if (err) {
            defer.reject(err);
        } else {
            defer.resolve(connection);
        }
    });
    return defer.promise;
};

module.exports = DBPool;
