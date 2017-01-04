'use strict'

const Q = require('q');
const Logger = require('../util/logger');
const Define = require('../util/define');

let KeyDefine = new Define();

let Status = {};

Status.demo = function(req, res) {
    console.log('This is a demo');
    res.send('This is a demo');
};

module.exports = Status;
