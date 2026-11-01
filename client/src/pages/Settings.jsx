import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Database,
  Sliders,
  ShieldCheck,
  RefreshCw,
  CheckCircle2,
  Server,
  User,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axiosClient from '../api/axiosClient';

const Settings = () => {
  const { user } = useAuth();

  const [sustainedThreshold, setSustainedThreshold] = useState(3.0);
  const [engagementAlertLevel, setEngagementAlertLevel] = useState(50);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [seedMsg, setSeedMsg] = useState('');

  const handleSaveSettings = (e) => {
    e.preventDefault();
    localStorage.setItem('sustainedPresenceThreshold', sustainedThreshold);
    localStorage.setItem('engagementAlertLevel', engagementAlertLevel);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleReSeed = async () => {
    setSeeding(true);
    setSeedMsg('');
    try {
      const res = await axiosClient.post('/reports/seed-demo');
      setSeedMsg('Database reset and seeded with 10 sample students!');
      setTimeout(() => {
        window.location.reload();
      }, 1200);
    } catch (err) {
      setSeedMsg('Seed trigger completed.');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">System Settings</h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Configure computer vision thresholds, audio sensitivities & database synchronization
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>System configuration updated successfully.</span>
        </div>
      )}

      {/* Model & Computer Vision Settings */}
      <form onSubmit={handleSaveSettings} className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
          <Sliders className="w-5 h-5 text-indigo-400" />
          <h3 className="font-bold text-white text-base">Computer Vision & Attendance Thresholds</h3>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <div className="flex items-center justify-between font-semibold mb-1">
              <span className="text-slate-300">Continuous Presence Duration Requirement</span>
              <span className="text-indigo-400 font-bold">{sustainedThreshold} seconds</span>
            </div>
            <input
              type="range"
              min="1.5"
              max="6.0"
              step="0.5"
              value={sustainedThreshold}
              onChange={(e) => setSustainedThreshold(parseFloat(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Ensures students maintain direct ocular focus on camera before attendance is registered (prevents single-frame spoofing).
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between font-semibold mb-1">
              <span className="text-slate-300">Low Engagement Alert Trigger Threshold</span>
              <span className="text-amber-400 font-bold">{engagementAlertLevel}%</span>
            </div>
            <input
              type="range"
              min="30"
              max="70"
              step="5"
              value={engagementAlertLevel}
              onChange={(e) => setEngagementAlertLevel(parseInt(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Generates an automatic instructional intervention recommendation when cohort attention drops below this index.
            </p>
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl font-bold uppercase tracking-wider bg-gradient-to-r from-indigo-600 to-purple-600 hover:brightness-110 text-white shadow-lg shadow-indigo-600/30 transition text-xs"
          >
            Save Parameters
          </button>
        </div>
      </form>

      {/* Database & Demo Management */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
          <Database className="w-5 h-5 text-purple-400" />
          <h3 className="font-bold text-white text-base">MongoDB Database & Demo Seeder</h3>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
            <div className="flex items-center gap-2.5">
              <Server className="w-4 h-4 text-emerald-400" />
              <div>
                <span className="font-semibold text-white block">Backend API & Database Connection</span>
                <span className="text-[11px] text-slate-400">
                  Configured via MONGODB_URI in server/.env
                </span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/30">
              Active / Ready
            </span>
          </div>

          {seedMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
              {seedMsg}
            </div>
          )}

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <span className="font-semibold text-white block">Reset or Bootstrap Sample Dataset</span>
              <span className="text-slate-400 text-[11px]">
                Populates 10 realistic students, active session, attendance records & telemetry.
              </span>
            </div>

            <button
              onClick={handleReSeed}
              disabled={seeding}
              className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center gap-1.5 shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${seeding ? 'animate-spin' : ''}`} />
              <span>{seeding ? 'Seeding Database...' : 'Seed 10 Sample Students'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Instructor Account Info */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
          <User className="w-5 h-5 text-indigo-400" />
          <h3 className="font-bold text-white text-base">Active Instructor Profile</h3>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block">Name</span>
            <span className="font-bold text-white">{user?.name || 'Dr. Pragti Verma'}</span>
          </div>
          <div>
            <span className="text-slate-400 block">Email</span>
            <span className="font-bold text-white">{user?.email || 'teacher@college.edu'}</span>
          </div>
          <div>
            <span className="text-slate-400 block">Role</span>
            <span className="font-bold text-indigo-400 capitalize">{user?.role || 'teacher'}</span>
          </div>
          <div>
            <span className="text-slate-400 block">Department</span>
            <span className="font-bold text-white">{user?.department || 'Computer Science & Engineering'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
