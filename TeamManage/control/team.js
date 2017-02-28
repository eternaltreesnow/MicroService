'use strict'

const Q = require('q');
const Logger = require('../util/logger');
const Define = require('../util/define');
const Session = require('../util/session');

const teamModel = require('../model/team');

let KeyDefine = new Define();

let Team = {};

Team.getTeamIdByUserId = function(req, res) {
    let userId = req.query.userId;

    let result = {
        code: KeyDefine.RESULT_FAILED,
        desc: 'Get TeamId By UserId failed',
        data: null
    };

    teamModel.getTeamIdByUserId(userId)
        .then(teamResult => {
            result.code = teamResult.code;
            result.desc = teamResult.desc;
            result.data = teamResult.data;
            res.send(result);
        }, error => {
            Logger.console(error);
            result.desc = error;
            res.send(result);
        });
};

Team.getPartnerIdByUserId = function(req, res) {
    let userId = req.query.userId;

    let result = {
        code: KeyDefine.RESULT_FAILED,
        desc: 'Get PartnerId By UserId failed',
        data: null
    };

    teamModel.getPartnerIdByUserId(userId)
        .then(partnerResult => {
            result.code = partnerResult.code;
            result.desc = partnerResult.desc;
            result.data = partnerResult.data;
            res.send(result);
        }, error => {
            Logger.console(error);
            result.desc = error;
            res.send(result);
        });
};

Team.getTeamList = function(req, res) {
    // 获取session中的用户数据
    let userData = Session.getUserData(req);
    let partnerId;
    if(userData) {
        partnerId = userData.userId;
    }

    let draw = req.query.draw;
    let start = req.query.start;
    let length = req.query.length;

    let result = {
        status: KeyDefine.RESULT_SUCCESS,
        draw: draw,
        data: [],
        recordsFiltered: 0
    };

    teamModel.count(partnerId)
        .then(countResult => {
            result.recordsFiltered = countResult.data;
            return teamModel.getList(partnerId, start, length);
        })
        .then(teamResult => {
            result.data = teamResult.data;
            res.send(result);
        })
        .catch(error => {
            Logger.console(error);
            res.send(result);
        });
};

Team.addTeam = function(req, res) {
    // 获取session中的用户数据
    let userData = Session.getUserData(req);
    let partnerId;
    if(userData) {
        partnerId = userData.userId;
    }

    let result = {
        code: KeyDefine.RESULT_FAILED,
        desc: 'Failed to add team',
        data: null
    };

    let team = {
        partnerId: partnerId,
        leaderId: req.body.leaderId,
        name: req.body.teamName,
        state: 1
    };

    teamModel.add(team)
        .then(teamResult => {
            result.code = teamResult.code;
            result.desc = teamResult.desc;
            res.send(result);
        })
        .catch(error => {
            Logger.console(error);
            res.send(result);
        });
};

Team.checkTeam = function(req, res) {
    let userId = req.query.userId;

    let result = {
        code: KeyDefine.RESULT_FAILED,
        desc: 'Check Team failed',
        data: {}
    };

    teamModel.getTeamIdByUserId(userId)
        .then(teamResult => {
            if(teamResult.code === KeyDefine.RESULT_SUCCESS) {
                let teamId = teamResult.data;
                result.data.teamId = teamId;
                return teamModel.getLeaderIdByTeamId(teamId);
            } else {
                result.desc = 'Get teamId error';
                Logger.console(teamResult.desc);
                res.send(result);
                throw new Error('Abort promise chain');
                return null;
            }
        })
        .then(leaderResult => {
            if(leaderResult.code === KeyDefine.RESULT_SUCCESS) {
                let leaderId = leaderResult.data;
                if(leaderId == userId) {
                    result.data.isLeader = 1;
                } else {
                    result.data.isLeader = 0;
                }
                result.code = KeyDefine.RESULT_SUCCESS;
                result.desc = 'Check Team success';
                res.send(result);
            } else {
                result.desc = 'Get LeaderId error';
                Logger.console(leaderResult.desc);
                res.send(result);
                throw new Error('Abort promise chain');
                return null;
            }
        })
        .catch(error => {
            if(error.message === 'Abort promise chain') {
                // 手动跳出promise链
            } else {
                Logger.console(error);
                res.send(result);
            }
        });
};

Team.getTeamInfo = function(req, res) {
    let teamId = req.query.teamId;

    let result = {
        code: KeyDefine.RESULT_FAILED,
        desc: 'getTeamInfo failed',
        data: {}
    };

    teamModel.get(teamId)
        .then(teamResult => {
            result.code = teamResult.code;
            result.desc = teamResult.desc;
            if(teamResult.code === KeyDefine.RESULT_SUCCESS) {
                result.data = teamResult.data;
            }
            res.send(result);
        })
        .catch(error => {
            Logger.console(error);
            res.send(result);
        });
};

// 获取团队成员列表
Team.getMemberList = function(req, res) {
    let draw = req.query.draw;
    let start = req.query.start;
    let length = req.query.length;
    let teamId = req.query.teamId;
    let roleId = req.query.roleId;

    let result = {
        status: KeyDefine.RESULT_SUCCESS,
        draw: draw,
        data: [],
        recordsFiltered: 0
    };

    teamModel.memCount(teamId, roleId)
        .then(countResult => {
            result.recordsFiltered = countResult.data;
            return teamModel.getMemberList(teamId, roleId, start, length);
        })
        .then(teamResult => {
            result.data = teamResult.data;
            res.send(result);
        })
        .catch(error => {
            Logger.console(error);
            res.send(result);
        });
}

module.exports = Team;
