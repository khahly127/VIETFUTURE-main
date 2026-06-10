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
-- Table structure for table `useranswer`
--

DROP TABLE IF EXISTS `useranswer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `useranswer` (
  `answer_id` int NOT NULL AUTO_INCREMENT,
  `attempt_id` int NOT NULL,
  `question_id` int NOT NULL,
  `selected_option_id` int DEFAULT NULL,
  `answer_text` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `score` double DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`answer_id`),
  KEY `UserAnswer_attempt_id_fkey` (`attempt_id`),
  KEY `UserAnswer_question_id_fkey` (`question_id`),
  KEY `UserAnswer_selected_option_id_fkey` (`selected_option_id`),
  CONSTRAINT `UserAnswer_attempt_id_fkey` FOREIGN KEY (`attempt_id`) REFERENCES `assessmentattempt` (`attempt_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `UserAnswer_question_id_fkey` FOREIGN KEY (`question_id`) REFERENCES `question` (`question_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `UserAnswer_selected_option_id_fkey` FOREIGN KEY (`selected_option_id`) REFERENCES `questionoption` (`option_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `useranswer`
--

LOCK TABLES `useranswer` WRITE;
/*!40000 ALTER TABLE `useranswer` DISABLE KEYS */;
/*!40000 ALTER TABLE `useranswer` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-05 15:49:53
