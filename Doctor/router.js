'use strict'

const Express = require('express');

// 日志模块
const Logger = require('./util/logger');
// 枚举变量
const Define = require('./util/define');

let KeyDefine = new Define();

let router = Express.Router();

router.get('/test', (req, res) => {
    res.render('test');
});

module.exports = router;
