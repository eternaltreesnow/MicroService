'use strict'

const Q = require('q');
const sqlQuery = require('sql-query').Query();
const Define = require('../util/define');
const Logger = require('../util/logger');

const DBPool = require('./dbpool');

let KeyDefine = new Define();
KeyDefine.TABLE_NAME = 'contract';

let Contract = {};

Contract.add = function(hospitalId, partnerId) {
    let defer = Q.defer();

    let result = {
        request: KeyDefine.ACTION_INSERT,
        target: KeyDefine.TABLE_NAME,
        code: KeyDefine.RESULT_FAILED,
        desc: 'Contract Model: Unknowed error',
        data: null
    };

    let insertOption = sqlQuery.insert()
                        .into(KeyDefine.TABLE_NAME)
                        .set({
                            "hospitalId": hospitalId,
                            "partnerId": partnerId
                        })
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
                    result.data = rows[0];
                    defer.resolve(result);
                }
            });
        }, error => {
            defer.reject(error);
        });

    return defer.promise;
};

/**
 * 根据基层医院id和契约获取合伙人id
 * @param  {Number} hospitalId 基层医院id
 * @return {Number}            合伙人id
 */
Contract.getPartnerId = function(hospitalId) {
    let defer = Q.defer();

    let result = {
        request: KeyDefine.ACTION_QUERY,
        target: KeyDefine.TABLE_NAME,
        code: KeyDefine.RESULT_FAILED,
        desc: 'Contract Model: Unknowed error',
        data: null
    };

    let queryOption = sqlQuery.select()
                        .from(KeyDefine.TABLE_NAME)
                        .select('partnerId')
                        .where({
                            hospitalId: hospitalId
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
                } else if(rows.length <= 0) {
                    Logger.console('Empty in QUERY ' + KeyDefine.TABLE_NAME + ': hospitalId=' + hospitalId);
                    result.code = KeyDefine.RESULT_EMPTY;
                    result.desc = 'Empty in QUERY' + KeyDefine.TABLE_NAME + ': hospitalId=' + hospitalId;
                    defer.resolve(result);
                } else {
                    Logger.console('Success in QUERY ' + KeyDefine.TABLE_NAME + ': hospitalId=' + hospitalId);
                    Logger.console('Result: ' + JSON.stringify(rows));

                    result.code = KeyDefine.RESULT_SUCCESS;
                    result.desc = 'Success in QUERY ' + KeyDefine.TABLE_NAME + ': hospitalId=' + hospitalId;
                    result.data = rows[0];
                    defer.resolve(result);
                }
            });
        }, error => {
            defer.reject(error);
        });

    return defer.promise;
};

Contract.getHospitalId = function(partnerId) {
    let defer = Q.defer();

    let result = {
        request: KeyDefine.ACTION_QUERY,
        target: KeyDefine.TABLE_NAME,
        code: KeyDefine.RESULT_FAILED,
        desc: 'Contract Model: Unknowed error',
        data: null
    };

    let queryOption = sqlQuery.select()
                        .from(KeyDefine.TABLE_NAME)
                        .select('hospitalId')
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
                } else if(rows.length <= 0) {
                    Logger.console('Empty in QUERY ' + KeyDefine.TABLE_NAME + ': partnerId=' + partnerId);
                    result.code = KeyDefine.RESULT_EMPTY;
                    result.desc = 'Empty in QUERY' + KeyDefine.TABLE_NAME + ': partnerId=' + partnerId;
                    defer.resolve(result);
                } else {
                    Logger.console('Success in QUERY ' + KeyDefine.TABLE_NAME + ': partnerId=' + partnerId);
                    Logger.console('Result: ' + JSON.stringify(rows));

                    result.code = KeyDefine.RESULT_SUCCESS;
                    result.desc = 'Success in QUERY ' + KeyDefine.TABLE_NAME + ': partnerId=' + partnerId;
                    Logger.console(rows);
                    result.data = rows;
                    defer.resolve(result);
                }
            });
        }, error => {
            defer.reject(error);
        });

    return defer.promise;
};

module.exports = Contract;
