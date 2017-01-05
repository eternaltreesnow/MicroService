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

Action.getAction = function(actionId) {
    let defer = Q.defer();
    let result = {
        code: KeyDefine.RESULT_FAILED,
        desc: 'Action Control: Unknowed error',
        data: null
    };

    actionModel.get(actionId)
        .then(actionResult => {
            result.code = actionResult.code;
            result.desc = actionResult.desc;
            if(actionResult.code === KeyDefine.RESULT_SUCCESS) {
                result.data = actionResult.data;
            }
            defer.resolve(result);
        }, error => {
            Logger.console(error);
            result.desc = 'Action Model error';
            defer.reject(result);
        });
    return defer.promise;
};

module.exports = Action;
