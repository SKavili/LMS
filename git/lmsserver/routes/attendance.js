
const express = require('express');
const router = express.Router();
const db = require('../db');
const logger = require('../logger');
const jwtAuth = require('../middleware/auth');
router.use(jwtAuth);

/**
 * @swagger
 * tags:
 *   name: Attendance
 *   description: API endpoints for managing attendance
 */

/**
 * @swagger
 * /attendance:
 *   get:
 *     summary: Get all attendance records
 *     tags: [Attendance]
 *     responses:
 *       200:
 *         description: A list of all attendance records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The auto-generated ID of the attendance record
 *                   student_id:
 *                     type: integer
 *                     description: The ID of the student
 *                   course_id:
 *                     type: integer
 *                     description: The ID of the course
 *                   training_id:
 *                     type: integer
 *                     description: The ID of the training
 *                   attendance_date:
 *                     type: string
 *                     format: date
 *                     description: The date of attendance
 *                   status:
 *                     type: string
 *                     enum: [present, absent]
 *                     description: The attendance status
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     description: The creation date of the record
 *                   updated_at:
 *                     type: string
 *                     format: date-time
 *                     description: The last update date of the record
 *       500:
 *         description: Server error
 */
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM attendance');
        res.json(rows);
    } catch (err) {
        logger.error(err.message, err);
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /attendance/{id}:
 *   get:
 *     summary: Get an attendance record by ID
 *     tags: [Attendance]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the attendance record to retrieve
 *     responses:
 *       200:
 *         description: Attendance record retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The auto-generated ID of the attendance record
 *                 student_id:
 *                   type: integer
 *                   description: The ID of the student
 *                 course_id:
 *                   type: integer
 *                   description: The ID of the course
 *                 training_id:
 *                   type: integer
 *                   description: The ID of the training
 *                 attendance_date:
 *                   type: string
 *                   format: date
 *                   description: The date of attendance
 *                 status:
 *                   type: string
 *                   enum: [present, absent]
 *                   description: The attendance status
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                   description: The creation date of the record
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *                   description: The last update date of the record
 *       404:
 *         description: Attendance record not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 'Attendance record not found'
 *       500:
 *         description: Server error
 */
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query('SELECT * FROM attendance WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Attendance record not found' });
        }
        res.json(rows[0]);
    } catch (err) {
        logger.error(err.message, err);
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /attendance:
 *   post:
 *     summary: Create new attendance records
 *     tags: [Attendance]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               required:
 *                 - student_id
 *                 - course_id
 *                 - training_id
 *                 - attendance_date
 *                 - status
 *               properties:
 *                 student_id:
 *                   type: integer
 *                   description: The ID of the student
 *                 course_id:
 *                   type: integer
 *                   description: The ID of the course
 *                 training_id:
 *                   type: integer
 *                   description: The ID of the training
 *                 attendance_date:
 *                   type: string
 *                   format: date
 *                   description: The date of attendance
 *                 status:
 *                   type: string
 *                   enum: [present, absent]
 *                   description: The attendance status
 *     responses:
 *       201:
 *         description: The attendance records were successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Attendance records created'
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 'Invalid input format, expected an array of attendance records'
 *       500:
 *         description: Server error
 */

router.post('/', async (req, res) => {
    const attendanceRecords = req.body; // Expecting an array of attendance records

    if (!Array.isArray(attendanceRecords)) {
        return res.status(400).json({ error: 'Invalid input format, expected an array of attendance records' });
    }

    try {
        const results = [];
        for (const record of attendanceRecords) {
            const { student_id, course_id, training_id, attendance_date, status } = record;

            if (!student_id || !course_id || !training_id || !attendance_date || !status) {
                return res.status(400).json({ error: 'Missing required fields in one or more records' });
            }

            // Check if the record already exists
            const [existingRecord] = await db.query(
                `SELECT id FROM attendance 
                 WHERE student_id = ? AND course_id = ? AND training_id = ? AND attendance_date = ?`,
                [student_id, course_id, training_id, attendance_date]
            );

            if (existingRecord.length > 0) {
                // Update the existing record
                await db.query(
                    `UPDATE attendance 
                     SET status = ? 
                     WHERE id = ?`,
                    [status, existingRecord[0].id]
                );
                results.push({ id: existingRecord[0].id, ...record });
            } else {
                // Insert a new record
                const [result] = await db.query(
                    `INSERT INTO attendance 
                     (student_id, course_id, training_id, attendance_date, status) 
                     VALUES (?, ?, ?, ?, ?)`,
                    [student_id, course_id, training_id, attendance_date, status]
                );
                results.push({ id: result.insertId, ...record });
            }
        }

        res.status(201).json({ message: 'Attendance records processed', data: results });
    } catch (err) {
        logger.error(err.message, err);
        res.status(500).json({ error: err.message });
    }
});


/**
 * @swagger
 * /attendance:
 *   put:
 *     summary: Update multiple attendance records
 *     tags: [Attendance]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               required:
 *                 - id
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The ID of the attendance record
 *                 student_id:
 *                   type: integer
 *                   description: The ID of the student
 *                 course_id:
 *                   type: integer
 *                   description: The ID of the course
 *                 training_id:
 *                   type: integer
 *                   description: The ID of the training
 *                 attendance_date:
 *                   type: string
 *                   format: date
 *                   description: The date of attendance
 *                 status:
 *                   type: string
 *                   enum: [present, absent]
 *                   description: The attendance status
 *     responses:
 *       200:
 *         description: Attendance records updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Updated'
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: The ID of the updated attendance record
 *                       student_id:
 *                         type: integer
 *                         description: The ID of the student
 *                       course_id:
 *                         type: integer
 *                         description: The ID of the course
 *                       training_id:
 *                         type: integer
 *                         description: The ID of the training
 *                       attendance_date:
 *                         type: string
 *                         format: date
 *                         description: The date of attendance
 *                       status:
 *                         type: string
 *                         enum: [present, absent]
 *                         description: The attendance status
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         description: The creation date of the record
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *                         description: The last update date of the record
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 'Invalid input format, expected an array of attendance records with IDs'
 *       404:
 *         description: Attendance record not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 'Attendance record with the specified ID not found'
 *       500:
 *         description: Server error
 */
router.put('/', async (req, res) => {
    const attendanceRecords = req.body; // Expecting an array of attendance records
    if (!Array.isArray(attendanceRecords)) {
        return res.status(400).json({ error: 'Invalid input format, expected an array of attendance records with IDs' });
    }
    try {
        const results = [];
        for (const record of attendanceRecords) {
            const { id, student_id, course_id, training_id, attendance_date, status } = record;
            if (!id || !student_id || !course_id || !training_id || !attendance_date || !status) {
                return res.status(400).json({ error: 'Missing required fields in one or more records' });
            }
            const [result] = await db.query(
                'UPDATE attendance SET student_id = ?, course_id = ?, training_id = ?, attendance_date = ?, status = ? WHERE id = ?',
                [student_id, course_id, training_id, attendance_date, status, id]
            );
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: `Attendance record with id ${id} not found` });
            }
            results.push({ id, ...record });
        }
        res.json({ message: 'Updated', data: results });
    } catch (err) {
        logger.error(err.message, err);
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /attendance/{id}:
 *   delete:
 *     summary: Delete an attendance record by ID
 *     tags: [Attendance]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the attendance record to delete
 *     responses:
 *       200:
 *         description: Attendance record deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Deleted'
 *       404:
 *         description: Attendance record not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 'Attendance record not found'
 *       500:
 *         description: Server error
 */
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query('DELETE FROM attendance WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Attendance record not found' });
        }
        res.json({ message: 'Deleted' });
    } catch (err) {
        logger.error(err.message, err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
