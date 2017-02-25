-- phpMyAdmin SQL Dump
-- version 4.6.5.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: 2017-02-25 16:00:50
-- 服务器版本： 5.7.17
-- PHP Version: 5.6.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ecg_auth`
--
CREATE DATABASE IF NOT EXISTS `ecg_auth` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `ecg_auth`;

-- --------------------------------------------------------

--
-- 表的结构 `censor`
--

CREATE TABLE IF NOT EXISTS `censor` (
  `censorId` int(11) NOT NULL AUTO_INCREMENT COMMENT '审核信息id',
  `clinicId` int(11) NOT NULL COMMENT '检查单id',
  `doctorId` int(11) NOT NULL COMMENT '医生id',
  `errorType` varchar(40) DEFAULT NULL COMMENT '错误类型',
  `feedback` varchar(40) DEFAULT NULL COMMENT '审核反馈信息',
  `censorTime` varchar(15) NOT NULL COMMENT '审核时间',
  PRIMARY KEY (`censorId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COMMENT='审核信息表';

--
-- 转存表中的数据 `censor`
--

INSERT INTO `censor` (`censorId`, `clinicId`, `doctorId`, `errorType`, `feedback`, `censorTime`) VALUES
(1, 6, 2, '病症判断有误', 'feedback', '1488037093071');

-- --------------------------------------------------------

--
-- 表的结构 `clinic`
--

CREATE TABLE IF NOT EXISTS `clinic` (
  `clinicId` int(11) NOT NULL AUTO_INCREMENT COMMENT '检查单id',
  `patientId` int(11) NOT NULL COMMENT '病人id',
  `addTime` varchar(15) NOT NULL COMMENT '新建时间',
  `description` varchar(80) DEFAULT NULL COMMENT '简要描述',
  `file` varchar(40) NOT NULL COMMENT '心电文件名',
  `report` varchar(40) DEFAULT NULL COMMENT '心电报告名',
  `hospitalId` int(11) NOT NULL COMMENT '所属医院id',
  `partnerId` int(11) DEFAULT NULL COMMENT '合伙人id',
  `doctorId` int(11) DEFAULT '0' COMMENT '负责医生id',
  `techId` int(11) DEFAULT '0' COMMENT '负责技师id',
  `state` tinyint(3) UNSIGNED NOT NULL DEFAULT '2' COMMENT '状态',
  `teamId` int(11) DEFAULT '0' COMMENT '所属团队id',
  `reportTime` varchar(15) DEFAULT NULL COMMENT '报告时间',
  PRIMARY KEY (`clinicId`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8 COMMENT='检查单表';

--
-- 转存表中的数据 `clinic`
--

INSERT INTO `clinic` (`clinicId`, `patientId`, `addTime`, `description`, `file`, `report`, `hospitalId`, `partnerId`, `doctorId`, `techId`, `state`, `teamId`, `reportTime`) VALUES
(1, 1, '1483613755736', 'desc', 'temp_file', 'temp_report', 1, 0, 1, 1, 1, 1, '1483613755736'),
(2, 2, '1483767218924', 'desc2', 'ecg-file-1483767218918.zip', NULL, 2, 1, 2, 3, 6, 1, NULL),
(3, 1, '1487629412425', NULL, '326444b53f540bceba72cbd6a1b6aa9e', 'ecg-report-1487954474100.csv', 1, 1, 2, 0, 9, 0, '1487954474111'),
(4, 1, '1487629647842', NULL, '4bcd8685fa777d300bf8f580c91552cb', 'ecg-report-1488036807786.csv', 1, 1, 2, 3, 7, 1, '1488036807796'),
(5, 1, '1487629795592', NULL, 'd624a8e1ac4187e171a17a6964a7cfef', 'ecg-report-1488036825412.csv', 1, 1, 2, 3, 7, 1, '1488036825415'),
(6, 1, '1487630093317', NULL, 'ecg-file-1487630093292.png', 'ecg-report-1488037021884.csv', 1, 1, 2, 3, 7, 1, '1488037021896'),
(7, 1, '1487630976572', NULL, 'ecg-file-1487630976556.png', 'ecg-report-1488037029604.csv', 1, 1, 2, 3, 9, 1, '1488038019422'),
(8, 1, '1487632726539', NULL, 'ecg-file-1487632726497.png', NULL, 1, 1, 0, 0, 2, 0, NULL),
(9, 1, '1487632831542', NULL, 'ecg-file-1487632831495.png', 'ecg-report-1488037037389.png', 1, 1, 0, 3, 6, 1, '1488037037393'),
(10, 1, '1487952435664', NULL, 'ecg-file-1487952435642.png', NULL, 1, 1, 0, 0, 2, 0, NULL);

-- --------------------------------------------------------

--
-- 表的结构 `clinic_action`
--

CREATE TABLE IF NOT EXISTS `clinic_action` (
  `actionId` int(11) NOT NULL AUTO_INCREMENT COMMENT '动作id',
  `name` varchar(20) NOT NULL COMMENT '动作名称',
  `preState` int(11) DEFAULT NULL COMMENT '前置状态id',
  `postState` int(11) DEFAULT NULL COMMENT '后置状态id',
  `permission` tinyint(3) UNSIGNED NOT NULL DEFAULT '0' COMMENT '角色权限',
  `chargeType` tinyint(3) UNSIGNED DEFAULT '0' COMMENT '负责人类型',
  `explanation` varchar(20) DEFAULT NULL COMMENT '动作释义',
  PRIMARY KEY (`actionId`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8 COMMENT='操作动作表' ROW_FORMAT=COMPACT;

--
-- 转存表中的数据 `clinic_action`
--

INSERT INTO `clinic_action` (`actionId`, `name`, `preState`, `postState`, `permission`, `chargeType`, `explanation`) VALUES
(1, 'addClinic', NULL, 2, 1, 0, '新建检查单'),
(2, 'allocateClinic', 2, 3, 0, 0, '分配团队'),
(3, 'analyzeClinicDoc', 3, 4, 2, 0, '医生拉取检查单进行分析'),
(4, 'analyzeClinicTech', 3, 5, 3, 0, '技师拉取检查单进行分析'),
(5, 'revokeClinicTech', 5, 3, 3, 3, '技师撤回检查单'),
(6, 'publishReportDoc', 4, 9, 2, 2, '医生发布报告'),
(7, 'submitReportTech', 5, 6, 3, 3, '技师提交报告'),
(8, 'auditFailedDoc', 6, 7, 2, 0, '医生审核未通过'),
(9, 'reanalyzeTech', 7, 5, 3, 3, '技师重分析'),
(10, 'auditSuccessDoc', 6, 9, 2, 0, '医生审核通过'),
(11, 'initConsulAudit', 6, 8, 2, 0, '医生审核时发起会诊'),
(12, 'initConsulAnalysis', 4, 8, 2, 0, '医生分析时发起会诊'),
(13, 'publishReportConsul', 8, 9, 2, 2, '会诊通过并发布报告');

-- --------------------------------------------------------

--
-- 表的结构 `clinic_state`
--

CREATE TABLE IF NOT EXISTS `clinic_state` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `stateId` int(11) NOT NULL COMMENT '状态id',
  `name` varchar(20) DEFAULT NULL COMMENT '状态名称',
  PRIMARY KEY (`id`),
  UNIQUE KEY `stateId` (`stateId`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `clinic_state`
--

INSERT INTO `clinic_state` (`id`, `stateId`, `name`) VALUES
(1, 0, '待新建'),
(2, 1, '待分配团队'),
(3, 2, '待拉取'),
(4, 3, '医生分析中'),
(5, 4, '技师分析中'),
(6, 5, '待审核'),
(7, 6, '待重分析'),
(8, 7, '会诊中'),
(9, 8, '已报告');

-- --------------------------------------------------------

--
-- 表的结构 `contract`
--

CREATE TABLE IF NOT EXISTS `contract` (
  `contractId` int(11) NOT NULL AUTO_INCREMENT COMMENT '契约id',
  `hospitalId` int(11) NOT NULL COMMENT '基层医院id',
  `partnerId` int(11) NOT NULL COMMENT '合伙人id',
  `status` int(11) NOT NULL DEFAULT '1' COMMENT '状态',
  PRIMARY KEY (`contractId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COMMENT='契约表';

--
-- 转存表中的数据 `contract`
--

INSERT INTO `contract` (`contractId`, `hospitalId`, `partnerId`, `status`) VALUES
(1, 1, 1, 1);

-- --------------------------------------------------------

--
-- 表的结构 `operation`
--

CREATE TABLE IF NOT EXISTS `operation` (
  `operationId` int(11) NOT NULL AUTO_INCREMENT COMMENT '操作id',
  `name` varchar(40) NOT NULL COMMENT '操作名称',
  `remark` varchar(40) NOT NULL COMMENT '注释',
  PRIMARY KEY (`operationId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `operation`
--

INSERT INTO `operation` (`operationId`, `name`, `remark`) VALUES
(1, 'addTeam', '添加分析团队'),
(2, 'editTeam', '编辑团队信息');

-- --------------------------------------------------------

--
-- 表的结构 `patient`
--

CREATE TABLE IF NOT EXISTS `patient` (
  `patientId` int(11) NOT NULL AUTO_INCREMENT COMMENT '病人id',
  `hospitalId` int(11) NOT NULL COMMENT '基层医院id',
  `name` varchar(40) NOT NULL COMMENT '病人姓名',
  `idCode` varchar(20) NOT NULL COMMENT '身份证号码',
  `gender` varchar(5) NOT NULL COMMENT '性别',
  `birth` varchar(15) NOT NULL COMMENT '出生日期',
  `height` int(11) NOT NULL COMMENT '身高',
  `weight` int(11) NOT NULL COMMENT '体重',
  `medicareNum` varchar(20) NOT NULL COMMENT '医保号',
  `telephone` varchar(11) NOT NULL COMMENT '联系电话',
  `address` varchar(80) NOT NULL COMMENT '联系地址',
  `patientNum` varchar(20) NOT NULL COMMENT '医疗号',
  `wardNum` int(11) NOT NULL COMMENT '病房号',
  `bedNum` int(11) NOT NULL COMMENT '病床号',
  `remark` varchar(100) NOT NULL COMMENT '备注',
  PRIMARY KEY (`patientId`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COMMENT='病人信息表';

--
-- 转存表中的数据 `patient`
--

INSERT INTO `patient` (`patientId`, `hospitalId`, `name`, `idCode`, `gender`, `birth`, `height`, `weight`, `medicareNum`, `telephone`, `address`, `patientNum`, `wardNum`, `bedNum`, `remark`) VALUES
(1, 1, 'dickzheng', '444444444444444444', '男', '724896000000', 170, 75, '10001', '18888888888', '广东省广州市番禺区大学城', '10001', 1, 1, 'remark'),
(2, 1, '许留山', '440440198001010101', '男', '724896000000', 170, 75, '10002', '18888888888', '广东省广州市大学城', '10002', 1, 1, 'remark'),
(3, 1, '拉萨尔', '444444444444444444', '男', '724896000000', 175, 88, '10003', '13333333333', '广东省广州市番禺区', '10003', 1, 1, 'remark'),
(4, 1, '费德勒', '444444444444444444', '男', '724896000000', 188, 90, '10004', '17000000000', '澳大利亚北美', '10004', 1, 1, 'remark');

-- --------------------------------------------------------

--
-- 表的结构 `role`
--

CREATE TABLE IF NOT EXISTS `role` (
  `roleId` int(11) NOT NULL AUTO_INCREMENT COMMENT '角色id',
  `name` varchar(40) NOT NULL COMMENT '角色名称',
  `uri` varchar(80) NOT NULL COMMENT '角色端Uri',
  `remark` varchar(40) NOT NULL COMMENT '中文名称',
  PRIMARY KEY (`roleId`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `role`
--

INSERT INTO `role` (`roleId`, `name`, `uri`, `remark`) VALUES
(1, 'doctor', 'http://localhost:10005/', '医生'),
(2, 'technician', 'http://localhost:10006/', '技师'),
(3, 'hospital', 'http://localhost:10007/', '基层医院'),
(4, 'partner', 'http://localhost:10008/', '合伙人');

-- --------------------------------------------------------

--
-- 表的结构 `rolemapoperation`
--

CREATE TABLE IF NOT EXISTS `rolemapoperation` (
  `rmpId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'mapId',
  `roleId` int(11) NOT NULL COMMENT '角色id',
  `operationId` int(11) NOT NULL COMMENT '操作id',
  PRIMARY KEY (`rmpId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COMMENT='角色与权限映射表';

--
-- 转存表中的数据 `rolemapoperation`
--

INSERT INTO `rolemapoperation` (`rmpId`, `roleId`, `operationId`) VALUES
(1, 1, 1),
(2, 1, 2);

-- --------------------------------------------------------

--
-- 表的结构 `service`
--

CREATE TABLE IF NOT EXISTS `service` (
  `serviceId` int(11) NOT NULL AUTO_INCREMENT COMMENT '服务id',
  `name` varchar(40) NOT NULL COMMENT '服务名称',
  `password` varchar(40) NOT NULL COMMENT '服务密钥',
  `remark` varchar(40) NOT NULL COMMENT '注释',
  PRIMARY KEY (`serviceId`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8 COMMENT='服务密钥表';

--
-- 转存表中的数据 `service`
--

INSERT INTO `service` (`serviceId`, `name`, `password`, `remark`) VALUES
(1, 'UserManage', 'root', '用户管理服务'),
(2, 'DoctorCli', 'root', '医生客户端服务'),
(3, 'ClinicManage', 'root', '检查单管理服务'),
(4, 'HospitalCli', 'root', '基层医院客户端服务'),
(5, 'TechnicianCli', 'root', '技师客户端服务'),
(6, 'PartnerCli', 'root', '合伙人客户端服务'),
(7, 'TeamManage', 'root', '团队管理服务');

-- --------------------------------------------------------

--
-- 表的结构 `service_token`
--

CREATE TABLE IF NOT EXISTS `service_token` (
  `tokenId` int(11) NOT NULL AUTO_INCREMENT COMMENT '令牌id',
  `serviceName` varchar(40) NOT NULL COMMENT '服务名称',
  `accessToken` varchar(40) NOT NULL COMMENT '令牌',
  `ttl` varchar(15) NOT NULL COMMENT '过期时间',
  PRIMARY KEY (`tokenId`)
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=utf8 COMMENT='服务令牌表' ROW_FORMAT=COMPACT;

--
-- 转存表中的数据 `service_token`
--

INSERT INTO `service_token` (`tokenId`, `serviceName`, `accessToken`, `ttl`) VALUES
(26, 'UserManage', 'fedbbfdc11277f98454d8f7dbec252a3', '1487866375428'),
(27, 'UserManage', 'b5f7f4eaae02981f70e02ee2557ae2d9', '1487866866050'),
(28, 'UserManage', '3cf29036243f41084f9096ff794bd546', '1487866867380'),
(29, 'UserManage', '1a6bb4c8298dc51e34abeb5eeb3614cf', '1487866868709'),
(30, 'UserManage', 'b31cbd2d9411c72264bb45280e671671', '1487866869992'),
(31, 'UserManage', 'ecb2d7ca7a42803c78583b6ee72f0756', '1487866871374'),
(32, 'UserManage', 'd8b414056098b81e916b8b732f6573ab', '1487866872713'),
(33, 'UserManage', 'a0711db633f8d328e148c3357e4a9290', '1487866874052'),
(34, 'UserManage', '870136302448edb743d9a2058921df64', '1487866973633'),
(35, 'UserManage', 'd492cd01cea236585bdd43d2b46a8a0a', '1487866974984'),
(36, 'UserManage', 'b501a3807780815cf256c74fff8c170a', '1487866976263'),
(37, 'UserManage', 'c23b7e0354dcda1000fe67a023c3dff4', '1487866977551'),
(38, 'UserManage', 'ce5c23a4ecf8138f0ee7757ca380c9dd', '1487866978812'),
(39, 'UserManage', '143c98af8459e4a73f9c4a5b75fa333c', '1487866980124'),
(40, 'UserManage', '33a32aee421784a92df710bc8a2985cc', '1487867768162'),
(41, 'UserManage', 'b383c7998ac989a7563108c4efa704e6', '1487867769543'),
(42, 'UserManage', '21c1d93f56ff6984942735505586d3c1', '1487867770839'),
(43, 'UserManage', '07bd2693f19c3bba0ead99d39ffaa23e', '1487868408314'),
(44, 'ClinicManage', 'ee7c235b6a6d48b260fb6afbcb889399', '1487868958076'),
(45, 'ClinicManage', 'bd28f69fe7c3e7f11e4d2e5fa1a5df24', '1487869216124'),
(46, 'ClinicManage', '381d33f852cbb6c5c8f0f67d791c3380', '1487870185541'),
(47, 'ClinicManage', '6c8c46b8d5c394c6afaa8bb8df7623f7', '1487870648735'),
(48, 'ClinicManage', 'ddffaa7247327bec8932cd60ac3ee760', '1487951613742'),
(49, 'ClinicManage', '4bc0516155e6be4db759a936b1512d65', '1487952291243'),
(50, 'ClinicManage', 'ba084393d88769dbb8ee7288d069a715', '1487952918421'),
(51, 'ClinicManage', '256cef9026037a48043afc665357241b', '1487954214424'),
(52, 'ClinicManage', '572b415926d97aeeaae4d9d131c311b1', '1487954813662'),
(53, 'ClinicManage', '17ab2cba30d120c32022a004efafa42e', '1488036485262'),
(54, 'ClinicManage', 'fe08a8a8d3e29b2b6c82736e7b67b71b', '1488036757991'),
(55, 'ClinicManage', 'f71ff317cc61ce0bafeec33d2f6f24d3', '1488036976373'),
(56, 'ClinicManage', 'b60d3ad84c1ead433da1ff2192cb6093', '1488037194180'),
(57, 'ClinicManage', '71a0f48051e59de475769f38107a5c3c', '1488038186440');

-- --------------------------------------------------------

--
-- 表的结构 `team`
--

CREATE TABLE IF NOT EXISTS `team` (
  `teamId` int(11) NOT NULL AUTO_INCREMENT COMMENT '团队id',
  `partnerId` int(11) NOT NULL COMMENT '合伙人id',
  `leaderId` int(11) NOT NULL COMMENT '负责人id',
  `name` varchar(20) NOT NULL COMMENT '团队名称',
  `state` int(11) NOT NULL COMMENT '状态',
  PRIMARY KEY (`teamId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COMMENT='分析团队表';

--
-- 转存表中的数据 `team`
--

INSERT INTO `team` (`teamId`, `partnerId`, `leaderId`, `name`, `state`) VALUES
(1, 1, 2, '杨医生团队', 1);

-- --------------------------------------------------------

--
-- 表的结构 `user`
--

CREATE TABLE IF NOT EXISTS `user` (
  `userId` int(11) NOT NULL AUTO_INCREMENT COMMENT '用户id',
  `username` varchar(40) NOT NULL COMMENT '用户名',
  `password` varchar(100) NOT NULL COMMENT '登录密码',
  `workId` varchar(40) DEFAULT NULL COMMENT '工号',
  `realName` varchar(40) DEFAULT NULL COMMENT '真实姓名',
  `chargeName` varchar(40) DEFAULT NULL COMMENT '医院负责人',
  `grade` int(11) DEFAULT NULL COMMENT '医院分级-级',
  `level` int(11) DEFAULT NULL COMMENT '医院分级-等',
  `idCode` varchar(20) DEFAULT NULL COMMENT '身份证号码',
  `telephone` varchar(20) DEFAULT NULL COMMENT '联系电话',
  `address` varchar(160) DEFAULT NULL COMMENT '联系地址',
  `email` varchar(40) DEFAULT NULL COMMENT '常用邮箱',
  `major` varchar(15) NOT NULL COMMENT '专业',
  `createTime` varchar(15) NOT NULL COMMENT '创建时间',
  `status` varchar(2) NOT NULL COMMENT '状态',
  `roleId` int(11) NOT NULL COMMENT '角色id',
  `teamId` int(11) NOT NULL DEFAULT '0' COMMENT '所在团队id',
  PRIMARY KEY (`userId`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COMMENT='用户表';

--
-- 转存表中的数据 `user`
--

INSERT INTO `user` (`userId`, `username`, `password`, `workId`, `realName`, `chargeName`, `grade`, `level`, `idCode`, `telephone`, `address`, `email`, `major`, `createTime`, `status`, `roleId`, `teamId`) VALUES
(1, 'root', 'root', '0', '武警医院', NULL, NULL, NULL, '444444444444444444', '18888888888', '广东省广州市大学城中山大学', '562276119@qq.com', '', '1486963385949', '1', 3, 0),
(2, 'doctor', 'root', NULL, '杨医生', NULL, NULL, NULL, '444444444444444444', '18888888888', '广东省某医院', '99999999@qq.com', '心脏内科', '1487682988069', '1', 1, 1),
(3, 'tech', 'root', NULL, '李技师', NULL, NULL, NULL, '444444444444444444', '13333333333', '广东省基层卫生服务', '1333333@qq.com', '心脏内科', '1487682988069', '1', 2, 1),
(4, 'partner', 'root', NULL, '王合伙人', NULL, NULL, NULL, '444444444444444444', '13333333333', '广东省某投资合伙社区', '1882929@qq.com', '投资银行学', '1487682988069', '1', 4, 0);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
