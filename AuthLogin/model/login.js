'use strict'

const Q = require('q');
const Define = require('../define');
const DBPool = require('./dbpool');
const Logger = require('../log/logger');
const sqlQuery = require('sql-query').Query();

let KeyDefine = new Define;
KeyDefine.TABLE_NAME = 'user';

let validate = (param) => {
    return KeyDefine.VALID_SUCCESS;
};

let DB = {};

DB.query = (query, column) => {
    let defer = Q.defer();

    let result = {
        request: KeyDefine.ACTION_LOGIN,
        target: KeyDefine.TABLE_NAME,
        result: KeyDefine.RESULT_FAILED,
        desc: 'Unknowed error',
        data: null
    };
}
