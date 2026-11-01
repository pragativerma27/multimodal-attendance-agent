const mongoose = require('mongoose');
const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const ClassroomSession = require('../models/ClassroomSession');
const Engagement = require('../models/Engagement');
const Recommendation = require('../models/Recommendation');
const { seedDatabase } = require('../services/demoDataSeeder');
const memoryStore = require('../services/memoryStore');

// @desc    Get complete dashboard summary metrics
// @route   GET /api/reports/dashboard
// @access  Private
exports.getDashboardSummary = async (req, res) => {
  try {
    // If MongoDB is offline, serve immediate in-memory demo data
    if (mongoose.connection.readyState !== 1) {
      return res.json({ success: true, data: memoryStore.getDashboardSummary() });
    }

    const totalStudents = await Student.countDocuments();
    let activeSession = await ClassroomSession.findOne({ isActive: true }).sort({ createdAt: -1 });

    if (!activeSession && totalStudents > 0) {
      activeSession = await ClassroomSession.findOne().sort({ createdAt: -1 });
    }

    let presentToday = 0;
    let absentToday = 0;
    let attendancePercentage = 0;

    if (activeSession) {
      presentToday = await Attendance.countDocuments({ session: activeSession._id, status: 'present' });
      absentToday = Math.max(0, totalStudents - presentToday);
      attendancePercentage = totalStudents > 0 ? Math.round((presentToday / totalStudents) * 100) : 0;
    }

    // Average engagement
    const recentEngagement = await Engagement.find()
      .sort({ timestamp: -1 })
      .limit(15);
    const avgEngagement =
      recentEngagement.length > 0
        ? Math.round(recentEngagement.reduce((sum, e) => sum + e.overallScore, 0) / recentEngagement.length)
        : 82;

    // Recent attendance list
    const recentAttendance = await Attendance.find()
      .populate('student', 'name studentId department rollNumber avatarUrl')
      .populate('session', 'title courseCode')
      .sort({ timestamp: -1 })
      .limit(8);

    // Weekly attendance trend
    const weeklyAttendance = [
      { day: 'Mon', attendance: 88, engagement: 82 },
      { day: 'Tue', attendance: 92, engagement: 85 },
      { day: 'Wed', attendance: 85, engagement: 79 },
      { day: 'Thu', attendance: 90, engagement: 86 },
      { day: 'Fri', attendance: 94, engagement: 88 },
      { day: 'Sat', attendance: 82, engagement: 74 },
      { day: 'Sun (Today)', attendance: attendancePercentage || 80, engagement: avgEngagement },
    ];

    // Engagement time series
    const engagementTrend =
      recentEngagement.length > 0
        ? recentEngagement.reverse().map((e) => ({
            time: new Date(e.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            score: e.overallScore,
            headMovement: e.metrics?.headMovementScore || 70,
            audioLevel: e.metrics?.audioActivityLevel || 40,
          }))
        : memoryStore.engagement;

    // Recent Recommendations
    const recentRecommendations = await Recommendation.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        totalStudents,
        presentToday,
        absentToday,
        attendancePercentage,
        averageEngagement: avgEngagement,
        activeSession: activeSession || memoryStore.session,
        recentAttendance: recentAttendance.length > 0 ? recentAttendance : memoryStore.attendance.slice(0, 8),
        weeklyAttendance,
        engagementTrend,
        recentRecommendations: recentRecommendations.length > 0 ? recentRecommendations : memoryStore.recommendations,
      },
    });
  } catch (error) {
    console.error('Dashboard summary error:', error);
    // Graceful fallback to memory store
    res.json({ success: true, data: memoryStore.getDashboardSummary() });
  }
};

// @desc    Export attendance as CSV stream
// @route   GET /api/reports/export/csv
// @access  Private
exports.exportAttendanceCSV = async (req, res) => {
  try {
    let attendanceRecords = [];

    if (mongoose.connection.readyState === 1) {
      attendanceRecords = await Attendance.find()
        .populate('student', 'name studentId department rollNumber email')
        .populate('session', 'title courseCode date')
        .sort({ timestamp: -1 });
    }

    if (!attendanceRecords || attendanceRecords.length === 0) {
      attendanceRecords = memoryStore.attendance;
    }

    let csvContent = 'Student ID,Student Name,Roll No,Department,Course Code,Session,Date,Time,Status,Verification Method,Confidence,Sustained Duration (s)\n';

    attendanceRecords.forEach((rec) => {
      const student = rec.student || {};
      const session = rec.session || {};
      const dateStr = rec.date ? new Date(rec.date).toISOString().split('T')[0] : 'N/A';
      const timeStr = rec.timestamp ? new Date(rec.timestamp).toLocaleTimeString() : 'N/A';

      csvContent += `"${student.studentId || 'N/A'}","${student.name || 'Unknown'}","${student.rollNumber || ''}","${student.department || ''}","${session.courseCode || ''}","${session.title || ''}","${dateStr}","${timeStr}","${rec.status}","${rec.method}","${Math.round((rec.confidence || 0.95) * 100)}%","${rec.sustainedDurationSeconds || 3.0}s"\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=attendance-report-${Date.now()}.csv`);
    return res.status(200).send(csvContent);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Trigger Seeder on-demand
// @route   POST /api/reports/seed-demo
// @access  Public
exports.triggerSeed = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const result = await seedDatabase();
      return res.json(result);
    }
    // If MongoDB is offline, reseed memory store
    const { sampleStudentsData } = require('../services/demoDataSeeder');
    memoryStore.students = sampleStudentsData.map((s, idx) => ({
      _id: `64f01234567890abcdef00${idx + 10}`,
      ...s,
    }));
    return res.json({
      success: true,
      message: 'Demo memory store re-seeded with 10 sample students (MongoDB offline).',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
