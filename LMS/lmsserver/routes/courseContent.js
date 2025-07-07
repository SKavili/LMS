const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all course content
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM CourseContent ORDER BY date');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add new course content
router.post('/', async (req, res) => {
    try {
        const { date, day, day_number, skill, topic, assignment, assessment, project, status, notes } = req.body;
        const [result] = await db.query(
            'INSERT INTO CourseContent (date, day, day_number, skill, topic, assignment, assessment, project, status, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [date, day, day_number, skill, topic, assignment, assessment, project, status, notes]
        );
        res.status(201).json({ id: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update course content
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { date, day, day_number, skill, topic, assignment, assessment, project, status, notes } = req.body;
        await db.query(
            'UPDATE CourseContent SET date=?, day=?, day_number=?, skill=?, topic=?, assignment=?, assessment=?, project=?, status=?, notes=? WHERE id=?',
            [date, day, day_number, skill, topic, assignment, assessment, project, status, notes, id]
        );
        res.json({ message: 'Updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete course content
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM CourseContent WHERE id=?', [id]);
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router; 