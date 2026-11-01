import React, { useState, useEffect } from 'react';
import {
  ScanFace,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  RefreshCw,
  Edit3,
  Check,
  Search,
  Filter,
} from 'lucide-react';
import axiosClient from '../api/axiosClient';
import FaceWebcamDetector from '../components/FaceWebcamDetector';
import AttendanceStatusBadge from '../components/AttendanceStatusBadge';
import PrivacyDisclaimer from '../components/PrivacyDisclaimer';

const AttendanceMonitoring = () => {
  const [students, setStudents] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [editingRecordId, setEditingRecordId] = useState(null);
  const [newStatus, setNewStatus] = useState('present');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [studentsRes, attendanceRes] = await Promise.all([
        axiosClient.get('/students'),
        axiosClient.get('/attendance'),
      ]);

      if (studentsRes.data?.success) setStudents(studentsRes.data.data);
      if (attendanceRes.data?.success) setAttendanceRecords(attendanceRes.data.data);
    } catch (err) {
      console.warn('Attendance load error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAttendanceMarked = (newRecord) => {
    fetchData();
  };

  const handleUpdateStatus = async (recordId) => {
    try {
      await axiosClient.put(`/attendance/${recordId}`, { status: newStatus });
      setEditingRecordId(null);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update attendance');
    }
  };

  const filteredRecords = attendanceRecords.filter((rec) => {
    if (filterStatus === 'all') return true;
    return rec.status === filterStatus;
  });

  const exportCSV = async () => {
    try {
      const response = await axiosClient.get('/reports/export/csv', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `attendance-log-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Failed to download CSV');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Automated Attendance Monitor
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time continuous facial verification, duplicate prevention & presence audit
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={fetchData}
            title="Refresh Attendance"
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Interactive Facial Detector Component */}
      <FaceWebcamDetector students={students} onAttendanceMarked={handleAttendanceMarked} />

      {/* Attendance Roster & Manual Override Table */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="font-bold text-white text-base">Classroom Roll Log ({filteredRecords.length})</h3>
            <p className="text-xs text-slate-400">
              Live verification timestamps and manual teacher override controls
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Statuses</option>
              <option value="present">Present Only</option>
              <option value="absent">Absent Only</option>
              <option value="late">Late Only</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Student ID</th>
                <th className="py-3 px-4">Status & Method</th>
                <th className="py-3 px-4">Confidence</th>
                <th className="py-3 px-4">Sustained Gaze</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4 text-right">Manual Override</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredRecords && filteredRecords.length > 0 ? (
                filteredRecords.map((record) => (
                  <tr key={record._id} className="hover:bg-slate-900/50 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={
                            record.student?.avatarUrl ||
                            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=128&q=80'
                          }
                          alt={record.student?.name}
                          className="w-7 h-7 rounded-full object-cover border border-slate-700"
                        />
                        <span className="font-semibold text-white">{record.student?.name || 'Student'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-indigo-400">
                      {record.student?.studentId}
                    </td>
                    <td className="py-3 px-4">
                      <AttendanceStatusBadge status={record.status} method={record.method} />
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-200">
                      {record.confidence ? `${Math.round(record.confidence * 100)}%` : 'Manual'}
                    </td>
                    <td className="py-3 px-4 font-mono text-indigo-300">
                      {record.sustainedDurationSeconds ? `${record.sustainedDurationSeconds}s` : 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-slate-400 font-mono">
                      {new Date(record.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {editingRecordId === record._id ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <select
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                            className="px-2 py-1 rounded bg-slate-900 border border-slate-700 text-xs text-white"
                          >
                            <option value="present">Present</option>
                            <option value="absent">Absent</option>
                            <option value="late">Late</option>
                          </select>
                          <button
                            onClick={() => handleUpdateStatus(record._id)}
                            className="p-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white"
                            title="Confirm override"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingRecordId(null)}
                            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400"
                            title="Cancel"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingRecordId(record._id);
                            setNewStatus(record.status);
                          }}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-400 hover:text-indigo-300 transition"
                          title="Correct attendance"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-6 text-slate-400">
                    No attendance records logged for current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <PrivacyDisclaimer compact={true} />
    </div>
  );
};

export default AttendanceMonitoring;
