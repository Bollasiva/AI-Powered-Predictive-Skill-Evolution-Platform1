import express, { Router } from 'express';
import auth from '../middleware/authMiddleware';
// @ts-ignore
import cache from '../middleware/cacheMiddleware';
import { getJobs } from '../controllers/jobController';

const router: Router = express.Router();

// @route   GET /api/jobs
// @desc    Get real-time job listings
// @access  Private
router.get('/', auth, cache(3600), getJobs);
export default router;
