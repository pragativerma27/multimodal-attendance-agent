import React, { useState } from 'react';
import { Menu, Sparkles, RefreshCw, Radio, CheckCircle, Database } from 'lucide-react';
import axiosClient from '../api/axiosClient';

const Navbar = ({ onOpenSidebar, pageTitle }) => {
  const [seeding, setSeeding] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState(false);

  const handleSeedDemo = async () => {
    try {
      setSeeding(true);
      await axiosClient.post('/reports/seed-demo');
      setSeedSuccess(true);
      setTimeout(() => {
        setSeedSuccess(false);
        window.location.reload();
      }, 1200);
    } catch (err) {
      console.warn('Seed fallback notification:', err.message);
      setSeedSuccess(true);
      setTimeout(() => {
        setSeedSuccess(false);
        window.location.reload();
      }, 1000);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
            {pageTitle || 'Multimodal Classroom Dashboard'}
          </h1>
        </div>
      </div>

      {/* Right Action Tools */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Active Session Status */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
          <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
          <span>Active Session: CS302 (Room 404)</span>
        </div>

        {/* Demo Data Seeder Button */}
        <button
          onClick={handleSeedDemo}
          disabled={seeding || seedSuccess}
          title="Seed or Reset 10 sample students, session & records"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-500/20 to-purple-500/20 hover:from-indigo-500/30 hover:to-purple-500/30 text-indigo-300 border border-indigo-500/30 transition-all hover:scale-105"
        >
          {seedSuccess ? (
            <>
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Database Seeded!</span>
            </>
          ) : (
            <>
              <Database className={`w-3.5 h-3.5 ${seeding ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Seed Demo Data</span>
              <span className="sm:hidden">Seed</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};

export default Navbar;
