const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '.env' }).parsed;


createToken = (id, email, role_id) => {
    const token = jwt.sign
        (
            { id, email, role_id },
            process.env.JWT_SECRET,
             { expiresIn: '1h' }
        );
    return token;
}


module.exports = createToken
