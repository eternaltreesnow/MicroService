'use strict'

const Express = require('express');

const team = require('./control/team');

// 日志模块
const Logger = require('./util/logger');
// 枚举变量
const Define = require('./util/define');
// 验证模块
const Auth = require('./util/auth');
// 代理模块
const Agent = require('./util/agent');

let KeyDefine = new Define();

let router = Express.Router();

// 获取团队id
router.get('/getTeamId', (req, res) => {
    Logger.console('Get Req /getTeamId');
    Auth.authService(req, res, team.getTeamIdByUserId);
});

// 获取合伙人id
router.get('/getPartnerId', (req, res) => {
    Logger.console('Get Req /getPartnerId');
    Auth.authService(req, res, team.getPartnerIdByUserId);
});

router.get('/getTeamList', (req, res) => {
    Auth.auth(req, res, '', team.getTeamList);
});

// 添加团队
router.post('/addTeam', (req, res) => {
    Auth.auth(req, res, '', team.addTeam);
});

// 获取teamId并判断是否为队长
router.get('/checkTeam', (req, res) => {
    Logger.console('Get Req /checkTeam');
    Auth.authService(req, res, team.checkTeam);
});

// 获取团队基本信息
router.get('/getTeamInfo', (req, res) => {
    Auth.auth(req, res, '', team.getTeamInfo);
});

// 获取团队成员列表
router.get('/getMemberList', (req, res) => {
    Auth.auth(req, res, '', team.getMemberList);
})

// 删除团队
router.post('/deleteTeam', (req, res) => {

});

// 停用团队
router.post('/stopTeam', (req, res) => {

});

// 启用团队
router.post('/startTeam', (req, res) => {

});

// 查看团队信息
router.get('/info', (req, res) => {

});

// 修改团队名称
router.post('/modifyName', (req, res) => {

});

// 修改负责医生
router.post('/modifyLeader', (req, res) => {

});

// 添加团队成员
router.post('/addMember', (req, res) => {
    Auth.auth(req, res, '', team.addMember);
});

module.exports = router;
