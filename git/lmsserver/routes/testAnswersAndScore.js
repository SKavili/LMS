const express = require('express');
const router = express.Router();
const db = require('../db');
const logger = require('../logger');
const jwtAuth = require('../middleware/auth');
router.use(jwtAuth);
/**
 * @swagger
 * tags:
 *   name: Test Answers & Score
 *   description: API endpoints for managing test answers
 */

/**
 * @swagger
 * /test-answers-score:
 *   post:
 *     summary: Submit answers for a test
 *     tags: [Test Answers & Score]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               student_id:
 *                 type: integer
 *                 description: The ID of the student submitting the answers
 *               test_id:
 *                 type: integer
 *                 description: The ID of the test for which the answers are being submitted
 *               answers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     question_id:
 *                       type: integer
 *                       description: The ID of the question
 *                       example: 1
 *                     selected_option:
 *                       type: string
 *                       description: The selected option for the question
 *                       example: 1
 *     responses:
 *       201:
 *         description: Answers and score submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Answers and score submitted successfully'
 *       500:
 *         description: Server error
 */

router.post('/', async (req, res) => {
    const { student_id, test_id, answers } = req.body;
    try {
        // Process each answer and insert into the database
        const promises = answers.map(async (answer) => {
            const { question_id, selected_option } = answer;
            await db.query('INSERT INTO test_answers (student_id, test_id, question_id, selected_option) VALUES (?, ?, ?, ?)', [student_id, test_id, question_id, selected_option]);
        });
        await Promise.all(promises);

        // Calculate score
        const [questions] = await db.query('SELECT id, correct_answer FROM mcq_test_questions WHERE test_id = ?', [test_id]);
        let score = 0;
        for (const answer of answers) {
            const question = questions.find(q => Number(q.id) === Number(answer.question_id));
            console.log(
                'Comparing:',
                'selected_option:', answer.selected_option, typeof answer.selected_option,
                'correct_answer:', question ? question.correct_answer : undefined, question ? typeof question.correct_answer : undefined
            );
            if (
                question &&
                answer.selected_option &&
                question.correct_answer &&
                answer.selected_option.toString().trim() === question.correct_answer.toString().trim()
            ) {
                score++;
            }
        }

        // Insert score into test_scores table
        await db.query('INSERT INTO test_scores (test_id, student_id, score) VALUES (?, ?, ?)', [test_id, student_id, score]);

        res.status(201).json({ message: 'Answers and score submitted successfully' });
    } catch (err) {
        logger.error(err.message, err);
        res.status(500).json({ error: err.message });
    }
});


/**
 * @swagger
 * /test-answers-score/{test_id}:
 *   get:
 *     summary: Get test scores by test ID
 *     tags: [Test Answers & Score]
 *     parameters:
 *       - in: path
 *         name: test_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the test
 *     responses:
 *       200:
 *         description: A list of test scores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   test_id:
 *                     type: integer
 *                   student_id:
 *                     type: integer
 *                   student_name:
 *                     type: string
 *                   score:
 *                     type: integer
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                   updated_at:
 *                     type: string
 *                     format: date-time
 *       404:
 *         description: No test scores found for the test
 *       500:
 *         description: Server error
 */

router.get('/:test_id', async (req, res) => {
    const { test_id } = req.params;
    try {
        const [rows] = await db.query(`
            SELECT  t.*,u.username AS student_name 
            FROM    test_scores t
            JOIN    users u ON t.student_id = u.id 
            WHERE   t.test_id = ?`, [test_id]);
        res.status(200).json(rows);
    } catch (err) {
        logger.error(err.message, err);
        res.status(500).json({ error: err.message });
    }
});


router.get('/:test_id/:userid', async (req, res) => {
    const { test_id, userid } = req.params;
    try {
        const [rows] = await db.query(`
            SELECT  t.*,u.username AS student_name 
            FROM    test_scores t
            JOIN    users u ON t.student_id = u.id 
            WHERE   t.test_id = ?
            AND     t.student_id = ?`, [test_id, userid]);
        res.status(200).json(rows);
    } catch (err) {
        logger.error(err.message, err);
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;
