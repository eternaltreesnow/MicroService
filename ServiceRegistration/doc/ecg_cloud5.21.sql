-- phpMyAdmin SQL Dump
-- version 4.1.14
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: 2016-05-21 07:29:25
-- 服务器版本： 5.6.17
-- PHP Version: 5.5.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `ecg_cloud`
--

-- --------------------------------------------------------

--
-- 表的结构 `ecg_checklist`
--

CREATE TABLE IF NOT EXISTS `ecg_checklist` (
  `check_id` int(11) NOT NULL AUTO_INCREMENT,
  `patient_id` int(11) NOT NULL,
  `date` int(11) NOT NULL,
  `type` char(1) CHARACTER SET utf8 NOT NULL,
  `team_id` int(11) NOT NULL,
  `file_id` int(11) NOT NULL,
  `result_id` int(11) NOT NULL,
  `doctor_id` int(11) NOT NULL,
  `hospital_id` int(11) NOT NULL,
  `patient_check_date` int(11) NOT NULL,
  `examine_date` int(11) NOT NULL,
  `report_update_date` int(11) NOT NULL,
  `description` text CHARACTER SET utf8 NOT NULL,
  `status` tinyint(1) NOT NULL,
  `technician_id` int(11) NOT NULL,
  `doc_read` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`check_id`),
  UNIQUE KEY `checkID` (`check_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=22 ;

--
-- 转存表中的数据 `ecg_checklist`
--

INSERT INTO `ecg_checklist` (`check_id`, `patient_id`, `date`, `type`, `team_id`, `file_id`, `result_id`, `doctor_id`, `hospital_id`, `patient_check_date`, `examine_date`, `report_update_date`, `description`, `status`, `technician_id`, `doc_read`) VALUES
(19, 1, 1463808048, '1', 1, 17, 0, 0, 1, -2147483648, 0, 0, '', 1, 0, 0),
(20, 5, 1463808081, '1', 1, 18, 0, 0, 1, 2147483647, 0, 0, '', 1, 0, 0);

-- --------------------------------------------------------

--
-- 表的结构 `ecg_comment`
--

CREATE TABLE IF NOT EXISTS `ecg_comment` (
  `comment_id` int(11) NOT NULL AUTO_INCREMENT,
  `consult_id` int(11) NOT NULL,
  `doctor_id` int(11) NOT NULL,
  `content` text CHARACTER SET utf8 NOT NULL,
  `create_time` int(11) NOT NULL,
  PRIMARY KEY (`comment_id`),
  UNIQUE KEY `comment_id` (`comment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `ecg_consult`
--

CREATE TABLE IF NOT EXISTS `ecg_consult` (
  `consult_id` int(20) NOT NULL AUTO_INCREMENT,
  `title` char(40) NOT NULL,
  `examine_explain` text NOT NULL,
  `report` text NOT NULL,
  `create_time` int(11) NOT NULL,
  `doctor_id` int(11) NOT NULL,
  `doctor_list` char(100) NOT NULL,
  `join_num` int(11) NOT NULL,
  `summary` text NOT NULL,
  `summary_time` timestamp NOT NULL,
  `check_id` int(11) NOT NULL,
  `1` int(11) NOT NULL,
  `2` int(11) NOT NULL,
  `3` int(11) NOT NULL,
  `4` int(11) NOT NULL,
  `5` int(11) NOT NULL,
  `6` int(11) NOT NULL,
  `7` int(11) NOT NULL,
  `8` int(11) NOT NULL,
  `9` int(11) NOT NULL,
  `10` int(11) NOT NULL,
  PRIMARY KEY (`consult_id`),
  UNIQUE KEY `consult_id` (`consult_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

--
-- 转存表中的数据 `ecg_consult`
--

INSERT INTO `ecg_consult` (`consult_id`, `title`, `examine_explain`, `report`, `create_time`, `doctor_id`, `doctor_list`, `join_num`, `summary`, `summary_time`, `check_id`, `1`, `2`, `3`, `4`, `5`, `6`, `7`, `8`, `9`, `10`) VALUES
(1, '第一次', '需要尽快手术吗？', '15', 1463216577, 23, '17,20,16,21', 4, '', '0000-00-00 00:00:00', 4, 17, 20, 16, 21, 0, 0, 0, 0, 0, 0);

-- --------------------------------------------------------

--
-- 表的结构 `ecg_contract`
--

CREATE TABLE IF NOT EXISTS `ecg_contract` (
  `contract_id` int(11) NOT NULL AUTO_INCREMENT,
  `hospital_id` int(11) NOT NULL,
  `partner_id` int(11) NOT NULL,
  `create_date` int(11) NOT NULL,
  `status` int(11) NOT NULL,
  PRIMARY KEY (`contract_id`),
  UNIQUE KEY `contract_id` (`contract_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- 转存表中的数据 `ecg_contract`
--

INSERT INTO `ecg_contract` (`contract_id`, `hospital_id`, `partner_id`, `create_date`, `status`) VALUES
(1, 2, 1, 1460877341, 1),
(2, 1, 1, 1461039616, 1);

-- --------------------------------------------------------

--
-- 表的结构 `ecg_doctor`
--

CREATE TABLE IF NOT EXISTS `ecg_doctor` (
  `doctor_id` int(11) NOT NULL AUTO_INCREMENT,
  `username` char(20) CHARACTER SET utf8 NOT NULL,
  `password` char(64) CHARACTER SET latin1 NOT NULL,
  `doctor_name` varchar(20) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `team_id` int(11) NOT NULL,
  `inputlimit` int(11) NOT NULL,
  `create_time` int(11) NOT NULL,
  `status` tinyint(2) NOT NULL,
  `id_card` char(20) NOT NULL,
  `contact_num` char(20) NOT NULL,
  `address` text NOT NULL,
  `email` char(20) NOT NULL,
  PRIMARY KEY (`doctor_id`),
  UNIQUE KEY `doctor_id` (`doctor_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 AUTO_INCREMENT=24 ;

--
-- 转存表中的数据 `ecg_doctor`
--

INSERT INTO `ecg_doctor` (`doctor_id`, `username`, `password`, `doctor_name`, `team_id`, `inputlimit`, `create_time`, `status`, `id_card`, `contact_num`, `address`, `email`) VALUES
(16, 'doc1', 'root', '李医生', 0, 0, 0, 0, '441203198602134830', '13701278536', '广东省广州市天河区体育东路114～118号财富广场内', 'queue102@gmail.com'),
(17, 'doc2', 'root', '周医生', 0, 0, 0, 0, '440412197909173205', '13902013566', '广东省广州市越秀区东风东路698号', '1988023401@qq.com'),
(18, 'doc3', 'root', '郑医生', 1, 0, 0, 2, '325614197501301284', '13705641023', '广东省广州市东关汛17', 'jacksonen@gmail.com'),
(19, 'doc4', 'root', '廖医生', 1, 0, 0, 2, '440402198405231245', '17725460135', '广东省广州市白云路筑溪西街24号', 'timingtrack@qq.com'),
(20, 'doc5', 'root', '张医生', 1, 0, 0, 1, '441236197504154386', '18600451122', '广东省广州市越秀区白云路89号筑南新街地段', 'firelaser@163.com'),
(21, 'doc6', 'root', '金医生', 1, 0, 0, 2, '440400198004237586', '13800138000', '广东省广州市越秀区广舞台二马路东园路38号', '758611231@qq.com'),
(22, 'doc7', 'root', '胡医生', 1, 0, 0, 2, '554312196902159603', '13000095120', '广东省广州市越秀区东华南路98号', '562276119@qq.com'),
(23, 'root', 'root', '郑立贤', 1, 0, 0, 1, '323214198601230456', '15688060022', '广东省广州市番禺区大学城外环东路132号', 'eternal@gmail.com');

-- --------------------------------------------------------

--
-- 表的结构 `ecg_examine`
--

CREATE TABLE IF NOT EXISTS `ecg_examine` (
  `examine_id` int(11) NOT NULL AUTO_INCREMENT,
  `check_id` int(11) NOT NULL,
  `doctor_id` int(11) NOT NULL,
  `suggestion` varchar(255) NOT NULL,
  `examine_time` int(11) NOT NULL,
  `error_type` int(11) NOT NULL,
  PRIMARY KEY (`examine_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 表的结构 `ecg_file`
--

CREATE TABLE IF NOT EXISTS `ecg_file` (
  `file_id` int(11) NOT NULL AUTO_INCREMENT,
  `check_id` int(11) NOT NULL,
  `file_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `up_time` int(11) NOT NULL,
  PRIMARY KEY (`file_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=20 ;

--
-- 转存表中的数据 `ecg_file`
--

INSERT INTO `ecg_file` (`file_id`, `check_id`, `file_name`, `up_time`) VALUES
(15, 17, 'xurui.pdf', 1463807976),
(16, 18, '', 1463808002),
(17, 19, 'xurui.pdf', 1463808048),
(18, 20, 'devcpp.11.22.zip', 1463808092),
(19, 21, '', 1463808098);

-- --------------------------------------------------------

--
-- 表的结构 `ecg_hospital`
--

CREATE TABLE IF NOT EXISTS `ecg_hospital` (
  `hospital_id` int(11) NOT NULL AUTO_INCREMENT,
  `username` char(20) CHARACTER SET utf8 NOT NULL,
  `password` char(64) NOT NULL,
  `hospital_name` char(20) CHARACTER SET utf8 NOT NULL,
  `area_id` varchar(256) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `address` char(50) CHARACTER SET utf8 NOT NULL,
  `legal_person` char(20) CHARACTER SET utf8 NOT NULL,
  `contact_num` char(20) CHARACTER SET utf8 NOT NULL,
  `phone_num` char(20) CHARACTER SET utf8 NOT NULL,
  `grade` int(1) NOT NULL,
  `level` int(1) NOT NULL,
  `postcode` int(10) NOT NULL,
  `intro` text CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `status` int(1) NOT NULL,
  `id_card` int(20) NOT NULL,
  PRIMARY KEY (`hospital_id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=17 ;

--
-- 转存表中的数据 `ecg_hospital`
--

INSERT INTO `ecg_hospital` (`hospital_id`, `username`, `password`, `hospital_name`, `area_id`, `address`, `legal_person`, `contact_num`, `phone_num`, `grade`, `level`, `postcode`, `intro`, `status`, `id_card`) VALUES
(1, 'root', 'root', '广东省人民医院', '0', '广东省东山区中山二路106号', '林曙光', '020-83827812', '020-83845150', 0, 0, 0, '', 1, 0),
(5, 'hosp3', 'root', '越秀区梅花街社区卫生服务中心', '0', '广东省广州市越秀区东风东路水均大街72号', '吴海云', '020-87604207', '020-87604207', 0, 0, 0, '', 1, 0),
(6, 'hosp4', 'root', '素社街社区卫生服务中心', '0', '广东省广州市海珠区前进路南园大街1号之一', '安宁', '', '', 0, 0, 0, '', 0, 0),
(7, 'hosp5', 'root', '海珠区昌岗街社区卫生服务中心', '0', '广州市江南大道跃进新村四巷7号首层', '李九莲', '020-84239601', '', 0, 0, 0, '', 0, 0),
(8, 'hosp6', 'root', '广州市天河区石牌街社区卫生服务中心', '0', '天河北路571号', '姚美芳', '020-38497124', '', 0, 0, 0, '', 0, 0),
(9, 'hosp7', 'root', '滨江街小港社区卫生服务站', '0', '海珠区小港路156号', '秦淑慧', '020-84448010', '', 0, 0, 0, '', 0, 0),
(10, 'hosp8', 'root', '车陂街社区卫生服务中心', '0', '广东省广州市天河区东圃大马路13', '蒋太平', '020-82312275', '', 0, 0, 0, '', 0, 0),
(11, 'hosp9', 'root', '广州市白云区三元里街社区服务中心', '0', '广东省广州市白云区石榴桥65号二楼', '谢道同', '020-26296910', '', 0, 0, 0, '', 0, 0),
(12, 'xurui', 'xurui25', '', '0', '', '', '', '', 0, 0, 0, '', 0, 0),
(13, 'xurui26', 'xurui25', 'xurui', '0', '', '', '', '', 0, 0, 0, '', 0, 0),
(14, 'r222', 'root', '额打发士大夫', '0', '', '', '', '', 0, 0, 0, '', 0, 0),
(16, 'xurui22', 'xurui', '中华人民医院', 'S就会', '', '许瑞2', '13450375676', '', 2, 1, 133333, '天禧', 1, 2147483647);

-- --------------------------------------------------------

--
-- 表的结构 `ecg_partner`
--

CREATE TABLE IF NOT EXISTS `ecg_partner` (
  `partner_id` int(11) NOT NULL AUTO_INCREMENT,
  `username` char(20) CHARACTER SET utf8 NOT NULL,
  `password` char(64) NOT NULL,
  `partner_name` varchar(20) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `status` tinyint(2) NOT NULL,
  `id_card` char(20) NOT NULL,
  `contact_num` char(20) NOT NULL,
  `address` text CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `email` char(20) NOT NULL,
  `create_time` int(11) NOT NULL,
  PRIMARY KEY (`partner_id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `partner_id` (`partner_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=27 ;

--
-- 转存表中的数据 `ecg_partner`
--

INSERT INTO `ecg_partner` (`partner_id`, `username`, `password`, `partner_name`, `status`, `id_card`, `contact_num`, `address`, `email`, `create_time`) VALUES
(1, 'root', 'root', '广东广州负责人', 1, '341003199402051417', '13450375676', '大学城', '2509702745@qq.com', 0),
(26, 'root3', 'xurui', '湖南地区', 0, '341003199402051417', '13450375676', '湖南大学', '2509702745@qq.com', 1463635650);

-- --------------------------------------------------------

--
-- 表的结构 `ecg_patient`
--

CREATE TABLE IF NOT EXISTS `ecg_patient` (
  `patient_id` int(11) NOT NULL AUTO_INCREMENT,
  `id_card` char(20) CHARACTER SET utf8 NOT NULL,
  `name` char(16) CHARACTER SET utf8 NOT NULL,
  `gender` tinyint(1) NOT NULL DEFAULT '0',
  `age` int(11) NOT NULL,
  `hospital_id` int(11) NOT NULL,
  `height` char(3) CHARACTER SET utf8 NOT NULL,
  `weight` char(3) CHARACTER SET utf8 NOT NULL,
  `medicare_num` char(18) CHARACTER SET utf8 NOT NULL,
  `phone_num` char(12) CHARACTER SET utf8 NOT NULL,
  `address` text CHARACTER SET utf8 NOT NULL,
  `comment` text CHARACTER SET utf8 NOT NULL,
  `patient_num` char(12) CHARACTER SET utf8 NOT NULL,
  `type` char(1) CHARACTER SET utf8 NOT NULL,
  `clinic_num` char(12) CHARACTER SET utf8 NOT NULL,
  `bed_num` char(10) CHARACTER SET utf8 NOT NULL,
  `ward` char(15) CHARACTER SET utf8 NOT NULL,
  `diagnose` text CHARACTER SET utf8 NOT NULL,
  PRIMARY KEY (`patient_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=15 ;

--
-- 转存表中的数据 `ecg_patient`
--

INSERT INTO `ecg_patient` (`patient_id`, `id_card`, `name`, `gender`, `age`, `hospital_id`, `height`, `weight`, `medicare_num`, `phone_num`, `address`, `comment`, `patient_num`, `type`, `clinic_num`, `bed_num`, `ward`, `diagnose`) VALUES
(1, '440440198001010101', '许留山', 1, 36, 1, '175', '68', '440440198001010101', '13000000000', '广东省广州市番禺区大学城外环东路132号', '患者有5年心血管疾病史', '001', '', '', '', '', ''),
(5, '440512196503112569', '庄叔明', 1, 51, 1, '171', '86', '440512196503112569', '15600843940', '广东省广州市天河区体育东横街6-2号', '无', '002', '', '', '', '', ''),
(6, '441203196912150128', '刘晓华', 2, 47, 1, '159', '52', '441203196912150128', '17725620378', '广东省广州市荔湾区花地大道中89号', '心血管疾病患者', '003', '', '', '', '', ''),
(7, '441650194602133148', '吴晓莲', 2, 70, 1, '155', '43', '441650194602133148', '13810104531', '广东省广州市荔湾区花地大道南86号', '无', '005', '', '', '', '', ''),
(8, '361584197503113690', '文祥军', 1, 41, 1, '180', '89', '361584197503113690', '13055653147', '广东省广州市江高镇中兴路', '无', '006', '', '', '', '', ''),
(9, '556912196203124102', '哈尔买提·多尔多', 1, 54, 1, '174', '73', '556912196203124102', '17725170377', '广东省广州市番禺区s111', '无', '007', '', '', '', '', ''),
(10, '218456196601120704', '郑百惠', 2, 50, 1, '157', '52', '218456196601120704', '15601023840', '广东省广州市番禺区榄核镇绿村工业区人绿路38号', '无', '009', '', '', '', '', ''),
(11, '440463199012210563', '苏俊文', 1, 26, 1, '170', '62', '440463199012210563', '18944703520', '广东省广州市海珠区南城路670号', '无', '101', '', '', '', '', ''),
(12, '415023196203241563', '周华勇', 1, 54, 1, '179', '71', '415023196203241563', '18952031245', '广东省广州市越秀区东风东路753号', '无', '102', '', '', '', '', ''),
(13, '411523198712033651', '荣华曼', 2, 29, 1, '162', '53', '411523198712033651', '13231531274', '广东省广州市白云区石井镇石潭西路2号', '无', '103', '', '', '', '', ''),
(14, '341003110000111', '空一格', 1, 45, 3, '', '', '', '', '', '', '31000333333', '', '', '', '', '');

-- --------------------------------------------------------

--
-- 表的结构 `ecg_result`
--

CREATE TABLE IF NOT EXISTS `ecg_result` (
  `result_id` int(11) NOT NULL AUTO_INCREMENT,
  `check_id` int(11) NOT NULL,
  `file_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `up_time` int(11) NOT NULL,
  PRIMARY KEY (`result_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=18 ;

-- --------------------------------------------------------

--
-- 表的结构 `ecg_team`
--

CREATE TABLE IF NOT EXISTS `ecg_team` (
  `team_id` int(11) NOT NULL AUTO_INCREMENT,
  `partner_id` int(11) NOT NULL,
  `team_name` char(20) CHARACTER SET utf8 NOT NULL,
  `leading_doctor_id` int(11) NOT NULL,
  `date` int(11) NOT NULL,
  `status` int(11) NOT NULL,
  PRIMARY KEY (`team_id`),
  UNIQUE KEY `team_name` (`team_name`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=9 ;

--
-- 转存表中的数据 `ecg_team`
--

INSERT INTO `ecg_team` (`team_id`, `partner_id`, `team_name`, `leading_doctor_id`, `date`, `status`) VALUES
(1, 1, 'team name5', 23, 0, 1),
(2, 1, 'team_name12', 17, 1460796459, 3),
(3, 1, 'team_name2', 16, 1460796507, 3),
(8, 1, 'team_name4', 19, 1460796690, 3);

-- --------------------------------------------------------

--
-- 表的结构 `ecg_technician`
--

CREATE TABLE IF NOT EXISTS `ecg_technician` (
  `technician_id` int(11) NOT NULL AUTO_INCREMENT,
  `team_id` int(11) NOT NULL,
  `username` char(20) CHARACTER SET utf8 NOT NULL,
  `password` char(64) NOT NULL,
  `technician_name` varchar(20) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `create_time` int(11) NOT NULL,
  `id_card` char(20) NOT NULL,
  `status` tinyint(2) NOT NULL,
  `contact_num` char(20) NOT NULL,
  `address` varchar(255) CHARACTER SET utf8 COLLATE utf8_swedish_ci NOT NULL,
  `email` char(20) NOT NULL,
  `inputlimit` int(11) NOT NULL,
  PRIMARY KEY (`technician_id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=10 ;

--
-- 转存表中的数据 `ecg_technician`
--

INSERT INTO `ecg_technician` (`technician_id`, `team_id`, `username`, `password`, `technician_name`, `create_time`, `id_card`, `status`, `contact_num`, `address`, `email`, `inputlimit`) VALUES
(1, 1, 'root', 'root', '张武阳', 0, '440412198901314520', 1, '17758361203', '广东省广州市花都区海阳路北130号', 'jointechni@qq.com', 0),
(2, 0, 'tech2', 'root', '李道明', 0, '440123197503123840', 0, '13715620132', '广东省广州市番禺区大学城', 'daoming@gmail.com', 0),
(3, 0, 'tech3', 'root', '张志江', 0, '441263198412050192', 0, '15621045328', '广东省广州市海珠区滨江东路157号', 'zhingzhang@gmail.com', 0),
(4, 0, 'tech4', 'root', '李幺幺', 0, '321740198702120356', 0, '13756992102', '广东省广州市越秀区光华东路北12号', 'yaoyao@qq.com', 0),
(5, 0, 'tech5', 'root', '肖金焕', 0, '553619198612300569', 0, '18503691231', '广东省广州市番禺区市桥东路', 'jinhuan@gmail.com', 0),
(6, 0, 'tech6', 'root', '工齐武', 0, '440312198412033562', 0, '15642189893', '广东省广州市天河区岗顶北310号', 'qiwu112@163.com', 0),
(7, 0, 'tech7', 'root', '吕奉贤', 0, '621235198603251280', 0, '17742563155', '广东省广州市花都区华侨南路新都花园', 'fengxian90@sina.com', 0),
(8, 0, 'tech8', 'root', '黄熊道', 0, '443216199203210562', 0, '13812523840', '广东省广州市天河区黄埔东路北', 'xiongdh@qq.com', 0),
(9, 0, 'tech9', 'root', '郑领光', 0, '521294198704129652', 0, '13962456675', '广东省广州市番禺区小洲村', 'lingxtseng@qq.com', 0);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
