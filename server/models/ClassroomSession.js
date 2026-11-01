const mongoose = require('mongoose');

const classroomSessionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Session title is required'],
      trim: true,
      default: 'CS302: Advanced Artificial Intelligence & Computer Vision',
    },
    courseCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      default: 'CS302',
    },
    department: {
      type: String,
      default: 'Computer Science & Engineering',
    },
    roomNumber: {
      type: String,
      default: 'Room 404 / AI Vision Lab',
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    instructorName: {
      type: String,
      default: 'Dr. A. Sharma',
    },
    date: {
      type: Date,
      default: Date.now,
    },
    startTime: {
      type: Date,
      default: Date.now,
    },
    endTime: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    totalStudents: {
      type: Number,
      default: 0,
    },
    presentCount: {
      type: Number,
      default: 0,
    },
    absentCount: {
      type: Number,
      default: 0,
    },
    averageEngagement: {
      type: Number,
      default: 78,
      min: 0,
      max: 100,
    },
    notes: {
      type: String,
      default: 'Multimodal session with continuous facial verification & audio activity analysis',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ClassroomSession', classroomSessionSchema);
