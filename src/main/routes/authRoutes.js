// src/routes/authRoutes.js
const express = require('express');
const bcrypt = require('bcrypt');
const { sql, dbConfig } = require('../config/db');
const router = express.Router();

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
let result2,result3,result
    try {
         await sql.connect(dbConfig);
let usertype;
          result = await sql.query
           `SELECT * FROM StudentProfile WHERE fullName = ${username}`
         ;

         if (result.recordset.length === 0) {
             result2 = await sql.query
            `SELECT * FROM TeacherProfile WHERE fullName = ${username}`
         ;
         if(result2.recordset.length ===0){
             result3 = await sql.query
         `SELECT * FROM EmployeeProfile WHERE fullName = ${username}`
         ;
         }
        

             
         }
        usertype=result.recordset.length>0?'student':'engineer';
         const user = result.recordset.length?result.recordset[0]:result2.recordset[0];
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

router.post('/logout', (req, res) => {
    req.session.destroy(() => {
        res.json({ success: true });
    });
});

module.exports = router;
