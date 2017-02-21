'use strict'

const Q = require('q');
const Logger = require('../util/logger');
const Define = require('../util/define');
const contractModel = require('../model/contract');
const teamModel = require('../model/team');

let KeyDefine = new Define();

let Contract = {};

// 契约管理列表页
Contract.contractManage = function(req, res) {
    res.render('contract/contractManage');
};

// 添加契约页
Contract.addContract = function(req, res) {
    res.render('contract/addContract');
};

// 编辑契约页
Contract.editContract = function(req, res) {
    res.render('contract/editContract');
};

module.exports = Contract;
