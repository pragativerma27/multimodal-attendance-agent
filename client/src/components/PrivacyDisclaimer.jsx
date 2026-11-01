import React, { useState } from 'react';
import { ShieldAlert, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';

const PrivacyDisclaimer = ({ compact = false }) => {
  const [expanded, setExpanded] = useState(false);

  if (compact) {
    return (
      <div className="flex items-center gap-2 p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/20 text-xs text-indigo-300/90">
        <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
        <span>
          <strong>Privacy Preserving Architecture:</strong> Live camera & audio frames are processed client-side. No raw biometric video or voice transcripts are recorded or stored.
        </span>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
      <div
        className="flex items-center justify-between cursor-pointer select-none"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2.5 font-semibold text-slate-200">
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <span>Multimodal Privacy & Algorithmic Ethics Advisory</span>
        </div>
        <button className="text-slate-400 hover:text-white">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-2 text-slate-400 leading-relaxed">
          <p>
            • <strong>Local Video Pipeline:</strong> Facial bounding coordinates and head orientation are computed client-side via browser computer vision. Video frames are discarded immediately after feature extraction.
          </p>
          <p>
            • <strong>Non-Invasive Web Audio API:</strong> Audio analysis measures acoustic energy and frequency envelope only. The system does not identify speakers or transcribe conversation content.
          </p>
          <p>
            • <strong>Scientific Engagement Proxy:</strong> Head orientation and movement patterns serve solely as operational behavioral proxies and do not claim to definitively quantify cognitive attention or learning outcomes.
          </p>
        </div>
      )}
    </div>
  );
};

export default PrivacyDisclaimer;
