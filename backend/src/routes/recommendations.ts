import express, { Router } from 'express';
import auth from '../middleware/authMiddleware';
// @ts-ignore
import cache from '../middleware/cacheMiddleware';
import { getMarketRecommendations, getCollaborativeRecommendations } from '../controllers/recommendationController';

const router: Router = express.Router();

router.post('/market', auth, cache(3600), getMarketRecommendations);
router.get('/collaborative', auth, cache(3600), getCollaborativeRecommendations);

export default router;