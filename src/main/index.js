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

    if (!/^[\w\-/]+\.(html|css|js|png|jpg|jpeg|gif|woff|woff2|ttf|svg)$/.test(relativePath)) {
        return res.status(400).send('Invalid file name.');
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
  app.get('/files', async (req, res) => {
    try {
      const pool = await sql.connect(dbConfig);
      const result = await pool.request()
        .query('SELECT Id, FileName, UploadDate FROM MediaFiles ORDER BY UploadDate DESC');
  
      res.json(result.recordset); // Send array of files as JSON
    } catch (err) {
      console.error(err);
      res.status(500).send('Failed to get files');
    }
  });
  app.get('/download/:id', async (req, res) => {
    const id = parseInt(req.params.id);
  
    try {
      const pool = await sql.connect(dbConfig);
      const result = await pool.request()
        .input('Id', sql.Int, id)
        .query(`SELECT FileName, MimeType, FileData FROM MediaFiles WHERE Id = @Id`);
  
      if (!result.recordset[0]) {
        return res.status(404).send('File not found');
      }
  
      const file = result.recordset[0];
      res.setHeader('Content-Disposition', `attachment; filename="${file.FileName}"`);
      res.setHeader('Content-Type', file.MimeType);
      res.send(file.FileData);
    } catch (err) {
      console.error(err);
      res.status(500).send('Download failed');
    }
  });
  app.use(express.json()); // Add this if you haven’t

app.post('/ads', async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).send('Title and content are required');
  }

  try {
    const pool = await sql.connect(dbConfig);
    await pool.request()
      .input('Title', sql.NVarChar, title)
      .input('Content', sql.NVarChar(sql.MAX), content)
      .query(
        `INSERT INTO Advertisements (Title, Content)
        VALUES (@Title, @Content)`
      );

    res.send('Advertisement created');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to create advertisement');
  }
});

app.get('/ads', async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .query('SELECT Id, Title, Content, UploadDate FROM Advertisements ORDER BY UploadDate DESC');

    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to load advertisements');
  }
});
// Start server
const PORT = 4200;
app.listen(PORT, () => {
    console.log(`✅ السيرفر شغال على http://localhost:${PORT}`);
});

app.post('/marks', async (req, res) => {
  const { studentId, subject, exam, mark, maxMark } = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    const student = await pool.request().query(`SELECT id FROM StudentProfile WHERE Studentid =${studentId}`)
    await pool.request()
    .input('StudentIdentifier',sql.UniqueIdentifier,student.recordset[0].id)
      .input('StudentID', sql.NVarChar, studentId)
      .input('Subject', sql.NVarChar, subject)
      .input('Exam', sql.NVarChar, exam)
      .input('Mark', sql.Int, mark)
      .input('MaxMark', sql.Int, maxMark)
      .query(
        `INSERT INTO StudentMarks (StudentIdentifier,StudentId, Subject, Exam, Mark, MaxMark)
        VALUES (@StudentIdentifier,@StudentId, @Subject, @Exam, @Mark, @MaxMark)`
      );
    res.send('Mark uploaded successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error uploading mark');
  }
});

app.get('/marks/:studentId', async (req, res) => {
  const studentId = req.params.studentId;
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .input('StudentIdentifier', sql.UniqueIdentifier, studentId)
      .query(
        `SELECT Subject, Exam, Mark, MaxMark, UploadDate
        FROM StudentMarks
        WHERE StudentIdentifier = @StudentIdentifier
        ORDER BY UploadDate DESC`
      );
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send('Error fetching marks');
  }
});