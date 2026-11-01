const express = require('express');
const router = express.Router();
const { processLiveTelemetry, uploadAudio } = require('../controllers/audioController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.use(protect);

router.post('/telemetry', processLiveTelemetry);
router.post('/upload', upload.single('audio'), uploadAudio);

module.exports = router;
