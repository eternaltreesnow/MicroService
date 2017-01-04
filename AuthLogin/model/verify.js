'use strict'

const Q = require('q');
const Logger = require('../util/logger');
const redisClient = require('./redis');
const Define = require('../util/define');

let KeyDefine = new Define();

let Verify = {};

Verify.verify = function(sessionId) {
    let defer = Q.defer();

    let result = {
        code: KeyDefine.RESULT_FAILED,
        data: null
    };

    redisClient()
        .then(client => {
            client.get(sessionId, (err, reply) => {
                if(err) {
                    defer.reject(err);
                } else {
                    Logger.console('Verify Model: Reach session data');
                    let session = JSON.parse(reply);
                    if(session && session.data) {
                        result.code = KeyDefine.RESULT_SUCCESS;
                        result.data = session.data;
                        defer.resolve(result);
                    } else {
                        defer.resolve(result);
                    }
                }
            });
            client.quit();
        }, error => {
            defer.reject(error);
        })

    return defer.promise;
}

module.exports = Verify;
