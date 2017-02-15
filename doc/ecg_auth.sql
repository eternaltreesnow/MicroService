-- phpMyAdmin SQL Dump
-- version 4.6.5.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: 2017-02-15 14:19:44
-- 服务器版本： 5.6.24
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
-- 表的结构 `role`
--

CREATE TABLE IF NOT EXISTS `role` (
  `roleId` int(11) NOT NULL AUTO_INCREMENT COMMENT '角色id',
  `name` varchar(40) NOT NULL COMMENT '角色名称',
  `remark` varchar(40) NOT NULL COMMENT '中文名称',
  PRIMARY KEY (`roleId`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `role`
--

INSERT INTO `role` (`roleId`, `name`, `remark`) VALUES
(1, 'doctor', '医生'),
(2, 'technician', '技师'),
(3, 'hospital', '基层医院'),
(4, 'partner', '合伙人');

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COMMENT='服务密钥表';

--
-- 转存表中的数据 `service`
--

INSERT INTO `service` (`serviceId`, `name`, `password`, `remark`) VALUES
(1, 'UserManage', 'root', '用户管理服务');

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
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8 COMMENT='服务令牌表' ROW_FORMAT=COMPACT;

--
-- 转存表中的数据 `service_token`
--

INSERT INTO `service_token` (`tokenId`, `serviceName`, `accessToken`, `ttl`) VALUES
(2, 'UserManage', '7a564363823118ac3947c8c7af525245', '1487146067436'),
(3, 'UserManage', '68bd7be105094359136029a9cd111594', '1487147163336'),
(4, 'UserManage', '81252114d0f3575430b7b2caaba0a62e', '1487167201644'),
(5, 'UserManage', '7935d823257ff87e00c86a0eaa6adb56', '1487167493556'),
(6, 'UserManage', '7fe8e41fdd1394246ec5fd2e341fed63', '1487167676895'),
(7, 'UserManage', '927da6634a1606e30722de944d720fae', '1487167805477'),
(8, 'UserManage', '3145f8a8a3e64da42453dc2e46b73499', '1487167883193'),
(9, 'UserManage', '37b2c05734414b1fe10ac552f18e5d08', '1487168013147'),
(10, 'UserManage', '9717e63ccc42be290e824ed4c1e09654', '1487168126539');

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
  PRIMARY KEY (`userId`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COMMENT='用户表';

--
-- 转存表中的数据 `user`
--

INSERT INTO `user` (`userId`, `username`, `password`, `workId`, `realName`, `chargeName`, `grade`, `level`, `idCode`, `telephone`, `address`, `email`, `major`, `createTime`, `status`) VALUES
(1, 'root', 'root', '0', '张武阳', NULL, NULL, NULL, '444444444444444444', '18888888888', '广东省广州市大学城中山大学', '562276119@qq.com', '心脏内科', '1486963385949', '1');

-- --------------------------------------------------------

--
-- 表的结构 `usermaprole`
--

CREATE TABLE IF NOT EXISTS `usermaprole` (
  `umrId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'mapId',
  `userId` int(11) NOT NULL COMMENT '用户id',
  `roleId` int(11) NOT NULL COMMENT '角色id',
  PRIMARY KEY (`umrId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COMMENT='用户与角色映射表';

--
-- 转存表中的数据 `usermaprole`
--

INSERT INTO `usermaprole` (`umrId`, `userId`, `roleId`) VALUES
(1, 1, 1);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
