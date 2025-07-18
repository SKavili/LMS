const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const logger = require('../logger');
const createToken = require('../middleware/tokenCreation');

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Logs in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email
 *               password:
 *                 type: string
 *                 description: The user's password
 *             example:
 *               email: johndoe@example.com
 *               password: password123
 *     responses:
 *       200:
 *         description: The user was successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Success
 *                   description: Success message
 *                 username:
 *                   type: string
 *                   description: The username of the logged-in user
 *                 role_id:
 *                   type: integer
 *                   description: The role ID of the logged-in user
 *       401:
 *         description: Invalid email, password, or both
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'InvalidCredentials'
 *       500:
 *         description: Some server error
 */
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length === 0) {
            logger.info(`Login failed for email: ${email} - User not found`);
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const user = rows[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            logger.info(`Login failed for email: ${email} - Incorrect password`);
            return res.status(401).json({ message: 'InvalidCredentials' });
        }

        logger.debug(`User logged in: ${email}`);
        const { id, username, role_id } = user; //destructor
        const token = createToken(id, email, role_id)
        res.json({ message: "Success", username, role_id, token, id });
    } catch (err) {
        logger.error(err.message, err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
