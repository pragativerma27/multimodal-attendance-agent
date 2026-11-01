const mongoose = require('mongoose');
const ClassroomSession = require('../models/ClassroomSession');
const memoryStore = require('../services/memoryStore');

// @desc    Get active classroom session
// @route   GET /api/sessions/active
// @access  Private
exports.getActiveSession = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({ success: true, data: memoryStore.session });
    }

    let session = await ClassroomSession.findOne({ isActive: true }).sort({ createdAt: -1 });
    if (!session) {
      session = await ClassroomSession.create(memoryStore.session);
    }

    res.json({ success: true, data: session });
  } catch (error) {
    res.json({ success: true, data: memoryStore.session });
  }
};

// @desc    Create a new classroom session
// @route   POST /api/sessions
// @access  Private
exports.createSession = async (req, res) => {
  try {
    const { title, courseCode, department, roomNumber, notes } = req.body;

    const newSess = {
      _id: 'sess_' + Date.now(),
      title: title || 'CS302: Computer Vision & Attendance Automation',
      courseCode: courseCode || 'CS302',
      department: department || 'Computer Science & Engineering',
      roomNumber: roomNumber || 'Room 404',
      instructorName: req.user ? req.user.name : 'Dr. Pragti Verma',
      isActive: true,
      totalStudents: 10,
      presentCount: 0,
      absentCount: 10,
      averageEngagement: 75,
      notes: notes || 'New interactive session',
    };

    memoryStore.session = newSess;

    if (mongoose.connection.readyState === 1) {
      await ClassroomSession.updateMany({ isActive: true }, { isActive: false, endTime: new Date() });
      await ClassroomSession.create(newSess);
    }

    res.status(201).json({ success: true, message: 'Classroom session initiated', data: newSess });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    End active classroom session
// @route   PUT /api/sessions/:id/end
// @access  Private
exports.endSession = async (req, res) => {
  try {
    memoryStore.session.isActive = false;
    if (mongoose.connection.readyState === 1) {
      await ClassroomSession.findByIdAndUpdate(req.params.id, { isActive: false, endTime: new Date() });
    }
    res.json({ success: true, message: 'Session concluded successfully', data: memoryStore.session });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all classroom sessions
// @route   GET /api/sessions
// @access  Private
exports.getAllSessions = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({ success: true, count: 1, data: [memoryStore.session] });
    }
    const sessions = await ClassroomSession.find().sort({ createdAt: -1 });
    res.json({ success: true, count: sessions.length, data: sessions });
  } catch (error) {
    res.json({ success: true, count: 1, data: [memoryStore.session] });
  }
};
