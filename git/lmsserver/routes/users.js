const express = require('express');
const router = express.Router();
const db = require('../db');
const logger = require('../logger');
const bcrypt = require('bcrypt');
const jwtAuth = require('../middleware/auth');
router.use(jwtAuth);
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Users Related Api's
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Users:
 *       type: object
 *       required:
 *         - email
 *         - username
 *         - password
 *         - role_id
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated ID of the user
 *         email:
 *           type: string
 *           description: The email of the user
 *         username:
 *           type: string
 *           description: The username of the user
 *         password:
 *           type: string
 *           description: The password of the user
 *         role_id:
 *           type: integer
 *           description: The role ID of the user
 *         company_id:
 *           type: integer
 *           description: The company ID of the user
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The creation date of the user
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: The last update date of the user
 *       example:
 *         id: 1
 *         email: johndoe@example.com
 *         username: johndoe
 *         password: password123
 *         role_id: 1
 *         company_id: 1
 *         created_at: 2024-01-01T00:00:00.000Z
 *         updated_at: 2024-01-01T00:00:00.000Z
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Returns the list of all the users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: The list of the users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The auto-generated ID of the user
 *                   email:
 *                     type: string
 *                     description: The email of the user
 *                   username:
 *                     type: string
 *                     description: The username of the user
 *                   role_id:
 *                     type: integer
 *                     description: The role ID of the user
 *                   role_name:
 *                     type: string
 *                     description: The role of the user
 *                   company_id:
 *                     type: integer
 *                     description: The company ID of the user
 *                   company_name:
 *                     type: string
 *                     description: The company of the user
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     description: The creation date of the user
 *                   updated_at:
 *                     type: string
 *                     format: date-time
 *                     description: The last update date of the user
 */

router.get('/', async (req, res) => {
    try {
        const qu = `SELECT u.*,r.name AS role_name,c.name AS company_name
        FROM users u 
        JOIN roles r ON u.role_id = r.id
        JOIN companies c ON u.company_id = c.id AND u.isactive = 1 and u.role_id <> 1`
        const [rows] = await db.query(qu);
        res.json(rows);
    } catch (err) {
        logger.error(err.message, err);
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get the user by id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The user id
 *     responses:
 *       200:
 *         description: The user description by id
 *         contents:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The auto-generated ID of the user
 *                 email:
 *                   type: string
 *                   description: The email of the user
 *                 username:
 *                   type: string
 *                   description: The username of the user
 *                 role_id:
 *                   type: integer
 *                   description: The role ID of the user
 *                 role_name:
 *                     type: string
 *                     description: The role of the user
 *                 company_id:
 *                     type: integer
 *                     description: The company ID of the user
 *                 company_name:
 *                     type: string
 *                     description: The company of the user
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                   description: The creation date of the user
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *                   description: The last update date of the user
 *       404:
 *         description: The user was not found
 */

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query(`SELECT u.*,r.name AS role_name,c.name AS company_name
        FROM users u 
        JOIN roles r ON u.role_id = r.id
        JOIN companies c ON u.company_id = c.id WHERE u.id = ?`, [id]);
        if (rows.length === 0) return res.status(404).json({ error: 'User not found' });
        res.json(rows[0]);
    } catch (err) {
        logger.error(err.message, err);
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - username
 *               - password
 *               - role_id
 *               - company_id 
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email of the user
 *               username:
 *                 type: string
 *                 description: The username of the user
 *               password:
 *                 type: string
 *                 description: The password of the user
 *               role_id:
 *                 type: integer
 *                 description: The role ID of the user
 *               company_id:
 *                 type: integer
 *                 description: The company ID of the user
 *     responses:
 *       201:
 *         description: The user was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The auto-generated ID of the user
 *                 email:
 *                   type: string
 *                   description: The email of the user
 *                 username:
 *                   type: string
 *                   description: The username of the user
 *                 role_id:
 *                   type: integer
 *                   description: The role ID of the user
 *                 company_id:
 *                   type: integer
 *                   description: The company ID of the user
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                   description: The creation date of the user
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *                   description: The last update date of the user
 *       500:
 *         description: Some server error
 */

// router.post('/', async (req, res) => {
//     const { email, username, password, role_id, company_id } = req.body;
//     try {
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // Store the user in the database
//         const [result] = await db.query('INSERT INTO users (email, username, password, role_id,company_id) VALUES (?, ?, ?, ?, ?)', [email, username, hashedPassword, role_id, company_id]);
//         res.status(201).json({ id: result.insertId, email, username, role_id });
//     } catch (err) {
//         logger.error(err.message, err);
//         res.status(500).json({ error: err.message });
//     }
// });

// The below api inserts and user in users table and an record in attendance table if the user was a student.
router.post('/', async (req, res) => {
    const { email, username, password, role_id, company_id } = req.body;
    try {
        const [rows] = await db.query('SELECT Count(*) FROM users WHERE email =?', [email]);
        if (rows[0]['Count(*)'] > 0)
            return res.status(409).json({ error: 'User already exists' });
        const hashedPassword = await bcrypt.hash(password, 10);

        // Store the user in the database
        const [result] = await db.query('INSERT INTO users (email, username, password, role_id, company_id) VALUES (?, ?, ?, ?, ?)', [email, username, hashedPassword, role_id, company_id]);

        const userId = result.insertId;

        // If role_id is 3, insert the studentid into the attendance table
        // if (role_id === 3) {
        //     await db.query('INSERT INTO attendance (student_id) VALUES (?)', [userId]);
        // }

        res.status(201).json({ id: userId, email, username, role_id, company_id });
    } catch (err) {
        logger.error(err.message, err);
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update the user by the id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The user id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email of the user
 *               username:
 *                 type: string
 *                 description: The username of the user
 *               role_id:
 *                 type: integer
 *                 description: The role ID of the user
 *               company_id:
 *                   type: integer
 *                   description: The company ID of the user
 *     responses:
 *       200:
 *         description: The user was updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Updated
 *       404:
 *         description: The user was not found
 *       500:
 *         description: Some error happened
 */

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { email, username, role_id, company_id } = req.body;
    try {
        await db.query('UPDATE users SET email = ?, username = ?, role_id = ?,company_id = ? WHERE id = ?', [email, username, role_id, company_id, id]);
        res.json({ message: "Updated" });
    } catch (err) {
        logger.error(err.message, err);
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Remove the user by id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The user id
 *     responses:
 *       200:
 *         description: The user was updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Deleted
 *       404:
 *         description: The user was not found
 */

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('UPDATE users SET isactive = ? WHERE id = ?', [0, id]);
        res.json({ message: 'Deleted' });
    } catch (err) {
        logger.error(err.message, err);
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;


