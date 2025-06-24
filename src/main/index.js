// src/main/index.js
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const {sql,dbConfig} =require('./config/db');
const multer =require('multer');
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
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // e.g., 1629972839.mp4
    }
  });
  
  const upload = multer({ storage });
  const uploadDir ='uploads'
 
app.post('/upload', upload.single('media'), async (req, res) => {
    const file = req.file;
  
    if(!fs.existsSync(uploadDir)){
        fs.mkdirSync(uploadDir)
      }
    if (!file) return res.status(400).send('No file uploaded');
  
    const fileBuffer = fs.readFileSync(file.path);
  
    try {
      const pool = await sql.connect(dbConfig);
      await pool.request()
        .input('FileName', sql.NVarChar, file.originalname)
        .input('MimeType', sql.NVarChar, file.mimetype)
        .input('FileData', sql.VarBinary(sql.MAX), fileBuffer)
        .query(
         `INSERT INTO MediaFiles (FileName, MimeType, FileData)
          VALUES (@FileName, @MimeType, @FileData)`
        );
  
      fs.unlinkSync(file.path); // Clean up temp file
      res.send('File uploaded to database!');
    } catch (err) {
      console.error(err);
      res.status(500).send('Upload failed');
    }
  });
// Start server
const PORT = 4200;
app.listen(PORT, () => {
    console.log(`✅ السيرفر شغال على http://localhost:${PORT}`);
});
