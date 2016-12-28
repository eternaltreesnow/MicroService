'use strict'

const Q = require('q');
const Logger = require('../log/logger');
const Define = require('../define');
const verifyModel = require('../model/verify');

let KeyDefine = new Define();

let Verify = {};

Verify.verify = function(req, res) {
    let result = {
        code: KeyDefine.RESULT_REDIRECT,
        url: 'http://localhost:10000/login'
    };
    let sessionId = req.query.sessionId;
    Logger.console('Verify Control: sessionId = ' + sessionId);

    if(sessionId && sessionId.length > 0) {
        verifyModel.verify(sessionId)
            .then(verifyResult => {
                if(verifyResult.code === KeyDefine.RESULT_SUCCESS) {
                    result.code = KeyDefine.RESULT_SUCCESS;
                    result.data = {
                        sessionId: sessionId,
                        sessionData: verifyResult.data
                    };
                } else {
                    Logger.console('Verify Control: Session invalid');
                }
                res.end(JSON.stringify(result));
            }, error => {
                Logger.console('Verify Control: Session verify error');
                res.end(JSON.stringify(result));
            });
    } else {
        Logger.console('Verify Control: Null Session');
        res.end(JSON.stringify(result));
    }
};

module.exports = Verify;
