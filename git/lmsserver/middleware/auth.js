// middleware/auth.js
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '.env' }).parsed;

function authenticateToken(req, res, next) {
    let token = req.headers['authorization'];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    // If token starts with "Bearer ", remove it
    if (token.startsWith("Bearer ")) {
        token = token.slice(7, token.length);
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Forbidden' });
        if (Date.now() >= user.exp * 1000) { // Check if token is expired
            return res.status(401).json({ message: 'Token expired' });
        }
        req.user = user;
        next();
    });
}

module.exports = authenticateToken;
