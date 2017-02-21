'use strict'

const Q = require('q');
const Define = require('../util/define');
const DBPool = require('./dbpool');
const Logger = require('../util/logger');
const sqlQuery = require('sql-query').Query();

let KeyDefine = new Define();
KeyDefine.TABLE_NAME = 'role';

let Role = {};

// 获取角色端Uri
Role.getUri = function(roleId) {
    let defer = Q.defer();

    let result = {
        request: KeyDefine.ACTION_QUERY,
        target: KeyDefine.TABLE_NAME,
        code: KeyDefine.RESULT_FAILED,
        desc: 'Role Model: Unknowed error',
        data: null
    };

    Logger.console('Role Model: getUri function');

    let queryOption = sqlQuery.select()
                        .from(KeyDefine.TABLE_NAME)
                        .where({
                            roleId: roleId
                        })
                        .build();

    DBPool.getConnection()
        .then(connection => {
            connection.query(queryOption, (err, rows) => {
                connection.release();
                if(err) {
                    Logger.console('Error in QUERY ' + KeyDefine.TABLE_NAME + ': ' + err);
                    defer.reject(err);
                } else if(rows.length <= 0) {
                    Logger.console('Empty in QUERY ' + KeyDefine.TABLE_NAME + ': roleId=' + roleId);
                    result.code = KeyDefine.RESULT_EMPTY;
                    result.desc = 'Empty in QUERY ' + KeyDefine.TABLE_NAME + ': roleId=' + roleId;
                    defer.resolve(result);
                } else {
                    Logger.console('Success in QUERY ' + KeyDefine.TABLE_NAME + ': roleId=' + roleId);

                    result.code = KeyDefine.RESULT_SUCCESS;
                    result.desc = 'Success in QUERY ' + KeyDefine.TABLE_NAME + ': roleId=' + roleId;
                    result.data = rows[0].uri;
                    defer.resolve(result);
                }
            });
        }, error => {
            defer.reject(error);
        });
    return defer.promise;
};

module.exports = Role;
