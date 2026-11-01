const mongoose = require('mongoose');
const Engagement = require('../models/Engagement');
const memoryStore = require('../services/memoryStore');

// @desc    Record multimodal engagement telemetry snapshot
// @route   POST /api/engagement
// @access  Private
exports.recordEngagement = async (req, res) => {
  try {
    const {
      facePresenceRatio = 0.85,
      headMovementScore = 70,
      inactivityDurationSec = 10,
      audioActivityLevel = 45,
      movementVariance = 15.0,
      notes = '',
    } = req.body;

    const faceWeight = Math.min(1, Math.max(0, facePresenceRatio)) * 35;
    const movementWeight = (Math.min(100, Math.max(0, headMovementScore)) / 100) * 30;
    const activityWeight = Math.max(0, 1 - Math.min(inactivityDurationSec, 40) / 40) * 20;
    const audioWeight = (Math.min(100, Math.max(0, audioActivityLevel)) / 100) * 15;

    const overallScore = Math.round(faceWeight + movementWeight + activityWeight + audioWeight);

    let category = 'Moderate Engagement';
    if (overallScore >= 75) {
      category = 'High Engagement';
    } else if (overallScore < 50) {
      category = 'Low Engagement';
    }

    const doc = {
      _id: 'eng_' + Date.now(),
      overallScore,
      category,
      metrics: {
        facePresenceRatio: Number(facePresenceRatio.toFixed(2)),
        headMovementScore: Math.round(headMovementScore),
        inactivityDurationSec: Math.round(inactivityDurationSec),
        audioActivityLevel: Math.round(audioActivityLevel),
        movementVariance: Number(movementVariance.toFixed(1)),
      },
      notes: notes || 'Automated browser telemetry ingestion',
      timestamp: new Date(),
    };

    memoryStore.session.averageEngagement = overallScore;
    memoryStore.engagement.push({
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      score: overallScore,
      headMovement: Math.round(headMovementScore),
      audioLevel: Math.round(audioActivityLevel),
    });

    if (mongoose.connection.readyState === 1) {
      await Engagement.create({
        session: req.body.sessionId || memoryStore.session._id,
        ...doc,
      });
    }

    res.status(201).json({
      success: true,
      data: doc,
      sessionAverageEngagement: overallScore,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get engagement timeline data for charts
// @route   GET /api/engagement/session/:sessionId
// @access  Private
exports.getSessionEngagement = async (req, res) => {
  try {
    const raw = memoryStore.engagement;
    const records = raw.map((r, idx) => ({
      _id: 'eng_record_' + idx,
      timestamp: new Date(Date.now() - (raw.length - idx) * 3 * 60 * 1000),
      overallScore: r.score,
      category: r.score >= 75 ? 'High Engagement' : r.score >= 50 ? 'Moderate Engagement' : 'Low Engagement',
      metrics: {
        headMovementScore: r.headMovement,
        audioActivityLevel: r.audioLevel,
        inactivityDurationSec: 10,
      },
    }));

    res.json({
      success: true,
      count: records.length,
      distribution: {
        highPct: 65,
        moderatePct: 25,
        lowPct: 10,
      },
      data: records,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
