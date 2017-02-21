'use strict'

const Q = require('q');
const Logger = require('../util/logger');
const Define = require('../util/define');
const teamModel = require('../model/team');

let KeyDefine = new Define();

let Team = {};

// 团队管理列表页
Team.teamManage = function(req, res) {
    res.render('team/teamManage');
};

// 添加团队
Team.addTeam = function(req, res) {
    res.render('team/addTeam');
};

// 编辑团队
Team.editTeam = function(req, res) {
    res.render('team/editTeam');
};

module.exports = Team;
