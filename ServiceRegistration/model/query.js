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

DB.query = (query, column) => {
    let defer = Q.defer();

    let result = {
        request: KeyDefine.ACTION_QUERY,
        target: KeyDefine.TABLE_NAME,
        result: KeyDefine.RESULT_FAILED,
        desc: 'Unknowed error',
        data: null
    };

    let queryOption;
    let validateResult = validate(query);
    if(validateResult === KeyDefine.VALID_LACK_PARAM) {
        result.result = KeyDefine.VALID_LACK_PARAM;
        result.desc = 'Lack of query params';
        defer.resolve(result);
    } else if(validateResult === KeyDefine.VALID_PARAM_TYPE_ERROR) {
        result.result = KeyDefine.VALID_PARAM_TYPE_ERROR;
        result.desc = 'Error param type';
        defer.resolve(result);
    } else if(validateResult === KeyDefine.VALID_SUCCESS) {
        if(column === 'name' || column === undefined) {
            queryOption = sqlQuery.select()
                            .from(KeyDefine.TABLE_NAME)
                            .where({
                                name: query.name,
                                status: 1
                            })
                            .build();
        } else if(column === 'id') {
            queryOption = sqlQuery.select()
                            .from(KeyDefine.TABLE_NAME)
                            .where({
                                id: query.id
                            })
                            .build();
        }

        DBPool.getConnection()
            .then(connection => {
                connection.query(queryOption, (err, rows) => {
                    console.log(queryOption);
                    if(err) {
                        Logger.console('Error in SELECT ' + KeyDefine.TABLE_NAME + ': ' + err);
                        defer.reject(err);
                    } else if(rows.length <= 0) {
                        Logger.console('Empty in SELECT ' + KeyDefine.TABLE_NAME + ': name = ' + query.name);
                        result.result = KeyDefine.RESULT_EMPTY;
                        result.desc = 'Empty result';
                        defer.resolve(result);
                    } else {
                        Logger.console('Success in SELECT ' + KeyDefine.TABLE_NAME + ': name = ' + query.name);
                        Logger.console('Result: ' + JSON.stringify(rows));
                        result.result = KeyDefine.RESULT_SUCCESS;
                        result.desc = 'Query successfully';
                        result.data = rows;
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
