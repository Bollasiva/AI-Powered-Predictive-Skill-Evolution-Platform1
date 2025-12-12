const express = require('express');
const multer = require('multer');
const { parseResume } = require('../services/aiService');
const User = require('../models/user'); // Assuming you have a User model
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', authMiddleware, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ msg: 'No file uploaded' });

    // 1. Call AI Service
    const extractedSkills = await parseResume(req.file.path);

    // 2. Update User Profile in DB
    const user = await User.findById(req.user.id);
    // Add new skills, avoiding duplicates
    const newSkills = extractedSkills.filter(skill => 
      !user.skills.some(existing => existing.name.toLowerCase() === skill.toLowerCase())
    );
    
    const skillsToAdd = newSkills.map(name => ({ name, level: 'Beginner' }));
    user.skills.push(...skillsToAdd);
    await user.save();

    // 3. Cleanup local file
    const fs = require('fs');
    fs.unlinkSync(req.file.path);

    res.json({ msg: 'Resume processed', skillsAdded: skillsToAdd });
  } catch (error) {
    res.status(500).json({ msg: 'Server Error', error: error.message });
  }
});

module.exports = router;