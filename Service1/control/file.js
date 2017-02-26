'use strict'

const Q = require('q');
const Logger = require('../util/logger');
const Define = require('../util/define');

const clinicModel = require('../model/clinic');

let KeyDefine = new Define();

let File = {};

/**
 * 下载心电报告
 * @param  {Object} req 请求
 * @param  {Object} res 响应
 * @return {File}       心电报告
 */
File.downloadReport = (req, res) => {
    let clinicId = req.query.id;

    let pathRoot = 'uploads/report/';

    let result = {
        code: KeyDefine.RESULT_FAILED,
        desc: 'Download Report: Unknowed error'
    };

    clinicModel.get(clinicId)
        .then(clinicResult => {
            if(clinicResult.code === KeyDefine.RESULT_SUCCESS) {
                if(clinicResult.data.report == null) {
                    result.code = KeyDefine.RESULT_EMPTY;
                    result.desc = 'Download Report: Empty Report';
                    res.send(result);
                } else {
                    let reportName = clinicResult.data.report;
                    res.download(pathRoot + reportName, reportName, function(err) {
                        if(err) {
                            Logger.console(err);
                            result.desc = 'Download Report: download file error';
                            res.send(result);
                        }
                    });
                }
            } else if(clinicResult.code === KeyDefine.RESULT_EMPTY) {
                result.code = KeyDefine.RESULT_EMPTY;
                result.desc = 'Download Report: Empty Report';
                res.send(result);
            } else {
                result.desc = 'Download Report: Query Report data failed';
                res.send(result);
            }
        });
};

/**
 * 下载心电文件
 * @param  {Object} req 请求
 * @param  {Object} res 响应
 * @return {File}       心电文件
 */
File.downloadFile = (req, res) => {
    let clinicId = req.query.id;

    let pathRoot = 'uploads/ecg_file/';

    let result = {
        code: KeyDefine.RESULT_FAILED,
        desc: 'Download File: Unknowed error'
    };

    clinicModel.get(clinicId)
        .then(clinicResult => {
            if(clinicResult.code === KeyDefine.RESULT_SUCCESS) {
                if(clinicResult.data.file == null) {
                    result.code = KeyDefine.RESULT_EMPTY;
                    result.desc = 'Download File: Empty File';
                    res.send(result);
                } else {
                    let fileName = clinicResult.data.file;
                    res.download(pathRoot + fileName, fileName, function(err) {
                        if(err) {
                            Logger.console(err);
                            result.desc = 'Download File: download file error';
                            res.send(result);
                        }
                    });
                }
            } else if(clinicResult.code === KeyDefine.RESULT_EMPTY) {
                result.code = KeyDefine.RESULT_EMPTY;
                result.desc = 'Download File: Empty File';
                res.send(result);
            } else {
                result.desc = 'Download File: Query File data failed';
                res.send(result);
            }
        });
};

module.exports = File;
