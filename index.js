const express = require('express');
const bcrypt = require('bcrypt');
const {v4:uuidv4} = require('uuid');
const bodyParser = require('body-parser');
const sql = require('mssql');
const session = require('express-session');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());
app.use(express.static('src/public'));
app.use(session({
    secret: 'someSecretKey',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60,
        secure: false
    }
}));

// Your existing generic auth middleware (example)
function authMiddleware(req, res, next) {
    if (req.session && req.session.user) {
        next();
    } else {
        res.redirect('/login.html');
    }
}

// Route to serve any HTML file inside views/, including nested folders
app.get('/views/*path', authMiddleware, (req, res) => {
    const relativePath = req.path.replace('/views/', '') || 'index.html'; // Default to index.html if no path is provided

    if (!/^[a-zA-Z0-9/_-]+\.html$/.test(relativePath)) {
        return res.status(400).send('Invalid page name.');
    }

    const filePath = path.normalize(path.join(__dirname, 'src/views', relativePath));
    if (!filePath.startsWith(path.join(__dirname, 'src/views'))) {
        return res.status(400).send('Invalid page name.');
    }

    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            return res.status(404).send('Page not found.');
        }
        res.sendFile(filePath);
    });
});


const dbConfig = {
    user:'omm',
    password:'omarmdmhd',
    server: 'localhost',
    database: 'LearnGateDB',
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

app.post('/register', async (req, res) => {
    const {studentid, password,sec,year,gen,fullname} = req.body;
    const userid = uuidv4();
    try {
        const hashedPassword = await bcrypt.hash(password,10);
        await sql.connect(dbConfig);
        await sql.query(`INSERT INTO StudentProfile (fullName , StudentID , password  , section ,year , gender) VALUES ('${fullname}' , '${studentid}' ,'${hashedPassword}', '${sec}' ,'${year}' ,'${gen}')`);
        res.send({ message: 'تم التسجيل بنجاح' });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'حدث خطأ بالسيرفر' });
    }
});
/**/ app.post('/registerEngineer', async (req, res) => {
    const {engnumber,engemail ,password,spec,startdate,gen,fullname} = req.body;
    const userid = uuidv4();
    try {
        const hashedPassword = await bcrypt.hash(password,10);
        await sql.connect(dbConfig);
        await sql.query(`INSERT INTO TeacherProfile (fullName , engNumber, password  , specialty ,startDate , gender ,engEmail) VALUES ('${fullname}' , '${engnumber}' ,'${hashedPassword}', '${spec}' ,'${startdate}' ,'${gen}','${engemail}')`);
        res.send({ message: 'تم التسجيل بنجاح' });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'حدث خطأ بالسيرفر' });
    }
});
/***/ app.post('/registerEmployee', async (req, res) => {
    const {empnumber,empemail ,password,spec,startdate,gen,fullname} = req.body;
    const userid = uuidv4();
    try {
        const hashedPassword = await bcrypt.hash(password,10);
        await sql.connect(dbConfig);
        await sql.query(`INSERT INTO EmployeeProfile (fullName , empNumber, password  , specialty ,startDate , gender ,empEmail) VALUES ('${fullname}' , '${empnumber}' ,'${hashedPassword}', '${spec}' ,'${startdate}' ,'${gen}','${empemail}')`);
        res.send({ message: 'تم التسجيل بنجاح' });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'حدث خطأ بالسيرفر' });
    }
});
/**/
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
         await sql.connect(dbConfig);
let usertype;
         const result = await sql.query
            `SELECT * FROM StudentProfile WHERE fullName = ${username}`
         ;

         if (result.recordset.length === 0) {
            const result2 = await sql.query
            `SELECT * FROM TeacherProfile WHERE fullName = ${username}`
         ;
         if(result2.recordset.length ===0){
            const result3 = await sql.query
         `SELECT * FROM EmployeeProfile WHERE fullName = ${username}`
         ;
         }
        

             return res.status(401).send({ error: '❌ المستخدم غير موجود' });
         }
        usertype=result.recordset.length>0?'student':'engineer';'employee'
         const user = result.recordset[0];
         const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {

            req.session.user = { username };
            res.send({ message: '✅ تسجيل الدخول ناجح', usertype });
        } else {
            res.status(401).send({ error: '❌ الرجاء التحقق من صحة بيانات التسجيل' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: '❌ خطأ في السيرفر' });
    }
});
app.post('/logout', (req, res) => {
    req.session.destroy(() => {
        res.json({ success: true });
    });
});
app.listen(4200, (error) => {
    if(error){
        console.log('error: '+ error);
    }
    else{console.log('السيرفر شغال على http://localhost:4200');}
});
