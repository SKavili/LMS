const express = require('express');
const router = express.Router();
const db = require('../db');
const logger = require('../logger');
const jwtAuth = require('../middleware/auth');

router.use(jwtAuth);

/**
 * @swagger
 * tags:
 *   name: Companies
 *   description: Companies Related API's
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Company:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated ID of the company
 *         name:
 *           type: string
 *           description: The name of the company
 *         address:
 *           type: string
 *           description: The address of the company
 *         contact_person:
 *           type: string
 *           description: The contact person of the company
 *         contact_number:
 *           type: string
 *           description: The contact number of the company
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The creation date of the company
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: The last update date of the company
 *       example:
 *         id: 1
 *         name: Example Company
 *         address: 123 Main St, Anytown
 *         contact_person: John Doe
 *         contact_number: 123-456-7890
 *         created_at: 2024-01-01T00:00:00.000Z
 *         updated_at: 2024-01-01T00:00:00.000Z
 */

/**
 * @swagger
 * /companies:
 *   get:
 *     summary: Returns the list of all companies
 *     tags: [Companies]
 *     responses:
 *       200:
 *         description: The list of companies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Company'
 */

router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM companies');
        res.json(rows);
    } catch (err) {
        logger.error(err.message, err);
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /companies/{id}:
 *   get:
 *     summary: Get a company by ID
 *     tags: [Companies]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The company ID
 *     responses:
 *       200:
 *         description: The company details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Company'
 *       404:
 *         description: Company not found
 */

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query('SELECT * FROM companies WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Company not found' });
        }
        res.json(rows[0]);
    } catch (err) {
        logger.error(err.message, err);
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /companies:
 *   post:
 *     summary: Create a new company
 *     tags: [Companies]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Company'
 *     responses:
 *       201:
 *         description: Company created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Company'
 *       500:
 *         description: Server error
 */

router.post('/', async (req, res) => {
    const { name, address, contact_person, contact_number } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO companies (name, address, contact_person, contact_number) VALUES (?, ?, ?, ?)',
            [name, address, contact_person, contact_number]
        );
        const insertedCompany = {
            id: result.insertId,
            name,
            address,
            contact_person,
            contact_number,
            created_at: new Date(),
            updated_at: null
        };
        res.status(201).json(insertedCompany);
    } catch (err) {
        logger.error(err.message, err);
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /companies/{id}:
 *   put:
 *     summary: Update a company by ID
 *     tags: [Companies]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The company ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Company'
 *     responses:
 *       200:
 *         description: Company updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Updated
 *       404:
 *         description: Company not found
 *       500:
 *         description: Server error
 */

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, address, contact_person, contact_number } = req.body;
    try {
        const [result] = await db.query(
            'UPDATE companies SET name = ?, address = ?, contact_person = ?, contact_number = ? WHERE id = ?',
            [name, address, contact_person, contact_number, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Company not found' });
        }
        res.json({ message: "Updated" }); // Response adjusted to return { message: "Updated" }
    } catch (err) {
        logger.error(err.message, err);
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /companies/{id}:
 *   delete:
 *     summary: Delete a company by ID
 *     tags: [Companies]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The company ID
 *     responses:
 *       200:
 *         description: Company deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Deleted
 *       404:
 *         description: Company not found
 *       500:
 *         description: Server error
 */

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query('DELETE FROM companies WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Company not found' });
        }
        res.json({ status: 'Deleted' });
    } catch (err) {
        logger.error(err.message, err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
