'use strict'

const Express = require('express');
const clinicControl = require('./control/clinic');
const patientControl = require('./control/patient');

// 日志模块
const Logger = require('./util/logger');
// 枚举变量
const Define = require('./util/define');
// 验证模块
const Auth = require('./util/auth');

let KeyDefine = new Define();

let router = Express.Router();

router.get('/test', (req, res) => {
    Auth.auth(req, res, '', function() {
        res.render('test');
    });
});

// 检查单列表页
router.get('/', (req, res) => {
    Auth.auth(req, res, '', clinicControl.clinicManage);
});

// 未完成检查单
router.get('/clinic/unfinishedClinic', (req, res) => {
    Auth.auth(req, res, '', clinicControl.unfinishedClinic);
});

// 已完成检查单
router.get('/clinic/finishedClinic', (req, res) => {
    Auth.auth(req, res, '', clinicControl.finishedClinic);
});

// 新建检查单
router.get('/clinic/addClinic', (req, res) => {
    Auth.auth(req, res, '', clinicControl.addClinic);
});

// 病人管理页
router.get('/patient/patientManage', (req, res) => {
    Auth.auth(req, res, '', patientControl.patientManage);
});

// 添加病人页
router.get('/patient/addPatient', (req, res) => {
    Auth.auth(req, res, '', patientControl.addPatient);
});

// 编辑病人页
router.get('/patient/editPatient', (req, res) => {
    Auth.auth(req, res, '', patientControl.editPatient);
});

module.exports = router;
