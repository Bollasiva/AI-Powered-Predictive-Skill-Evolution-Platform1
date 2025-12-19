const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const User = require('../models/user');

// @route   PUT /api/users/skills
// @desc    Update user skills
// @access  Private
router.put('/skills', auth, async (req, res) => {
  try {
    const { skills } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { skills: skills } },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;