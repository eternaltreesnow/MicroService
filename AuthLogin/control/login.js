'use strict'

const Q = require('q');
const Logger = require('../util/logger');
const Define = require('../util/define');
const loginModel = require('../model/login');
const session = require('./session');

let KeyDefine = new Define();

let Login = {};

Login.login = function(req, res) {
    let username = req.body.username;
    let password = req.body.password;
    let src = req.body.src;

    // 检查用户名&密码
    loginModel.checkParam(username, password)
        .then(checkResult => {
            Logger.console(checkResult.desc);
            if(checkResult.code === KeyDefine.RESULT_SUCCESS) {
                // 登录请求
                return loginModel.login(username, password);
            } else {
                res.send(checkResult);
            }
        })
        .then(loginResult => {
            Logger.console(loginResult.desc);
            if(loginResult.code === KeyDefine.LOGIN_SUCCESS) {
                let userData = loginResult.data;
                // 注册session
                return session.register(userData);
            } else {
                res.send(loginResult);
            }
        })
        .then(sessionResult => {
            if(sessionResult.code === KeyDefine.RESULT_SUCCESS) {
                let sessionId = req.session.id;
                let sessionData = JSON.stringify(sessionResult.data);
                // 将session信息存储到redis和cookie中
                req.session.data = sessionData;
                if(src && src.length > 0) {
                    res.redirect(src);
                } else {
                    res.send(req.session);
                }
            } else {
                res.send(sessionResult);
            }
        })
        .catch(error => {
            res.send(error);
        });
};

Login.loginView = function(req, res) {
    res.render('../view/login', {
        src: req.query.src
    });
};

module.exports = Login;
