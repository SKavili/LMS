const express = require('express');
const router = express.Router();
const db = require('../db');
const logger = require('../logger');
const jwtAuth = require('../middleware/auth');
router.use(jwtAuth);
/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: Courses Related API's
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Course:
 *       type: object
 *       required:
 *         - name
 *         - duration
 *         - company_id
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated ID of the course
 *         name:
 *           type: string
 *           description: The name of the course
 *         description:
 *           type: string
 *           description: The description of the course
 *         duration:
 *           type: integer
 *           description: The duration of the course in hours
 *         status:
 *           type: string
 *           enum: [Active, InActive]
 *           description: The status of the course
 *         company_id:
 *           type: integer
 *           description: The company ID associated with the course
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The creation date of the course
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: The last update date of the course
 *       example:
 *         id: 1
 *         name: Advanced JavaScript
 *         description: A course on advanced JavaScript topics
 *         duration: 40
 *         status: Active
 *         company_id: 1
 *         created_at: 2024-06-01T12:00:00.000Z
 *         updated_at: 2024-06-01T12:00:00.000Z
 */

/**
 * @swagger
 * /courses:
 *   get:
 *     summary: Retrieve all courses
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: A list of courses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Course'
 *       500:
 *         description: Internal server error
 */

router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(`SELECT * FROM courses WHERE status = 'Active'`);
        res.json(rows);
    } catch (err) {
        logger.error(err.message, err);
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /courses/{id}:
 *   get:
 *     summary: Retrieve a course by ID
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the course to retrieve
 *     responses:
 *       200:
 *         description: The course object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 *       404:
 *         description: Course not found
 *       500:
 *         description: Internal server error
 */

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query('SELECT * FROM courses WHERE id = ?', [id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Course not found' });
        res.json(rows[0]);
    } catch (err) {
        logger.error(err.message, err);
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /courses:
 *   post:
 *     summary: Create a new course
 *     tags: [Courses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - duration
 *               - company_id
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the course
 *               description:
 *                 type: string
 *                 description: The description of the course
 *               duration:
 *                 type: integer
 *                 description: The duration of the course in hours
 *               company_id:
 *                 type: integer
 *                 description: The company ID associated with the course
 *             example:
 *               name: Advanced JavaScript
 *               description: A course on advanced JavaScript topics
 *               duration: 40
 *               company_id: 1
 *     responses:
 *       201:
 *         description: The course was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 *       500:
 *         description: Internal server error
 */

router.post('/', async (req, res) => {
    const { name, description, duration, company_id } = req.body;
    try {
        const [existingCourse] = await db.query(
            'SELECT id FROM courses WHERE name = ?',
            [name]
        );

        if (existingCourse.length > 0) {
            return res.status(400).json({ error: 'Course name already exists' });
        }
        const [result] = await db.query(
            'INSERT INTO courses (name, description, duration, company_id) VALUES (?, ?, ?, ?)',
            [name, description, duration, company_id]
        );
        res.status(201).json({ id: result.insertId, name, description, duration, status: 'Active', company_id });
    } catch (err) {
        logger.error(err.message, err);
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /courses/{id}:
 *   put:
 *     summary: Update the course by ID
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the course to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the course
 *               description:
 *                 type: string
 *                 description: The description of the course
 *               duration:
 *                 type: integer
 *                 description: The duration of the course in hours
 *               status:
 *                 type: string
 *                 enum: [Active, InActive]
 *                 description: The status of the course
 *               company_id:
 *                 type: integer
 *                 description: The company ID associated with the course
 *             example:
 *               name: Advanced JavaScript
 *               description: A course on advanced JavaScript topics
 *               duration: 40
 *               status: in_progress
 *               company_id: 1
 *     responses:
 *       200:
 *         description: The course was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Update status message
 *                   example: Updated
 *       500:
 *         description: Internal server error
 */

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description, duration, company_id } = req.body;
    try {
        await db.query(
            'UPDATE courses SET name = ?, description = ?, duration = ?, company_id = ? WHERE id = ?',
            [name, description, duration, company_id, id]
        );
        res.json({ status: 'Updated' });
    } catch (err) {
        logger.error(err.message, err);
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /courses/{id}:
 *   delete:
 *     summary: Update the status of a course to 'deleted' by ID
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the course to update status
 *     responses:
 *       200:
 *         description: The status was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Update status message
 *                   example: Status Updated
 *       500:
 *         description: Internal server error
 */

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query(
            'UPDATE courses SET status = ? WHERE id = ?',
            ['InActive', id]
        );
        res.json({ status: 'Status Updated' });
    } catch (err) {
        logger.error(err.message, err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
