CREATE DATABASE  IF NOT EXISTS `lms` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `lms`;
-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: localhost    Database: lms
-- ------------------------------------------------------
-- Server version	8.4.0

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
-- Table structure for table `attendance`
--

DROP TABLE IF EXISTS `attendance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attendance` (
  `id` int NOT NULL AUTO_INCREMENT,
  `student_id` int NOT NULL,
  `course_id` int NOT NULL,
  `training_id` int NOT NULL,
  `attendance_date` date NOT NULL,
  `status` enum('present','absent') NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `attendance_ibfk_1` (`student_id`),
  KEY `attendance_ibfk_2` (`course_id`),
  KEY `attendance_ibfk_3` (`training_id`),
  CONSTRAINT `attendance_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`),
  CONSTRAINT `attendance_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`),
  CONSTRAINT `attendance_ibfk_3` FOREIGN KEY (`training_id`) REFERENCES `training_details` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendance`
--

LOCK TABLES `attendance` WRITE;
/*!40000 ALTER TABLE `attendance` DISABLE KEYS */;
/*!40000 ALTER TABLE `attendance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `companies`
--

DROP TABLE IF EXISTS `companies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `companies` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `address` text NOT NULL,
  `contact_person` varchar(200) NOT NULL,
  `contact_number` varchar(200) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `companies`
--

LOCK TABLES `companies` WRITE;
/*!40000 ALTER TABLE `companies` DISABLE KEYS */;
INSERT INTO `companies` VALUES (1,'TCS','123 Main St, Anytown','John Doe','123-456-7890','2024-06-07 12:00:00',NULL),(2,'Ey','456 Elm St, Othertown','Jane Smith','987-654-3210','2024-06-07 12:00:00',NULL),(3,'ivy','789 Oak St, Another Town','Mike Johnson','555-123-4567','2024-06-07 12:00:00',NULL),(4,'Satyam Computers (GWS payroll); CITI BANK','401 NAKSHATRA CLASSIC, J P NAGAR, YELLA REDDY GUDA','Suresh Kavili','09848512516','2024-08-09 05:46:20',NULL),(5,'Maven1','Hyd','Maven Soft','09848512516','2025-07-02 05:23:11','2025-07-02 05:29:29'),(6,'Org','afas','suresh k','09848512516','2025-07-02 05:23:42',NULL),(7,'Maven','adfd','Maven Soft','09848512516','2025-07-02 05:27:43',NULL);
/*!40000 ALTER TABLE `companies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `courses`
--

DROP TABLE IF EXISTS `courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `courses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  `duration` int NOT NULL,
  `status` enum('Active','InActive') NOT NULL DEFAULT 'Active',
  `company_id` int NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `courses_ibfk_1` (`company_id`),
  CONSTRAINT `courses_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `courses`
--

LOCK TABLES `courses` WRITE;
/*!40000 ALTER TABLE `courses` DISABLE KEYS */;
INSERT INTO `courses` VALUES (3,'BC 2025','BC 2025',33,'Active',7,'2025-07-02 06:35:26',NULL);
/*!40000 ALTER TABLE `courses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `material`
--

DROP TABLE IF EXISTS `material`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `material` (
  `id` int NOT NULL AUTO_INCREMENT,
  `training_id` int NOT NULL,
  `faculty_id` int NOT NULL,
  `material_name` varchar(255) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `training_date` date NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `material_ibfk_1` (`training_id`),
  KEY `material_ibfk_2` (`faculty_id`),
  CONSTRAINT `material_ibfk_1` FOREIGN KEY (`training_id`) REFERENCES `training_details` (`id`),
  CONSTRAINT `material_ibfk_2` FOREIGN KEY (`faculty_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `material`
--

LOCK TABLES `material` WRITE;
/*!40000 ALTER TABLE `material` DISABLE KEYS */;
/*!40000 ALTER TABLE `material` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mcq_test_questions`
--

DROP TABLE IF EXISTS `mcq_test_questions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mcq_test_questions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `test_id` int NOT NULL,
  `training_id` int NOT NULL,
  `question_text` text NOT NULL,
  `option_1` text NOT NULL,
  `option_2` text NOT NULL,
  `option_3` text NOT NULL,
  `option_4` text NOT NULL,
  `correct_answer` text NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `mcq_test_questions_ibfk_1` (`test_id`),
  KEY `mcq_test_questions_ibfk_2` (`training_id`),
  CONSTRAINT `mcq_test_questions_ibfk_1` FOREIGN KEY (`test_id`) REFERENCES `test_master` (`test_id`),
  CONSTRAINT `mcq_test_questions_ibfk_2` FOREIGN KEY (`training_id`) REFERENCES `training_details` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mcq_test_questions`
--

LOCK TABLES `mcq_test_questions` WRITE;
/*!40000 ALTER TABLE `mcq_test_questions` DISABLE KEYS */;
INSERT INTO `mcq_test_questions` VALUES (14,12,3,'How many different ways may Spring-based apps be configured?','Java-based configuration','XML-based configuration','Annotation-based configuration','All of the above','4','2025-07-02 06:36:19',NULL),(15,12,3,'____ is a class that accepts incoming requests and routes them to the appropriate resources such as controllers, models, and views.','DispatcherServlet','Servlet','ServletContext','HandlerApapter','3','2025-07-02 06:36:19',NULL),(16,12,3,'With Spring Web MVC, which class serves as the front controller?','DispatcherServlet','Servlet','ServletContext','HandlerApapter','2','2025-07-02 06:36:19',NULL);
/*!40000 ALTER TABLE `mcq_test_questions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'admin','2024-06-07 12:41:53',NULL),(2,'faculty','2024-06-07 12:41:58',NULL),(3,'student','2024-06-07 12:42:02',NULL);
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_documents`
--

DROP TABLE IF EXISTS `student_documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_documents` (
  `id` int NOT NULL AUTO_INCREMENT,
  `student_id` int NOT NULL,
  `course_id` int NOT NULL,
  `document_name` varchar(255) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `student_documents_ibfk_1` (`student_id`),
  KEY `student_documents_ibfk_2` (`course_id`),
  CONSTRAINT `student_documents_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`),
  CONSTRAINT `student_documents_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_documents`
--

LOCK TABLES `student_documents` WRITE;
/*!40000 ALTER TABLE `student_documents` DISABLE KEYS */;
INSERT INTO `student_documents` VALUES (1,3,3,'Useful.txt','files\\studentDocuments\\1751439700414-Useful.txt','2025-07-02 12:31:40',NULL);
/*!40000 ALTER TABLE `student_documents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_trainings`
--

DROP TABLE IF EXISTS `student_trainings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_trainings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `student_id` int NOT NULL,
  `training_id` int NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_student` (`student_id`),
  KEY `fk_training` (`training_id`),
  CONSTRAINT `fk_student` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_training` FOREIGN KEY (`training_id`) REFERENCES `training_details` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_trainings`
--

LOCK TABLES `student_trainings` WRITE;
/*!40000 ALTER TABLE `student_trainings` DISABLE KEYS */;
INSERT INTO `student_trainings` VALUES (5,3,3,'2025-07-02 06:36:43',NULL),(6,5,3,'2025-07-02 06:36:43',NULL),(7,10,3,'2025-07-02 06:36:43',NULL);
/*!40000 ALTER TABLE `student_trainings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `test_answers`
--

DROP TABLE IF EXISTS `test_answers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `test_answers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `student_id` int NOT NULL,
  `test_id` int NOT NULL,
  `question_id` int NOT NULL,
  `selected_option` varchar(1) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `test_answers_ibfk_1` (`student_id`),
  KEY `test_answers_ibfk_2` (`test_id`),
  KEY `test_answers_ibfk_3` (`question_id`),
  CONSTRAINT `test_answers_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`),
  CONSTRAINT `test_answers_ibfk_2` FOREIGN KEY (`test_id`) REFERENCES `test_master` (`test_id`),
  CONSTRAINT `test_answers_ibfk_3` FOREIGN KEY (`question_id`) REFERENCES `mcq_test_questions` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `test_answers`
--

LOCK TABLES `test_answers` WRITE;
/*!40000 ALTER TABLE `test_answers` DISABLE KEYS */;
INSERT INTO `test_answers` VALUES (23,3,12,14,'4','2025-07-02 06:41:59',NULL),(24,3,12,15,'4','2025-07-02 06:41:59',NULL),(25,3,12,16,'3','2025-07-02 06:41:59',NULL),(26,3,12,16,'4','2025-07-02 12:31:18',NULL);
/*!40000 ALTER TABLE `test_answers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `test_master`
--

DROP TABLE IF EXISTS `test_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `test_master` (
  `test_id` int NOT NULL AUTO_INCREMENT,
  `training_id` int NOT NULL,
  `test_name` varchar(255) NOT NULL,
  `from_date` datetime DEFAULT NULL,
  `to_date` datetime DEFAULT NULL,
  `duration` int NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`test_id`),
  KEY `test_master_ibfk_1` (`training_id`),
  CONSTRAINT `test_master_ibfk_1` FOREIGN KEY (`training_id`) REFERENCES `training_details` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `test_master`
--

LOCK TABLES `test_master` WRITE;
/*!40000 ALTER TABLE `test_master` DISABLE KEYS */;
INSERT INTO `test_master` VALUES (12,3,'ttt','2025-07-02 00:00:00','2025-07-02 00:00:00',3,'2025-07-02 06:36:19','2025-07-02 06:37:04');
/*!40000 ALTER TABLE `test_master` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `test_scores`
--

DROP TABLE IF EXISTS `test_scores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `test_scores` (
  `id` int NOT NULL AUTO_INCREMENT,
  `test_id` int NOT NULL,
  `student_id` int NOT NULL,
  `score` int DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `test_scores_ibfk_1` (`test_id`),
  KEY `test_scores_ibfk_2` (`student_id`),
  CONSTRAINT `test_scores_ibfk_1` FOREIGN KEY (`test_id`) REFERENCES `test_master` (`test_id`),
  CONSTRAINT `test_scores_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `test_scores`
--

LOCK TABLES `test_scores` WRITE;
/*!40000 ALTER TABLE `test_scores` DISABLE KEYS */;
INSERT INTO `test_scores` VALUES (8,12,3,0,'2025-07-02 06:37:28',NULL),(9,12,3,1,'2025-07-02 06:41:59',NULL),(10,12,3,0,'2025-07-02 12:31:18',NULL);
/*!40000 ALTER TABLE `test_scores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `training_details`
--

DROP TABLE IF EXISTS `training_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `training_details` (
  `id` int NOT NULL AUTO_INCREMENT,
  `training_name` varchar(150) NOT NULL,
  `course_id` int NOT NULL,
  `from_date` date NOT NULL,
  `to_date` date NOT NULL,
  `training_type` varchar(255) NOT NULL,
  `faculty_id` int NOT NULL,
  `company_id` int NOT NULL,
  `status` enum('Active','InActive') NOT NULL DEFAULT 'Active',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `training_details_ibfk_1` (`course_id`),
  KEY `training_details_ibfk_2` (`faculty_id`),
  KEY `training_details_ibfk_3` (`company_id`),
  CONSTRAINT `training_details_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`),
  CONSTRAINT `training_details_ibfk_2` FOREIGN KEY (`faculty_id`) REFERENCES `users` (`id`),
  CONSTRAINT `training_details_ibfk_3` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `training_details`
--

LOCK TABLES `training_details` WRITE;
/*!40000 ALTER TABLE `training_details` DISABLE KEYS */;
INSERT INTO `training_details` VALUES (3,'BC 20251',3,'2025-07-02','2025-07-02','Offline',8,7,'Active','2025-07-02 06:35:48',NULL);
/*!40000 ALTER TABLE `training_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role_id` int NOT NULL,
  `company_id` int NOT NULL,
  `isactive` int NOT NULL DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `users_ibfk_1` (`role_id`),
  KEY `users_ibfk_2` (`company_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`),
  CONSTRAINT `users_ibfk_2` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin@gmail.com.com','admin','$2b$10$junrkq72Tf2bWeGCQfsABu9KUULBXAHOfjwKOAeR7wiOcOOT2wIlW',1,1,1,'2024-06-07 12:00:00',NULL),(2,'faculty@gmail.com.com','faculty','$2b$10$junrkq72Tf2bWeGCQfsABu9KUULBXAHOfjwKOAeR7wiOcOOT2wIlW',2,1,1,'2024-06-07 12:00:00',NULL),(3,'student1@gmail.com.com','student1','$2b$10$junrkq72Tf2bWeGCQfsABu9KUULBXAHOfjwKOAeR7wiOcOOT2wIlW',3,7,1,'2024-06-07 12:00:00','2025-07-02 06:11:19'),(4,'faculty2@gmail.com.com','faculty2','$2b$10$junrkq72Tf2bWeGCQfsABu9KUULBXAHOfjwKOAeR7wiOcOOT2wIlW',2,2,1,'2024-06-07 12:00:00',NULL),(5,'student2@gmail.com.com','student2','$2b$10$junrkq72Tf2bWeGCQfsABu9KUULBXAHOfjwKOAeR7wiOcOOT2wIlW',3,7,1,'2024-06-07 12:00:00','2025-07-02 06:11:37'),(6,'faculty3@gmail.com.com','faculty3','$2b$10$junrkq72Tf2bWeGCQfsABu9KUULBXAHOfjwKOAeR7wiOcOOT2wIlW',2,3,1,'2024-06-07 12:00:00',NULL),(7,'student3@gmail.com.com','student3','$2b$10$junrkq72Tf2bWeGCQfsABu9KUULBXAHOfjwKOAeR7wiOcOOT2wIlW',3,3,1,'2024-06-07 12:00:00',NULL),(8,'suresh.kavili@gmail.com','Suresh@suresh.com','$2b$10$vph2KxIqdYFBs28x/rQR0O.r68P1./.0gBB174/dYDSj3INDp18ZS',2,3,1,'2024-08-09 05:45:10',NULL),(9,'student@gmail.com','student@gmail.com','$2b$10$2dIlzLwd6kySR87U6S0dHeE766XC82LTc0vokw7MxGnScfUUt2K3m',3,1,1,'2024-11-26 12:05:55',NULL),(10,'suresh@mavensoft.com','suresh@mavensoft.com','$2b$10$NkiL3N/XLKMJMpZmkVWuOOY9nOXjMfEGq41fEGb3xaP5ti2wVMZ5C',2,7,1,'2025-07-02 05:29:03',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'lms'
--

--
-- Dumping routines for database 'lms'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-02 15:36:28

-- Table structure for table `CourseContent`

CREATE TABLE IF NOT EXISTS `CourseContent` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `date` DATE NOT NULL,
  `day` VARCHAR(20),
  `day_number` INT,
  `skill` VARCHAR(50),
  `topic` TEXT,
  `assignment` TEXT,
  `assessment` TEXT,
  `project` TEXT,
  `status` ENUM('pending', 'in_progress', 'completed') DEFAULT 'pending',
  `notes` TEXT
);
