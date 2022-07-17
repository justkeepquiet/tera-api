/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

/*!40000 ALTER TABLE `server_strings` DISABLE KEYS */;
INSERT IGNORE INTO `server_strings` (`language`, `categoryPvE`, `categoryPvP`, `serverOffline`, `serverLow`, `serverMedium`, `serverHigh`, `crowdNo`, `crowdYes`, `popup`) VALUES
	('en', 'PvE', 'PvP', 'Offline', 'Low', 'Medium', 'High', 'No', 'Yes', 'Unable to access the server at this time.'),
	('ru', 'PvE', 'PvP', 'Отключен', 'Низко', 'Средне', 'Высоко', 'Нет', 'Да', 'В настоящее время невозможно войти на сервер.'),
	('tw', 'PvE', 'PvP', '离线', '低的', '中间', '高的', '不', '是的', '此时无法访问服务器。');
/*!40000 ALTER TABLE `server_strings` ENABLE KEYS */;

/*!40000 ALTER TABLE `shop_categories` DISABLE KEYS */;
INSERT IGNORE INTO `shop_categories` (`id`, `sort`, `active`) VALUES
	(1, 0, 1),
	(2, 0, 1),
	(3, 0, 1),
	(4, 0, 1),
	(5, 0, 1),
	(6, 0, 1),
	(7, 0, 1),
	(8, 0, 1),
	(9, 0, 1),
	(10, 0, 1),
	(11, 0, 1),
	(12, 0, 1),
	(13, 0, 1),
	(14, 0, 1),
	(15, 0, 1),
	(16, 0, 1);
/*!40000 ALTER TABLE `shop_categories` ENABLE KEYS */;

/*!40000 ALTER TABLE `shop_category_strings` DISABLE KEYS */;
INSERT IGNORE INTO `shop_category_strings` (`id`, `language`, `categoryId`, `title`, `description`) VALUES
	(1, 'en', 1, 'Costumes', NULL),
	(2, 'en', 2, 'Swimsuits', NULL),
	(3, 'en', 3, 'School Uniform', NULL),
	(4, 'en', 4, 'Weapon Styles', NULL),
	(5, 'en', 5, 'Accessories (head)', NULL),
	(6, 'en', 6, 'Accessories (face)', NULL),
	(7, 'en', 7, 'Accessories (back)', NULL),
	(8, 'en', 8, 'Footprints', NULL),
	(9, 'en', 9, 'Underwear', NULL),
	(10, 'en', 10, 'Mounts', NULL),
	(11, 'en', 11, 'Flying Mounts', NULL),
	(12, 'en', 12, 'Helper Pets', NULL),
	(13, 'en', 13, 'Pet Styles', NULL),
	(14, 'en', 14, 'Skill Books', NULL),
	(15, 'en', 15, 'Services', NULL),
	(16, 'en', 16, 'Other', NULL),
	(17, 'ru', 1, 'Костюмы', NULL),
	(18, 'ru', 2, 'Купальники', NULL),
	(19, 'ru', 3, 'Школьная форма', NULL),
	(20, 'ru', 4, 'Стили оружия', NULL),
	(21, 'ru', 5, 'Аксессуары (голова)', NULL),
	(22, 'ru', 6, 'Аксессуары (лицо)', NULL),
	(23, 'ru', 7, 'Аксессуары (спина)', NULL),
	(24, 'ru', 8, 'Следы', NULL),
	(25, 'ru', 9, 'Белье', NULL),
	(26, 'ru', 10, 'Маунты', NULL),
	(27, 'ru', 11, 'Летающие маунты', NULL),
	(28, 'ru', 12, 'Питомцы-помощники', NULL),
	(29, 'ru', 13, 'Стили питомцев', NULL),
	(30, 'ru', 14, 'Книги умений', NULL),
	(31, 'ru', 15, 'Сервисы', NULL),
	(32, 'ru', 16, 'Другое', NULL);
/*!40000 ALTER TABLE `shop_category_strings` ENABLE KEYS */;

/*!40000 ALTER TABLE `shop_promocodes` DISABLE KEYS */;
INSERT IGNORE INTO `shop_promocodes` (`promoCodeId`, `promoCode`, `function`, `validAfter`, `validBefore`, `active`) VALUES
	(1, 'FREE-70-LVLUP', 'add_item_70_scroll', '2022-06-01 23:06:00', '2025-06-20 23:06:00', 1),
	(2, 'FREE-100-COINS', 'fund_100_coins', '2022-06-01 00:52:13', '2025-06-22 00:52:21', 1),
	(3, 'FREE-VIP-30DAY', 'add_benefit_vip_30', '2022-06-01 01:06:00', '2025-06-22 01:06:00', 1);
/*!40000 ALTER TABLE `shop_promocodes` ENABLE KEYS */;

/*!40000 ALTER TABLE `shop_promocode_strings` DISABLE KEYS */;
INSERT IGNORE INTO `shop_promocode_strings` (`id`, `language`, `promoCodeId`, `description`) VALUES
	(2, 'en', 1, 'Your free scroll for instant level 70.'),
	(4, 'en', 2, '100 free coins to your TERA Shop balance.'),
	(5, 'en', 3, 'Premium status activation for 30 days.'),
	(1, 'ru', 1, 'Свиток перехода на 70 уровень.'),
	(3, 'ru', 2, '100 бесплатных монет на ваш счет.'),
	(6, 'ru', 3, 'Активация VIP-статуса на 30 дней.');
/*!40000 ALTER TABLE `shop_promocode_strings` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
