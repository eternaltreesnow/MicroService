-- phpMyAdmin SQL Dump
-- version 4.6.5.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: 2017-02-25 16:00:28
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

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
