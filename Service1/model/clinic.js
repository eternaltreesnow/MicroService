'use strict'

const Q = require('q');
const sqlQuery = require('sql-query').Query();
const Define = require('../util/define');
const Logger = require('../util/logger');

const DBPool = require('./dbpool');

let KeyDefine = new Define();
KeyDefine.TABLE_NAME = 'clinic';

let validate = (param) => {
    return KeyDefine.VALID_SUCCESS;
};

let clinicModel = {};

clinicModel.add = function(clinic) {
    let defer = Q.defer();

    let result = {
        request: KeyDefine.ACTION_INSERT,
        target: KeyDefine.TABLE_NAME,
        code: KeyDefine.RESULT_FAILED,
        desc: 'Clinic Model: Unknowed error',
        data: null
    };

    let insertOption = sqlQuery.insert()
                        .into(KeyDefine.TABLE_NAME)
                        .set(clinic)
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

clinicModel.set = function(clinic) {
    let defer = Q.defer();

    let result = {
        request: KeyDefine.ACTION_UPDATE,
        target: KeyDefine.TABLE_NAME,
        code: KeyDefine.RESULT_FAILED,
        desc: 'Clinic Model: Unknowed error',
    };

    let updateOption = sqlQuery.update()
                        .into(KeyDefine.TABLE_NAME)
                        .set(clinic)
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
                    Logger.console('Null in UPDATE ' + KeyDefine.TABLE_NAME + ': clinicId=' + clinic.clinicId);
                    result.code = KeyDefine.RESULT_EMPTY;
                    result.desc = 'Null in UPDATE' + KeyDefine.TABLE_NAME + ': clinicId=' + clinic.clinicId;
                    defer.resolve(result);
                } else {
                    Logger.console('Success in UPDATE ' + KeyDefine.TABLE_NAME + ': clinicId=' + clinic.clinicId);
                    result.code = KeyDefine.RESULT_SUCCESS;
                    result.desc = 'Success in UPDATE ' + KeyDefine.TABLE_NAME + ': clinicId=' + clinic.clinicId;
                    defer.resolve(result);
                }
            });
        }, error => {
            defer.reject(error);
        });

    return defer.promise;
}

clinicModel.get = function(clinicId) {
    let defer = Q.defer();

    let result = {
        request: KeyDefine.ACTION_QUERY,
        target: KeyDefine.TABLE_NAME,
        code: KeyDefine.RESULT_FAILED,
        desc: 'Clinic Model: Unknowed error',
        data: null
    };

    let queryOption = sqlQuery.select()
                        .from(KeyDefine.TABLE_NAME)
                        .where({
                            clinicId: clinicId
                        })
                        .build();

    DBPool.getConnection()
        .then(connection => {
            connection.query(queryOption, (err, rows) => {
                Logger.console(queryOption);
                if(err) {
                    Logger.console('Error in QUERY ' + KeyDefine.TABLE_NAME);
                    Logger.console(err);
                    defer.reject(err);
                } else if(rows.length <= 0) {
                    Logger.console('Empty in QUERY ' + KeyDefine.TABLE_NAME + ': clinicId=' + clinicId);
                    result.code = KeyDefine.RESULT_EMPTY;
                    result.desc = 'Empty in QUERY' + KeyDefine.TABLE_NAME + ': clinicId=' + clinicId;
                    defer.resolve(result);
                } else {
                    Logger.console('Success in QUERY ' + KeyDefine.TABLE_NAME + ': clinicId=' + clinicId);
                    Logger.console('Result: ' + JSON.stringify(rows));

                    result.code = KeyDefine.RESULT_SUCCESS;
                    result.desc = 'Success in QUERY ' + KeyDefine.TABLE_NAME + ': clinicId=' + clinicId;
                    result.data = rows[0];
                    defer.resolve(result);
                }
            });
        }, error => {
            defer.reject(error);
        });

    return defer.promise;
};

module.exports = clinicModel;
