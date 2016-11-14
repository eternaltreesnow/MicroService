'use strict'

const Logger = require('../log/logger');
const queryModel = require('../model/query');

let query = function(req, res) {
    Logger.console('query control');
    queryModel.query(req.query)
        .then(result => {
            res.send(result);
        }, error => {
            res.send(error);
        });
}

module.exports = query;
