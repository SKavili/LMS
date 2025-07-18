const express = require('express');
const multer = require('multer');
const path = require('path');
const db = require('../db');
const logger = require('../logger');

const router = express.Router();

// Multer configuration for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/') // Destination folder where files will be stored
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Keep the original filename
    }
});

const upload = multer({ storage: storage }).single('file'); // 'file' is the name of the field in the form data

/**
 * @swagger
 * /uploadMaterial:
 *   post:
 *     summary: Upload material
 *     tags: [Material]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               training_id:
 *                 type: integer
 *                 description: ID of the training
 *               faculty_id:
 *                 type: integer
 *                 description: ID of the faculty
 *               material_name:
 *                 type: string
 *                 description: Name of the material
 *               upload_date:
 *                 type: string
 *                 format: date-time
 *                 description: Date of the upload
 *               training_date:
 *                 type: string
 *                 format: date-time
 *                 description: Date of the training
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The file to upload
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post('/', (req, res) => {
    upload(req, res, async (err) => {
        console.log("api enterss         sfsfsfsf")
        console.log("entered into try block", req.body);
        if (err) {
            console.log("entered into error block");
            logger.error('Error uploading file:', err);
            return res.status(400).json({ error: err.message });
        } else {
            try {
                if (!req.file) {
                    logger.error('No file selected!');
                    return res.status(400).json({ error: 'No file selected!' });
                }

                const { training_id, faculty_id, material_name, upload_date, training_date } = req.body;
                if (!training_id || !faculty_id || !material_name || !upload_date || !training_date) {
                    logger.error('Missing required parameters');
                    return res.status(400).json({ error: 'Missing required parameters' });
                }

                const file_path = req.file.filename;
                const query = 'INSERT INTO material (training_id, faculty_id, material_name, file_path, upload_date, training_date) VALUES (?, ?, ?, ?, ?, ?)';
                await db.query(query, [training_id, faculty_id, material_name, file_path, upload_date, training_date]);
                logger.info('File uploaded successfully:', req.file.filename);
                res.status(200).json({ message: 'File uploaded successfully', file: req.file });
            } catch (error) {
                logger.error('Error inserting into database:', error);
                return res.status(500).json({ error: 'Server error' });
            }
        }
    });
});



module.exports = router;
