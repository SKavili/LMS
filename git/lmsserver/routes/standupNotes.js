const express = require('express');

const router = express.Router();

const db = require('../db');

const logger = require('../logger');

const jwtAuth = require('../middleware/auth');

router.use(jwtAuth);
 
/**

* @swagger

* tags:

*   name: Standup Notes

*   description: CRUD operations for daily standup notes

*/
 
/**

* @swagger

* components:

*   schemas:

*     StandupNote:

*       type: object

*       required:

*         - standup_date

*       properties:

*         id:

*           type: integer

*           description: The auto-generated ID of the note

*         user_id:

*           type: integer

*           description: The user who submitted the note (no longer required)

*         standup_date:

*           type: string

*           format: date

*         yesterday_work:

*           type: string

*         today_plan:

*           type: string

*         blockers:

*           type: string

*         created_at:

*           type: string

*           format: date-time

*         updated_at:

*           type: string

*           format: date-time

*/
 
// GET all standup notes

router.get('/', async (req, res) => {
  try {
    // Join standup_notes with users to get username
    const [rows] = await db.query(`
      SELECT s.*, u.username
      FROM standup_notes s
      JOIN users u ON s.user_id = u.id
    `);
    res.json(rows);
  } catch (err) {
    logger.error(err.message, err);
    res.status(500).json({ error: err.message });
  }
});

// GET weekly standup notes for all students (admin only)
router.get('/weekly', async (req, res) => {
   
   
  // Only admin can access - temporarily disabled for testing
  if (!req.user || req.user.role_id !== 1) {
    console.log("Access denied - User role_id:", req.user?.role_id);
    return res.status(403).json({ error: 'Forbidden: Admins only' });
  }
  const { start, end } = req.query;
  if (!start || !end) {
    return res.status(400).json({ error: 'Missing start or end date' });
  }
  try {
    // Get all students
    const [students] = await db.query(
      `SELECT id, username FROM users WHERE role_id = 3 AND isactive = 1`
    );
    // Get all standup notes for the week
    const [notes] = await db.query(
      `SELECT * FROM standup_notes WHERE standup_date BETWEEN ? AND ?`,
      [start, end]
    );

    // Group notes by user_id and date
    const notesMap = {};
notes.forEach(note => {
  const dateKey = new Date(note.standup_date).toLocaleDateString('en-CA');
  if (!notesMap[note.user_id]) notesMap[note.user_id] = {};
  notesMap[note.user_id][dateKey] = note;
});

// Map result
const result = students.map(student => {
  const userNotes = notesMap[student.id] || {};
  return {
    user_id: student.id,
    username: student.username,
    notes: userNotes
  };
});
    
    res.json(result);
  } catch (err) {
    logger.error(err.message, err);
    res.status(500).json({ error: err.message });
  }
});

// GET note by ID

router.get('/:id', async (req, res) => {
  console.log("get i")

  const { id } = req.params;

  try {

    const [rows] = await db.query('SELECT * FROM standup_notes WHERE id = ?', [id]);

    if (rows.length === 0) {

      return res.status(404).json({ error: 'Note not found' });

    }

    res.json(rows[0]);

  } catch (err) {

    logger.error(err.message, err);

    res.status(500).json({ error: err.message });

  }

});
 
// POST create a new standup note

router.post('/', async (req, res) => {
  const { standup_date, yesterday_work, today_plan, blockers } = req.body;
  const user_id = req.user.id; // Get user_id from JWT

  try {
    const query = `INSERT INTO standup_notes(user_id, standup_date, yesterday_work, today_plan, blockers)
                   VALUES (?, ?, ?, ?, ?)`;
    const [result] = await db.query(query, [user_id, standup_date, yesterday_work, today_plan, blockers]);
    res.status(201).json({
      id: result.insertId,
      user_id,
      standup_date,
      yesterday_work,
      today_plan,
      blockers
    });
  } catch (err) {
    logger.error(err.message, err);
    res.status(500).json({ error: err.message });
  }
});
 
// PUT update standup note

router.put('/:id', async (req, res) => {

  const { id } = req.params;

  const { yesterday_work, today_plan, blockers } = req.body;

  try {

    const query = `UPDATE standup_notes 

                   SET yesterday_work = ?, today_plan = ?, blockers = ?, updated_at = NOW()

                   WHERE id = ?`;

    const [result] = await db.query(query, [yesterday_work, today_plan, blockers, id]);

    if (result.affectedRows === 0) {

      return res.status(404).json({ error: 'Note not found' });

    }

    res.json({ status: 'Updated' });

  } catch (err) {

    logger.error(err.message, err);

    res.status(500).json({ error: err.message });

  }

});
 
// DELETE standup note

router.delete('/:id', async (req, res) => {

  const { id } = req.params;

  try {

    const query = 'DELETE FROM standup_notes WHERE id = ?';

    const [result] = await db.query(query, [id]);

    if (result.affectedRows === 0) {

      return res.status(404).json({ error: 'Note not found' });

    }

    res.json({ status: 'Deleted' });

  } catch (err) {

    logger.error(err.message, err);

    res.status(500).json({ error: err.message });

  }

});
 
module.exports = router;
