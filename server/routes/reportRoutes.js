const express = require('express');
const router = express.Router();
const {
  getDashboardSummary,
  exportAttendanceCSV,
  triggerSeed,
} = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');

// Seed endpoint can be triggered to bootstrap demo data
router.post('/seed-demo', triggerSeed);

// Protected report endpoints
router.get('/dashboard', protect, getDashboardSummary);
router.get('/export/csv', protect, exportAttendanceCSV);

module.exports = router;
