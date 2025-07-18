const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const db = require('../db');
const logger = require('../logger');
const jwtAuth = require('../middleware/auth');
router.use(jwtAuth);
// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'files/studentDocuments/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });

/**
 * @swagger
 * tags:
 *   name: StudentDocuments
 *   description: API endpoints for managing student documents
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     StudentDocument:
 *       type: object
 *       required:
 *         - student_id
 *         - course_id
 *         - document_name
 *         - file_path
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated ID of the document
 *         student_id:
 *           type: integer
 *           description: The ID of the student
 *         course_id:
 *           type: integer
 *           description: The ID of the course
 *         document_name:
 *           type: string
 *           description: The name of the document
 *         file_path:
 *           type: string
 *           description: The path to the document file
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The creation date of the document record
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: The last update date of the document record
 */

/**
 * @swagger
 * /student_documents:
 *   post:
 *     summary: Upload new student documents
 *     tags: [StudentDocuments]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               student_id:
 *                 type: integer
 *               course_id:
 *                 type: integer
 *               documents:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Documents uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Documents uploaded successfully'
 *       500:
 *         description: Server error
 */
router.post('/', upload.array('documents'), async (req, res) => {
    const { student_id, course_id, project_type } = req.body;
    const files = req.files;
    try {
        const promises = files.map(file => {
            const { originalname, path: filePath } = file;
            return db.query(
                'INSERT INTO student_documents (student_id, course_id, document_name, file_path) VALUES (?, ?, ?, ?)',
                [student_id, course_id, originalname, filePath, project_type]
            );
        });
        await Promise.all(promises);
        res.status(201).json({ message: 'Documents uploaded successfully' });
    } catch (err) {
        logger.error(err.message, err);
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /student_documents:
 *   get:
 *     summary: Get all student documents
 *     tags: [StudentDocuments]
 *     responses:
 *       200:
 *         description: A list of all student documents
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/StudentDocument'
 *       500:
 *         description: Server error
 */
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM student_documents');
        res.json(rows);
    } catch (err) {
        logger.error(err.message, err);
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /student_documents/{id}:
 *   get:
 *     summary: Get a student document by ID
 *     tags: [StudentDocuments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the student document to retrieve
 *     responses:
 *       200:
 *         description: Student document retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StudentDocument'
 *       404:
 *         description: Document not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 'Document not found'
 *       500:
 *         description: Server error
 */
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query('SELECT * FROM student_documents WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Document not found' });
        }
        res.json(rows[0]);
    } catch (err) {
        logger.error(err.message, err);
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /student_documents/file/{id}:
 *   get:
 *     summary: Download a file by document ID
 *     tags: [StudentDocuments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the document to download the file for
 *     responses:
 *       200:
 *         description: File retrieved successfully
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Document not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 'Document not found'
 *       500:
 *         description: Server error
 */
router.get('/file/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query('SELECT * FROM student_documents WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Document not found' });
        }
        const document = rows[0];
        const filePath = path.join(__dirname, '..', document.file_path);
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

/**
 * @swagger
 * /student_documents/{id}:
 *   put:
 *     summary: Update a student document by ID
 *     tags: [StudentDocuments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the document to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               student_id:
 *                 type: integer
 *               course_id:
 *                 type: integer
 *               document_name:
 *                 type: string
 *               file_path:
 *                 type: string
 *     responses:
 *       200:
 *         description: Document updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Updated'
 *       404:
 *         description: Document not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 'Document not found'
 *       500:
 *         description: Server error
 */
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { student_id, course_id, document_name, file_path } = req.body;
    try {
        const result = await db.query('UPDATE student_documents SET student_id = ?, course_id = ?, document_name = ?, file_path = ? WHERE id = ?', [student_id, course_id, document_name, file_path, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Document not found' });
        }
        res.json({ message: 'Updated' });
    } catch (err) {
        logger.error(err.message, err);
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /student_documents/{id}:
 *   delete:
 *     summary: Delete a student document by ID
 *     tags: [StudentDocuments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the document to delete
 *     responses:
 *       200:
 *         description: Document deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Deleted'
 *       404:
 *         description: Document not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 'Document not found'
 *       500:
 *         description: Server error
 */
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM student_documents WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Document not found' });
        }
        res.json({ message: 'Deleted' });
    } catch (err) {
        logger.error(err.message, err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

