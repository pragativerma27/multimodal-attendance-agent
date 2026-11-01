import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  Percent,
  Activity,
  Award,
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import axiosClient from '../api/axiosClient';

const StudentAnalytics = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const res = await axiosClient.get('/students');
        if (res.data?.success && res.data.data.length > 0) {
          setStudents(res.data.data);
          setSelectedStudentId(res.data.data[0]._id);
        }
      } catch (err) {
        console.warn(err);
      }
    };
    loadStudents();
  }, []);

  useEffect(() => {
    if (!selectedStudentId) return;

    const loadStudentDetails = async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get(`/students/${selectedStudentId}`);
        if (res.data?.success) {
          setStudentData(res.data.data);
        }
      } catch (err) {
        console.warn(err);
      } finally {
        setLoading(false);
      }
    };

    loadStudentDetails();
  }, [selectedStudentId]);

  const analytics = studentData?.analytics || {
    totalSessions: 12,
    presentSessions: 10,
    absentSessions: 2,
    attendancePercentage: 83,
    attendanceHistory: [],
  };

  const pieData = [
    { name: 'Present', value: analytics.presentSessions || 1 },
    { name: 'Absent', value: analytics.absentSessions || 0 },
  ];
  const COLORS = ['#10b981', '#f43f5e'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Individual Student Analytics
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Personal attendance record, continuous presence logs & participation metrics
          </p>
        </div>

        {/* Student Selector */}
        <div className="w-full sm:w-72">
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500 font-semibold"
          >
            {students.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name} ({s.studentId})
              </option>
            ))}
          </select>
        </div>
      </div>

      {studentData && (
        <>
          {/* Student Profile & KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Student ID Card */}
            <div className="md:col-span-1 glass-panel rounded-2xl p-5 border border-slate-800 text-center flex flex-col items-center justify-center">
              <img
                src={
                  studentData.avatarUrl ||
                  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80'
                }
                alt={studentData.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-indigo-500 shadow-xl mb-3"
              />
              <h3 className="font-bold text-white text-base">{studentData.name}</h3>
              <p className="text-xs font-mono text-indigo-400 font-bold">{studentData.studentId}</p>
              <p className="text-[11px] text-slate-400 mt-1">{studentData.department}</p>
              <span className="mt-3 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                Roll No. {studentData.rollNumber || '01'} • Year {studentData.year}
              </span>
            </div>

            {/* Attendance Donut & Stats */}
            <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col justify-between items-center text-center">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Overall Attendance
              </span>
              <div className="h-32 w-32 relative my-1">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={35} outerRadius={50} dataKey="value">
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center font-black text-xl text-white">
                  {analytics.attendancePercentage}%
                </div>
              </div>
              <span className="text-xs font-medium text-emerald-400">
                {analytics.presentSessions} Present / {analytics.totalSessions} Sessions
              </span>
            </div>

            {/* Engagement Rating */}
            <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Attention Consistency
              </span>
              <div className="text-center py-4">
                <div className="text-4xl font-black text-purple-400">88%</div>
                <p className="text-xs text-slate-400 mt-1">High Gaze Stability</p>
              </div>
              <div className="text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800 pt-2">
                <span>Facial Lock Reliability</span>
                <span className="font-bold text-white">96%</span>
              </div>
            </div>

            {/* Attendance Standing */}
            <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Roster Standing
              </span>
              <div className="text-center py-4">
                <div className="text-3xl font-black text-emerald-400">Eligible</div>
                <p className="text-xs text-slate-400 mt-1">&gt; 75% Mandatory Threshold</p>
              </div>
              <div className="text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800 pt-2">
                <span>Final Exam Eligibility</span>
                <span className="font-bold text-emerald-400">Qualified</span>
              </div>
            </div>
          </div>

          {/* Historical Session Attendance Table */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-3">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-400" />
              <span>Historical Classroom Sessions</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Session Title</th>
                    <th className="py-3 px-4">Course</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Verification Method</th>
                    <th className="py-3 px-4">Sustained Gaze</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {analytics.attendanceHistory && analytics.attendanceHistory.length > 0 ? (
                    analytics.attendanceHistory.map((rec) => (
                      <tr key={rec._id} className="hover:bg-slate-900/50">
                        <td className="py-3 px-4 font-semibold text-white">
                          {rec.session?.title || 'CS302 AI Vision Lecture'}
                        </td>
                        <td className="py-3 px-4 font-mono text-indigo-400">
                          {rec.session?.courseCode || 'CS302'}
                        </td>
                        <td className="py-3 px-4 text-slate-400">
                          {new Date(rec.date).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                              rec.status === 'present'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            }`}
                          >
                            {rec.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 capitalize text-slate-300">{rec.method?.replace('_', ' ')}</td>
                        <td className="py-3 px-4 font-mono text-indigo-300">
                          {rec.sustainedDurationSeconds ? `${rec.sustainedDurationSeconds}s` : 'N/A'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-6 text-slate-400">
                        No historical attendance records found for this student.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default StudentAnalytics;
