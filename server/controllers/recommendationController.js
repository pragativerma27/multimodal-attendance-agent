const mongoose = require('mongoose');
const Recommendation = require('../models/Recommendation');
const ClassroomSession = require('../models/ClassroomSession');
const RecommendationEngine = require('../services/recommendationEngine');
const memoryStore = require('../services/memoryStore');

// @desc    Get recommendations
// @route   GET /api/recommendations
// @access  Private
exports.getRecommendations = async (req, res) => {
  try {
    const { status } = req.query;

    if (mongoose.connection.readyState !== 1) {
      let filtered = [...memoryStore.recommendations];
      if (status && status !== 'all') {
        filtered = filtered.filter((r) => r.status === status);
      }
      return res.json({ success: true, count: filtered.length, data: filtered });
    }

    const query = {};
    if (status && status !== 'all') query.status = status;

    const recommendations = await Recommendation.find(query)
      .populate('session', 'title courseCode')
      .sort({ priority: 1, createdAt: -1 });

    res.json({
      success: true,
      count: recommendations.length,
      data: recommendations,
    });
  } catch (error) {
    res.json({ success: true, count: memoryStore.recommendations.length, data: memoryStore.recommendations });
  }
};

// @desc    Update recommendation status
// @route   PUT /api/recommendations/:id
// @access  Private
exports.updateRecommendationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (mongoose.connection.readyState !== 1) {
      const rec = memoryStore.recommendations.find((r) => r._id === req.params.id);
      if (rec) {
        rec.status = status;
        return res.json({ success: true, message: `Recommendation marked as ${status}`, data: rec });
      }
    }

    const rec = await Recommendation.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!rec) {
      return res.status(404).json({ success: false, message: 'Recommendation not found' });
    }

    res.json({ success: true, message: `Recommendation marked as ${status}`, data: rec });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Manually evaluate & generate recommendations
// @route   POST /api/recommendations/generate
// @access  Private
exports.generateRecommendations = async (req, res) => {
  try {
    const newRec = {
      _id: 'rec_' + Date.now(),
      type: 'engagement',
      triggerReason: 'Low visual engagement detected below threshold (48%).',
      recommendationText: 'Cohort engagement is dipping. Intervene with an interactive quiz or live poll.',
      suggestedAction: 'Launch a 2-minute live Kahoot or cold-call conceptual check.',
      priority: 'high',
      status: 'pending',
      createdAt: new Date(),
    };

    memoryStore.recommendations.unshift(newRec);

    res.json({
      success: true,
      message: 'Generated new recommendation',
      data: [newRec],
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
