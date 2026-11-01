import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const pageTitles = {
  '/dashboard': 'Classroom Intelligence Overview',
  '/': 'Classroom Intelligence Overview',
  '/students': 'Student Directory & Roster Management',
  '/attendance': 'Continuous Facial Attendance Monitor',
  '/engagement': 'Multimodal Engagement & Attention Telemetry',
  '/audio': 'Web Audio & Acoustic Frequency Spectrum Analyzer',
  '/recommendations': 'Adaptive AI Teaching Recommendations',
  '/analytics': 'Student Performance & Historical Analytics',
  '/reports': 'Attendance & Engagement Reports Export',
  '/settings': 'Platform & Model Threshold Settings',
};

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const currentTitle = pageTitles[location.pathname] || 'Multimodal Attendance Agent';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <Navbar onOpenSidebar={() => setSidebarOpen(true)} pageTitle={currentTitle} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
