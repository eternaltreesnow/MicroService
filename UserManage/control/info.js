'use strict'

const Q = require('q');
const Logger = require('../util/logger');
const Define = require('../util/define');

const userModel = require('../model/user');

let KeyDefine = new Define();

let Info = {};

// 获取用户信息
Info.getUser = function(userId) {

};

//
Info.delUser = function(userId) {

};

// 修改用户状态
// status {
//      1: '正常使用',
//      2: '已停用'
// }
Info.modifyUser = function(userId, status) {

};

module.exports = Info;
