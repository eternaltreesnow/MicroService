'use strict'

const Q = require('q');
const Logger = require('../util/logger');
const Define = require('../util/define');
const verifyModel = require('../model/verify');

let KeyDefine = new Define();

let Verify = {};

Verify.verify = function(req, res) {
    let result = {
        code: KeyDefine.RESULT_REDIRECT,
        url: 'http://' + req.headers.host + '/login'
    };
    let sessionId = req.query.sessionId;
    Logger.console('Verify Control: sessionId = ' + sessionId);

    if(sessionId && sessionId.length > 0) {
        verifyModel.verify(sessionId)
            .then(verifyResult => {
                Logger.console(verifyResult);
                if(verifyResult.code === KeyDefine.RESULT_SUCCESS) {
                    result.code = KeyDefine.RESULT_SUCCESS;
                    result.data = {
                        sessionId: sessionId,
                        sessionData: verifyResult.data
                    };
                } else {
                    Logger.console('Verify Control: Session invalid');
                }
                Logger.console(JSON.stringify(verifyResult.data));
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
