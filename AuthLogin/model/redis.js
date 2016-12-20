'use strict'

const redis = require('redis');
const Q = require('q');
const Logger = require('../log/logger');

const RDS_CONFIG = {
    host: '54.187.245.212',
    port: 6379,
    password: 'ecg-cloud',
    prefix: 'session:'
};

let redisClient = function() {
    let defer = Q.defer();

    let client = redis.createClient(RDS_CONFIG);

    client.on('error', (err) => {
        defer.reject(err);
    });

    client.on('ready', (err) => {
        Logger.console('Redis connection ready');
        if(err) {
            defer.reject(err);
        } else {
            defer.resolve(client);
        }
    });

    client.on('end', () => {
        Logger.console('Redis connection closed');
    });

    return defer.promise();
}

module.exports = redisClient;
