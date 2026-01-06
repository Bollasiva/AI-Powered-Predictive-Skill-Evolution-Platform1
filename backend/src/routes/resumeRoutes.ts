import express, { Router, Request, Response } from 'express';
import multer from 'multer';
import { parseResume } from '../services/aiService';
import User from '../models/user';
import authMiddleware from '../middleware/authMiddleware';
import fs from 'fs';

const router: Router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', authMiddleware, upload.single('resume'), async (req: Request, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ msg: 'No file uploaded' });

    // 1. Call AI Service (Returns { technical_skills, soft_skills, role, seniority })
    const analysis = await parseResume(req.file.path);
    const { technical_skills, soft_skills, role, seniority } = analysis;

    // 2. Update User Profile in DB
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    // Helper to map AI seniority to DB proficiency
    const mapSeniorityToProficiency = (seniority: string): string => {
      const s = seniority?.toLowerCase() || '';
      if (s.includes('senior') || s.includes('lead')) return 'Advanced';
      if (s.includes('mid') || s.includes('intermediate')) return 'Intermediate';
      if (s.includes('junior') || s.includes('entry')) return 'Beginner';
      if (s.includes('expert')) return 'Expert';
      return 'Beginner'; // Default
    };

    // Add new skills, avoiding duplicates
    const skillsToAdd = (technical_skills as string[])
      .filter(skill => !user.skills.some((existing: any) => existing.skillName.toLowerCase() === skill.toLowerCase()))
      .map(name => ({
        skillName: name,
        proficiency: mapSeniorityToProficiency(seniority) as any
      }));

    user.skills.push(...skillsToAdd);

    // Store extra insights if your model supports them (optional)
    if (role && role !== "Unknown") (user as any).careerInterest = role;

    await user.save();

    // 3. Cleanup local file
    if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);

    res.json({
      msg: 'Resume analyzed successfully',
      skillsAdded: skillsToAdd,
      insights: { role, seniority, soft_skills }
    });
  } catch (error: any) {
    console.error("Upload Error:", error);
    res.status(500).json({ msg: 'Server Error during resume processing', error: error.message });
  }
});

export default router;