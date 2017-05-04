'use strict'

const Express = require('express');
const roleControl = require('./control/role');
const userControl = require('./control/user');
const operationControl = require('./control/operation');

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

// 用户管理列表页
router.get('/', (req, res) => {
    Auth.auth(req, res, '', userControl.userManage);
});

// 添加用户
router.get('/user/addUser', (req, res) => {
    Auth.auth(req, res, '', userControl.addUser);
});

// 编辑用户
router.get('/user/editUser', (req, res) => {
    Auth.auth(req, res, '', userControl.editUser);
});

// 角色管理列表页
router.get('/role/roleManage', (req, res) => {
    Auth.auth(req, res, '', roleControl.roleManage);
});

// 添加角色
router.get('/role/addRole', (req, res) => {
    Auth.auth(req, res, '', roleControl.addRole);
});

// 编辑角色
router.get('/role/editRole', (req, res) => {
    Auth.auth(req, res, '', roleControl.editRole);
});

module.exports = router;
