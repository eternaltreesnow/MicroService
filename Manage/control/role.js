'use strict'

const Q = require('q');
const Logger = require('../util/logger');
const Define = require('../util/define');
const Session = require('../util/session');

let KeyDefine = new Define();

let Role = {};

// 角色管理列表页
Role.roleManage = function(req, res) {
    let userData = Session.getUserData(req);
    res.render('role/roleManage', {
        realName: userData.realName,
        userId: userData.userId
    });
};

// 添加角色
Role.addRole = function(req, res) {
    let userData = Session.getUserData(req);
    res.render('role/addRole', {
        realName: userData.realName,
        userId: userData.userId
    });
};

// 编辑角色
Role.editRole = function(req, res) {
    let userData = Session.getUserData(req);
    res.render('role/editRole', {
        realName: userData.realName,
        userId: userData.userId
    });
};

module.exports = Role;
