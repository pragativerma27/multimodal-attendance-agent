import React, { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  Calendar,
  Filter,
  Printer,
  CheckCircle2,
  FileSpreadsheet,
  FileCheck,
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import axiosClient from '../api/axiosClient';

const Reports = () => {
  const [reportType, setReportType] = useState('daily');
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setLoading(true);
        const [attRes, stuRes] = await Promise.all([
          axiosClient.get('/attendance'),
          axiosClient.get('/students'),
        ]);

        if (attRes.data?.success) setAttendanceRecords(attRes.data.data);
        if (stuRes.data?.success) setStudents(stuRes.data.data);
      } catch (err) {
        console.warn('Report fetch issue:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, []);

  // CSV Export
  const handleExportCSV = async () => {
    try {
      const response = await axiosClient.get('/reports/export/csv', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `attendance-report-${reportType}-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Error downloading CSV report');
    }
  };

  // PDF Export via jsPDF & AutoTable
  const handleExportPDF = () => {
    try {
      const doc = new jsPDF();

      // Report Header
      doc.setFontSize(16);
      doc.setTextColor(30, 41, 59);
      doc.text('MULTIMODAL ATTENDANCE & ENGAGEMENT AGENT', 14, 20);

      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      doc.text(`Official Academic Attendance Report • Type: ${reportType.toUpperCase()}`, 14, 26);
      doc.text(`Generated On: ${new Date().toLocaleString()}`, 14, 32);

      // Table formatting
      const tableData = attendanceRecords.map((r, i) => [
        i + 1,
        r.student?.studentId || 'N/A',
        r.student?.name || 'Student',
        r.student?.rollNumber || '',
        r.session?.courseCode || 'CS302',
        r.status.toUpperCase(),
        `${r.sustainedDurationSeconds || 3.0}s`,
        new Date(r.timestamp).toLocaleTimeString(),
      ]);

      doc.autoTable({
        startY: 38,
        head: [['#', 'Student ID', 'Full Name', 'Roll', 'Course', 'Status', 'Sustained Presence', 'Timestamp']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [79, 70, 229], textColor: [255, 255, 255], fontStyle: 'bold' },
        styles: { fontSize: 8 },
      });

      doc.save(`attendance-report-${reportType}-${Date.now()}.pdf`);
    } catch (err) {
      console.error('PDF Generation error:', err);
      alert('Failed to generate PDF. Make sure all records are loaded.');
    }
  };

  const totalPresent = attendanceRecords.filter((r) => r.status === 'present').length;
  const totalStudents = students.length || 10;
  const pct = totalStudents > 0 ? Math.round((totalPresent / totalStudents) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Academic Reports & Export
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Generate printable PDF transcripts and spreadsheet CSV records
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 transition"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleExportPDF}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-indigo-600 to-purple-600 hover:brightness-110 text-white shadow-lg shadow-indigo-600/30 transition"
          >
            <FileCheck className="w-4 h-4" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Report Controls & Type Selectors */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-indigo-400" />
          <span className="text-xs text-slate-300 font-semibold">Report Period:</span>
          <div className="flex items-center gap-1.5">
            {[
              { id: 'daily', label: 'Daily Roll' },
              { id: 'weekly', label: 'Weekly Summary' },
              { id: 'monthly', label: 'Monthly Term' },
              { id: 'engagement', label: 'Engagement Audit' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setReportType(t.id)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  reportType === t.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <span className="text-xs text-slate-400">Total Records: {attendanceRecords.length}</span>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel rounded-2xl p-4 border border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Enrolled Students</span>
          <div className="text-2xl font-black text-white mt-1">{totalStudents}</div>
          <span className="text-xs text-slate-400">Active classroom register</span>
        </div>

        <div className="glass-panel rounded-2xl p-4 border border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Present Today</span>
          <div className="text-2xl font-black text-emerald-400 mt-1">{totalPresent}</div>
          <span className="text-xs text-slate-400">Continuous presence verified</span>
        </div>

        <div className="glass-panel rounded-2xl p-4 border border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Attendance Rate</span>
          <div className="text-2xl font-black text-indigo-400 mt-1">{pct}%</div>
          <span className="text-xs text-slate-400">Term session threshold</span>
        </div>
      </div>

      {/* Report Table Preview */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="font-bold text-white text-base">Report Preview Transcript</h3>
          <span className="text-xs text-slate-400">CS302: AI Vision Lab</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Student ID</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Roll</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Sustained Gaze</th>
                <th className="py-3 px-4">Recorded At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {attendanceRecords && attendanceRecords.length > 0 ? (
                attendanceRecords.map((r, i) => (
                  <tr key={r._id} className="hover:bg-slate-900/50">
                    <td className="py-3 px-4 text-slate-400">{i + 1}</td>
                    <td className="py-3 px-4 font-mono font-bold text-indigo-400">
                      {r.student?.studentId}
                    </td>
                    <td className="py-3 px-4 font-semibold text-white">{r.student?.name}</td>
                    <td className="py-3 px-4 font-mono">{r.student?.rollNumber || 'N/A'}</td>
                    <td className="py-3 px-4 text-slate-400">{r.student?.department}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                          r.status === 'present'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-indigo-300">
                      {r.sustainedDurationSeconds ? `${r.sustainedDurationSeconds}s` : '3.0s'}
                    </td>
                    <td className="py-3 px-4 text-slate-400 font-mono">
                      {new Date(r.timestamp).toLocaleTimeString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-6 text-slate-400">
                    No attendance records for report.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
