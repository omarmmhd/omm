// src/middleware/auth.js
function authMiddleware(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    }
    res.redirect('/login.html');
}

module.exports = authMiddleware;