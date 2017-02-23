'use strict'

const Express = require('express');
const contractControl = require('./control/contract');
const teamControl = require('./control/team');

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

// 退出登录
router.get('/logout', (req, res) => {
    res.cookie('connect.sid', '', {expires: new Date(1), path: '/' });
    res.redirect('/');
});

// 团队管理列表页
router.get('/', (req, res) => {
    Auth.auth(req, res, '', teamControl.teamManage);
});

// 添加团队
router.get('/team/addTeam', (req, res) => {
    Auth.auth(req, res, '', teamControl.addTeam);
});

// 编辑团队
router.get('/team/editTeam', (req, res) => {
    Auth.auth(req, res, '', teamControl.editTeam);
});

// 契约管理列表页
router.get('/contract/contractManage', (req, res) => {
    Auth.auth(req, res, '', contractControl.contractManage);
});

// 添加契约页
router.get('/contract/addContract', (req, res) => {
    Auth.auth(req, res, '', contractControl.addContract);
});

// 编辑契约页
router.get('/contract/editContract', (req, res) => {
    Auth.auth(req, res, '', contractControl.editContract);
});


module.exports = router;
