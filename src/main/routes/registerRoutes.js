// src/routes/registerRoutes.js
const express = require('express');
const bcrypt = require('bcrypt');
const { sql, dbConfig } = require('../config/db');
const {v4:uuidv4} = require('uuid');
const router = express.Router();

router.post('/register', async (req, res) => {
    const { studentid, password, sec, year, gen, fullname } = req.body;
    const id = uuidv4();
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await sql.connect(dbConfig);
        await sql.query`
            INSERT INTO StudentProfile (id,fullName, StudentID, password, section, year, gender)
            VALUES (${id} , ${fullname}, ${studentid}, ${hashedPassword}, ${sec}, ${year}, ${gen})
        `;
        res.send({ message: '✅ تم التسجيل بنجاح' });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: '❌ حدث خطأ بالسيرفر' });
    }
});

router.post('/registerEngineer', async (req, res) => {
    const { engnumber, engemail, password, spec, startdate, gen, fullname } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await sql.connect(dbConfig);
        await sql.query`
            INSERT INTO TeacherProfile (fullName, engNumber, password, specialty, startDate, gender, engEmail)
            VALUES (${fullname}, ${engnumber}, ${hashedPassword}, ${spec}, ${startdate}, ${gen}, ${engemail})
        `;
        res.send({ message: '✅ تم التسجيل بنجاح' });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: '❌ حدث خطأ بالسيرفر' });
    }
});

router.post('/registerEmployee', async (req, res) => {
    const { empnumber, empemail, password, spec, startdate, gen, fullname } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await sql.connect(dbConfig);
        await sql.query`
            INSERT INTO EmployeeProfile (fullName, empNumber, password, specialty, startDate, gender, empEmail)
            VALUES (${fullname}, ${empnumber}, ${hashedPassword}, ${spec}, ${startdate}, ${gen}, ${empemail})
        `;
        res.send({ message: '✅ تم التسجيل بنجاح' });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: '❌ حدث خطأ بالسيرفر' });
    }
});

module.exports = router;
