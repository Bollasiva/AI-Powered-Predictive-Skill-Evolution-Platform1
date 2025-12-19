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

    // 1. Call AI Service (Returns { technical_skills, soft_skills, role, seniority })
    const analysis = await parseResume(req.file.path);
    const { technical_skills, soft_skills, role, seniority } = analysis;

    // 2. Update User Profile in DB
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    // Add new skills, avoiding duplicates
    const skillsToAdd = technical_skills
      .filter(skill => !user.skills.some(existing => existing.skillName.toLowerCase() === skill.toLowerCase()))
      .map(name => ({ skillName: name, proficiency: seniority || 'Beginner' }));

    user.skills.push(...skillsToAdd);

    // Store extra insights if your model supports them (optional)
    if (role && role !== "Unknown") user.careerInterest = role;

    await user.save();

    // 3. Cleanup local file
    const fs = require('fs');
    if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);

    res.json({
      msg: 'Resume analyzed successfully',
      skillsAdded: skillsToAdd,
      insights: { role, seniority, soft_skills }
    });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ msg: 'Server Error during resume processing', error: error.message });
  }
});

module.exports = router;