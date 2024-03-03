const express = require('express');
const router = express.Router();
const Mentor = require('../models/mentor');
const Student = require('../models/student');


router.post('/create', async (req, res) => {
    try {
        const student = new Student(req.body);
        await student.sa
        ve();
        res.status(201).json(student);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.put('/:studentId/assign-mentor', async (req, res) => {
    try {
        const student = await Student.findById(req.params.studentId);
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        const newMentor = await Mentor.findById(req.body.mentorId);
        if (!newMentor) {
            return res.status(404).json({ error: 'Mentor not found' });
        }

        if (student.mentor) {
            
            const prevMentor = await Mentor.findById(student.mentor);
            prevMentor.students = prevMentor.students.filter(id => id.toString() !== student._id.toString());
            await prevMentor.save();
        }

        student.mentor = newMentor._id;
        await student.save();

      
        newMentor.students.push(student._id);
        await newMentor.save();

        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:studentId/previous-mentor', async (req, res) => {
    try {
        const student = await Student.findById(req.params.studentId);
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        if (!student.mentor) {
            return res.status(404).json({ error: 'Student does not have a previous mentor' });
        }

        const prevMentor = await Mentor.findById(student.mentor);
        res.status(200).json(prevMentor);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
