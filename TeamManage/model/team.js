'use strict'

const Q = require('q');
const sqlQuery = require('sql-query').Query();
const Define = require('../util/define');
const Logger = require('../util/logger');

const DBPool = require('./dbpool');

let KeyDefine = new Define();
KeyDefine.TABLE_NAME = 'team';

let Team = {};

Team.getTeamIdByUserId = function(userId) {
    let defer = Q.defer();

    let result = {
        request: KeyDefine.ACTION_QUERY,
        target: KeyDefine.TABLE_NAME,
        code: KeyDefine.RESULT_FAILED,
        desc: 'User Model: Connection error',
        data: null
    };

    let queryOption = sqlQuery.select()
                        .from('user')
                        .select('teamId')
                        .where({
                            'userId': userId
                        })
                        .build();

    Logger.console(queryOption);

    DBPool.getConnection()
        .then(connection => {
            connection.query(queryOption, (err, rows) => {
                connection.release();
                if(err) {
                    Logger.console('Error in QUERY user');
                    Logger.console(err);
                    defer.reject(err);
                } else if(rows.length <= 0) {
                    Logger.console('Empty in QUERY user: userId=' + userId);
                    result.code = KeyDefine.RESULT_SUCCESS;
                    result.desc = 'Empty in QUERY user';
                    defer.resolve(result);
                } else {
                    Logger.console('Success in QUERY user');
                    Logger.console(rows[0]);
                    result.code = KeyDefine.RESULT_SUCCESS;
                    result.desc = 'Success in QUERY user';
                    result.data = rows[0].teamId;
                    defer.resolve(result);
                }
            });
        }, error => {
            defer.reject(error);
        });

    return defer.promise;
};

Team.getPartnerIdByUserId = function(userId) {
    let defer = Q.defer();

    let result = {
        request: KeyDefine.ACTION_QUERY,
        target: KeyDefine.TABLE_NAME,
        code: KeyDefine.RESULT_FAILED,
        desc: 'Team Model: Connection error',
        data: null
    };

    let queryOption = sqlQuery.select()
                        .from(KeyDefine.TABLE_NAME)
                        .select('partnerId')
                        .from('user', 'teamId', 'teamId', { joinType: 'left' })
                        .where('user', {
                            'userId': userId
                        })
                        .build();

    Logger.console(queryOption);

    DBPool.getConnection()
        .then(connection => {
            connection.query(queryOption, (err, rows) => {
                connection.release();
                if(err) {
                    Logger.console('Error in QUERY ' + KeyDefine.TABLE_NAME);
                    Logger.console(err);
                    defer.reject(err);
                } else if(rows.length <= 0) {
                    Logger.console('Empty in QUERY ' + KeyDefine.TABLE_NAME + ': userId=' + userId);
                    result.code = KeyDefine.RESULT_SUCCESS;
                    result.desc = 'Empty in QUERY' + KeyDefine.TABLE_NAME;
                    defer.resolve(result);
                } else {
                    Logger.console('Success in QUERY ' + KeyDefine.TABLE_NAME);
                    Logger.console(rows[0]);
                    result.code = KeyDefine.RESULT_SUCCESS;
                    result.desc = 'Success in QUERY ' + KeyDefine.TABLE_NAME;
                    result.data = rows[0].partnerId;
                    defer.resolve(result);
                }
            });
        }, error => {
            defer.reject(error);
        });

    return defer.promise;
};

Team.count = function(partnerId) {
    let defer = Q.defer();

    let result = {
        request: KeyDefine.ACTION_QUERY,
        target: KeyDefine.TABLE_NAME,
        code: KeyDefine.RESULT_FAILED,
        desc: 'Team Model: Unknowed error',
        data: 0
    };

    let queryOption = sqlQuery.select()
                        .from(KeyDefine.TABLE_NAME)
                        .count()
                        .where({
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

/**
 * 获取团队列表
 * @param  {Number} partnerId  合伙人id
 * @param  {Number} start      起始位置
 * @param  {Number} length     筛选长度
 * @return {Array}             团队列表
 */
Team.getList = function(partnerId, start, length) {
    let defer = Q.defer();

    let result = {
        request: KeyDefine.ACTION_QUERY,
        target: KeyDefine.TABLE_NAME,
        code: KeyDefine.RESULT_FAILED,
        desc: 'Team Model: Unknowed error',
        data: []
    };

    let queryOption = sqlQuery.select()
                        .from(KeyDefine.TABLE_NAME)
                        .select('teamId', 'name', 'state')
                        .from('user', 'userId', 'leaderId', { joinType: 'left' })
                        .select('realName')
                        .where({
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

module.exports = Team;
