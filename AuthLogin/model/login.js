'use strict'

const Q = require('q');
const Define = require('../define');
const DBPool = require('./dbpool');
const Logger = require('../log/logger');
const sqlQuery = require('sql-query').Query();

let KeyDefine = new Define;
KeyDefine.TABLE_NAME = 'user';

let validate = (param) => {
    return KeyDefine.VALID_SUCCESS;
};

let loginModel = {};

loginModel.checkParam = (username, password) => {
    let defer = Q.defer();

    let result = {
        result: KeyDefine.RESULT_FAILED,
        desc: 'Unknowed error'
    };

    if(username === undefined || username.length === 0) {
        result.result = KeyDefine.LACK_PARAM_USERNAME;
        result.desc = 'Lack of username';
        defer.reject(result);
    } else if(password === undefined || password.length === 0) {
        result.result = KeyDefine.LACK_PARAM_PWD;
        result.desc = 'Lack of password';
        defer.reject(result);
    } else if(username.length > 0 && password.length > 0) {
        result.result = KeyDefine.RESULT_SUCCESS;
        result.desc = 'Params valid';
        defer.resolve(result);
    } else {
        defer.reject(result);
    }

    return defer.promise;
};

loginModel.login = (username, password) => {
    let defer = Q.defer();

    let result = {
        request: KeyDefine.ACTION_LOGIN,
        target: KeyDefine.TABLE_NAME,
        result: KeyDefine.RESULT_FAILED,
        desc: 'Unknowed error',
        data: null
    };

    let queryOption = sqlQuery.select()
                        .from(KeyDefine.TABLE_NAME)
                        .where({
                            username: username
                        })
                        .build();

    DBPool.getConnection()
        .then(connection => {
            connection.query(queryOption, (err, rows) => {
                Logger.console(queryOption);
                if(err) {
                    Logger.console('Error in QUERY ' + KeyDefine.TABLE_NAME + ': ' + err);
                    defer.reject(err);
                } else if(rows.length <= 0) {
                    Logger.console('Empty in QUERY ' + KeyDefine.TABLE_NAME + ': username=' + username);
                    result.result = KeyDefine.RESULT_EMPTY;
                    result.desc = 'Empty in QUERY ' + KeyDefine.TABLE_NAME + ': username=' + username;
                    defer.resolve(result);
                } else {
                    Logger.console('Success in QUERY ' + KeyDefine.TABLE_NAME + ': username=' + username);
                    Logger.console('Result: ' + JSON.stringify(rows));

                    if(password === rows[0].password) {
                        Logger.console('Password matched: username=' + username);
                        result.result = KeyDefine.LOGIN_SUCCESS;
                        result.desc = 'Password matched, login successfully';
                        result.data = rows[0].id;
                        defer.resolve(result);
                    } else {
                        Logger.console('Password don\'t match: username=' + username);
                        result.result = KeyDefine.LOGIN_WORNG_PWD;
                        result.desc = 'Password don\'t match';
                        defer.resolve(result);
                    }
                }
            });
        }, error => {
            defer.reject(error);
        });

    return defer.promise;
};

