-- phpMyAdmin SQL Dump
-- version 4.6.5.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: 2017-01-07 09:25:59
-- 服务器版本： 5.6.24
-- PHP Version: 5.6.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `clinic`
--
CREATE DATABASE IF NOT EXISTS `clinic` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `clinic`;

-- --------------------------------------------------------

--
-- 表的结构 `action`
--
-- 创建时间： 2017-01-06 07:14:47
--

CREATE TABLE IF NOT EXISTS `action` (
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
-- 转存表中的数据 `action`
--

INSERT INTO `action` (`actionId`, `name`, `preState`, `postState`, `permission`, `chargeType`, `explanation`) VALUES
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
-- 表的结构 `clinic`
--
-- 创建时间： 2017-01-07 05:22:09
--

CREATE TABLE IF NOT EXISTS `clinic` (
  `clinicId` int(11) NOT NULL AUTO_INCREMENT COMMENT '检查单id',
  `patientId` int(11) NOT NULL COMMENT '病人id',
  `addTime` varchar(15) NOT NULL COMMENT '新建时间',
  `description` varchar(200) DEFAULT NULL COMMENT '备注信息',
  `file` varchar(40) NOT NULL COMMENT '心电文件名',
  `report` varchar(40) DEFAULT NULL COMMENT '心电报告名',
  `hospitalId` int(11) NOT NULL COMMENT '所属医院id',
  `doctorId` int(11) DEFAULT NULL COMMENT '负责医生id',
  `techId` int(11) DEFAULT NULL COMMENT '负责技师id',
  `state` tinyint(3) UNSIGNED NOT NULL DEFAULT '2' COMMENT '状态',
  `teamId` int(11) DEFAULT NULL COMMENT '所属团队id',
  `reportTime` varchar(15) DEFAULT NULL COMMENT '报告时间',
  PRIMARY KEY (`clinicId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COMMENT='检查单表';

--
-- 转存表中的数据 `clinic`
--

INSERT INTO `clinic` (`clinicId`, `patientId`, `addTime`, `description`, `file`, `report`, `hospitalId`, `doctorId`, `techId`, `state`, `teamId`, `reportTime`) VALUES
(1, 1, '1483613755736', NULL, 'temp_file', 'temp_report', 1, 1, 1, 1, 1, '1483613755736'),
(2, 2, '1483767218924', NULL, 'ecg-file-1483767218918.zip', NULL, 2, NULL, NULL, 2, NULL, NULL);

-- --------------------------------------------------------

--
-- 表的结构 `state`
--
-- 创建时间： 2017-01-05 07:30:06
--

CREATE TABLE IF NOT EXISTS `state` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `stateId` int(11) NOT NULL COMMENT '状态id',
  `name` varchar(20) DEFAULT NULL COMMENT '状态名称',
  PRIMARY KEY (`id`),
  UNIQUE KEY `stateId` (`stateId`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `state`
--

INSERT INTO `state` (`id`, `stateId`, `name`) VALUES
(1, 0, '待新建'),
(2, 1, '待分配团队'),
(3, 2, '待拉取'),
(4, 3, '医生分析中'),
(5, 4, '技师分析中'),
(6, 5, '待审核'),
(7, 6, '待重分析'),
(8, 7, '会诊中'),
(9, 8, '已报告');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
