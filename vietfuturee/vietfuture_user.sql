-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: vietfuture
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` enum('student','professional','career_switcher','enterprise','admin') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'student',
  `status` enum('active','inactive') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `User_email_key` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'Nguyễn Thanh Huyền','trannguyen06010205@gmail.com','$2b$10$GYgh4JUEjx2U88dAC4cJ4OZ8gYqlma8HEbP6APiVE.IQ1Qtu6wPFW',NULL,'student','active','2026-05-23 05:38:25.990','2026-05-23 05:38:25.990'),(8,'Trần Dũng','tranducdung2003ned@gmail.com','$2b$10$Iyq211lFC8KH2sv.HJ8S5uUAIaJ2LQcF3OMNpUMwj1kFVXV006c2O','123456789','student','active','2026-05-23 18:18:11.967','2026-05-24 02:12:13.158'),(9,'System Admin','admin@gmail.com','$2b$10$UiFBg20okiFYn2imUUmwiOM06vCs5tviMBY6.tpflQsqilTMKPwZW',NULL,'admin','active','2026-05-23 22:48:32.364','2026-05-23 22:48:32.364'),(11,'Trần Dũng Ned','tranducdung20033ned@gmail.com','$2b$10$2jaJXOFawr8WBeVLCvJE/eb9KO1DbYIQ6v87hG5CSlpgydQ77GMae',NULL,'professional','active','2026-05-24 02:25:20.159','2026-05-24 02:25:20.159'),(14,'Nguyễn Đức Thiên','ducthien@gmail.com','$2b$10$/SodcNwQUlBfdtIdlWN2N.aIW/Bb4n1nHTVsOIji.nQ7lpi5Ma9Ee',NULL,'student','active','2026-06-03 17:26:05.631','2026-06-03 17:26:05.631'),(16,'Dev AI','devai@gmail.com','$2b$10$LNe0cwdimPbE/885fGF2neFFbqDssFjS43Yt6y3IsZOHuSSZQsH3i',NULL,'enterprise','active','2026-06-05 06:13:37.491','2026-06-05 06:13:37.491');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-05 15:49:55
