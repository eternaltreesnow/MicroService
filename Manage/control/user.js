'use strict'

const Q = require('q');
const Logger = require('../util/logger');
const Define = require('../util/define');
const Session = require('../util/session');

let KeyDefine = new Define();

let User = {};

// 用户管理列表页
User.userManage = function(req, res) {
    let userData = Session.getUserData(req);
    res.render('user/userManage', {
        realName: userData.realName,
        userId: userData.userId
    });
};

// 添加用户
User.addUser = function(req, res) {
    let userData = Session.getUserData(req);
    res.render('user/addUser', {
        realName: userData.realName,
        userId: userData.userId
    });
};

// 编辑用户
User.editUser = function(req, res) {
    let userData = Session.getUserData(req);
    res.render('user/editUser', {
        realName: userData.realName,
        userId: userData.userId
    });
};

module.exports = User;
