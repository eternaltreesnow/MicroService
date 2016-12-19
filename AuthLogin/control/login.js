'use strict'

const Q = require('q');
const Logger = require('../log/logger');
const Define = require('../define');
const loginModel = require('../model/login');
const session = require('./session');

let KeyDefine = new Define();

let Login = {};

Login.login = function(req, res) {
    Logger.console('login controller');
    let username = req.body.username;
    let password = req.body.password;

    loginModel.checkParam(username, password)
        .then(result => {
            if(result.result === KeyDefine.RESULT_SUCCESS) {
                Logger.console(result.desc);
                loginModel.login(username, password)
                    .then(result => {
                        if(result.result === KeyDefine.LOGIN_SUCCESS) {
                            let userId = result.data;
                            session.register(userId)
                                .then(result => {

                                }, error => {

                                });
                        } else {
                            res.send(result);
                        }
                    }, error => {
                        res.send(error);
                    });
            }
        }, error => {
            res.send(error);
        });
};

module.exports = Login;
