const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'repminder_secret_token_2l|.*8pou]X-m32r');
        const userId = decodedToken.userId;
        if (!userId) {
            res.status(401).json({
                error: new Error('Invalid userId.')
            });
        } else {
            next();
        }
    } catch {
        res.status(401).json({
            error: new Error('Invalid request.')
        });
    }
};