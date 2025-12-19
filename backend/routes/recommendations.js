const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware'); // Import Auth Middleware
const cache = require('../middleware/cacheMiddleware');
const { getMarketRecommendations, getCollaborativeRecommendations } = require('../controllers/recommendationController');

/**
 * @swagger
 * /api/recommendations/market:
 *   post:
 *     summary: Get AI-powered market recommendations
 *     tags: [Recommendations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               skills:
 *                 type: array
 *                 items:
 *                   type: object
 *               careerInterest:
 *                 type: string
 *     responses:
 *       200:
 *         description: List of recommendations
 */
router.post('/market', auth, cache(3600), getMarketRecommendations);

/**
 * @swagger
 * /api/recommendations/collaborative:
 *   get:
 *     summary: Get peer-based recommendations
 *     tags: [Recommendations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of peer recommendations
 */
router.get('/collaborative', auth, cache(3600), getCollaborativeRecommendations);

module.exports = router;