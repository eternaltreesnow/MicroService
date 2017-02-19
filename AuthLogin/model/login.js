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

let Login = {};

Login.checkParam = (username, password) => {
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

Login.login = (username, password) => {
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
                if(err) {
                    Logger.console('Login Model: Error in QUERY ' + KeyDefine.TABLE_NAME + ': ' + err);
                    defer.reject(err);
                } else if(rows.length <= 0) {
                    Logger.console('Empty in QUERY ' + KeyDefine.TABLE_NAME + ': username=' + username);
                    result.code = KeyDefine.RESULT_EMPTY;
                    result.desc = 'Username or Password error';
                    defer.resolve(result);
                } else {
                    Logger.console('Login Model: Success in QUERY ' + KeyDefine.TABLE_NAME + ': username=' + username);
                    Logger.console('Login Model: Result: ' + JSON.stringify(rows));

                    if(password === rows[0].password) {
                        Logger.console('Password matched: username=' + username);
                        result.code = KeyDefine.LOGIN_SUCCESS;
                        result.desc = 'Login successfully';
                        result.data = {
                            userId: rows[0].userId,
                            username: rows[0].username,
                            roleId: rows[0].roleId,
                            operation: new Array()
                        };
                        defer.resolve(result);
                    } else {
                        Logger.console('Login Model: Password don\'t match: username=' + username);
                        result.code = KeyDefine.LOGIN_WORNG_PWD;
                        result.desc = 'Username or Password error';
                        defer.resolve(result);
                    }
                }
            });
        }, error => {
            defer.reject(error);
        });

    return defer.promise;
};

// 获取用户被允许执行的operation数组
Login.getOperation = function(userData) {
    let userId = userData.userId;

    let defer = Q.defer();

    let result = {
        code: KeyDefine.RESULT_FAILED,
        desc: 'QUERY operations: Unknowed error',
        data: userData
    };

    let queryOption = 'SELECT name FROM operation WHERE operationId IN ( SELECT operationId from rolemapoperation WHERE roleId IN ( SELECT roleId from user WHERE userId = ' + userId + ' ) )';

    DBPool.getConnection()
        .then(connection => {
            connection.query(queryOption, (err, rows) => {
                if(err) {
                    Logger.console('Error in QUERY operations: ' + err);
                    defer.reject(err);
                } else if(rows.length <= 0) {
                    Logger.console('Empty in QUERY operations: userId=' + userId);
                    result.code = KeyDefine.RESULT_EMPTY;
                    result.desc = 'Empty in QUERY operations: userId=' + userId;
                    defer.resolve(result);
                } else {
                    Logger.console('Success in QUERY operations: userId=' + userId);
                    Logger.console('Result: ' + JSON.stringify(rows));
                    result.code = KeyDefine.RESULT_SUCCESS;
                    result.desc = 'Success in QUERY operations: userId=' + userId;
                    for(let item of rows) {
                        userData.operation.push(item.name);
                    }
                    result.data = userData;
                    defer.resolve(result);
                }
            });
        }, error => {
            defer.reject(error);
        });

    return defer.promise;
}

module.exports = Login;
