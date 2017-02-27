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

module.exports = Team;
