import React, { useState } from 'react';
import { Volume2, Mic, Info, ShieldCheck, CheckCircle2, AlertTriangle } from 'lucide-react';
import AudioVisualizer from '../components/AudioVisualizer';
import PrivacyDisclaimer from '../components/PrivacyDisclaimer';

const AudioAnalysis = () => {
  const [latestAcoustic, setLatestAcoustic] = useState(null);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Acoustic & Web Audio Analysis
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time spectral analysis, noise level estimation & classroom participation metrics
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-indigo-400" />
          <span>Non-Invasive Spectral Analyzer</span>
        </div>
      </div>

      {/* Embedded High-Fidelity Web Audio Visualizer */}
      <AudioVisualizer onAcousticUpdate={(data) => setLatestAcoustic(data)} />

      {/* Classroom Acoustic Standards & Guidelines */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
        <h3 className="font-bold text-white text-base flex items-center gap-2">
          <Info className="w-4 h-4 text-indigo-400" />
          <span>Classroom Acoustic Reference Benchmarks (ANSI/ASA S12.60)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between font-bold text-emerald-400">
              <span>35 dB – 50 dB</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20">Optimal Lecture</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Ideal noise floor for high speech intelligibility and low vocal strain. Students hear instructor clearly without acoustic interference.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between font-bold text-amber-400">
              <span>55 dB – 72 dB</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20">Active Discussion</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Expected dynamic range during student breakout groups, think-pair-share exercises, and interactive Q&A exchanges.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between font-bold text-rose-400">
              <span>&gt; 75 dB</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20">Excessive Noise</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Ambient noise exceeds recommended instructional threshold. Suggests loud background hum or uncoordinated side chatter.
            </p>
          </div>
        </div>
      </div>

      <PrivacyDisclaimer />
    </div>
  );
};

export default AudioAnalysis;
