'use strict'

const Q = require('q');
const Logger = require('../util/logger');
const Define = require('../util/define');
const clinicModel = require('../model/clinic');
const teamModel = require('../model/team');

let KeyDefine = new Define();

let Team = {};

// 团队管理页
Team.teamManage = function(req, res) {
    res.render('team/teamManage');
};

// 医生详情页
Team.docDetail = function(req, res) {
    res.render('team/docDetail');
};

// 技师详情页
Team.techDetail = function(req, res) {
    res.render('team/techDetail');
};

module.exports = Team;
