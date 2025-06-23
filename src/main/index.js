// src/main/index.js
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));
app.use(session({
    secret: 'someSecretKey',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000, secure: false }
}));

// Auth middleware
const authMiddleware = require('./middleware/auth');

// Routes
app.use('/', require('./routes/authRoutes'));
app.use('/', require('./routes/registerRoutes'));

// View routes
app.get('/views/*path', authMiddleware, (req, res) => {
    const relativePath = req.path.replace('/views/', '') || 'index.html';

    if (!/^[\w\-/]+\.html$/.test(relativePath)) {
        return res.status(400).send('Invalid page name.');
    }

    const filePath = path.normalize(path.join(__dirname, '../views', relativePath));

    if (!filePath.startsWith(path.join(__dirname, '../views'))) {
        return res.status(400).send('Invalid page path.');
    }

    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) return res.status(404).send('Page not found.');
        res.sendFile(filePath);
    });
});

// Start server
const PORT = 4200;
app.listen(PORT, () => {
    console.log(`✅ السيرفر شغال على http://localhost:${PORT}`);
});
