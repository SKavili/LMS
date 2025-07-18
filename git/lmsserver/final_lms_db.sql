
-- --------------------------------------------------------

-- Table structure for table `roles`
CREATE TABLE `roles` (
  `id` int NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
);

-- Dumping data for table `roles`
INSERT INTO `roles` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, 'admin', '2024-06-07 12:41:53', NULL),
(2, 'faculty', '2024-06-07 12:41:58', NULL),
(3, 'student', '2024-06-07 12:42:02', NULL);

-- --------------------------------------------------------

-- Table structure for table `companies`
CREATE TABLE `companies` (
  `id` int NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `address` text NOT NULL,  -- corrected `ress` to `address`
  `contact_person` varchar(200) NOT NULL,
  `contact_number` varchar(200) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
);

-- dummy data for companies tbale

-- Insert statements for companies table
INSERT INTO `companies` (`id`, `name`, `address`, `contact_person`, `contact_number`, `created_at`, `updated_at`)
VALUES
(1, 'TCS', '123 Main St, Anytown', 'John Doe', '123-456-7890', '2024-06-07 12:00:00', NULL),
(2, 'Ey', '456 Elm St, Othertown', 'Jane Smith', '987-654-3210', '2024-06-07 12:00:00', NULL),
(3, 'ivy', '789 Oak St, Another Town', 'Mike Johnson', '555-123-4567', '2024-06-07 12:00:00', NULL);

-- --------------------------------------------------------

-- Table structure for table `users`
CREATE TABLE `users` (
  `id` int NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role_id` int NOT NULL,
  `company_id` int NOT NULL,
  `isactive` int NOT NULL DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`),
  CONSTRAINT `users_ibfk_2` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`)
);


-- Dummy data for users tables

-- Insert statements for users table
INSERT INTO `users` (`id`, `email`, `username`, `password`, `role_id`, `company_id`, `isactive`, `created_at`, `updated_at`)
VALUES
(1, 'admin@gmail.com.com', 'admin', '$2b$10$junrkq72Tf2bWeGCQfsABu9KUULBXAHOfjwKOAeR7wiOcOOT2wIlW', 1, 1, 1, '2024-06-07 12:00:00', NULL), -- Admin user for Company A
(2, 'faculty@gmail.com.com', 'faculty', '$2b$10$junrkq72Tf2bWeGCQfsABu9KUULBXAHOfjwKOAeR7wiOcOOT2wIlW', 2, 1, 1, '2024-06-07 12:00:00', NULL), -- Faculty user for Company A
(3, 'student1@gmail.com.com', 'student1', '$2b$10$junrkq72Tf2bWeGCQfsABu9KUULBXAHOfjwKOAeR7wiOcOOT2wIlW', 3, 1, 1, '2024-06-07 12:00:00', NULL), -- Student user for Company A
(4, 'faculty2@gmail.com.com', 'faculty2', '$2b$10$junrkq72Tf2bWeGCQfsABu9KUULBXAHOfjwKOAeR7wiOcOOT2wIlW', 2, 2, 1, '2024-06-07 12:00:00', NULL), -- Faculty user for Company B
(5, 'student2@gmail.com.com', 'student2', '$2b$10$junrkq72Tf2bWeGCQfsABu9KUULBXAHOfjwKOAeR7wiOcOOT2wIlW', 3, 2, 1, '2024-06-07 12:00:00', NULL), -- Student user for Company B
(6, 'faculty3@gmail.com.com', 'faculty3', '$2b$10$junrkq72Tf2bWeGCQfsABu9KUULBXAHOfjwKOAeR7wiOcOOT2wIlW', 2, 3, 1, '2024-06-07 12:00:00', NULL), -- Faculty user for Company C
(7, 'student3@gmail.com.com', 'student3', '$2b$10$junrkq72Tf2bWeGCQfsABu9KUULBXAHOfjwKOAeR7wiOcOOT2wIlW', 3, 3, 1, '2024-06-07 12:00:00', NULL); -- Student user for Company C

-- --------------------------------------------------------

-- Table structure for table `courses`
CREATE TABLE `courses` (
  `id` int NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  `duration` int NOT NULL,
  `status` enum('Active','InActive') NOT NULL DEFAULT 'Active',
  `company_id` int NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `courses_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`)
);

-- --------------------------------------------------------

-- Table structure for table `training_details`
CREATE TABLE `training_details` (
  `id` int NOT NULL PRIMARY KEY AUTO_INCREMENT,
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
  CONSTRAINT `training_details_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`),
  CONSTRAINT `training_details_ibfk_2` FOREIGN KEY (`faculty_id`) REFERENCES `users` (`id`),
  CONSTRAINT `training_details_ibfk_3` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`)
);

-- --------------------------------------------------------

-- Table structure for table `test_master`
CREATE TABLE `test_master` (
  `test_id` int NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `training_id` int NOT NULL,
  `test_name` varchar(255) NOT NULL,
  `from_date` datetime DEFAULT NULL,
  `to_date` datetime DEFAULT NULL,
  `duration` int NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `test_master_ibfk_1` FOREIGN KEY (`training_id`) REFERENCES `training_details` (`id`)
);

-- --------------------------------------------------------

-- Table structure for table `mcq_test_questions`
CREATE TABLE `mcq_test_questions` (
  `id` int NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `test_id` int NOT NULL,
  `training_id` int NOT NULL,
  `question_text` text NOT NULL,
  `option_1` text NOT NULL,
  `option_2` text NOT NULL,
  `option_3` text NOT NULL,
  `option_4` text NOT NULL,
  `correct_answer` varchar(1) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `mcq_test_questions_ibfk_1` FOREIGN KEY (`test_id`) REFERENCES `test_master` (`test_id`),
  CONSTRAINT `mcq_test_questions_ibfk_2` FOREIGN KEY (`training_id`) REFERENCES `training_details` (`id`)
);

-- --------------------------------------------------------

-- Table structure for table `test_answers`
CREATE TABLE `test_answers` (
  `id` int NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `student_id` int NOT NULL,
  `test_id` int NOT NULL,
  `question_id` int NOT NULL,
  `selected_option` varchar(1) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `test_answers_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`),
  CONSTRAINT `test_answers_ibfk_2` FOREIGN KEY (`test_id`) REFERENCES `test_master` (`test_id`),
  CONSTRAINT `test_answers_ibfk_3` FOREIGN KEY (`question_id`) REFERENCES `mcq_test_questions` (`id`)
);

-- --------------------------------------------------------

-- Table structure for table `test_scores`
CREATE TABLE `test_scores` (
  `id` int NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `test_id` int NOT NULL,
  `student_id` int NOT NULL,
  `score` int DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `test_scores_ibfk_1` FOREIGN KEY (`test_id`) REFERENCES `test_master` (`test_id`),
  CONSTRAINT `test_scores_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`)
);

-- --------------------------------------------------------

-- Table structure for table `student_trainings`
CREATE TABLE `student_trainings` (
  `id` int NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `student_id` int NOT NULL,
  `training_id` int NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_student` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_training` FOREIGN KEY (`training_id`) REFERENCES `training_details` (`id`)
);

-- --------------------------------------------------------

-- Table structure for table `attendance`
CREATE TABLE `attendance` (
  `id` int NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `student_id` int NOT NULL,
  `course_id` int NOT NULL,
  `training_id` int NOT NULL,
  `attendance_date` date NOT NULL,
  `status` enum('present','absent') NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `attendance_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`),
  CONSTRAINT `attendance_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`),
  CONSTRAINT `attendance_ibfk_3` FOREIGN KEY (`training_id`) REFERENCES `training_details` (`id`)
);

-- --------------------------------------------------------

-- Table structure for table `student_documents`
CREATE TABLE `student_documents` (
  `id` int NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `student_id` int NOT NULL,
  `course_id` int NOT NULL,
  `document_name` varchar(255) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `student_documents_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`),
  CONSTRAINT `student_documents_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`)
);

-- --------------------------------------------------------

-- Table structure for table `material`
CREATE TABLE `material` (
  `id` int NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `training_id` int NOT NULL,
  `faculty_id` int NOT NULL,
  `material_name` varchar(255) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `training_date` date NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `material_ibfk_1` FOREIGN KEY (`training_id`) REFERENCES `training_details` (`id`),
  CONSTRAINT `material_ibfk_2` FOREIGN KEY (`faculty_id`) REFERENCES `users` (`id`)
);
