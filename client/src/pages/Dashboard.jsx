import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  UserCheck,
  UserX,
  Percent,
  Activity,
  Radio,
  ScanFace,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Volume2,
  RefreshCw,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import axiosClient from '../api/axiosClient';
import StatCard from '../components/StatCard';
import AttendanceStatusBadge from '../components/AttendanceStatusBadge';
import RecommendationCard from '../components/RecommendationCard';
import PrivacyDisclaimer from '../components/PrivacyDisclaimer';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    totalStudents: 10,
    presentToday: 8,
    absentToday: 2,
    attendancePercentage: 80,
    averageEngagement: 84,
    activeSession: {
      title: 'CS302: Multimodal Machine Learning & AI Systems',
      courseCode: 'CS302',
      roomNumber: 'Room 404 / AI Vision Lab',
      isActive: true,
    },
    recentAttendance: [],
    weeklyAttendance: [],
    engagementTrend: [],
    recentRecommendations: [],
  });

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get('/reports/dashboard');
      if (res.data?.success) {
        setData(res.data.data);
      }
    } catch (err) {
      console.warn('Dashboard fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleApplyRec = async (id) => {
    try {
      await axiosClient.put(`/recommendations/${id}`, { status: 'applied' });
      fetchDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDismissRec = async (id) => {
    try {
      await axiosClient.put(`/recommendations/${id}`, { status: 'dismissed' });
      fetchDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Active Session */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Live Classroom Telemetry Active
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
            {data.activeSession?.title || 'CS302: Multimodal AI & Attendance Intelligence'}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Location: {data.activeSession?.roomNumber || 'Room 404'} • Realtime Computer Vision & Web Audio Pipeline
          </p>
        </div>

        <div className="flex items-center gap-2 relative z-10">
          <Link
            to="/attendance"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-indigo-600 to-purple-600 hover:brightness-110 text-white shadow-lg shadow-indigo-600/30 transition"
          >
            <ScanFace className="w-4 h-4" />
            <span>Launch Attendance</span>
          </Link>

          <button
            onClick={fetchDashboardData}
            title="Refresh Telemetry"
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* KPI Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Registered Students"
          value={data.totalStudents}
          subtitle="Enrolled cohort roster"
          icon={Users}
          color="indigo"
          badge={{ label: 'Class size', value: '10 Enrolled' }}
        />

        <StatCard
          title="Attendance Rate"
          value={`${data.attendancePercentage}%`}
          subtitle={`${data.presentToday} Present • ${data.absentToday} Absent`}
          icon={Percent}
          color="emerald"
          badge={{ label: 'Status', value: data.attendancePercentage >= 75 ? 'Optimal' : 'Needs Review', isPositive: true }}
        />

        <StatCard
          title="Average Engagement"
          value={`${data.averageEngagement}%`}
          subtitle="Multimodal attention index"
          icon={Activity}
          color="purple"
          badge={{
            label: 'Category',
            value: data.averageEngagement >= 75 ? 'High Attention' : 'Moderate Attention',
            isPositive: true,
          }}
        />

        <StatCard
          title="Active Session"
          value="1 Session"
          subtitle={data.activeSession?.courseCode || 'CS302'}
          icon={Radio}
          color="cyan"
          badge={{ label: 'Sensors', value: 'Video + Audio ON' }}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Attendance & Engagement Trend */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-white text-base">Weekly Attendance & Engagement</h3>
              <p className="text-xs text-slate-400">Cohort attendance % compared with multimodal engagement</p>
            </div>
            <TrendingUp className="w-4 h-4 text-indigo-400" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.weeklyAttendance} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" domain={[0, 100]} fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="attendance" name="Attendance %" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="engagement" name="Engagement %" fill="#a855f7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Session Engagement Time-Series */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-white text-base">Continuous Engagement Timeline</h3>
              <p className="text-xs text-slate-400">Head posture, visual lock, and acoustic vitality time-series</p>
            </div>
            <Activity className="w-4 h-4 text-purple-400" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.engagementTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorAudio" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" domain={[0, 100]} fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Area
                  type="monotone"
                  dataKey="score"
                  name="Engagement Index"
                  stroke="#8b5cf6"
                  fillOpacity={1}
                  fill="url(#colorEngagement)"
                />
                <Area
                  type="monotone"
                  dataKey="audioLevel"
                  name="Acoustic Activity"
                  stroke="#06b6d4"
                  fillOpacity={1}
                  fill="url(#colorAudio)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Lower Section: Recent Attendance & AI Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Attendance List */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="font-bold text-white text-base">Recent Attendance Confirmations</h3>
              <p className="text-xs text-slate-400">Continuous presence verifications recorded for this session</p>
            </div>
            <Link
              to="/attendance"
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              <span>Full View</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="mt-3 divide-y divide-slate-800/80 overflow-x-auto">
            {data.recentAttendance && data.recentAttendance.length > 0 ? (
              data.recentAttendance.map((rec) => (
                <div key={rec._id} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={
                        rec.student?.avatarUrl ||
                        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=128&q=80'
                      }
                      alt={rec.student?.name || 'Student'}
                      className="w-9 h-9 rounded-full object-cover border border-slate-700 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-semibold text-white truncate">
                        {rec.student?.name || 'Enrolled Student'}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {rec.student?.studentId} • Roll {rec.student?.rollNumber || 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <AttendanceStatusBadge status={rec.status} method={rec.method} />
                    <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                      {new Date(rec.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-6 text-center">
                No attendance verifications recorded yet. Launch Attendance to begin.
              </p>
            )}
          </div>
        </div>

        {/* Recent AI Recommendations Column */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <h3 className="font-bold text-white text-base">Adaptive AI Advice</h3>
              </div>
              <Link to="/recommendations" className="text-xs font-semibold text-indigo-400 hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {data.recentRecommendations && data.recentRecommendations.length > 0 ? (
                data.recentRecommendations.slice(0, 2).map((rec) => (
                  <RecommendationCard
                    key={rec._id}
                    recommendation={rec}
                    onApply={handleApplyRec}
                    onDismiss={handleDismissRec}
                  />
                ))
              ) : (
                <p className="text-xs text-slate-400 py-6 text-center">
                  All teaching recommendations applied or session telemetry optimal!
                </p>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800">
            <Link
              to="/recommendations"
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-center text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition"
            >
              <span>Explore Recommendation Engine</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Privacy Disclaimer Footer */}
      <PrivacyDisclaimer />
    </div>
  );
};

export default Dashboard;
