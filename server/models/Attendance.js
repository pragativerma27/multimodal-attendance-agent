const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Student reference is required'],
    },
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ClassroomSession',
      required: [true, 'Session reference is required'],
    },
    date: {
      type: Date,
      default: Date.now,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['present', 'absent', 'late'],
      default: 'present',
    },
    method: {
      type: String,
      enum: ['face_recognition', 'sustained_presence', 'manual', 'demo'],
      default: 'sustained_presence',
    },
    confidence: {
      type: Number,
      min: 0,
      max: 1,
      default: 0.95,
    },
    sustainedDurationSeconds: {
      type: Number,
      default: 3.0,
      min: 0,
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    notes: {
      type: String,
      default: 'Verified via continuous presence detector',
    },
  },
  { timestamps: true }
);

// Prevent duplicate attendance for the same student in the same session
attendanceSchema.index({ student: 1, session: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
