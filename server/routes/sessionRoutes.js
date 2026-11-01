const express = require('express');
const router = express.Router();
const {
  getActiveSession,
  createSession,
  endSession,
  getAllSessions,
} = require('../controllers/sessionController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(getAllSessions)
  .post(createSession);

router.get('/active', getActiveSession);
router.put('/:id/end', endSession);

module.exports = router;
