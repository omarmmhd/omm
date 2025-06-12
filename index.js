const express = require('express');
const bcrypt = require('bcrypt');
const {v4:uuidv4} = require('uuid');
const bodyParser = require('body-parser');
const sql = require('mssql');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

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
    const { username, password } = req.body;
const userid = uuidv4();
    try {
      const hashedPassword = await bcrypt.hash(password,10);
        await sql.connect(dbConfig);
        await sql.query(`INSERT INTO Table_2 (fullName , StudentID , password) VALUES ('${username}' , '${userid}' ,'${hashedPassword}')`);
        res.send({ message: 'تم التسجيل بنجاح' });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'حدث خطأ بالسيرفر' });
    }
});
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
      await sql.connect(dbConfig);

      const result = await sql.query
         `SELECT * FROM Table_2 WHERE fullName = ${username}`
      ;

      if (result.recordset.length === 0) {11
          return res.status(401).send({ error: '❌ المستخدم غير موجود' });
      }

      const user = result.recordset[0];
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
          res.send({ message: '✅ تسجيل الدخول ناجح' });
      } else {
          res.status(401).send({ error: '❌ كلمة المرور غير صحيحة' });
      }
  } catch (err) {
      console.error(err);
      res.status(500).send({ error: '❌ خطأ في السيرفر' });
  }
});
app.listen(4200, (error) => {
  if(error){
    console.log('error: '+ error);
  }
  else{console.log('السيرفر شغال على http://localhost:4200');}
});