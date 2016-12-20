'use strict'

const Q = require('q');
const Logger = require('../log/logger');
const redisClient = require('./redis');

let Verify = {};

Verify.verify = function(sessionId) {
    let defer = Q.defer();

    redisClient()
        .then(client => {
            client.get(sessionId, (err, reply) => {
                if(err) {
                    defer.reject(err);
                } else {
                    console.log(reply);
                }
            })
        }, error => {
            defer.reject(error);
        })

    return defer.promise();
}

module.exports = Verify;
