const express = require('express');
const router = express.Router();
const Mentor = require('../models/mentor');
const Student = require('../models/student');

router.post('/create', async (req, res) => {
    try {
        const mentor = new Mentor(req.body);
        await mentor.save();
        res.status(201).json(mentor);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/:mentorId/assign-student', async (req, res) => {
    try {
        const mentor = await Mentor.findById(req.params.mentorId);
        if (!mentor) {
            return res.status(404).json({ error: 'Mentor not found' });
        }

        const student = new Student(req.body);
        student.mentor = mentor._id;

        await student.save();
        mentor.students.push(student._id);
        await mentor.save();

        res.status(201).json(student);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:mentorId/students', async (req, res) => {
    try {
        const mentor = await Mentor.findById(req.params.mentorId).populate('students');
        if (!mentor) {
            return res.status(404).json({ error: 'Mentor not found' });
        }

        res.status(200).json(mentor.students);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
