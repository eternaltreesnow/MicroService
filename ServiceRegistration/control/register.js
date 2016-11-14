'use strict'

const Q = require('q');
const Logger = require('../log/logger');
const registerModel = require('../model/register');

let register = function(req, res) {
    Logger.console('register control');
    registerModel.register(req.body)
        .then(result => {
            res.send(result);
        }, error => {
            res.send(error);
        });
};

module.exports = register;
