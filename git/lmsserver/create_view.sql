-- Execute this script to create the combined_scores_view
-- Run this in your MySQL database

SOURCE combined_scores_view.sql;

-- Verify the view was created
SHOW CREATE VIEW combined_scores_view;

-- Test the view with a sample query
SELECT 
    student_name,
    company_name,
    course_name,
    test_name,
    student_score,
    percentage_score,
    test_average_score
FROM combined_scores_view 
LIMIT 5; 