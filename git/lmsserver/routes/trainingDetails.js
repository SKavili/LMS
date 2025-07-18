const express = require('express');
const router = express.Router();
const db = require('../db');
const logger = require('../logger');
const jwtAuth = require('../middleware/auth');
router.use(jwtAuth);

/**
 * @swagger
 * tags:
 *   name: Training Details
 *   description: CRUD operations for training details
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     TrainingDetails:
 *       type: object
 *       required:
 *         - course_id
 *         - from_date
 *         - to_date
 *         - training_type
 *         - faculty_id
 *         - company_id
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated ID of the training
 *         training_name:
 *           type: string
 *           description: The name of the training
 *         course_id:
 *           type: integer
 *           description: The ID of the course associated with the training
 *         from_date:
 *           type: string
 *           format: date
 *           description: The start date of the training
 *         to_date:
 *           type: string
 *           format: date
 *           description: The end date of the training
 *         training_type:
 *           type: string
 *           description: The type of training
 *         faculty_id:
 *           type: integer
 *           description: The ID of the faculty member associated with the training
 *         company_id:
 *           type: integer
 *           description: The ID of the company associated with the training
 *         status:
 *           type: string
 *           enum: ['Active','InActive']
 *           description: The status of the training (Active, InActive)
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The creation date of the training
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: The last update date of the training
 *       example:
 *         id: 1
 *         training_name: 'Advanced JavaScript'
 *         course_id: 123
 *         from_date: '2024-06-01'
 *         to_date: '2024-06-30'
 *         training_type: 'Online'
 *         faculty_id: 456
 *         company_id: 789
 *         status: 'Active'
 *         created_at: '2024-06-01T10:00:00Z'
 *         updated_at: '2024-06-02T15:30:00Z'
 */

/**
 * @swagger
 * /training_details:
 *   get:
 *     summary: Get all training details
 *     tags: [Training Details]
 *     responses:
 *       200:
 *         description: List of training details
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TrainingDetails'
 *       500:
 *         description: Internal server error
 */

router.get('/', async (req, res) => {
    try {
        const query = `
            SELECT td.*, c.name AS course_name, u.username AS faculty_username, co.name AS company_name
            FROM training_details td
            JOIN courses c ON td.course_id = c.id
            JOIN users u ON td.faculty_id = u.id
            JOIN companies co ON td.company_id = co.id
            WHERE td.status = 'Active'
        `;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (err) {
        logger.error(err.message, err);
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /training_details/{id}:
 *   get:
 *     summary: Get a training detail by ID
 *     tags: [Training Details]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the training detail to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Training detail found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TrainingDetails'
 *       404:
 *         description: Training detail not found
 *       500:
 *         description: Internal server error
 */

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const query = `
            SELECT td.*, c.name AS course_name, u.username AS faculty_username, co.name AS company_name
            FROM training_details td
            JOIN courses c ON td.course_id = c.id
            JOIN users u ON td.faculty_id = u.id
            JOIN companies co ON td.company_id = co.id
            WHERE td.status = 'Active' AND td.id = ?
        `;
        const [rows] = await db.query(query, [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Training detail not found' });
        }
        res.json(rows[0]);
    } catch (err) {
        logger.error(err.message, err);
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /training_details:
 *   post:
 *     summary: Create a new training detail
 *     tags: [Training Details]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TrainingDetails'
 *     responses:
 *       201:
 *         description: Training detail created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TrainingDetails'
 *       500:
 *         description: Internal server error
 */

router.post('/', async (req, res) => {
    const { course_id, from_date, to_date, training_type, faculty_id, company_id, training_name } = req.body;
    try {
        const query = 'INSERT INTO training_details (course_id,training_name, from_date, to_date, training_type, faculty_id, company_id) VALUES (?,?, ?, ?, ?, ?, ?)';
        const [result] = await db.query(query, [course_id, training_name, from_date, to_date, training_type, faculty_id, company_id]);
        const insertedId = result.insertId;
        const newTrainingDetail = {
            id: insertedId,
            training_name,// Assuming training_name is included in req.body
            course_id,
            from_date,
            to_date,
            training_type,
            faculty_id,
            company_id,
            status: 'Active', // Default status
            created_at: new Date().toISOString(), // Current timestamp
            updated_at: null // No update yet
        };
        res.status(201).json(newTrainingDetail);
    } catch (err) {
        logger.error(err.message, err);
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /training_details/{id}:
 *   put:
 *     summary: Update a training detail by ID
 *     tags: [Training Details]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the training detail to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TrainingDetails'
 *     responses:
 *       200:
 *         description: Training detail updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Updated
 *                   description: Confirmation message
 *       404:
 *         description: Training detail not found
 *       500:
 *         description: Internal server error
 */

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { course_id, training_name, from_date, to_date, training_type, faculty_id, company_id } = req.body;
    try {
        const query = `
            UPDATE training_details 
            SET course_id = ?,training_name =?, from_date = ?, to_date = ?, training_type = ?, faculty_id = ?, company_id = ?
            WHERE id = ?
        `;
        await db.query(query, [course_id, training_name, from_date, to_date, training_type, faculty_id, company_id, id]);
        res.json({ status: "Updated" });
    } catch (err) {
        logger.error(err.message, err);
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /training_details/{id}:
 *     delete:
 *       summary: Delete a training detail by ID
 *       tags: [Training Details]
 *       parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: integer
 *           required: true
 *           description: The ID of the training detail to delete
 *       responses:
 *         200:
 *           description: Training detail deleted successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   status:
 *                     type: string
 *                     example: Deleted
 *                     description: Confirmation message
 *         500:
 *           description: Internal server error
 */

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const query = 'UPDATE training_details SET status = ? WHERE id = ?';
        await db.query(query, ['InActive', id]);
        res.json({ status: "Deleted" });
    } catch (err) {
        logger.error(err.message, err);
        res.status(500).json({ error: err.message });
    }
});


router.get('/training_tests/:training_id', async (req, res) => {
    const { training_id } = req.params;
    try {
        const [rows] = await db.query(`
SELECT 	t.*
FROM 	test_master t
WHERE   t.training_id = ?`,
            [training_id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'tests not found' });
        }
        res.json(rows);
    } catch (err) {
        logger.error(err.message, err);
        res.status(500).json({ error: err.message });
    }
});
module.exports = router;

