'use strict'

const Q = require('q');
const Logger = require('../util/logger');
const Define = require('../util/define');
const Uri = require('../util/uri');
const Session = require('../util/session');
const Agent = require('../util/agent');

const clinicModel = require('../model/clinic');
const teamModel = require('../model/team');

let KeyDefine = new Define();

let Team = {};

// 团队管理页
Team.teamManage = function(req, res) {
    let userData = Session.getUserData(req);
    let userId = userData.userId;

    // 判断是否为队长
    let method = 'GET';
    let uri = Uri.TeamManage + '/checkTeam';
    let param = {
        "userId": userId
    };
    Agent.request(method, uri, param, function(data) {
        if(data.code === KeyDefine.RESULT_SUCCESS) {
            Logger.console(data.desc);
            let teamId = data.data.teamId;
            let isLeader = data.data.isLeader;
            res.render('team/teamManage', {
                checkTeam: true,
                teamId: teamId,
                isLeader: isLeader
            });
        } else {
            res.render('team/teamManage', {
                checkTeam: false
            });
        }
    });
};

// 医生详情页
Team.memberDetail = function(req, res) {
    res.render('team/memberDetail');
};

// 技师详情页
Team.techDetail = function(req, res) {
    res.render('team/techDetail');
};

module.exports = Team;
