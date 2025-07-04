const express = require('express');
const router = express.Router();
const db = require('../db');
const logger = require('../logger');
// const jwtAuth = require('../middleware/auth');
// router.use(jwtAuth);


/**
 * @swagger
 * /reports/:
 *   post:
 *     summary: Get reports by type and ID
 *     tags: [Reports]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - id
 *             properties:
 *               type:
 *                 type: string
 *                 description: The type of report (course, test, student)
 *               id:
 *                 type: integer
 *                 description: The ID of the course, test, or student
 *     responses:
 *       200:
 *         description: Report data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The ID
 *                   name:
 *                     type: string
 *                     description: The name
 *                   total_score:
 *                     type: number
 *                     description: The total score
 *       404:
 *         description: Data not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 'data not found'
 *       500:
 *         description: Server error
 */


router.post('/', async (req, res) => {
    const { id, type } = req.body;
    
    try {
        let query;
        let params;
        
        switch (type) {
            case 'course':
                // Get all students and their scores for a specific course
                query = `
                    SELECT 
                        u.id,
                        u.username as name,
                        COALESCE(SUM(ts.score), 0) as total_score
                    FROM users u
                    INNER JOIN student_trainings st ON u.id = st.student_id
                    INNER JOIN training_details td ON st.training_id = td.id
                    INNER JOIN courses c ON td.course_id = c.id
                    LEFT JOIN test_scores ts ON u.id = ts.student_id
                    WHERE c.id = ? AND u.role_id = 3
                    GROUP BY u.id, u.username
                    ORDER BY total_score DESC
                `;
                params = [id];
                break;
                
            case 'test':
                // Get all students and their scores for a specific test
                query = `
                    SELECT 
                        u.id,
                        u.username as name,
                        COALESCE(ts.score, 0) as total_score
                    FROM users u
                    INNER JOIN student_trainings st ON u.id = st.student_id
                    INNER JOIN training_details td ON st.training_id = td.id
                    INNER JOIN test_master tm ON td.id = tm.training_id
                    LEFT JOIN test_scores ts ON u.id = ts.student_id AND tm.test_id = ts.test_id
                    WHERE tm.test_id = ? AND u.role_id = 3
                    ORDER BY total_score DESC
                `;
                params = [id];
                break;
                
            case 'student':
                // Get all tests and scores for a specific student
                query = `
                    SELECT 
                        tm.test_id as id,
                        tm.test_name as name,
                        COALESCE(ts.score, 0) as total_score
                    FROM test_master tm
                    INNER JOIN training_details td ON tm.training_id = td.id
                    INNER JOIN student_trainings st ON td.id = st.training_id
                    LEFT JOIN test_scores ts ON tm.test_id = ts.test_id AND st.student_id = ts.student_id
                    WHERE st.student_id = ?
                    ORDER BY tm.test_name
                `;
                params = [id];
                break;
                
            default:
                return res.status(400).json({ error: 'Invalid report type. Must be course, test, or student.' });
        }
        
        const [rows] = await db.query(query, params);
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'data not found' });
        }
        
        console.log(rows, "Report data retrieved successfully");
        res.json(rows);
        
    } catch (err) {
        logger.error(err.message, err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;