const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');
const Student = require('../models/Student');
const ClassroomSession = require('../models/ClassroomSession');
const Attendance = require('../models/Attendance');
const Engagement = require('../models/Engagement');
const Recommendation = require('../models/Recommendation');

const sampleStudentsData = [
  {
    studentId: 'CS2026-001',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@college.edu',
    department: 'Computer Science & Engineering',
    year: 3,
    section: 'A',
    rollNumber: '01',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=256&q=80',
    phone: '+91 98765 01001',
    status: 'active',
  },
  {
    studentId: 'CS2026-002',
    name: 'Priya Patel',
    email: 'priya.patel@college.edu',
    department: 'Computer Science & Engineering',
    year: 3,
    section: 'A',
    rollNumber: '02',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    phone: '+91 98765 01002',
    status: 'active',
  },
  {
    studentId: 'CS2026-003',
    name: 'Rohan Gupta',
    email: 'rohan.gupta@college.edu',
    department: 'Computer Science & Engineering',
    year: 3,
    section: 'A',
    rollNumber: '03',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    phone: '+91 98765 01003',
    status: 'active',
  },
  {
    studentId: 'CS2026-004',
    name: 'Ananya Iyer',
    email: 'ananya.iyer@college.edu',
    department: 'Computer Science & Engineering',
    year: 3,
    section: 'A',
    rollNumber: '04',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&q=80',
    phone: '+91 98765 01004',
    status: 'active',
  },
  {
    studentId: 'CS2026-005',
    name: 'Vikram Singh',
    email: 'vikram.singh@college.edu',
    department: 'Computer Science & Engineering',
    year: 3,
    section: 'A',
    rollNumber: '05',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
    phone: '+91 98765 01005',
    status: 'active',
  },
  {
    studentId: 'CS2026-006',
    name: 'Sneha Reddy',
    email: 'sneha.reddy@college.edu',
    department: 'Computer Science & Engineering',
    year: 3,
    section: 'A',
    rollNumber: '06',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
    phone: '+91 98765 01006',
    status: 'active',
  },
  {
    studentId: 'CS2026-007',
    name: 'Rahul Verma',
    email: 'rahul.verma@college.edu',
    department: 'Computer Science & Engineering',
    year: 3,
    section: 'A',
    rollNumber: '07',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=256&q=80',
    phone: '+91 98765 01007',
    status: 'active',
  },
  {
    studentId: 'CS2026-008',
    name: 'Meera Nair',
    email: 'meera.nair@college.edu',
    department: 'Computer Science & Engineering',
    year: 3,
    section: 'A',
    rollNumber: '08',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80',
    phone: '+91 98765 01008',
    status: 'active',
  },
  {
    studentId: 'CS2026-009',
    name: 'Aditya Joshi',
    email: 'aditya.joshi@college.edu',
    department: 'Computer Science & Engineering',
    year: 3,
    section: 'A',
    rollNumber: '09',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=256&q=80',
    phone: '+91 98765 01009',
    status: 'active',
  },
  {
    studentId: 'CS2026-010',
    name: 'Tanvi Kapoor',
    email: 'tanvi.kapoor@college.edu',
    department: 'Computer Science & Engineering',
    year: 3,
    section: 'A',
    rollNumber: '10',
    avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=256&q=80',
    phone: '+91 98765 01010',
    status: 'active',
  },
];

async function seedDatabase() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/multimodal_attendance';
  console.log(`[Seeder] Connecting to MongoDB: ${uri.replace(/\/\/.*@/, '//<credentials>@')}`);

  let conn;
  try {
    conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('[Seeder] Connected to MongoDB successfully.');
  } catch (err) {
    console.warn(`[Seeder] Could not connect directly to MongoDB: ${err.message}`);
    return {
      success: false,
      message: 'MongoDB connection failed. Ensure mongod is running or configure MONGODB_URI.',
    };
  }

  try {
    // 1. Clear existing collections for a clean seed
    console.log('[Seeder] Clearing old records...');
    await User.deleteMany({});
    await Student.deleteMany({});
    await ClassroomSession.deleteMany({});
    await Attendance.deleteMany({});
    await Engagement.deleteMany({});
    await Recommendation.deleteMany({});

    // 2. Create Users (Admin & Teacher)
    console.log('[Seeder] Creating admin and teacher accounts...');
    const adminUser = await User.create({
      name: 'System Administrator',
      email: 'admin@college.edu',
      password: 'Admin@123',
      role: 'admin',
      department: 'Dean of Academic Technology',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&q=80',
    });

    const teacherUser = await User.create({
      name: 'Dr. Pragti Verma',
      email: 'teacher@college.edu',
      password: 'Teacher@123',
      role: 'teacher',
      department: 'Computer Science & Engineering',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
    });

    // 3. Create 10 Students
    console.log('[Seeder] Inserting 10 sample students...');
    const createdStudents = await Student.insertMany(sampleStudentsData);

    // 4. Create Active Classroom Session
    console.log('[Seeder] Creating active classroom session...');
    const session = await ClassroomSession.create({
      title: 'CS302: Multimodal Machine Learning & AI Systems',
      courseCode: 'CS302',
      department: 'Computer Science & Engineering',
      roomNumber: 'Room 404 / AI Vision Lab',
      instructor: teacherUser._id,
      instructorName: teacherUser.name,
      date: new Date(),
      startTime: new Date(Date.now() - 45 * 60 * 1000), // 45 mins ago
      isActive: true,
      totalStudents: createdStudents.length,
      presentCount: 8,
      absentCount: 2,
      averageEngagement: 84,
      notes: 'Active session monitored with facial sustained presence and acoustic activity analysis',
    });

    // 5. Seed Attendance (8 present, 2 absent)
    console.log('[Seeder] Marking attendance records...');
    const attendanceRecords = [];
    for (let i = 0; i < createdStudents.length; i++) {
      const isPresent = i < 8; // First 8 present, last 2 absent
      attendanceRecords.push({
        student: createdStudents[i]._id,
        session: session._id,
        date: new Date(),
        timestamp: isPresent ? new Date(Date.now() - (40 - i * 3) * 60 * 1000) : new Date(),
        status: isPresent ? 'present' : 'absent',
        method: isPresent ? (i % 2 === 0 ? 'sustained_presence' : 'face_recognition') : 'manual',
        confidence: isPresent ? Number((0.92 + Math.random() * 0.07).toFixed(2)) : 0,
        sustainedDurationSeconds: isPresent ? Number((3.2 + Math.random() * 2.0).toFixed(1)) : 0,
        verifiedBy: teacherUser._id,
        notes: isPresent ? 'Face verified with > 3.0s sustained gaze' : 'Unexcused absent during roll call',
      });
    }
    await Attendance.insertMany(attendanceRecords);

    // 6. Seed Engagement Time-Series (12 points over lecture duration)
    console.log('[Seeder] Generating engagement telemetry time-series...');
    const engagementRecords = [];
    const baseScores = [74, 78, 85, 88, 91, 84, 79, 68, 73, 82, 87, 84];
    for (let i = 0; i < baseScores.length; i++) {
      const score = baseScores[i];
      let cat = 'High Engagement';
      if (score < 60) cat = 'Low Engagement';
      else if (score < 75) cat = 'Moderate Engagement';

      engagementRecords.push({
        session: session._id,
        timestamp: new Date(Date.now() - (45 - i * 3.5) * 60 * 1000),
        overallScore: score,
        category: cat,
        metrics: {
          facePresenceRatio: Number((0.80 + Math.random() * 0.18).toFixed(2)),
          headMovementScore: Math.round(55 + Math.random() * 35),
          inactivityDurationSec: Math.round(5 + Math.random() * 20),
          audioActivityLevel: Math.round(30 + Math.random() * 45),
          movementVariance: Number((12.5 + Math.random() * 15).toFixed(1)),
        },
        notes: `Telemetry sample #${i + 1} during live instruction`,
      });
    }
    await Engagement.insertMany(engagementRecords);

    // 7. Seed AI Recommendations
    console.log('[Seeder] Generating rule-based AI recommendations...');
    const recommendations = [
      {
        session: session._id,
        type: 'engagement',
        triggerReason: 'Sustained peak engagement observed at minute 25 (91%).',
        recommendationText: 'Cohorts demonstrated high visual attention during the neural network architecture walkthrough.',
        suggestedAction: 'Capture this momentum: pose a high-order design challenge or code implementation drill.',
        priority: 'low',
        status: 'applied',
      },
      {
        session: session._id,
        type: 'inactivity',
        triggerReason: 'Moderate visual fatigue / inactivity spike detected at minute 30.',
        recommendationText: 'Head movement variance reduced by 28%. Students appear sedentary after 30 minutes of continuous slide delivery.',
        suggestedAction: 'Take a 90-second posture reset or conduct a quick "raise hands if you agree" pulse check.',
        priority: 'medium',
        status: 'pending',
      },
      {
        session: session._id,
        type: 'participation',
        triggerReason: 'Acoustic participation level under 25% over the past 8 minutes.',
        recommendationText: 'Verbal interaction is primarily instructor monologue. Encourage bidirectional classroom dialogue.',
        suggestedAction: 'Conduct a 2-minute "Think-Pair-Share" on the trade-offs between CNNs and Transformers.',
        priority: 'medium',
        status: 'pending',
      },
      {
        session: session._id,
        type: 'acoustics',
        triggerReason: 'Acoustic clarity is optimal (estimated 58 dB, within speech comfort band).',
        recommendationText: 'Classroom acoustic dynamics are balanced with zero ambient distortion.',
        suggestedAction: 'Maintain current microphone sensitivity and speaking tempo.',
        priority: 'low',
        status: 'applied',
      },
    ];
    await Recommendation.insertMany(recommendations);

    console.log('[Seeder] Demo database successfully seeded with all initial data!');
    return {
      success: true,
      message: 'Demo dataset created successfully: 2 users, 10 students, 1 session, 10 attendance records, 12 engagement points, 4 recommendations.',
    };
  } catch (error) {
    console.error('[Seeder] Error seeding data:', error);
    return { success: false, error: error.message };
  }
}

// Allow direct execution from terminal: node demoDataSeeder.js
if (require.main === module) {
  seedDatabase().then((res) => {
    console.log(res);
    process.exit(0);
  });
}

module.exports = { seedDatabase, sampleStudentsData };
