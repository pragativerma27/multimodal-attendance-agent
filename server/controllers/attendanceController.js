const mongoose = require('mongoose');
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const ClassroomSession = require('../models/ClassroomSession');
const memoryStore = require('../services/memoryStore');

// @desc    Get attendance records with filtering
// @route   GET /api/attendance
// @access  Private
exports.getAttendance = async (req, res) => {
  try {
    const { status, studentId } = req.query;

    if (mongoose.connection.readyState !== 1) {
      let filtered = [...memoryStore.attendance];
      if (status && status !== 'all') {
        filtered = filtered.filter((r) => r.status === status);
      }
      if (studentId) {
        filtered = filtered.filter((r) => r.student?.studentId === studentId);
      }
      return res.json({ success: true, count: filtered.length, data: filtered });
    }

    const query = {};
    if (status && status !== 'all') query.status = status;

    const attendanceRecords = await Attendance.find(query)
      .populate('student', 'name studentId department rollNumber avatarUrl section')
      .populate('session', 'title courseCode')
      .sort({ timestamp: -1 });

    res.json({
      success: true,
      count: attendanceRecords.length,
      data: attendanceRecords,
    });
  } catch (error) {
    res.json({ success: true, count: memoryStore.attendance.length, data: memoryStore.attendance });
  }
};

// @desc    Mark attendance via sustained face presence or demo mode
// @route   POST /api/attendance/mark
// @access  Private
exports.markAttendance = async (req, res) => {
  try {
    const {
      studentId,
      method = 'sustained_presence',
      confidence = 0.95,
      sustainedDurationSeconds = 3.0,
      notes = '',
    } = req.body;

    if (!studentId) {
      return res.status(400).json({ success: false, message: 'Student ID is required' });
    }

    if (mongoose.connection.readyState !== 1) {
      // Offline fallback in memory store
      const student =
        memoryStore.students.find(
          (s) => s.studentId === studentId.toUpperCase() || s._id === studentId
        ) || memoryStore.students[0];

      // Duplicate check
      const existing = memoryStore.attendance.find(
        (a) => a.student?.studentId === student.studentId && a.status === 'present'
      );
      if (existing) {
        return res.status(409).json({
          success: false,
          isDuplicate: true,
          message: `Attendance already recorded for ${student.name} (${student.studentId}) at ${new Date(
            existing.timestamp
          ).toLocaleTimeString()}`,
          attendance: existing,
          student,
        });
      }

      const newRecord = {
        _id: 'att_' + Date.now(),
        student,
        session: memoryStore.session,
        date: new Date(),
        timestamp: new Date(),
        status: 'present',
        method,
        confidence,
        sustainedDurationSeconds,
        notes: notes || `Marked via ${method} (${sustainedDurationSeconds}s sustained)`,
      };

      memoryStore.attendance.unshift(newRecord);

      return res.status(201).json({
        success: true,
        message: `Attendance successfully confirmed for ${student.name}`,
        data: newRecord,
      });
    }

    // Direct MongoDB execution
    let student;
    if (studentId.match(/^[0-9a-fA-F]{24}$/)) {
      student = await Student.findById(studentId);
    } else {
      student = await Student.findOne({ studentId: studentId.toUpperCase().trim() });
    }

    if (!student) {
      return res.status(404).json({ success: false, message: `Student ID "${studentId}" was not found.` });
    }

    let session = await ClassroomSession.findOne({ isActive: true });
    if (!session) {
      session = await ClassroomSession.create({
        title: 'CS302: Multimodal Machine Learning & AI Systems',
        courseCode: 'CS302',
        isActive: true,
      });
    }

    const existingAttendance = await Attendance.findOne({
      student: student._id,
      session: session._id,
    });

    if (existingAttendance) {
      return res.status(409).json({
        success: false,
        isDuplicate: true,
        message: `Attendance already recorded for ${student.name} at ${new Date(existingAttendance.timestamp).toLocaleTimeString()}`,
        attendance: existingAttendance,
        student,
      });
    }

    const attendance = await Attendance.create({
      student: student._id,
      session: session._id,
      date: new Date(),
      timestamp: new Date(),
      status: 'present',
      method,
      confidence,
      sustainedDurationSeconds,
      notes: notes || 'Verified via continuous presence',
    });

    const populated = await Attendance.findById(attendance._id)
      .populate('student', 'name studentId department rollNumber avatarUrl section')
      .populate('session', 'title courseCode');

    res.status(201).json({
      success: true,
      message: `Attendance successfully confirmed for ${student.name}`,
      data: populated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Manual attendance correction
// @route   PUT /api/attendance/:id
// @access  Private
exports.updateAttendance = async (req, res) => {
  try {
    const { status, notes } = req.body;

    if (mongoose.connection.readyState !== 1) {
      const rec = memoryStore.attendance.find((a) => a._id === req.params.id);
      if (rec) {
        rec.status = status;
        rec.method = 'manual';
        if (notes) rec.notes = notes;
        return res.json({ success: true, message: `Status updated to ${status}`, data: rec });
      }
    }

    const attendance = await Attendance.findById(req.params.id);
    if (!attendance) {
      return res.status(404).json({ success: false, message: 'Attendance record not found' });
    }

    attendance.status = status;
    attendance.method = 'manual';
    if (notes) attendance.notes = notes;
    await attendance.save();

    res.json({ success: true, message: `Status updated to ${status}`, data: attendance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
