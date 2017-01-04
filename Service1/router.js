'use strict'

const Express = require('express');
const http = require('http');

// 日志模块
const Logger = require('./util/logger');
// 枚举变量
const Define = require('./util/define');
// 验证模块
const Auth = require('./util/auth');

const service = require('./control/service');

let KeyDefine = new Define();

let router = Express.Router();

router.get('/', (req, res) => {
    Auth.auth(req, res, service.demo);
});

module.exports = router;
