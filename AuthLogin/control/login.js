'use strict'

const Q = require('q');
const Logger = require('../util/logger');
const Define = require('../util/define');
const loginModel = require('../model/login');
const roleModel = require('../model/role');
const session = require('./session');

let KeyDefine = new Define();

let Login = {};

/**
 * 用户登录
 * @param  {Object} req 请求
 * @param  {Object} res 响应
 * @return {Object}     登录结果
 * @workflow:
 *  - 检查用户名密码
 *  - 登录
 *  - 获取授权操作
 *  - 注册session
 *  - 获取跳转uri
 */
Login.login = function(req, res) {
    let username = req.body.username;
    let password = req.body.password;
    let src = req.body.src || '';

    let result = {
        code: KeyDefine.RESULT_FAILED,
        desc: 'Login Control: Login failed, unknowed error'
    };

    // 检查用户名&密码
    loginModel.checkParam(username, password)
        .then(checkResult => {
            Logger.console(checkResult.desc);
            if(checkResult.code === KeyDefine.RESULT_SUCCESS) {
                // 登录请求
                return loginModel.login(username, password);
            } else {
                // 验证失败则跳出promise链
                result.code = checkResult.code;
                result.desc = checkResult.desc;
                result.uri = null;
                res.send(result);
                throw new Error('Abort promise chain');
                return null;
            }
        })
        .then(loginResult => {
            Logger.console(loginResult.desc);
            result.code = loginResult.code;
            result.desc = loginResult.desc;
            if(loginResult.code === KeyDefine.LOGIN_SUCCESS) {
                let userData = loginResult.data;
                // 获取操作
                return loginModel.getOperation(userData);
            } else {
                // 登录失败则跳出promise链
                res.send(result);
                throw new Error('Abort promise chain');
                return null;
            }
        })
        .then(operationResult => {
            let userData = operationResult.data;
            Logger.console(operationResult.desc);
            // 注册session
            req.session.data = JSON.stringify(userData);
            Logger.console(JSON.stringify(userData));
            if(src && src !== '' && src.length > 0) {
                result.uri = src;
                res.send(result);
                throw new Error('Abort promise chain');
                return null;
            } else {
                // 无跳转uri时，根据角色获取跳转uri
                return roleModel.getUri(userData.roleId);
            }
        })
        .then(roleResult => {
            if(roleResult.code === KeyDefine.RESULT_SUCCESS) {
                result.uri = roleResult.data;
            } else {
                result.uri = null;
            }
            res.send(result);
        })
        .catch(error => {
            if(error.message === 'Abort promise chain') {
                // 手动跳出promise链
            } else {
                result.desc = 'Login error';
                Logger.console(error);
                res.send(result);
            }
        });
};

Login.loginView = function(req, res) {
    res.render('login', {
        src: req.query.src
    });
};

module.exports = Login;
