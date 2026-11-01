const AudioAnalysisService = require('../services/audioAnalysisService');

// @desc    Process live microphone telemetry slice
// @route   POST /api/audio/telemetry
// @access  Private
exports.processLiveTelemetry = async (req, res) => {
  try {
    const { averageRms, peakLevel, speechFrequencyRatio } = req.body;

    const analysis = AudioAnalysisService.analyzeAudioMetrics({
      averageRms: parseFloat(averageRms) || 0.05,
      peakLevel: parseFloat(peakLevel) || 0.2,
      speechFrequencyRatio: parseFloat(speechFrequencyRatio) || 0.5,
    });

    res.json({ success: true, data: analysis });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Upload classroom audio recording for offline acoustic analysis
// @route   POST /api/audio/upload
// @access  Private
exports.uploadAudio = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an audio file (MP3, WAV, OGG)' });
    }

    const report = await AudioAnalysisService.analyzeUploadedFile(req.file);

    res.json({
      success: true,
      message: 'Audio analyzed successfully',
      data: report,
    });
  } catch (error) {
    console.error('Audio upload error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
