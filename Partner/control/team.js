'use strict'

const Q = require('q');
const Logger = require('../util/logger');
const Define = require('../util/define');
const Session = require('../util/session');

const teamModel = require('../model/team');

let KeyDefine = new Define();

let Team = {};

// 团队管理列表页
Team.teamManage = function(req, res) {
    let userData = Session.getUserData(req);
    res.render('team/teamManage', {
        realName: userData.realName,
        userId: userData.userId
    });
};

// 添加团队
Team.addTeam = function(req, res) {
    let userData = Session.getUserData(req);
    res.render('team/addTeam', {
        realName: userData.realName,
        userId: userData.userId
    });
};

// 编辑团队
Team.editTeam = function(req, res) {
    let userData = Session.getUserData(req);
    res.render('team/editTeam', {
        realName: userData.realName,
        userId: userData.userId
    });
};

module.exports = Team;
