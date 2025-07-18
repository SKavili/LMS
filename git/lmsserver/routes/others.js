const express = require('express');
const router = express.Router();
const db = require('../db');
const logger = require('../logger');


router.post('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query(`SELECT u.id,u.username 
FROM 	courses cu 
JOIN	users u ON u.company_id = cu.company_id
WHERE 	u.role_id = 3
AND     cu.id = ?`, [id]);
        if (rows.length === 0) return res.status(404).json({ error: 'details not found' });
        res.json(rows);
    } catch (err) {
        logger.error(err.message, err);
        res.status(500).json({ error: err.message });
    }
});



router.get('/courses_training_student/:courseId/:trainingId', async (req, res) => {
    const { courseId, trainingId } = req.params;
    console.log(courseId, trainingId)
    try {
        const [rows] = await db.query(`
SELECT  u.id,u.username 
FROM 	courses cu 
JOIN	users u ON u.company_id = cu.company_id
JOIN    training_details td ON cu.id =  td.course_id
WHERE 	u.role_id = 3
AND     cu.id = ?
AND     td.id= ?
        `, [courseId, trainingId]);
        if (rows.length === 0) return res.status(404).json({ error: 'details not found' });
        res.json(rows);
    } catch (err) {
        logger.error(err.message, err);
        res.status(500).json({ error: err.message });
    }
});


router.get('/courses_training_student/:courseId/:trainingId/:att_date', async (req, res) => {
    const { courseId, trainingId, att_date } = req.params;
    console.log(courseId, trainingId)
    try {
        const [rows] = await db.query(`
SELECT u.id, u.username, a.*
FROM courses cu
JOIN users u ON u.company_id = cu.company_id
JOIN training_details td ON cu.id = td.course_id
LEFT JOIN attendance a ON a.training_id = td.id AND A.attendance_date = ?
WHERE u.role_id = 3
AND cu.id = ?
AND td.id = ?
        `, [att_date, courseId, trainingId]);
        if (rows.length === 0) return res.status(404).json({ error: 'details not found' });
        res.json(rows);
    } catch (err) {
        logger.error(err.message, err);
        res.status(500).json({ error: err.message });
    }
});


router.get('/courses_student/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query(`SELECT cu.id, cu.name 
FROM 	courses cu 
JOIN	users u ON cu.company_id = u.company_id
WHERE 	u.role_id = 3
AND		u.id  =  ?`, [id]);
        if (rows.length === 0) return res.status(404).json({ error: 'details not found' });
        res.json(rows);
    } catch (err) {
        logger.error(err.message, err);
        res.status(500).json({ error: err.message });
    }
});

router.get('/courses_trainings/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query(`SELECT td.*
FROM 	training_details td
WHERE	td.course_id  =   ?`, [id]);
        if (rows.length === 0) return res.status(404).json({ error: 'details not found' });
        res.json(rows);
    } catch (err) {
        logger.error(err.message, err);
        res.status(500).json({ error: err.message });
    }
});


router.get('/company_courses/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query(`SELECT c.*
FROM 	courses c
WHERE	c.company_id  =   ?`, [id]);
        if (rows.length === 0) return res.status(404).json({ error: 'details not found' });
        res.json(rows);
    } catch (err) {
        logger.error(err.message, err);
        res.status(500).json({ error: err.message });
    }
});

router.get('/company_students/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query(`SELECT u.*
FROM 	users u
WHERE	u.company_id  =   ?
AND     u.role_id = 3`, [id]);
        if (rows.length === 0) return res.status(404).json({ error: 'details not found' });
        res.json(rows);
    } catch (err) {
        logger.error(err.message, err);
        res.status(500).json({ error: err.message });
    }
});

router.get('/student_trainings/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query(`SELECT td.*
FROM 	student_trainings st
JOIN    training_details td ON st.training_id =  td.id
WHERE	st.student_id  =   ?`, [id]);
        if (rows.length === 0) return res.status(404).json({ error: 'details not found' });
        res.json(rows);
    } catch (err) {
        logger.error(err.message, err);
        res.status(500).json({ error: err.message });
    }
});


router.get('/student_trainings_tests/:user_id/:training_id', async (req, res) => {
    const { user_id, training_id } = req.params;
    try {
        const [rows] = await db.query(`SELECT t.*
FROM 	student_trainings st
JOIN   test_master t  ON st.training_id = t.training_id
WHERE	t.training_id = ?
AND     st.student_id  =   ?`, [training_id, user_id]);
        if (rows.length === 0) return res.status(404).json({ error: 'details not found' });
        res.json(rows);
    } catch (err) {
        logger.error(err.message, err);
        res.status(500).json({ error: err.message });
    }
});


//getattendancedatafrom cmpy_id course_id training_id
router.get('/attendance/:trainingId/:courseId/:companyId', async (req, res) => {
    const { trainingId, courseId, companyId } = req.params;
    try {
        const [rows] = await db.query(
            `SELECT 
            a.*,
            u.username AS student_name
        FROM 
            attendance a
        JOIN 
            users u ON a.student_id = u.id
        JOIN 
            courses c ON a.course_id = c.id
        JOIN 
            training_details t ON t.course_id = c.id
            WHERE 
                t.id = ? AND c.id = ? AND c.company_id = ?`,
            [trainingId, courseId, companyId]
        );

        if (rows.length === 0) return res.status(404).json({ error: 'Attendance data not found' });
        res.json(rows);
    } catch (err) {
        logger.error(err.message, err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;