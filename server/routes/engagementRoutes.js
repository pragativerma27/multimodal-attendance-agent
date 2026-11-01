const express = require('express');
const router = express.Router();
const {
  recordEngagement,
  getSessionEngagement,
} = require('../controllers/engagementController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', recordEngagement);
router.get('/session/:sessionId', getSessionEngagement);

module.exports = router;
