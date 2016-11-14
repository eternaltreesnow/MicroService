'use strict'

const Q = require('q');
const Define = require('../define');
const DBPool = require('./dbpool');
const Logger = require('../log/logger');
const sqlQuery = require('sql-query').Query();

let KeyDefine = new Define;
KeyDefine.TABLE_NAME = 'service';

let validate = (param) => {
    return KeyDefine.VALID_SUCCESS;
};

let DB = {};

DB.remove = (query) => {
    let defer = Q.defer();

    let result = {
        request: KeyDefine.ACTION_REMOVE,
        target: KeyDefine.TABLE_NAME,
        result: KeyDefine.RESULT_FAILED,
        desc: 'Unknowed error'
    };

    let queryOption;
    let validateResult = validate(query);
    if(validateResult === KeyDefine.VALID_LACK_PARAM) {
        result.result = KeyDefine.VALID_LACK_PARAM;
        result.desc = 'Lack of delete params';
        defer.resolve(result);
    } else if(validateResult === KeyDefine.VALID_PARAM_TYPE_ERROR) {
        result.result = KeyDefine.VALID_PARAM_TYPE_ERROR;
        result.desc = 'Error param type';
        defer.resolve(result);
    } else if(validateResult === KeyDefine.VALID_SUCCESS) {
        queryOption = sqlQuery.update()
                        .into(KeyDefine.TABLE_NAME)
                        .set({
                            modify_time: Math.floor(+new Date() / 1000),
                            status: 0
                        })
                        .where({
                            id: query.id,
                            status: 1
                        })
                        .build();

        DBPool.getConnection()
            .then(connection => {
                connection.query(queryOption, (err, rows) => {
                    if(err) {
                        Logger.console('Error in DELETE ' + KeyDefine.TABLE_NAME + ': ' + err);
                        defer.reject(err);
                    } else if(rows.affectedRows === 0) {
                        Logger.console('Failed in DELETE ' + KeyDefine.TABLE_NAME + ': None column affected, WHERE id = ' + query.id);
                        result.result = KeyDefine.RESULT_DELETE_FAILED;
                        result.desc = 'None column affected';
                        defer.resolve(result);
                    } else {
                        Logger.console('Success in DELETE ' + KeyDefine.TABLE_NAME + ': id = ' + query.id + '. Affected columns: ' + rows.affectedRows);
                        result.result = KeyDefine.RESULT_SUCCESS;
                        result.desc = 'Delete successfully';
                        defer.resolve(result);
                    }
                });
            }, error => {
                defer.reject(error);
            });
    } else {
        defer.resolve(result);
    }

    return defer.promise;
};

module.exports = DB;
