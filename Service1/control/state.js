'use strict'

const Q = require('q');
const Logger = require('../util/logger');
const Define = require('../util/define');

const stateModel = require('../model/state');

let KeyDefine = new Define();

let State = {};

State.getState = function(stateId) {
    let result = {
        code: KeyDefine.RESULT_FAILED,
        desc: null,
        data: null
    };

    if(!stateId) {
        res.send(result);
    }

    stateModel.get(stateId)
        .then(stateResult => {
            result.code = stateResult.code;
            result.desc = stateResult.desc;
            if(stateResult.code === KeyDefine.RESULT_SUCCESS) {
                result.data = stateResult.data;
            }
            res.send(result);
        }, error => {
            result.desc = 'State Model Error';
            res.send(result);
        });
};

module.exports = State;
