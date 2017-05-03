'use strict'

const Express = require('express');
const http = require('http');
const sqlQuery = require('sql-query').Query();

const user = require('./control/user');
const info = require('./control/info');

// 日志模块
const Logger = require('./util/logger');
// 枚举变量
const Define = require('./util/define');
// 验证模块
const Auth = require('./util/auth');
// 代理模块
const Agent = require('./util/agent');

let KeyDefine = new Define();

let router = Express.Router();

router.get('/test', (req, res) => {
    Auth.auth(req, res, '', function() {
        res.send('test');
    });
});

router.get('/testservice', (req, res) => {
    Logger.console('Get Req testservice');
    Auth.authService(req, res, function(req, res) {
        res.send('{ "code": "200", "test": "testservice" }');
    });
});

router.get('/testservice_client', (req, res) => {
    Agent.request('GET', 'http://localhost:10003/testservice', {}, function(data) {
        Logger.console(data);
        res.send('testservice1');
    });
});

// 新增用户
router.post('/user', (req, res) => {
    Auth.auth(req, res, '', user.addUser);
});

// 删除用户
router.delete('/user', (req, res) => {
    Auth.auth(req, res, '', user.delUser);
});

// 获取用户
router.get('/user/:id', (req, res) => {
    Auth.auth(req, res, '', info.getUser);
});

// 启用用户
router.post('/startUser', (req, res) => {
    Auth.auth(req, res, '', user.startUser);
});

// 停用用户
router.post('/stopUser', (req, res) => {
    Auth.auth(req, res, '', user.stopUser);
});

// 获取医院列表
router.get('/getHospList', (req, res) => {
    Auth.auth(req, res, '', user.getHospList);
});

// 获取医生列表
router.get('/getDocList', (req, res) => {
    Auth.auth(req, res, '', user.getDocList);
});

// 获取技师列表
router.get('/getTechList', (req, res) => {
    Auth.auth(req, res, '', user.getTechList);
});

// 添加医院与契约
router.post('/addContract', (req, res) => {
    Auth.auth(req, res, '', user.addContract);
});

// 添加团队成员
router.post('/addMember', (req, res) => {
    Auth.auth(req, res, '', user.addMember);
});

module.exports = router;
