// Memory Store Fallback for zero-config evaluation when MongoDB is offline
const { sampleStudentsData } = require('./demoDataSeeder');

class MemoryStore {
  constructor() {
    this.students = sampleStudentsData.map((s, idx) => ({
      _id: `64f01234567890abcdef00${idx + 10}`,
      ...s,
    }));

    this.session = {
      _id: '64f01234567890abcdef0099',
      title: 'CS302: Multimodal Machine Learning & AI Systems',
      courseCode: 'CS302',
      department: 'Computer Science & Engineering',
      roomNumber: 'Room 404 / AI Vision Lab',
      instructorName: 'Dr. Pragti Verma',
      isActive: true,
      totalStudents: this.students.length,
      presentCount: 8,
      absentCount: 2,
      averageEngagement: 84,
    };

    this.attendance = this.students.map((student, i) => {
      const isPresent = i < 8;
      return {
        _id: `att_64f01234567890abcdef00${i + 10}`,
        student: { ...student },
        session: { ...this.session },
        date: new Date(),
        timestamp: isPresent ? new Date(Date.now() - (40 - i * 3) * 60 * 1000) : new Date(),
        status: isPresent ? 'present' : 'absent',
        method: isPresent ? (i % 2 === 0 ? 'sustained_presence' : 'face_recognition') : 'manual',
        confidence: isPresent ? 0.95 : 0,
        sustainedDurationSeconds: isPresent ? 3.2 : 0,
        notes: isPresent ? 'Sustained presence verified' : 'Absent during session',
      };
    });

    this.recommendations = [
      {
        _id: 'rec_1',
        type: 'engagement',
        triggerReason: 'Sustained peak engagement observed at minute 25 (91%).',
        recommendationText: 'Cohorts demonstrated high visual attention during neural network lecture.',
        suggestedAction: 'Capture momentum: pose a code implementation drill.',
        priority: 'low',
        status: 'applied',
        createdAt: new Date(),
      },
      {
        _id: 'rec_2',
        type: 'inactivity',
        triggerReason: 'Moderate visual fatigue / inactivity spike detected at minute 30.',
        recommendationText: 'Head movement variance reduced by 28%. Students appear sedentary.',
        suggestedAction: 'Take a 90-second posture reset or live poll.',
        priority: 'medium',
        status: 'pending',
        createdAt: new Date(),
      },
      {
        _id: 'rec_3',
        type: 'participation',
        triggerReason: 'Acoustic participation level under 25% over past 8 minutes.',
        recommendationText: 'Lecture has been predominantly instructor monologue.',
        suggestedAction: 'Initiate a 2-minute "Think-Pair-Share" discussion.',
        priority: 'medium',
        status: 'pending',
        createdAt: new Date(),
      },
    ];

    this.engagement = [
      { time: '09:00', score: 75, headMovement: 68, audioLevel: 35 },
      { time: '09:15', score: 82, headMovement: 75, audioLevel: 42 },
      { time: '09:30', score: 88, headMovement: 82, audioLevel: 55 },
      { time: '09:45', score: 84, headMovement: 78, audioLevel: 48 },
      { time: '10:00', score: 79, headMovement: 65, audioLevel: 38 },
      { time: '10:15', score: 86, headMovement: 84, audioLevel: 52 },
    ];
  }

  getDashboardSummary() {
    const presentToday = this.attendance.filter((a) => a.status === 'present').length;
    const totalStudents = this.students.length;
    const attendancePercentage = totalStudents > 0 ? Math.round((presentToday / totalStudents) * 100) : 0;

    return {
      totalStudents,
      presentToday,
      absentToday: Math.max(0, totalStudents - presentToday),
      attendancePercentage,
      averageEngagement: 84,
      activeSession: this.session,
      recentAttendance: this.attendance.slice(0, 8),
      weeklyAttendance: [
        { day: 'Mon', attendance: 88, engagement: 82 },
        { day: 'Tue', attendance: 92, engagement: 85 },
        { day: 'Wed', attendance: 85, engagement: 79 },
        { day: 'Thu', attendance: 90, engagement: 86 },
        { day: 'Fri', attendance: 94, engagement: 88 },
        { day: 'Sat', attendance: 82, engagement: 74 },
        { day: 'Sun (Today)', attendance: attendancePercentage, engagement: 84 },
      ],
      engagementTrend: this.engagement,
      recentRecommendations: this.recommendations,
    };
  }
}

const memoryStore = new MemoryStore();
module.exports = memoryStore;
