'use strict'

const Q = require('q');
const Define = require('../../util/define');
const DBPool = require('../dbpool');
const Logger = require('../../util/logger');
const sqlQuery = require('sql-query').Query();

let KeyDefine = new Define();
KeyDefine.TABLE_NAME = 'service';

let Auth = {};

Auth.checkParam = (name, password) => {
    let defer = Q.defer();

    let result = {
        code: KeyDefine.RESULT_FAILED,
        desc: 'Auth Model: Unknowed error'
    };

    if(name === undefined || name.length === 0) {
        result.code = KeyDefine.LACK_PARAM_SERVICEID;
        result.desc = 'Auth Model: Lack of name';
        defer.resolve(result);
    } else if(password === undefined || password.length === 0) {
        result.code = KeyDefine.LACK_PARAM_PWD;
        result.desc = 'Auth Model: Lack of password';
        defer.resolve(result);
    } else if(name.length > 0 && password.length > 0) {
        result.code = KeyDefine.RESULT_SUCCESS;
        result.desc = 'Auth Model: Params valid';
        defer.resolve(result);
    } else {
        defer.resolve(result);
    }

    return defer.promise;
};

Auth.auth = function(name, password) {
    let defer = Q.defer();

    let result = {
        request: KeyDefine.ACTION_LOGIN,
        target: KeyDefine.TABLE_NAME,
        code: KeyDefine.RESULT_FAILED,
        desc: 'Auth Model: Unknowed error',
        data: null
    };

    let queryOption = sqlQuery.select()
                        .from(KeyDefine.TABLE_NAME)
                        .where({
                            name: name
                        })
                        .build();

    DBPool.getConnection()
        .then(connection => {
            connection.query(queryOption, (err, rows) => {
                connection.release();
                if(err) {
                    Logger.console('Auth Model: Error in QUERY ' + KeyDefine.TABLE_NAME + ': ' + err);
                    defer.reject(err);
                } else if(rows.length <= 0) {
                    Logger.console('Auth Model: Empty in QUERY ' + KeyDefine.TABLE_NAME + ': name=' + name);
                    result.code = KeyDefine.RESULT_EMPTY;
                    result.desc = 'Empty in QUERY ' + KeyDefine.TABLE_NAME + ': name=' + name;
                    defer.resolve(result);
                } else {
                    Logger.console('Auth Model: Success in QUERY ' + KeyDefine.TABLE_NAME + ': name=' + name);
                    Logger.console('Auth Model: Result: ' + JSON.stringify(rows));

                    if(password === rows[0].password) {
                        Logger.console('Auth Model: Password matched: name=' + name);
                        result.code = KeyDefine.RESULT_SUCCESS;
                        result.desc = 'Password matched, login successfully';
                        result.data = {
                            serviceId: rows[0].serviceId,
                            name: rows[0].name,
                            remark: rows[0].remark
                        };
                        defer.resolve(result);
                    } else {
                        Logger.console('Auth Model: Password don\'t match: name=' + name);
                        result.code = KeyDefine.LOGIN_WORNG_PWD;
                        result.desc = 'Password don\'t match';
                        defer.resolve(result);
                    }
                }
            });
        }, error => {
            Logger.console(error);
            defer.reject(error);
        });

    return defer.promise;
};

module.exports = Auth;
