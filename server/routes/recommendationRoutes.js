const express = require('express');
const router = express.Router();
const {
  getRecommendations,
  updateRecommendationStatus,
  generateRecommendations,
} = require('../controllers/recommendationController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(getRecommendations);

router.put('/:id', updateRecommendationStatus);
router.post('/generate', generateRecommendations);

module.exports = router;
