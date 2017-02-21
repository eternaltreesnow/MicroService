'use strict'

const Q = require('q');
const Define = require('../../util/define');
const DBPool = require('../dbpool');
const Logger = require('../../util/logger');
const sqlQuery = require('sql-query').Query();

let KeyDefine = new Define();
KeyDefine.TABLE_NAME = 'service_token';

let Token = {};

Token.generate = function(serviceName, accessToken, ttl) {
    let defer = Q.defer();

    let result = {
        request: KeyDefine.ACTION_INSERT,
        target: KeyDefine.TABLE_NAME,
        code: KeyDefine.RESULT_FAILED,
        desc: 'Token Model: Unknowed error',
        data: null
    };

    let queryOption = sqlQuery.insert()
                        .into(KeyDefine.TABLE_NAME)
                        .set({
                            serviceName: serviceName,
                            accessToken: accessToken,
                            ttl: ttl
                        })
                        .build();

    DBPool.getConnection()
        .then(connection => {
            connection.query(queryOption, (err, rows) => {
                connection.release();
                if(err) {
                    Logger.console('Token Model: Error in INSERT ' + KeyDefine.TABLE_NAME + ': ' + err);
                    defer.reject(err);
                } else if(rows.affectedRows <= 0) {
                    Logger.console('Token Model: Empty in INSERT ' + KeyDefine.TABLE_NAME);
                    result.desc = 'Empty in INSERT ' + KeyDefine.TABLE_NAME;
                    defer.resolve(result);
                } else {
                    Logger.console('Token Model: Success in INSERT ' + KeyDefine.TABLE_NAME);
                    result.code = KeyDefine.RESULT_SUCCESS;
                    result.desc = 'Token Model: Success in INSERT ' + KeyDefine.TABLE_NAME;
                    result.data = {
                        name: serviceName,
                        accessToken: accessToken
                    };
                    defer.resolve(result);
                }
            });
        }, error => {
            Logger.console(error);
            defer.reject(error);
        });

    return defer.promise;
};

Token.get = function(serviceName, accessToken) {
    let defer = Q.defer();

    let result = {
        request: KeyDefine.ACTION_QUERY,
        target: KeyDefine.TABLE_NAME,
        code: KeyDefine.RESULT_FAILED,
        desc: 'Token Model: Unknowed error',
        data: null
    };

    let queryOption = sqlQuery.select()
                        .from(KeyDefine.TABLE_NAME)
                        .where({
                            serviceName: serviceName,
                            accessToken: accessToken
                        })
                        .build();

    DBPool.getConnection()
        .then(connection => {
            connection.query(queryOption, (err, rows) => {
                Logger.console(queryOption);
                if(err) {
                    Logger.console('Token Model: Error in QUERY ' + KeyDefine.TABLE_NAME + ': ' + err);
                    defer.reject(err);
                } else if(rows.length <= 0) {
                    Logger.console('Token Model: Failed in QUERY ' + KeyDefine.TABLE_NAME);
                    result.desc = 'Empty in QUERY ' + KeyDefine.TABLE_NAME;
                    defer.resolve(result);
                } else {
                    Logger.console('Token Model: Success in QUERY ' + KeyDefine.TABLE_NAME);
                    result.code = KeyDefine.RESULT_SUCCESS;
                    result.desc = 'Token Model: Success in QUERY ' + KeyDefine.TABLE_NAME;
                    result.data = rows[0];
                    defer.resolve(result);
                }
            });
        }, error => {
            Logger.console(error);
            defer.reject(error);
        });

    return defer.promise;
};

module.exports = Token;
