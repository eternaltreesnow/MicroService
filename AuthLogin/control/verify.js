'use strict'

const Q = require('q');
const Logger = require('../log/logger');
const Define = require('../define');
const verifyModel = require('../model/verify');

let KeyDefine = new Define();

let Verify = {};

Verify.verify = function(req, res) {
    let result = {
        code: 302,
        url: 'http://localhost:10000/login'
    };
    let sessionId = req.query.sessionId;
    Logger.console('Verify Control: sessionId = ' + sessionId);

    if(sessionId && sessionId.length > 0) {
        result.code = 200;
    } else {
        Logger.console('Verify Control: Null Session');
    }
    res.end(JSON.stringify(result));
};

module.exports = Verify;
