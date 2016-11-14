'use strict'

const Q = require('q');
const Define = require('../define');
const DBPool = require('./dbpool');
const Logger = require('../log/logger');
const sqlQuery = require('sql-query').Query();
const queryModel = require('./query');

let KeyDefine = new Define;
KeyDefine.TABLE_NAME = 'service';

let validate = (param) => {
    return KeyDefine.VALID_SUCCESS;
};

let DB = {};

DB.update = (query) => {
    let defer = Q.defer();

    let result = {
        request: KeyDefine.ACTION_UPDATE,
        target: KeyDefine.TABLE_NAME,
        result: KeyDefine.RESULT_FAILED,
        desc: 'Unknowed error'
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
        queryModel.query({id: query.id}, 'id')
            .then(queryResult => {
                if(queryResult.data) {
                    let updateData = {
                        name: query.name || queryResult.data[0].name,
                        ip: query.ip || queryResult.data[0].ip,
                        port: query.port || queryResult.data[0].port,
                        group: query.group || queryResult.data[0].group,
                        status: query.status !== undefined ? query.status : queryResult.data[0].status
                    };
                    queryOption = sqlQuery.update()
                                    .into(KeyDefine.TABLE_NAME)
                                    .set({
                                        name: updateData.name,
                                        ip: updateData.ip,
                                        port: updateData.port,
                                        group: updateData.group,
                                        modify_time: Math.floor(+new Date() / 1000),
                                        status: updateData.status
                                    })
                                    .where({
                                        id: query.id
                                    })
                                    .build();
                    DBPool.getConnection()
                        .then(connection => {
                            connection.query(queryOption, (err, rows) => {
                                if(err) {
                                    Logger.console('Error in UPDATE ' + KeyDefine.TABLE_NAME + ': ' + err);
                                    defer.reject(err);
                                } else if(rows.affectedRows === 0) {
                                    Logger.console('Failed in UPDATE ' + KeyDefine.TABLE_NAME + ': None column affected, WHERE id = ' + query.id);
                                    result.result = KeyDefine.RESULT_UPDATE_FAILED;
                                    result.desc = 'None column affected';
                                    defer.resolve(result);
                                } else {
                                    Logger.console('Success in UPDATE ' + KeyDefine.TABLE_NAME + ': ' + JSON.stringify(query));
                                    result.result = KeyDefine.RESULT_SUCCESS;
                                    result.desc = 'Successfully update';
                                    defer.resolve(result);
                                }
                            });
                        }, error => {
                            defer.reject(error);
                        });
                } else {
                    Logger.console('Failed in UPDATE ' + KeyDefine.TABLE_NAME + ': Query empty result, WHERE id = ' + query.id);
                    result.result = KeyDefine.RESULT_UPDATE_FAILED;
                    result.desc = 'None column affected';
                    defer.resolve(result);
                }
            }, error => {
                Logger.console('Error in UPDATE ' + KeyDefine.TABLE_NAME + ': ' + error);
                defer.reject(error);
            });
    } else {
        defer.resolve(result);
    }

    return defer.promise;
};

module.exports = DB;
