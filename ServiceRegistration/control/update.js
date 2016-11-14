'use strict'

const Logger = require('../log/logger');
const updateModel = require('../model/update');

let update = function(req, res) {
    Logger.console('update control');
    updateModel.update(req.body)
        .then(result => {
            res.send(result);
        }, error => {
            res.send(error);
        });
}

module.exports = update;
