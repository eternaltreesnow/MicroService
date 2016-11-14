'use strict'

var mysql = require('./sql/mysql');

let plugin = function() {
    let seneca = this;

    seneca
        .add('role:api, cmd:register', function(msg, reply) {
            // console.log(msg);
            reply(null, {reply: 'This is register api'});
        })
        .add('role: api, cmd: update', function(msg, reply) {
            console.log(msg);
            reply(null, {reply: 'This is update api'});
        })
        .add('role: api, cmd: delete', function(msg, reply) {
            console.log(msg);
            reply(null, {reply: 'This is delete api'});
        })
        .add('role: api, cmd: query', function(msg, reply) {
            console.log(msg);
            reply(null, {reply: 'This is query api'});
        })
};

module.exports = plugin;
