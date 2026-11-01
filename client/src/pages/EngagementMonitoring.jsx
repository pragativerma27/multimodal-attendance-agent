import React, { useState, useEffect } from 'react';
import {
  Activity,
  BrainCircuit,
  Eye,
  Move,
  Clock,
  Volume2,
  TrendingUp,
  AlertCircle,
  Sparkles,
  RefreshCw,
  Sliders,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import axiosClient from '../api/axiosClient';
import PrivacyDisclaimer from '../components/PrivacyDisclaimer';

const EngagementMonitoring = () => {
  const [telemetry, setTelemetry] = useState({
    facePresenceRatio: 0.88,
    headMovementScore: 74,
    inactivityDurationSec: 12,
    audioActivityLevel: 42,
  });

  const [activeSession, setActiveSession] = useState(null);
  const [timelineData, setTimelineData] = useState([]);
  const [distribution, setDistribution] = useState({ highPct: 65, moderatePct: 25, lowPct: 10 });
  const [currentScore, setCurrentScore] = useState(82);
  const [currentCategory, setCurrentCategory] = useState('High Engagement');
  const [simulating, setSimulating] = useState(false);

  const fetchSessionData = async () => {
    try {
      const sessionRes = await axiosClient.get('/sessions/active');
      if (sessionRes.data?.success) {
        const session = sessionRes.data.data;
        setActiveSession(session);

        const engagementRes = await axiosClient.get(`/engagement/session/${session._id}`);
        if (engagementRes.data?.success && engagementRes.data.data.length > 0) {
          const records = engagementRes.data.data;
          setTimelineData(
            records.map((r) => ({
              time: new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              score: r.overallScore,
              headMovement: r.metrics?.headMovementScore || 70,
              audio: r.metrics?.audioActivityLevel || 40,
              inactivity: r.metrics?.inactivityDurationSec || 10,
            }))
          );
          setDistribution(engagementRes.data.distribution);
          const latest = records[records.length - 1];
          setCurrentScore(latest.overallScore);
          setCurrentCategory(latest.category);
        }
      }
    } catch (err) {
      console.warn('Engagement load issue:', err.message);
    }
  };

  useEffect(() => {
    fetchSessionData();
  }, []);

  // Post new engagement telemetry snapshot
  const sendTelemetrySnapshot = async (metrics) => {
    try {
      const res = await axiosClient.post('/engagement', {
        sessionId: activeSession?._id,
        ...metrics,
      });
      if (res.data?.success) {
        const doc = res.data.data;
        setCurrentScore(doc.overallScore);
        setCurrentCategory(doc.category);
        setTimelineData((prev) => [
          ...prev.slice(-20),
          {
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            score: doc.overallScore,
            headMovement: doc.metrics.headMovementScore,
            audio: doc.metrics.audioActivityLevel,
            inactivity: doc.metrics.inactivityDurationSec,
          },
        ]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSliderChange = (key, value) => {
    const updated = { ...telemetry, [key]: value };
    setTelemetry(updated);
    sendTelemetrySnapshot(updated);
  };

  // Automated Real-time Simulation Pulse
  useEffect(() => {
    let interval;
    if (simulating) {
      interval = setInterval(() => {
        const newMetrics = {
          facePresenceRatio: Number((0.75 + Math.random() * 0.22).toFixed(2)),
          headMovementScore: Math.round(50 + Math.random() * 45),
          inactivityDurationSec: Math.round(5 + Math.random() * 25),
          audioActivityLevel: Math.round(25 + Math.random() * 50),
        };
        setTelemetry(newMetrics);
        sendTelemetrySnapshot(newMetrics);
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [simulating, activeSession]);

  const COLORS = ['#10b981', '#f59e0b', '#f43f5e'];
  const pieData = [
    { name: 'High Engagement', value: distribution.highPct || 65 },
    { name: 'Moderate Engagement', value: distribution.moderatePct || 25 },
    { name: 'Low Engagement', value: distribution.lowPct || 10 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Classroom Engagement Telemetry
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Multimodal behavioral proxies: head motion, visual lock, inactivity & acoustic cues
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSimulating(!simulating)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-lg ${
              simulating
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:brightness-110 shadow-purple-600/30'
            }`}
          >
            <Activity className={`w-4 h-4 ${simulating ? 'animate-spin' : ''}`} />
            <span>{simulating ? 'Stop Telemetry Stream' : 'Live Telemetry Stream'}</span>
          </button>
        </div>
      </div>

      {/* Top Composite Gauge Banner */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div className="md:col-span-2 space-y-2">
          <div className="flex items-center gap-2">
            <span
              className={`w-3 h-3 rounded-full ${
                currentScore >= 75
                  ? 'bg-emerald-400 animate-pulse'
                  : currentScore >= 50
                  ? 'bg-amber-400 animate-pulse'
                  : 'bg-rose-400 animate-ping'
              }`}
            />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Live Attention Classification
            </span>
          </div>

          <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {currentCategory}
          </h3>

          <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
            Synthesized from 4 multimodal proxies: sustained visual presence ({Math.round(telemetry.facePresenceRatio * 100)}%), head motion vitality ({telemetry.headMovementScore}/100), inactivity latency ({telemetry.inactivityDurationSec}s), and acoustic presence ({telemetry.audioActivityLevel}%).
          </p>
        </div>

        <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Overall Attention Index</span>
          <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 mt-1">
            {currentScore}%
          </div>
          <span className="text-[11px] text-slate-400 mt-1">Classroom Cohort Average</span>
        </div>
      </div>

      {/* Interactive Telemetry Tuning Sliders */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-400" />
            <h3 className="font-bold text-white text-sm">Interactive Telemetry Simulator & Signal Modulators</h3>
          </div>
          <span className="text-xs text-slate-400">Adjust sliders to test rule-based AI triggers</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Face Presence Ratio */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                <Eye className="w-3.5 h-3.5 text-indigo-400" /> Face Presence
              </span>
              <span className="font-bold text-white">{Math.round(telemetry.facePresenceRatio * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={telemetry.facePresenceRatio}
              onChange={(e) => handleSliderChange('facePresenceRatio', parseFloat(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>

          {/* Head Movement Score */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                <Move className="w-3.5 h-3.5 text-purple-400" /> Motion Vitality
              </span>
              <span className="font-bold text-white">{telemetry.headMovementScore}</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={telemetry.headMovementScore}
              onChange={(e) => handleSliderChange('headMovementScore', parseInt(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer"
            />
          </div>

          {/* Inactivity Duration */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                <Clock className="w-3.5 h-3.5 text-amber-400" /> Static Inactivity
              </span>
              <span className="font-bold text-white">{telemetry.inactivityDurationSec}s</span>
            </div>
            <input
              type="range"
              min="0"
              max="60"
              step="2"
              value={telemetry.inactivityDurationSec}
              onChange={(e) => handleSliderChange('inactivityDurationSec', parseInt(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Audio Activity */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> Classroom Sound
              </span>
              <span className="font-bold text-white">{telemetry.audioActivityLevel}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={telemetry.audioActivityLevel}
              onChange={(e) => handleSliderChange('audioActivityLevel', parseInt(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Engagement Timeline Chart */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-white text-base">Session Engagement Trajectory</h3>
              <p className="text-xs text-slate-400">Time-series response tracking throughout active lecture</p>
            </div>
            <TrendingUp className="w-4 h-4 text-indigo-400" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" domain={[0, 100]} fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  name="Engagement %"
                  stroke="#6366f1"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#scoreColor)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cohort Category Breakdown Pie */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-white text-base">Cohort Attention Distribution</h3>
            <p className="text-xs text-slate-400 mb-3">Overall breakdown of active cohort engagement</p>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2 mt-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> High Attention
                </span>
                <span className="font-bold text-emerald-400">{distribution.highPct}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Moderate
                </span>
                <span className="font-bold text-amber-400">{distribution.moderatePct}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Low Attention
                </span>
                <span className="font-bold text-rose-400">{distribution.lowPct}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PrivacyDisclaimer />
    </div>
  );
};

export default EngagementMonitoring;
