'use strict'

const Q = require('q');
const Logger = require('../util/logger');
const Define = require('../util/define');
const Session = require('../util/session');

const contractModel = require('../model/contract');
const teamModel = require('../model/team');

let KeyDefine = new Define();

let Contract = {};

// 契约管理列表页
Contract.contractManage = function(req, res) {
    let userData = Session.getUserData(req);
    res.render('contract/contractManage', {
        realName: userData.realName,
        userId: userData.userId
    });
};

// 添加契约页
Contract.addContract = function(req, res) {
    let userData = Session.getUserData(req);
    res.render('contract/addContract', {
        realName: userData.realName,
        userId: userData.userId
    });
};

// 编辑契约页
Contract.editContract = function(req, res) {
    let userData = Session.getUserData(req);
    res.render('contract/editContract', {
        realName: userData.realName,
        userId: userData.userId
    });
};

module.exports = Contract;
