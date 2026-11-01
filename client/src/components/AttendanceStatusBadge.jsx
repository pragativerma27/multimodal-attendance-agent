import React from 'react';
import { CheckCircle2, XCircle, Clock, Video, Sparkles } from 'lucide-react';

const AttendanceStatusBadge = ({ status, method }) => {
  const isPresent = status === 'present';
  const isAbsent = status === 'absent';
  const isLate = status === 'late';

  return (
    <div className="inline-flex items-center gap-1.5">
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
          isPresent
            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
            : isLate
            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
            : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
        }`}
      >
        {isPresent && <CheckCircle2 className="w-3 h-3" />}
        {isLate && <Clock className="w-3 h-3" />}
        {isAbsent && <XCircle className="w-3 h-3" />}
        <span className="capitalize">{status}</span>
      </span>

      {method && (
        <span
          className={`text-[10px] px-2 py-0.5 rounded font-medium border ${
            method === 'sustained_presence'
              ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
              : method === 'face_recognition'
              ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
              : method === 'demo'
              ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
              : 'bg-slate-700/50 text-slate-300 border-slate-600'
          }`}
        >
          {method === 'sustained_presence'
            ? 'Continuous Presence'
            : method === 'face_recognition'
            ? 'Face AI'
            : method === 'demo'
            ? 'Demo Mode'
            : 'Manual'}
        </span>
      )}
    </div>
  );
};

export default AttendanceStatusBadge;
