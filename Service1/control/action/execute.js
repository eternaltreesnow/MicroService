/**
 * action执行模块
 * @author dickzheng
 */
'use strict'

const Q = require('q');
const Logger = require('../../util/logger');
const Define = require('../../util/define');
const multer = require('../../util/multer-util');

let KeyDefine = new Define();
let RoleType = KeyDefine.ROLE_TYPE;

/**
 * action执行函数对象
 * @type {Object}
 */
let ActionFunc = {
    "allocateClinic": () => {

    },
    /**
     * 医生拉取检查单进行分析
     * @param  {Object} clinicData 检查单数据
     * @param  {Object} actionData action数据
     * @param  {Object} userData   用户session
     * @return {Promise}
     */
    "analyzeClinicDoc": (clinicData, actionData, userData) => {
        let defer = Q.defer();
        let result = {
            code: KeyDefine.RESULT_FAILED,
            desc: 'Action analyzeClinicDoc: '
        };

        // 修改状态: 待拉取 -> 医生分析中
        clinicData.state = actionData.postState;
        // 修改医生负责人
        clinicData.doctorId = userData.userId;

        clinicControl.setClinic(clinicData)
            .then(clinicResult => {
                result.code = clinicResult.code;
                result.desc += clinicResult.desc;
                defer.resolve(result);
            });

        return defer.promise;
    },
    /**
     * 技师拉取检查单进行分析
     * @param  {Object} clinicData 检查单数据
     * @param  {Object} actionData action数据
     * @param  {Object} userData   用户session
     * @return {Promise}
     */
    "analyzeClinicTech": (clinicData, actionData, userData) => {
        let defer = Q.defer();
        let result = {
            code: KeyDefine.RESULT_FAILED,
            desc: 'Action analyzeClinicTech: '
        };

        // 修改状态: 待拉取 -> 技师分析中
        clinicData.state = actionData.postState;
        // 修改技师负责人
        clinicData.techId = userData.userId;

        clinicControl.setClinic(clinicData)
            .then(clinicResult => {
                result.code = clinicResult.code;
                result.desc += clinicResult.desc;
                defer.resolve(result);
            });

        return defer.promise;
    },
    /**
     * 技师撤回已拉取的检查单
     * @param  {Object} clinicData 检查单数据
     * @param  {Object} actionData action数据
     * @param  {Object} userData   用户session
     * @return {Promise}
     */
    "revokeClinicTech": (clinicData, actionData, userData) => {
        let defer = Q.defer();
        let result = {
            code: KeyDefine.RESULT_FAILED,
            desc: 'Action revokeClinicTech: '
        };

        // 修改状态: 技师分析中 -> 待拉取f
        clinicData.state = actionData.postState;
        // 清空技师负责人
        clinicData.techId = null;

        clinicControl.setClinic(clinicData)
            .then(clinicResult => {
                result.code = clinicResult.code;
                result.desc += clinicResult.desc;
                defer.resolve(result);
            });

        return defer.promise;
    },
    /**
     * 医生上传心电报告与分析结论
     * @param  {Object} clinicData 检查单数据
     * @param  {Object} actionData action数据
     * @param  {Object} userData   用户session
     * @param  {Object} req        http请求request
     * @return {Promise}
     */
    "publishReportDoc": (clinicData, actionData, userData, req) => {
        let defer = Q.defer();
        let result = {
            code: KeyDefine.RESULT_FAILED,
            desc: 'Action publishReportDoc: '
        };
        // 调用multer中间件上传report文件
        let upload = multer('report').single('report');
        upload(req, res, (err) => {
            if(err) {
                Logger.console(err);
                result.desc += 'Upload report error';
                defer.resolve(result);
            }
            // 修改状态: 医生分析中 -> 已报告
            clinicData.state = actionData.postState;
            // 更新report文件名
            clinicData.report = req.file.filename;
            // 更新检查单分析结论
            clinicData.description = req.body.description;

            clinicControl.setClinic(clinicData)
                .then(clinicResult => {
                    result.code = clinicResult.code;
                    result.desc += clinicResult.desc;
                    defer.resolve(result);
                });
        });

        return defer.promise;
    },
    /**
     * 技师上传心电报告
     * @param  {Object} clinicData 检查单数据
     * @param  {Object} actionData action数据
     * @param  {Object} userData   用户session
     * @param  {Object} req        http请求request
     * @return {Promise}
     */
    "submitReportTech": (clinicData, actionData, userData, req) => {
        let defer = Q.defer();
        let result = {
            code: KeyDefine.RESULT_FAILED,
            desc: 'Action submitReportTech: '
        };
        // 调用multer中间件上传report文件
        let upload = multer('report').single('report');
        upload(req, res, (err) => {
            if(err) {
                Logger.console(err);
                result.desc += 'Upload report error';
                defer.resolve(result);
            }
            // 修改状态: 技师分析中 -> 待审核
            clinicData.state = actionData.postState;
            // 更新report文件名
            clinicData.report = req.file.filename;
            // 更新检查单分析结论
            clinicData.description = req.body.description;

            clinicControl.setClinic(clinicData)
                .then(clinicResult => {
                    result.code = clinicResult.code;
                    result.desc += clinicResult.desc;
                    defer.resolve(result);
                });
        });

        return defer.promise;
    },
    /**
     * 医生审核不通过，进入重分析
     * @param  {Object} clinicData 检查单数据
     * @param  {Object} actionData action数据
     * @param  {Object} userData   用户session
     * @return {Promise}
     */
    "auditFailedDoc": (clinicData, actionData, userData) => {
        let defer = Q.defer();
        let result = {
            code: KeyDefine.RESULT_FAILED,
            desc: 'Action auditFailedDoc: '
        };

        // 修改状态: 待审核 -> 待重分析
        clinicData.state = actionData.postState;
        // 修改医生负责人
        clinicData.doctorId = userData.userId;
        // 更新检查单分析结论
        if(clinicData.description) {
            clinicData.description = req.body.description;
        }

        clinicControl.setClinic(clinicData)
            .then(clinicResult => {
                result.code = clinicResult.code;
                result.desc += clinicResult.desc;
                defer.resolve(result);
            });

        return defer.promise;
    },
    /**
     * 技师重分析检查单
     * @param  {Object} clinicData 检查单数据
     * @param  {Object} actionData action数据
     * @param  {Object} userData   用户session
     * @return {Promise}
     */
    "reanalyzeTech": (clinicData, actionData, userData) => {
        let defer = Q.defer();
        let result = {
            code: KeyDefine.RESULT_FAILED,
            desc: 'Action reanalyzeTech: '
        };

        // 修改状态: 待重分析 -> 技师分析中
        clinicData.state = actionData.postState;

        clinicControl.setClinic(clinicData)
            .then(clinicResult => {
                result.code = clinicResult.code;
                result.desc += clinicResult.desc;
                defer.resolve(result);
            });

        return defer.promise;
    },
    /**
     * 医生审核通过
     * @param  {Object} clinicData 检查单数据
     * @param  {Object} actionData action数据
     * @param  {Object} userData   用户session
     * @return {Promise}
     */
    "auditSuccessDoc": (clinicData, actionData, userData) => {
        let defer = Q.defer();
        let result = {
            code: KeyDefine.RESULT_FAILED,
            desc: 'Action auditSuccessDoc: '
        };

        // 修改状态: 待审核 -> 已报告
        clinicData.state = actionData.postState;
        // 修改医生负责人
        clinicData.doctorId = userData.userId;
        // 更新检查单分析结论
        if(clinicData.description) {
            clinicData.description = req.body.description;
        }

        clinicControl.setClinic(clinicData)
            .then(clinicResult => {
                result.code = clinicResult.code;
                result.desc += clinicResult.desc;
                defer.resolve(result);
            });

        return defer.promise;
    },
    "initConsulAudit": () => {

    },
    "initConsulAnalysis": () => {

    },
    "publishReportConsul": () => {

    }
};

/**
 * 执行入口:
 * @param  {Object} clinicData 检查单数据
 * @param  {Object} actionData action数据
 * @param  {Object} userData   用户session
 * @param  {Object} req        http请求request
 * @return {Promise}
 */
module.exports = function(clinicData, actionData, userData, req) {
    let defer = Q.defer();

    // 根据actionName调用对应的action执行函数
    ActionFunc[actionData.name](clinicData, actionData, userData, req)
        .then(actionResult => {
            defer.resolve(actionResult);
        });

    return defer.promise;
};
