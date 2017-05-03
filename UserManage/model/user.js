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
                connection.release();
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
                    result.data = rows.insertId;
                    defer.resolve(result);
                }
            });
        }, error => {
            defer.reject(error);
        });

    return defer.promise;
};

UserModel.set = function(userId, user) {
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
                        .where({
                            userId: userId
                        })
                        .build();

    DBPool.getConnection()
        .then(connection => {
            connection.query(updateOption, (err, rows) => {
                connection.release();
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
                connection.release();
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

UserModel.hospCount = function(partnerId) {
    let defer = Q.defer();

    let result = {
        request: KeyDefine.ACTION_QUERY,
        target: KeyDefine.TABLE_NAME,
        code: KeyDefine.RESULT_FAILED,
        desc: 'User Model: Unknowed error',
        data: 0
    };

    let queryOption = sqlQuery.select()
                        .from('contract')
                        .from(KeyDefine.TABLE_NAME, 'userId', 'hospitalId', { joinType: 'left' })
                        .count()
                        .where('contract', {
                            partnerId: partnerId
                        })
                        .build();

    DBPool.getConnection()
        .then(connection => {
            connection.query(queryOption, (err, rows) => {
                connection.release();
                if(err) {
                    Logger.console('Error in QUERY ' + KeyDefine.TABLE_NAME);
                    Logger.console(err);
                    defer.reject(err);
                } else {
                    Logger.console(rows);
                    result.code = KeyDefine.RESULT_SUCCESS;
                    result.data = rows[0]['COUNT(*)'];
                    defer.resolve(result);
                }
            });
        }, error => {
            defer.reject(error);
        });

    return defer.promise;
};

UserModel.getHospList = function(partnerId, start, length) {
    let defer = Q.defer();

    let result = {
        request: KeyDefine.ACTION_QUERY,
        target: KeyDefine.TABLE_NAME,
        code: KeyDefine.RESULT_FAILED,
        desc: 'User Model: Unknowed error',
        data: []
    };

    let queryOption = sqlQuery.select()
                        .from('contract')
                        .select('contractId', 'status')
                        .from(KeyDefine.TABLE_NAME, 'userId', 'hospitalId', { joinType: 'left' })
                        .select('userId', 'username', 'realName', 'chargeName')
                        .where('contract', {
                            partnerId: partnerId
                        })
                        .limit(start + ', ' + length)
                        .build();

    DBPool.getConnection()
        .then(connection => {
            connection.query(queryOption, (err, rows) => {
                connection.release();
                if(err) {
                    Logger.console('Error in QUERY ' + KeyDefine.TABLE_NAME);
                    Logger.console(err);
                    defer.reject(err);
                } else if(rows.length <= 0) {
                    Logger.console('Empty in QUERY ' + KeyDefine.TABLE_NAME);
                    result.code = KeyDefine.RESULT_SUCCESS;
                    result.desc = 'Empty in QUERY' + KeyDefine.TABLE_NAME;
                    defer.resolve(result);
                } else {
                    Logger.console('Success in QUERY ' + KeyDefine.TABLE_NAME);
                    result.code = KeyDefine.RESULT_SUCCESS;
                    result.desc = 'Success in QUERY ' + KeyDefine.TABLE_NAME;
                    result.data = rows;
                    defer.resolve(result);
                }
            });
        }, error => {
            defer.reject(error);
        });

    return defer.promise;
};

UserModel.docTechCount = function(roleId) {
    let defer = Q.defer();

    let result = {
        request: KeyDefine.ACTION_QUERY,
        target: KeyDefine.TABLE_NAME,
        code: KeyDefine.RESULT_FAILED,
        desc: 'User Model: Unknowed error',
        data: 0
    };

    let queryOption = sqlQuery.select()
                        .from(KeyDefine.TABLE_NAME)
                        .where({
                            roleId: roleId,
                            teamId: 0
                        })
                        .count()
                        .build();

    DBPool.getConnection()
        .then(connection => {
            connection.query(queryOption, (err, rows) => {
                connection.release();
                if(err) {
                    Logger.console('Error in QUERY ' + KeyDefine.TABLE_NAME);
                    Logger.console(err);
                    defer.reject(err);
                } else {
                    Logger.console(rows);
                    result.code = KeyDefine.RESULT_SUCCESS;
                    result.data = rows[0]['COUNT(*)'];
                    defer.resolve(result);
                }
            });
        }, error => {
            defer.reject(error);
        });

    return defer.promise;
};

UserModel.getDocTechList = function(roleId, start, length) {
    let defer = Q.defer();

    let result = {
        request: KeyDefine.ACTION_QUERY,
        target: KeyDefine.TABLE_NAME,
        code: KeyDefine.RESULT_FAILED,
        desc: 'User Model: Unknowed error',
        data: []
    };

    let queryOption = sqlQuery.select()
                        .from(KeyDefine.TABLE_NAME)
                        .where({
                            roleId: roleId,
                            teamId: 0
                        })
                        .limit(start + ', ' + length)
                        .build();

    DBPool.getConnection()
        .then(connection => {
            connection.query(queryOption, (err, rows) => {
                connection.release();
                if(err) {
                    Logger.console('Error in QUERY ' + KeyDefine.TABLE_NAME);
                    Logger.console(err);
                    defer.reject(err);
                } else if(rows.length <= 0) {
                    Logger.console('Empty in QUERY ' + KeyDefine.TABLE_NAME);
                    result.code = KeyDefine.RESULT_SUCCESS;
                    result.desc = 'Empty in QUERY' + KeyDefine.TABLE_NAME;
                    defer.resolve(result);
                } else {
                    Logger.console('Success in QUERY ' + KeyDefine.TABLE_NAME);
                    result.code = KeyDefine.RESULT_SUCCESS;
                    result.desc = 'Success in QUERY ' + KeyDefine.TABLE_NAME;
                    result.data = rows;
                    defer.resolve(result);
                }
            });
        }, error => {
            defer.reject(error);
        });

    return defer.promise;
};

UserModel.addContract = function(contract) {
    let defer = Q.defer();

    let result = {
        request: KeyDefine.ACTION_INSERT,
        target: 'contract',
        code: KeyDefine.RESULT_FAILED,
        desc: 'User Model: Connection error',
        data: null
    };

    let insertOption = sqlQuery.insert()
                        .into('contract')
                        .set(contract)
                        .build();

    DBPool.getConnection()
        .then(connection => {
            connection.query(insertOption, (err, rows) => {
                connection.release();
                if(err) {
                    Logger.console('Error in INSERT contract');
                    Logger.console(err);
                    defer.reject(err)
                } else if(rows.affectedRows === 0) {
                    Logger.console('Failed in INSERT contract');
                    result.code = KeyDefine.RESULT_ADD_NONE;
                    result.desc = 'Failed in INSERT contract';
                    defer.resolve(result);
                } else {
                    result.code = KeyDefine.RESULT_SUCCESS;
                    result.desc = 'Success in INSERT contract';
                    result.data = rows.insertId;
                    defer.resolve(result);
                }
            });
        }, error => {
            defer.reject(error);
        });

    return defer.promise;
};

module.exports = UserModel;
