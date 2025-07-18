// routes/protectedRoute.js
const authenticateToken = require('../middleware/auth');

router.get('/protected', authenticateToken, (req, res) => {
    // This route is protected, only accessible with a valid JWT token
    res.json({ message: 'Protected Route' });
});
