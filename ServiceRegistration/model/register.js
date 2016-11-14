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

DB.register = (query) => {
    let defer = Q.defer();

    let result = {
        request: KeyDefine.ACTION_REGISTER,
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
        queryOption = sqlQuery.insert()
                        .into(KeyDefine.TABLE_NAME)
                        .set({
                            name: query.name,
                            ip: query.ip,
                            port: query.port,
                            group: query.group,
                            create_time: Math.floor(+new Date() / 1000),
                            modify_time: 0
                        })
                        .build();

        DBPool.getConnection()
            .then(connection => {
                connection.query(queryOption, (err, rows) => {
                    if(err) {
                        Logger.console('Error in INSERT ' + KeyDefine.TABLE_NAME + ': ' + err);
                        defer.reject(err);
                    } else if(rows.affectedRows === 0) {
                        Logger.console('Error in INSERT ' + KeyDefine.TABLE_NAME + ': None column affected');
                        result.result = KeyDefine.RESULT_ADD_NONE;
                        result.desc = 'None column affected';
                        defer.resolve(result);
                    } else {
                        Logger.console('Success in INSERT ' + KeyDefine.TABLE_NAME + ': ' + JSON.stringify(query));
                        result.result = KeyDefine.RESULT_SUCCESS;
                        result.desc = 'Successfully register';
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
