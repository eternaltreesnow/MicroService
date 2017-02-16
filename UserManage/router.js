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
    Auth.auth(req, res, user.addUser);
});

// 删除用户
router.delete('/user', (req, res) => {
    Auth.auth(req, res, user.delUser);
});

// 获取用户
router.get('/user/:id', (req, res) => {
    Auth.auth(req, res, info.getUser);
});

// 启用用户
router.post('/startUser', (req, res) => {
    user.startUser(req, res);
    // Auth.auth(req, res, user.startUser);
});

// 停用用户
router.post('/stopUser', (req, res) => {
    user.stopUser(req, res);
    // Auth.auth(req, res, user.stopUser);
});

module.exports = router;
