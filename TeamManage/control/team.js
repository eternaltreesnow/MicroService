'use strict'

const Q = require('q');
const Logger = require('../util/logger');
const Define = require('../util/define');

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

module.exports = Team;
