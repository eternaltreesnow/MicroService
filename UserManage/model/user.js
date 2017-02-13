'use strict'

const Q = require('q');
const sqlQuery = require('sql-query').Query();
const Define = require('../util/define');
const Logger = require('../util/logger');

const DBPool = require('./dbpool');

let KeyDefine = new Define();
KeyDefine.TABLE_NAME = 'user';

let UserModel = {};

UserModel.add = function(user) {
    let defer = Q.defer();

    let result = {
        request: KeyDefine.ACTION_INSERT,
        target: KeyDefine.TABLE_NAME,
        code: KeyDefine.RESULT_FAILED,
        desc: 'User Model: Connection error',
        data: null
    };

    let insertOption = sqlQuery.insert()
                        .into(KeyDefine.TABLE_NAME)
                        .set(user)
                        .build();

    DBPool.getConnection()
        .then(connection => {
            connection.query(insertOption, (err, rows) => {
                Logger.console(insertOption);
                if(err) {
                    Logger.console('Error in INSERT ' + KeyDefine.TABLE_NAME);
                    Logger.console(err);
                    defer.reject(err)
                } else if(rows.affectedRows === 0) {
                    Logger.console('Failed in INSERT ' + KeyDefine.TABLE_NAME);
                    result.code = KeyDefine.RESULT_ADD_NONE;
                    result.desc = 'Failed in INSERT ' + KeyDefine.TABLE_NAME;
                    defer.resolve(result);
                } else {
                    result.code = KeyDefine.RESULT_SUCCESS;
                    result.desc = 'Success in INSERT ' + KeyDefine.TABLE_NAME;
                    result.data = rows[0];
                    defer.resolve(result);
                }
            });
        }, error => {
            defer.reject(error);
        });

    return defer.promise;
};

UserModel.set = function(user) {
    let defer = Q.defer();

    let result = {
        request: KeyDefine.ACTION_UPDATE,
        target: KeyDefine.TABLE_NAME,
        code: KeyDefine.RESULT_FAILED,
        desc: 'User Model: Connection error',
    };

    let updateOption = sqlQuery.update()
                        .into(KeyDefine.TABLE_NAME)
                        .set(user)
                        .build();

    DBPool.getConnection()
        .then(connection => {
            connection.query(updateOption, (err, rows) => {
                Logger.console(updateOption);
                if(err) {
                    Logger.console('Error in UPDATE ' + KeyDefine.TABLE_NAME);
                    Logger.console(err);
                    defer.reject(err);
                } else if (rows.affectedRows <= 0) {
                    Logger.console('Null in UPDATE ' + KeyDefine.TABLE_NAME + ': userId=' + user.userId);
                    result.code = KeyDefine.RESULT_EMPTY;
                    result.desc = 'Null in UPDATE' + KeyDefine.TABLE_NAME + ': userId=' + user.userId;
                    defer.resolve(result);
                } else {
                    Logger.console('Success in UPDATE ' + KeyDefine.TABLE_NAME + ': userId=' + user.userId);
                    result.code = KeyDefine.RESULT_SUCCESS;
                    result.desc = 'Success in UPDATE ' + KeyDefine.TABLE_NAME + ': userId=' + user.userId;
                    defer.resolve(result);
                }
            });
        }, error => {
            defer.reject(error);
        });

    return defer.promise;
};

// 修改用户状态
UserModel.modifyStatus = function(userId, status) {
    let defer = Q.defer();

    let result = {
        request: KeyDefine.ACTION_UPDATE,
        target: KeyDefine.TABLE_NAME,
        code: KeyDefine.RESULT_FAILED,
        desc: 'User Model: Connection error',
    };

    let updateOption = sqlQuery.update()
                        .into(KeyDefine.TABLE_NAME)
                        .set({ status: status })
                        .where({ userId: userId })
                        .build();

    DBPool.getConnection()
        .then(connection => {
            connection.query(updateOption, (err, rows) => {
                Logger.console(updateOption);
                if(err) {
                    Logger.console('Error in UPDATE ' + KeyDefine.TABLE_NAME);
                    Logger.console(err);
                    defer.reject(err);
                } else if (rows.affectedRows <= 0) {
                    Logger.console('Null in UPDATE ' + KeyDefine.TABLE_NAME + ': userId=' + userId);
                    result.code = KeyDefine.RESULT_EMPTY;
                    result.desc = 'Null in UPDATE' + KeyDefine.TABLE_NAME + ': userId=' + userId;
                    defer.resolve(result);
                } else {
                    Logger.console('Success in UPDATE ' + KeyDefine.TABLE_NAME + ': userId=' + userId);
                    result.code = KeyDefine.RESULT_SUCCESS;
                    result.desc = 'Success in UPDATE ' + KeyDefine.TABLE_NAME + ': userId=' + userId;
                    defer.resolve(result);
                }
            });
        }, error => {
            defer.reject(error);
        });

    return defer.promise;
};

module.exports = UserModel;
