const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware'); // Import Auth Middleware
const { getMarketRecommendations, getCollaborativeRecommendations } = require('../controllers/recommendationController');

// FIX: Added 'auth' as the second argument to protect these routes
router.post('/market', auth, getMarketRecommendations);
router.get('/collaborative', auth, getCollaborativeRecommendations);

module.exports = router;