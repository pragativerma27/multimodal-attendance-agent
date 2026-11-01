const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema(
  {
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ClassroomSession',
    },
    type: {
      type: String,
      enum: ['engagement', 'inactivity', 'participation', 'acoustics', 'break'],
      required: true,
    },
    triggerReason: {
      type: String,
      required: true,
    },
    recommendationText: {
      type: String,
      required: true,
    },
    suggestedAction: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      enum: ['high', 'medium', 'low'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['pending', 'applied', 'dismissed'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Recommendation', recommendationSchema);
