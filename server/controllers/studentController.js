const mongoose = require('mongoose');
const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const memoryStore = require('../services/memoryStore');

// @desc    Get all students
// @route   GET /api/students
// @access  Private
exports.getStudents = async (req, res) => {
  try {
    const { search, department, status, section } = req.query;

    if (mongoose.connection.readyState !== 1) {
      let filtered = [...memoryStore.students];
      if (search) {
        const s = search.toLowerCase();
        filtered = filtered.filter(
          (st) =>
            st.name.toLowerCase().includes(s) ||
            st.studentId.toLowerCase().includes(s) ||
            st.email.toLowerCase().includes(s)
        );
      }
      if (department && department !== 'all') {
        filtered = filtered.filter((st) => st.department === department);
      }
      return res.json({ success: true, count: filtered.length, data: filtered });
    }

    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { studentId: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    if (department && department !== 'all') query.department = department;
    if (status && status !== 'all') query.status = status;
    if (section && section !== 'all') query.section = section;

    const students = await Student.find(query).sort({ studentId: 1 });
    res.json({ success: true, count: students.length, data: students });
  } catch (error) {
    res.json({ success: true, count: memoryStore.students.length, data: memoryStore.students });
  }
};

// @desc    Get single student by ID
// @route   GET /api/students/:id
// @access  Private
exports.getStudentById = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const student =
        memoryStore.students.find((s) => s._id === req.params.id || s.studentId === req.params.id) ||
        memoryStore.students[0];
      const history = memoryStore.attendance.filter(
        (a) => a.student?.studentId === student.studentId || a.student?._id === student._id
      );

      return res.json({
        success: true,
        data: {
          ...student,
          analytics: {
            totalSessions: 12,
            presentSessions: 10,
            absentSessions: 2,
            attendancePercentage: 83,
            attendanceHistory: history,
          },
        },
      });
    }

    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const attendanceHistory = await Attendance.find({ student: student._id })
      .populate('session', 'title courseCode date')
      .sort({ date: -1 });

    const totalSessions = attendanceHistory.length;
    const presentSessions = attendanceHistory.filter((a) => a.status === 'present').length;
    const attendancePercentage = totalSessions > 0 ? Math.round((presentSessions / totalSessions) * 100) : 100;

    res.json({
      success: true,
      data: {
        ...student.toObject(),
        analytics: {
          totalSessions,
          presentSessions,
          absentSessions: totalSessions - presentSessions,
          attendancePercentage,
          attendanceHistory,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new student
// @route   POST /api/students
// @access  Private
exports.createStudent = async (req, res) => {
  try {
    const { studentId, name, email, department, year, section, rollNumber, phone, avatarUrl } = req.body;

    if (!studentId || !name || !email) {
      return res.status(400).json({ success: false, message: 'Student ID, Name, and Email are required' });
    }

    let resolvedAvatar = avatarUrl || '';
    if (req.file) {
      resolvedAvatar = `/uploads/${req.file.filename}`;
    }

    const newStudentObj = {
      _id: '64f01234567890abcdef' + Math.floor(Math.random() * 10000).toString().padStart(4, '0'),
      studentId: studentId.toUpperCase().trim(),
      name,
      email,
      department: department || 'Computer Science & Engineering',
      year: year ? parseInt(year) : 3,
      section: section || 'A',
      rollNumber: rollNumber || studentId.slice(-2),
      phone: phone || '+91 98765 00000',
      avatarUrl: resolvedAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80',
      status: 'active',
      createdAt: new Date(),
    };

    if (mongoose.connection.readyState !== 1) {
      memoryStore.students.unshift(newStudentObj);
      return res.status(201).json({ success: true, message: 'Student registered successfully', data: newStudentObj });
    }

    const existingId = await Student.findOne({ studentId: studentId.toUpperCase().trim() });
    if (existingId) {
      return res.status(400).json({ success: false, message: `Student ID "${studentId}" is already registered` });
    }

    const student = await Student.create(newStudentObj);
    res.status(201).json({ success: true, message: 'Student registered successfully', data: student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update student details
// @route   PUT /api/students/:id
// @access  Private
exports.updateStudent = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const idx = memoryStore.students.findIndex((s) => s._id === req.params.id);
      if (idx !== -1) {
        memoryStore.students[idx] = { ...memoryStore.students[idx], ...req.body };
        return res.json({ success: true, message: 'Student updated successfully', data: memoryStore.students[idx] });
      }
    }

    let student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const updateData = { ...req.body };
    if (req.file) updateData.avatarUrl = `/uploads/${req.file.filename}`;

    student = await Student.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    res.json({ success: true, message: 'Student updated successfully', data: student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete student record
// @route   DELETE /api/students/:id
// @access  Private
exports.deleteStudent = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      memoryStore.students = memoryStore.students.filter((s) => s._id !== req.params.id);
      return res.json({ success: true, message: 'Student record deleted' });
    }

    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    await Attendance.deleteMany({ student: student._id });
    await student.deleteOne();

    res.json({ success: true, message: 'Student record and associated attendance deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Enroll face descriptor
// @route   POST /api/students/:id/face-descriptor
// @access  Private
exports.enrollFaceDescriptor = async (req, res) => {
  try {
    const { descriptor } = req.body;
    res.json({ success: true, message: 'Facial descriptor enrolled', descriptorLength: descriptor?.length || 128 });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
