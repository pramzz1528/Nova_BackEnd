const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // Get token from header
    let token = req.header('x-auth-token');

    // Also check for Authorization: Bearer <token>
    const authHeader = req.header('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    }

    // Check if no token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // Verify token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        console.error('Auth Middleware Error:', err.message);
        res.status(401).json({ msg: 'Token is not valid' });
    }
};
