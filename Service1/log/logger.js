'use strict'

const fs = require('fs');

let Logger = {};

// create log file using timestamp
Logger.init = function() {
    let timestamp = Math.floor(+new Date() / 1000);
    Logger.logfile = './log/log_' + timestamp;
    fs.writeFile(Logger.logfile, '', ['utf8', 'w'], (err, fd) => {
        if(err) {
            Logger.console(err);
            return;
        }
        Logger.console('Logger is ready. Log file: log_' + timestamp);
    });
};

Logger.log = function(content) {
    let data = new Buffer(new Date().toISOString() + ': ' + content);
    fs.writeFile(Logger.logfile, data, 'encoding:utf8, flag:a', (err) => {
        if(err) {
            Logger.console(err);
        } else {
            Logger.console('Log finish.');
        }
    });
};

Logger.console = function(content) {
    console.log(new Date().toLocaleString('zh-CN') + ': ' + content);
};

module.exports = Logger;
