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

clinicModel.set = function(clinicId, clinic) {
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
                        .where({
                            clinicId: clinicId
                        })
                        .build();

    DBPool.getConnection()
        .then(connection => {
            connection.query(updateOption, (err, rows) => {
                connection.release();
                if(err) {
                    Logger.console('Error in UPDATE ' + KeyDefine.TABLE_NAME);
                    defer.reject(err);
                } else if (rows.affectedRows <= 0) {
                    Logger.console('Null in UPDATE ' + KeyDefine.TABLE_NAME + ': clinicId=' + clinicId);
                    result.code = KeyDefine.RESULT_EMPTY;
                    result.desc = 'Null in UPDATE' + KeyDefine.TABLE_NAME + ': clinicId=' + clinicId;
                    defer.resolve(result);
                } else {
                    Logger.console('Success in UPDATE ' + KeyDefine.TABLE_NAME + ': clinicId=' + clinicId);
                    result.code = KeyDefine.RESULT_SUCCESS;
                    result.desc = 'Success in UPDATE ' + KeyDefine.TABLE_NAME + ': clinicId=' + clinicId;
                    defer.resolve(result);
                }
            });
        }, error => {
            defer.reject(error);
        });

    return defer.promise;
}

clinicModel.get = function(clinicId, state) {
    let defer = Q.defer();

    let result = {
        request: KeyDefine.ACTION_QUERY,
        target: KeyDefine.TABLE_NAME,
        code: KeyDefine.RESULT_FAILED,
        desc: 'Clinic Model: Unknowed error',
        data: null
    };

    let queryOption;
    // 获取分析状态检查单数据
    if(state == 4 || state == 5) {
        queryOption = sqlQuery.select()
                        .from(KeyDefine.TABLE_NAME)
                        .select('addTime', 'file', 'description')
                        .from('patient', 'patientId', 'patientId', { joinType: 'left' })
                        .select('name', 'gender', 'birth', 'height', 'weight')
                        .where(KeyDefine.TABLE_NAME, {
                            clinicId: clinicId,
                            state: state
                        })
                        .build();
    // 获取审核状态检查单数据
    } else if(state == 6) {
        queryOption = sqlQuery.select()
                        .from(KeyDefine.TABLE_NAME)
                        .select('addTime', 'file', 'description', 'report')
                        .from('patient', 'patientId', 'patientId', { joinType: 'left' })
                        .select('name', 'gender', 'birth', 'height', 'weight')
                        .where(KeyDefine.TABLE_NAME, {
                            clinicId: clinicId,
                            state: state
                        })
                        .build();
    // 获取重分析状态检查单数据
    } else if(state == 7) {
        queryOption = 'SELECT clinic.addTime, clinic.description, clinic.report, clinic.reportTime, clinic.file, patient.name, patient.gender, patient.birth, patient.height, patient.weight, censor.feedback, censor.censorTime, censor.errorType, user.realName FROM clinic LEFT JOIN patient ON patient.patientId = clinic.patientId LEFT JOIN censor ON censor.clinicId = clinic.clinicId LEFT JOIN user ON user.userId = censor.doctorId WHERE clinic.clinicId = ' + clinicId + ' ORDER BY censorTime DESC LIMIT 1';
    } else {
        queryOption = sqlQuery.select()
                        .from(KeyDefine.TABLE_NAME)
                        .select('addTime', 'file', 'description', 'report')
                        .from('patient', 'patientId', 'patientId', { joinType: 'left' })
                        .select('name', 'gender', 'birth', 'height', 'weight')
                        .where(KeyDefine.TABLE_NAME, {
                            clinicId: clinicId
                        })
                        .build();
    }

    DBPool.getConnection()
        .then(connection => {
            connection.query(queryOption, (err, rows) => {
                connection.release();
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
                    Logger.console('Result: ' + JSON.stringify(rows[0]));

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

/**
 * 获取检查单列表长度
 * @param  {Number} hospitalId 基层医院id
 * @param  {Number} state      状态
 * @return {Array}             列表长度
 */
clinicModel.count = function(condition) {
    let defer = Q.defer();

    let result = {
        request: KeyDefine.ACTION_QUERY,
        target: KeyDefine.TABLE_NAME,
        code: KeyDefine.RESULT_FAILED,
        desc: 'Clinic Model: Unknowed error',
        data: 0
    };

    let queryOption = sqlQuery.select()
                        .from(KeyDefine.TABLE_NAME)
                        .count()
                        .where(condition)
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
 * 获取检查单列表
 * @param  {JSON}   condition  搜索条件
 * @param  {Number} start      起始位置
 * @param  {Number} length     筛选长度
 * @return {Array}             检查单列表
 */
clinicModel.getList = function(condition, start, length) {
    let defer = Q.defer();

    let result = {
        request: KeyDefine.ACTION_QUERY,
        target: KeyDefine.TABLE_NAME,
        code: KeyDefine.RESULT_FAILED,
        desc: 'Clinic Model: Unknowed error',
        data: []
    };

    let queryOption = sqlQuery.select()
                        .from(KeyDefine.TABLE_NAME)
                        .select('clinicId', 'addTime', 'description', 'state')
                        .from('patient', 'patientId', 'patientId', { joinType: 'left' })
                        .select('name', 'gender', 'idCode', 'medicareNum')
                        .where('clinic', condition)
                        .limit(start + ', ' + length)
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
                    Logger.console('Empty in QUERY ' + KeyDefine.TABLE_NAME);
                    result.code = KeyDefine.RESULT_SUCCESS;
                    result.desc = 'Empty in QUERY' + KeyDefine.TABLE_NAME;
                    defer.resolve(result);
                } else {
                    Logger.console('Success in QUERY ' + KeyDefine.TABLE_NAME);
                    // Logger.console('Result: ' + JSON.stringify(rows));

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

module.exports = clinicModel;
