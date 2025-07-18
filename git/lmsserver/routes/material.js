const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db = require('../db');
const logger = require('../logger');
const jwtAuth = require('../middleware/auth');
router.use(jwtAuth);
// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'files/materials/');
    },
    filename: function (req, file, cb) {
        //const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

/**
 * @swagger
 * components:
 *   schemas:
 *     Material:
 *       type: object
 *       required:
 *         - training_id
 *         - faculty_id
 *         - material_name
 *         - file_path
 *         - training_date
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated ID of the material
 *         training_id:
 *           type: integer
 *           description: The ID of the associated training
 *         faculty_id:
 *           type: integer
 *           description: The ID of the faculty who uploaded the material
 *         material_name:
 *           type: string
 *           description: The name of the material
 *         file_path:
 *           type: string
 *           description: The path to the uploaded file
 *         training_date:
 *           type: string
 *           format: date
 *           description: The date of the training
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The creation date of the record
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: The last update date of the record
 *       example:
 *         id: 1
 *         training_id: 123
 *         faculty_id: 456
 *         material_name: "Sample Material"
 *         file_path: "uploads/sample.pdf"
 *         training_date: "2024-06-01"
 *         created_at: "2024-06-01T10:00:00Z"
 *         updated_at: "2024-06-01T10:30:00Z"
 */

/**
 * @swagger
 * /materials:
 *   post:
 *     summary: Create a new material with multiple files
 *     tags: [Materials]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - training_id
 *               - faculty_id
 *               - material_name
 *               - files
 *               - training_date
 *             properties:
 *               training_id:
 *                 type: integer
 *                 description: The ID of the associated training
 *               faculty_id:
 *                 type: integer
 *                 description: The ID of the faculty who uploaded the material
 *               material_name:
 *                 type: string
 *                 description: The name of the material
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: The files to upload
 *               training_date:
 *                 type: string
 *                 format: date
 *                 description: The date of the training
 *     responses:
 *       201:
 *         description: The material was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Material'
 *       500:
 *         description: Server error
 */
router.post('/', upload.array('files', 10), async (req, res) => {
    const { training_id, faculty_id, material_name, training_date } = req.body;
    const files = req.files;

    if (!files || files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded' });
    }

    try {
        const materials = [];
        const promises = files.map(file => {
            const file_path = file.path;
            return db.query(
                'INSERT INTO material (training_id, faculty_id, material_name, file_path, training_date) VALUES (?, ?, ?, ?, ?)',
                [training_id, faculty_id, material_name, file_path, training_date]
            ).then(([result]) => {
                materials.push({ id: result.insertId, training_id, faculty_id, material_name, file_path, training_date });
            });
        });

        await Promise.all(promises);

        res.status(201).json(materials);
    } catch (err) {
        logger.error(err.message, err);
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /materials:
 *   get:
 *     summary: Get all materials
 *     tags: [Materials]
 *     responses:
 *       200:
 *         description: A list of all materials
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Material'
 *       500:
 *         description: Server error
 */
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(`SELECT 	m.*, u.username AS faculty_name, c.name AS course_name
        FROM 	material m
        JOIN	users u ON m.faculty_id = u.id
        JOIN	training_details td ON m.training_id = td.id
        JOIN	courses c ON td.course_id = c.id`);
        res.json(rows);
    } catch (err) {
        logger.error(err.message, err);
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /materials/{id}:
 *   get:
 *     summary: Get a material by ID
 *     tags: [Materials]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the material to retrieve
 *     responses:
 *       200:
 *         description: Material retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Material'
 *       404:
 *         description: Material not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 'Material not found'
 *       500:
 *         description: Server error
 */
router.get('/:training_id', async (req, res) => {
    const { training_id } = req.params;
    try {
        const [rows] = await db.query(`
        SELECT 	m.*, u.username AS faculty_name, c.name AS course_name
FROM 	material m
JOIN	users u ON m.faculty_id = u.id
JOIN	training_details td ON m.training_id = td.id
JOIN	courses c ON td.course_id = c.id
WHERE   m.training_id = ?`,
            [training_id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Material not found' });
        }
        res.json(rows);
    } catch (err) {
        logger.error(err.message, err);
        res.status(500).json({ error: err.message });
    }
});
/**
 * @swagger
 * /materials/file/{id}:
 *   get:
 *     summary: Download a file by material ID
 *     tags: [Materials]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the material to download the file for
 *     responses:
 *       200:
 *         description: File retrieved successfully
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Material not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 'Material not found'
 *       500:
 *         description: Server error
 */
router.get('/file/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query('SELECT * FROM material WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Material not found' });
        }
        const material = rows[0];
        const filePath = path.join(__dirname, '..', material.file_path);
        res.download(filePath, (err) => {
            if (err) {
                logger.error(err.message, err);
                res.status(500).json({ error: 'Error downloading file' });
            }
        });
    } catch (err) {
        logger.error(err.message, err);
        res.status(500).json({ error: err.message });
    }
});

router.get('/student_materials/:student_id', async (req, res) => {
    const { student_id } = req.params;
    try {
        const [rows] = await db.query(`
        SELECT  st.* ,c.name AS course_name, u.username AS faculty_name,m.material_name,m.training_date
        FROM    student_trainings st
        JOIN    material m ON st.training_id =  m.training_id
        JOIN    training_details td ON td.id = m.training_id
        JOIN    courses c ON td.course_id = c.id
        JOIN    users u ON  m.faculty_id = u.id
        WHERE   st.student_id = ?`, [student_id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Material not found' });
        }
        res.json(rows);

    } catch (err) {
        logger.error(err.message, err);
        res.status(500).json({ error: err.message });
    }
});
module.exports = router;