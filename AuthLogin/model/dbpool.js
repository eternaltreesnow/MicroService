'use strict'

const Q = require('q');
const mysql = require('mysql');
const Logger = require('../log/logger');

const DBConfig = {
    database: 'auth',
    host: 'authinstance.cvz2dqoouwkc.us-west-2.rds.amazonaws.com',
    user: 'root',
    password: 'rootroot',
    port: 3306
};

let mysqlPool = mysql.createPool(DBConfig);

let DBPool = {};

DBPool.getConnection = function() {
    var defer = Q.defer();
    mysqlPool.getConnection(function(err, connection) {
        if(err) {
            Logger.console(err);
            Logger.log(err);
            defer.reject(err);
        } else {
            Logger.console('Mysql get connection successfully.');
            // Logger.log('Mysql get connection successfully.');
            defer.resolve(connection);
        }
    });
    return defer.promise;
};

module.exports = DBPool;
