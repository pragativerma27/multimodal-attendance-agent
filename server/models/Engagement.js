const mongoose = require('mongoose');

const engagementSchema = new mongoose.Schema(
  {
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ClassroomSession',
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    overallScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    category: {
      type: String,
      enum: ['High Engagement', 'Moderate Engagement', 'Low Engagement'],
      required: true,
    },
    metrics: {
      facePresenceRatio: {
        type: Number,
        default: 0.85,
        min: 0,
        max: 1,
      },
      headMovementScore: {
        type: Number,
        default: 72,
        min: 0,
        max: 100,
      },
      inactivityDurationSec: {
        type: Number,
        default: 12,
        min: 0,
      },
      audioActivityLevel: {
        type: Number,
        default: 45,
        min: 0,
        max: 100,
      },
      movementVariance: {
        type: Number,
        default: 18.5,
        min: 0,
      },
    },
    notes: {
      type: String,
      default: 'Automated multimodal telemetry snapshot',
    },
    privacyDisclaimer: {
      type: String,
      default:
        'Behavioral and movement indicators are proxy signals and do not definitively measure internal cognitive attention or learning comprehension.',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Engagement', engagementSchema);
