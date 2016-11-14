'use strict'

const Logger = require('../log/logger');
const removeModel = require('../model/remove');

let remove = function(req, res) {
    Logger.console('remove control');
    removeModel.remove(req.query)
        .then(result => {
            res.send(result);
        }, error => {
            res.send(error);
        });
}

module.exports = remove;
