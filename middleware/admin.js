const jwt = require('jsonwebtoken');
const User = require('../models/users');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'repminder_secret_token_2l|.*8pou]X-m32r');
        const userId = decodedToken.userId;
        if (!userId) {
            throw 'Invalid user ID';
        } else {
            User.findOne({ _id: userId, admin: true })
                .then(() => next())
                .catch(error => res.status(401).json(new Error('Need admin rights.')));
        }
    } catch {
        res.status(401).json({
            error: new Error('Invalid request!')
        });
    }
};