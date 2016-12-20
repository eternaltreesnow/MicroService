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
    let src = req.body.src;

    // 检查用户名&密码
    loginModel.checkParam(username, password)
        .then(checkResult => {
            Logger.console(checkResult.desc);
            if(checkResult.code === KeyDefine.RESULT_SUCCESS) {
                // 登录请求
                loginModel.login(username, password)
                    .then(loginResult => {
                        Logger.console(loginResult.desc);
                        if(loginResult.code === KeyDefine.LOGIN_SUCCESS) {
                            let userData = loginResult.data;
                            // 注册session
                            session.register(userData)
                                .then(sessionResult => {
                                    Logger.console(sessionResult.desc);
                                    if(sessionResult.code === KeyDefine.RESULT_SUCCESS) {
                                        // 将session信息存储到redis和cookie中
                                        req.session.data = JSON.stringify(sessionResult.data);
                                        if(src && src.length > 0) {
                                            res.redirect(src);
                                        } else {
                                            res.send(req.session);
                                        }
                                    } else {
                                        res.send(sessionResult);
                                    }
                                }, sessionError => {
                                    res.send(sessionError);
                                });
                        } else {
                            res.send(loginResult);
                        }
                    }, loginError => {
                        res.send(loginError);
                    });
            } else {
                res.send(checkResult);
            }
        }, checkError => {
            res.send(checkError);
        });
};

Login.loginView = function(req, res) {
    res.render('../view/login', {
        src: req.query.src
    });
};

module.exports = Login;
