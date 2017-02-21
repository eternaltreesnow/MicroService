'use strict'

const Express = require('express');
const http = require('http');

// 日志模块
const Logger = require('./util/logger');
// 枚举变量
const Define = require('./util/define');
// 验证模块
const Auth = require('./util/auth');
// Multer upload模块
const multer = require('./util/multer-util');

const service = require('./control/service');
const state = require('./control/state');
const action = require('./control/action');
const clinic = require('./control/clinic');
const patient = require('./control/patient');

let KeyDefine = new Define();

let router = Express.Router();

router.get('/', (req, res) => {
    Auth.auth(req, res, '', service.demo);
});

router.post('/action', (req, res) => {
    // Auth.auth(req, res, action);
});

router.get('/action', (req, res) => {
    Auth.auth(req, res, '', action.getAction);
});

router.get('/clinic', (req, res) => {
    Auth.auth(req, res, '', clinic.getClinic);
});

router.post('/clinic', (req, res) => {
    Auth.auth(req, res, '', clinic.addClinic);
});

router.get('/getClinicList', (req, res) => {
    Auth.auth(req, res, '', clinic.getClinicList);
});

router.get('/profile', (req, res) => {
    Auth.auth(req, res, '', function() {
        res.render('profile');
    });
});

router.get('/getPatientList', (req, res) => {
    Auth.auth(req, res, '', patient.getPatientList);
});

router.get('/deletePatient', (req, res) => {
    Auth.auth(req, res, '', patient.deletePatient)
});

module.exports = router;
