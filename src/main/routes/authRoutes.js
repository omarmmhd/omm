// src/routes/authRoutes.js
const express = require('express');
const bcrypt = require('bcrypt');
const { sql, dbConfig } = require('../config/db');
const router = express.Router();

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    let user = null;
    let usertype = null;

    try {
        await sql.connect(dbConfig);

        // Try StudentProfile
        let result = await sql.query `SELECT * FROM StudentProfile WHERE fullName = ${username}`;
        if (result.recordset.length > 0) {
            user = result.recordset[0];
            usertype = 'student';
           
        }

        // Try TeacherProfile if not found
        if (!user) {
            result = await sql.query `SELECT * FROM TeacherProfile WHERE fullName = ${username}`;
            if (result.recordset.length > 0) {
                user = result.recordset[0];
                usertype = 'engineer';
            }
        }

        // Try EmployeeProfile if still not found
        if (!user) {
            result = await sql.query `SELECT * FROM EmployeeProfile WHERE fullName = ${username}`;
            if (result.recordset.length > 0) {
                user = result.recordset[0];
                usertype = 'employee';
            }
        }

        // User not found in any profile
        if (!user) {
            return res.status(401).send({ error: '❌ المستخدم غير موجود' });
        }

        // Validate password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).send({ error: '❌ الرجاء التحقق من صحة بيانات التسجيل' });
        }

        // Set session and respond
        req.session.user = { username };
        res.send({ message: '✅ تسجيل الدخول ناجح', usertype,studentId:usertype==='student'?user.id:null});

        

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