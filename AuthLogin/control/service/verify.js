'use strict'

const Q = require('q');
const Logger = require('../../util/logger');
const Define = require('../../util/define');
const tokenModel = require('../../model/service/token');

let KeyDefine = new Define();

let Verify = {};

Verify.verify = function(req, res) {
    let result = {
        code: KeyDefine.RESULT_REDIRECT,
        url: 'http://' + req.headers.host + '/service/auth',
        data: null
    };

    let serviceName = req.query.service_name;
    let accessToken = req.query.access_token;

    if(serviceName && serviceName.length > 0 && accessToken && accessToken.length > 0) {
        tokenModel.get(serviceName, accessToken)
            .then(tokenResult => {
                Logger.console(tokenResult.desc);
                if(tokenResult.code === KeyDefine.RESULT_SUCCESS) {
                    let ttl = tokenResult.data.ttl;
                    if(ttl >= (+new Date())) {
                        result.code = KeyDefine.RESULT_SUCCESS;
                        result.data = tokenResult.data;
                    }
                    res.end(JSON.stringify(result));
                }
                res.end(JSON.stringify(result));
            }, error => {
                Logger.console(error);
                res.end(JSON.stringify(result));
            });
    } else {
        Logger.console('Null Verify Params');
        res.end(JSON.stringify(result));
    }
}

module.exports = Verify;
