import express, { Router, Request, Response } from 'express';
import auth from '../middleware/authMiddleware';
import User from '../models/user';

const router: Router = express.Router();

// @route   PUT /api/users/skills
// @desc    Update user skills
// @access  Private
router.put('/skills', auth, async (req: Request, res: Response) => {
  try {
    const { skills } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { skills: skills } },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;