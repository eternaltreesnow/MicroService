'use strict'

const Q = require('q');
const Logger = require('../util/logger');
const Define = require('../util/define');

const actionModel = require('../model/action');

let KeyDefine = new Define();

let Action = {};

Action.transfer = function(req, res) {
    let clinicId = req.body.clinicId;
    let actionId = req.body.actionId;
    let userId = req.body.userId;
};

Action.getAction = function(req, res) {
    let actionId = req.query.id;
    actionModel.get(actionId)
        .then(actionResult => {
            if(actionResult.code === KeyDefine.RESULT_SUCCESS) {
                res.send(actionResult);
            }
        }, error => {
            res.send(error);
        });
};

module.exports = Action;
