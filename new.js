const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mssql');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

app.use(cors());
app.use(bodyParser.json());

// إعدادات الاتصال بقاعدة البيانات
const config = {
    user: 'اسم_المستخدم',       // مثل sa
    password: 'كلمة_المرور',     // كلمة المرور للمستخدم
    server: 'اسم_الجهاز\\SQLEXPRESS',  // مثل: LAPTOP\\SQLEXPRESS
    database: 'LearnGateDB',   // مثل: LessonDB
    options: {
        encrypt: false,   // اجعلها true إذا كنت تستخدم Azure
        trustServerCertificate: true
    }
};

// استلام بيانات التسجيل من صفحة HTML
app.post('/register', async (req, res) => {
    const { studentId, firstName, lastName, major, year, gender, password } = req.body;

    try {
        await sql.connect(config);
        const result = await sql.query
          (`INSERT INTO StudentProfile (StudentID, StudentName, major, year, gender, password)`)
          (`VALUES (${studentId}, ${firstName + ' ' + lastName}, ${major}, ${year}, ${gender}, ${password})`)
        ;
        res.json({ message: 'تم إنشاء الحساب بنجاح' });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'فشل في إدخال البيانات' });
    }
});

// بدء الخادم
app.listen(4200, (error) => {
  if(error){
    console.log('error: '+ error);
  }
  else{console.log('السيرفر شغال على http://localhost:4200');}
});