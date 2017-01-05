'use strict'

const Q = require('q');
const Define = require('../util/define');
const DBPool = require('./dbpool');
const Logger = require('../util/logger');
const sqlQuery = require('sql-query').Query();

let KeyDefine = new Define();
KeyDefine.TABLE_NAME = 'user';

let validate = (param) => {
    return KeyDefine.VALID_SUCCESS;
};

let loginModel = {};

loginModel.checkParam = (username, password) => {
    let defer = Q.defer();

    let result = {
        code: KeyDefine.RESULT_FAILED,
        desc: 'Unknowed error'
    };

    if(username === undefined || username.length === 0) {
        result.code = KeyDefine.LACK_PARAM_USERNAME;
        result.desc = 'Lack of username';
        defer.reject(result);
    } else if(password === undefined || password.length === 0) {
        result.code = KeyDefine.LACK_PARAM_PWD;
        result.desc = 'Lack of password';
        defer.reject(result);
    } else if(username.length > 0 && password.length > 0) {
        result.code = KeyDefine.RESULT_SUCCESS;
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
        code: KeyDefine.RESULT_FAILED,
        desc: 'Login Model: Unknowed error',
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
                    Logger.console('Login Model: Error in QUERY ' + KeyDefine.TABLE_NAME + ': ' + err);
                    defer.reject(err);
                } else if(rows.length <= 0) {
                    Logger.console('Login Model: Empty in QUERY ' + KeyDefine.TABLE_NAME + ': username=' + username);
                    result.code = KeyDefine.RESULT_EMPTY;
                    result.desc = 'Login Model: Empty in QUERY ' + KeyDefine.TABLE_NAME + ': username=' + username;
                    defer.resolve(result);
                } else {
                    Logger.console('Login Model: Success in QUERY ' + KeyDefine.TABLE_NAME + ': username=' + username);
                    Logger.console('Login Model: Result: ' + JSON.stringify(rows));

                    if(password === rows[0].password) {
                        Logger.console('Login Model: Password matched: username=' + username);
                        result.code = KeyDefine.LOGIN_SUCCESS;
                        result.desc = 'Login Model: Password matched, login successfully';
                        result.data = {
                            userId: rows[0].id,
                            username: rows[0].username
                        };
                        defer.resolve(result);
                    } else {
                        Logger.console('Login Model: Password don\'t match: username=' + username);
                        result.code = KeyDefine.LOGIN_WORNG_PWD;
                        result.desc = 'Login Model: Password don\'t match';
                        defer.resolve(result);
                    }
                }
            });
        }, error => {
            defer.reject(error);
        });

    return defer.promise;
};

module.exports = loginModel;
