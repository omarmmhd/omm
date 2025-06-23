// src/routes/authRoutes.js
const express = require('express');
const bcrypt = require('bcrypt');
const { sql, dbConfig } = require('../config/db');
const router = express.Router();

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const profiles = [
        { table: 'StudentProfile', type: 'student' },
        { table: 'TeacherProfile', type: 'engineer' },
        { table: 'EmployeeProfile', type: 'employee' }
    ];

    try {
        await sql.connect(dbConfig);
        for (const profile of profiles) {
            const result = await sql.query`
                SELECT * FROM ${sql.ident(profile.table)} WHERE fullName = ${username}
            `;
            if (result.recordset.length > 0) {
                const user = result.recordset[0];
                const passwordMatch = await bcrypt.compare(password, user.password);
                if (passwordMatch) {
                    req.session.user = { username, type: profile.type };
                    return res.send({ message: '✅ تسجيل الدخول ناجح', usertype: profile.type });
                } else {
                    return res.status(401).send({ error: '❌ كلمة المرور غير صحيحة' });
                }
            }
        }
        res.status(401).send({ error: '❌ المستخدم غير موجود' });
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
