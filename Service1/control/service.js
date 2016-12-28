'use strict'

const Q = require('q');
const Logger = require('../log/logger');
const Define = require('../define');

let KeyDefine = new Define();

let Service = {};

Service.demo = function(req, res) {
    console.log('This is a demo');
    res.send('This is a demo');
};

module.exports = Service;
