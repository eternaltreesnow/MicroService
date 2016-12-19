'use strict'

const Q = require('q');
const Logger = require('../log/logger');
const Define = require('../define');
const sessionModel = require('../model/session');

let KeyDefine = new Define();

let Session = {};

Session.register = function(userId) {
    let defer = Q.defer();

    let result = {

    }

    return defer.promise;
};

module.exports = Session;
