import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Eye,
  X,
  Upload,
  CheckCircle,
  AlertCircle,
  Mail,
  Phone,
  Building,
} from 'lucide-react';
import axiosClient from '../api/axiosClient';

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [viewingStudent, setViewingStudent] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    studentId: '',
    name: '',
    email: '',
    department: 'Computer Science & Engineering',
    year: 3,
    section: 'A',
    rollNumber: '',
    phone: '+91 98765 00000',
    avatarUrl: '',
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get('/students', {
        params: { search, department: departmentFilter },
      });
      if (res.data?.success) {
        setStudents(res.data.data);
      }
    } catch (err) {
      console.warn('Fetch students error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [search, departmentFilter]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    const payload = new FormData();
    Object.keys(formData).forEach((key) => {
      payload.append(key, formData[key]);
    });
    if (avatarFile) {
      payload.append('avatar', avatarFile);
    }

    try {
      if (editingStudent) {
        await axiosClient.put(`/students/${editingStudent._id}`, payload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setFormSuccess('Student updated successfully!');
      } else {
        await axiosClient.post('/students', payload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setFormSuccess('New student registered successfully!');
      }

      setTimeout(() => {
        setShowAddModal(false);
        setEditingStudent(null);
        setAvatarFile(null);
        fetchStudents();
      }, 1000);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save student details');
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}? This will remove all their attendance records.`)) {
      try {
        await axiosClient.delete(`/students/${id}`);
        fetchStudents();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete student');
      }
    }
  };

  const openEditModal = (student) => {
    setEditingStudent(student);
    setFormData({
      studentId: student.studentId,
      name: student.name,
      email: student.email,
      department: student.department,
      year: student.year,
      section: student.section,
      rollNumber: student.rollNumber || '',
      phone: student.phone || '',
      avatarUrl: student.avatarUrl || '',
    });
    setShowAddModal(true);
  };

  const openViewProfile = async (student) => {
    try {
      const res = await axiosClient.get(`/students/${student._id}`);
      if (res.data?.success) {
        setViewingStudent(res.data.data);
      } else {
        setViewingStudent(student);
      }
    } catch (e) {
      setViewingStudent(student);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">Student Management</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Register students, manage biometric rosters, and review attendance records
          </p>
        </div>

        <button
          onClick={() => {
            setEditingStudent(null);
            setFormData({
              studentId: `CS2026-${String(students.length + 1).padStart(3, '0')}`,
              name: '',
              email: '',
              department: 'Computer Science & Engineering',
              year: 3,
              section: 'A',
              rollNumber: String(students.length + 1).padStart(2, '0'),
              phone: '+91 98765 00000',
              avatarUrl: '',
            });
            setShowAddModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-indigo-600 to-purple-600 hover:brightness-110 text-white shadow-lg shadow-indigo-600/30 transition shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New Student</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student name, ID (e.g. CS2026-001), or email..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Departments</option>
            <option value="Computer Science & Engineering">Computer Science & Engineering</option>
            <option value="Information Technology">Information Technology</option>
            <option value="Electronics & Communication">Electronics & Communication</option>
          </select>
        </div>
      </div>

      {/* Student Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Student</th>
                <th className="py-3.5 px-4">Student ID</th>
                <th className="py-3.5 px-4">Roll No</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4">Year / Sec</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {students && students.length > 0 ? (
                students.map((student) => (
                  <tr key={student._id} className="hover:bg-slate-900/50 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            student.avatarUrl ||
                            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=128&q=80'
                          }
                          alt={student.name}
                          className="w-8 h-8 rounded-full object-cover border border-slate-700 shrink-0"
                        />
                        <div>
                          <span className="font-semibold text-white block">{student.name}</span>
                          <span className="text-[11px] text-slate-400">{student.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-indigo-400">{student.studentId}</td>
                    <td className="py-3 px-4 font-mono">{student.rollNumber || 'N/A'}</td>
                    <td className="py-3 px-4 text-slate-300">{student.department}</td>
                    <td className="py-3 px-4">
                      Year {student.year} • Sec {student.section}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        Active
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openViewProfile(student)}
                          title="View Profile & Analytics"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openEditModal(student)}
                          title="Edit Student"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-400 hover:text-indigo-300"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(student._id, student.name)}
                          title="Delete Student"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-slate-400">
                    {loading ? 'Loading student roster...' : 'No students found matching your criteria.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-lg rounded-3xl p-6 border border-slate-700 shadow-2xl relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute right-5 top-5 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-1">
              {editingStudent ? 'Edit Student Profile' : 'Enroll New Student'}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Enter official college credentials and registration details
            </p>

            {formError && (
              <div className="mb-3 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                {formError}
              </div>
            )}
            {formSuccess && (
              <div className="mb-3 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
                {formSuccess}
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-400 mb-1">Student ID / Code</label>
                  <input
                    type="text"
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleInputChange}
                    placeholder="CS2026-001"
                    required
                    disabled={!!editingStudent}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500 disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-400 mb-1">Roll Number</label>
                  <input
                    type="text"
                    name="rollNumber"
                    value={formData.rollNumber}
                    onChange={handleInputChange}
                    placeholder="01"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Student Name"
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-400 mb-1">Student Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="student@college.edu"
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-400 mb-1">Department</label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  placeholder="Computer Science & Engineering"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-400 mb-1">Year</label>
                  <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    min={1}
                    max={5}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-400 mb-1">Section</label>
                  <input
                    type="text"
                    name="section"
                    value={formData.section}
                    onChange={handleInputChange}
                    placeholder="A"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Profile Image / Avatar */}
              <div>
                <label className="block font-semibold text-slate-400 mb-1">Profile Photo Upload</label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setAvatarFile(e.target.files[0])}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-2.5 rounded-xl font-bold uppercase tracking-wider bg-gradient-to-r from-indigo-600 to-purple-600 hover:brightness-110 text-white shadow-lg shadow-indigo-600/30 transition"
              >
                {editingStudent ? 'Save Changes' : 'Confirm Enrollment'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* View Student Profile Drawer / Modal */}
      {viewingStudent && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-md rounded-3xl p-6 border border-slate-700 shadow-2xl relative">
            <button
              onClick={() => setViewingStudent(null)}
              className="absolute right-5 top-5 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center pb-4 border-b border-slate-800">
              <img
                src={
                  viewingStudent.avatarUrl ||
                  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80'
                }
                alt={viewingStudent.name}
                className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-indigo-500 shadow-lg mb-3"
              />
              <h3 className="text-lg font-bold text-white">{viewingStudent.name}</h3>
              <p className="text-xs font-mono text-indigo-400 font-bold">{viewingStudent.studentId}</p>
              <p className="text-xs text-slate-400 mt-0.5">{viewingStudent.department}</p>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Class Roll</span>
                <span className="font-semibold text-white">{viewingStudent.rollNumber || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Year / Section</span>
                <span className="font-semibold text-white">
                  Year {viewingStudent.year} • Sec {viewingStudent.section}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Email</span>
                <span className="font-semibold text-white">{viewingStudent.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Phone</span>
                <span className="font-semibold text-white">{viewingStudent.phone || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <span className="text-slate-400">Attendance Rate</span>
                <span className="font-bold text-emerald-400 text-sm">
                  {viewingStudent.analytics?.attendancePercentage ?? 85}%
                </span>
              </div>
            </div>

            <button
              onClick={() => setViewingStudent(null)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase"
            >
              Close Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentManagement;
