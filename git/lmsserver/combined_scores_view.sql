CREATE OR REPLACE VIEW combined_scores_view AS
SELECT 
    -- Student Information
    u.id AS student_id,
    u.username AS student_name,
    u.email AS student_email,
    
    -- Company Information
    c.id AS company_id,
    c.name AS company_name,
    
    -- Course Information
    co.id AS course_id,
    co.name AS course_name,
    
    -- Training Information
    td.id AS training_id,
    td.training_name,
    td.from_date AS training_start_date,
    td.to_date AS training_end_date,
    
    -- Test Information
    tm.test_id,
    tm.test_name,
    tm.duration AS test_duration_minutes,
    tm.from_date AS test_start_date,
    tm.to_date AS test_end_date,
    
    -- Question Count
    COUNT(mtq.id) AS total_questions,
    
    -- Student Score Information
    ts.score AS student_score,
    COUNT(mtq.id) AS max_possible_score,
    ROUND((ts.score / COUNT(mtq.id)) * 100, 2) AS percentage_score,
    
    -- Test Statistics
    ROUND(AVG(ts2.score), 2) AS test_average_score,
    MAX(ts2.score) AS test_highest_score,
    MIN(ts2.score) AS test_lowest_score,
    COUNT(ts2.id) AS total_students_taken_test,
    
    -- Faculty Information
    f.id AS faculty_id,
    f.username AS faculty_name,
    
    -- Timestamps
    ts.created_at AS test_completion_date,
    ts.updated_at AS score_updated_date

FROM users u
INNER JOIN companies c ON u.company_id = c.id
INNER JOIN student_trainings st ON u.id = st.student_id
INNER JOIN training_details td ON st.training_id = td.id
INNER JOIN courses co ON td.course_id = co.id
INNER JOIN test_master tm ON td.id = tm.training_id
INNER JOIN mcq_test_questions mtq ON tm.test_id = mtq.test_id
INNER JOIN test_scores ts ON u.id = ts.student_id AND tm.test_id = ts.test_id
INNER JOIN users f ON td.faculty_id = f.id
LEFT JOIN test_scores ts2 ON tm.test_id = ts2.test_id  -- For test statistics

WHERE u.role_id = 3  -- Only students
  
GROUP BY 
    u.id, u.username, u.email,
    c.id, c.name,
    co.id, co.name,
    td.id, td.training_name, td.from_date, td.to_date,
    tm.test_id, tm.test_name, tm.duration, tm.from_date, tm.to_date,
    ts.score, ts.created_at, ts.updated_at,
    f.id, f.username

ORDER BY 
    c.name, co.name, td.training_name, tm.test_name, u.username; 