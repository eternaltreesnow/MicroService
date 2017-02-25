'use strict'

const Q = require('q');
const sqlQuery = require('sql-query').Query();
const Define = require('../util/define');
const Logger = require('../util/logger');

const DBPool = require('./dbpool');

let KeyDefine = new Define();
KeyDefine.TABLE_NAME = 'censor';

let Censor = {};

Censor.add = function(censor) {
    let defer = Q.defer();

    let result = {
        request: KeyDefine.ACTION_INSERT,
        target: KeyDefine.TABLE_NAME,
        code: KeyDefine.RESULT_FAILED,
        desc: 'Censor Model: Unknowed error'
    };

    let insertOption = sqlQuery.insert()
                        .into(KeyDefine.TABLE_NAME)
                        .set(censor)
                        .build();

    DBPool.getConnection()
        .then(connection => {
            connection.query(insertOption, (err, rows) => {
                connection.release();
                if(err) {
                    Logger.console('Error in INSERT ' + KeyDefine.TABLE_NAME);
                    Logger.console(err);
                    defer.reject(err)
                } else if(rows.affectedRows === 0) {
                    Logger.console('Failed in INSERT ' + KeyDefine.TABLE_NAME);
                    result.code = KeyDefine.RESULT_ADD_NONE;
                    result.desc = 'Failed in INSERT ' + KeyDefine.TABLE_NAME;
                    defer.resolve(result);
                } else {
                    result.code = KeyDefine.RESULT_SUCCESS;
                    result.desc = 'Success in INSERT ' + KeyDefine.TABLE_NAME;
                    defer.resolve(result);
                }
            });
        }, error => {
            defer.reject(error);
        });

    return defer.promise;
};

module.exports = Censor;
