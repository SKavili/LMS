const express = require('express');
const router = express.Router();
const db = require('../db');
const logger = require('../logger');
const jwtAuth = require('../middleware/auth');

router.use(jwtAuth);

/**
 * @swagger
 * tags:
 *   name: Student Trainings
 *   description: CRUD operations for student trainings
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     StudentTraining:
 *       type: object
 *       required:
 *         - training_id
 *         - student_ids
 *       properties:
 *         training_id:
 *           type: integer
 *           description: The ID of the training associated with the students
 *         student_ids:
 *           type: array
 *           items:
 *             type: integer
 *           description: Array of student IDs to associate with the training
 *       example:
 *         training_id: 1
 *         student_ids: [1, 2, 3]
 */

/**
 * @swagger
 * /student_trainings:
 *   post:
 *     summary: Create student trainings
 *     tags: [Student Trainings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StudentTraining'
 *     responses:
 *       201:
 *         description: Student trainings created successfully
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Server error
 */


router.post('/', async (req, res) => {
    
    let { training_id, student_ids = [], unmap_student_ids = [] } = req.body;

    if (!training_id || (student_ids.length === 0 && unmap_student_ids.length === 0)) {
        return res.status(400).json({ error: 'Invalid request body' });
    }

    try {
        // Insert new mappings
        if (student_ids.length > 0) {
            const values = student_ids.map(student_id => [student_id, training_id]);
            await db.query('INSERT INTO student_trainings (student_id, training_id) VALUES ?', [values]);
        }

        // Delete existing mappings
        if (unmap_student_ids.length > 0) {
            // Dynamically create placeholders for the IN clause
            const placeholders = unmap_student_ids.map(() => '?').join(',');
            await db.query(
                `DELETE FROM student_trainings WHERE training_id = ? AND student_id IN (${placeholders})`,
                [Number(training_id), ...unmap_student_ids.map(Number)]
            );
        }

        res.status(201).json({ message: 'Student trainings updated successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
    }
});

router.get('/:cid/:tid', async (req, res) => {
    const { tid, cid } = req.params;
    console.log("hitting")
    try {
        const query = `
     SELECT 
    u.id AS user_id,
    u.username,
    u.company_id,
    st.training_id,
  CASE WHEN st.training_id IS NOT NULL THEN 'Check' ELSE 'Uncheck' END AS has_training_record 
  FROM
    users u
LEFT JOIN
    student_trainings st ON u.id = st.student_id AND st.training_id = ?
WHERE
    u.company_id = ?;`
        const [rows] = await db.query(query, [tid, cid]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Not Mapped' });
        }
        res.json(rows);
    } catch (err) {
        logger.error(err.message, err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
