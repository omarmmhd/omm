// src/routes/authRoutes.js
const express = require('express');
const bcrypt = require('bcrypt');
const { sql, dbConfig } = require('../config/db');
const router = express.Router();

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        await sql.connect(dbConfig);

        const profiles = [
            { table: 'StudentProfile', type: 'student' },
            { table: 'TeacherProfile', type: 'teacher' },
            { table: 'EmployeeProfile', type: 'engineer' }
        ];

        let user = null;
        let usertype = null;

        for (const profile of profiles) {
            const result = await sql.query `SELECT * FROM ${sql.ident(profile.table)} WHERE fullName = ${username}`;

            if (result.recordset.length > 0) {
                user = result.recordset[0];
                usertype = profile.type;
                break;
            }
        }

        if (!user) {
            return res.status(401).send({ error: '❌ المستخدم غير موجود' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
            req.session.user = { username, usertype };
            res.send({ message: '✅ تسجيل الدخول ناجح', usertype });
        } else {
            res.status(401).send({ error: '❌ كلمة المرور غير صحيحة' });
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
