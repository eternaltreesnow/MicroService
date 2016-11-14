CREATE TABLE IF NOT EXISTS `service` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` char(100) CHARACTER SET utf8 NOT NULL,
  `ip` char(40) CHARACTER SET utf8 NOT NULL DEFAULT '127.0.0.1',
  `port` char(10) CHARACTER SET utf8 NOT NULL DEFAULT '80',
  `group` int(11) NOT NULL,
  `create_time` int(11) NOT NULL,
  `modify_time` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;
