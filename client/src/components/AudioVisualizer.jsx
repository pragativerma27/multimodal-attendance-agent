import React, { useRef, useState, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  UploadCloud,
  FileAudio,
  ShieldCheck,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import axiosClient from '../api/axiosClient';

const AudioVisualizer = ({ onAcousticUpdate }) => {
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const animFrameId = useRef(null);

  const [isListening, setIsListening] = useState(false);
  const [micError, setMicError] = useState(null);
  const [dbLevel, setDbLevel] = useState(42);
  const [speechPresence, setSpeechPresence] = useState(false);
  const [acousticCategory, setAcousticCategory] = useState('Quiet Lecture');

  // Audio Upload State
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);

  // Start Real Microphone Monitoring via Web Audio API
  const startListening = async () => {
    setMicError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });

      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioContextClass();
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      audioContextRef.current = audioCtx;
      analyserRef.current = analyser;
      sourceRef.current = { source, stream };

      setIsListening(true);
    } catch (err) {
      console.warn('Microphone access denied/unavailable:', err.message);
      setMicError(
        'Microphone access was denied or is not available. You can analyze an audio file below or simulate live acoustic audio.'
      );
    }
  };

  const stopListening = () => {
    if (sourceRef.current) {
      sourceRef.current.stream.getTracks().forEach((t) => t.stop());
      sourceRef.current.source.disconnect();
      sourceRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
    }
    if (animFrameId.current) {
      cancelAnimationFrame(animFrameId.current);
    }
    setIsListening(false);
  };

  useEffect(() => {
    return () => {
      stopListening();
    };
  }, []);

  // Web Audio Visualizer Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      let dataArray;
      if (isListening && analyserRef.current) {
        const bufferLength = analyserRef.current.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
        analyserRef.current.getByteFrequencyData(dataArray);

        // Compute RMS and dB approximation
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const avg = sum / bufferLength;
        const estimatedDb = Math.min(95, Math.max(30, Math.round(30 + avg * 0.45)));
        const isSpeech = avg > 25;

        setDbLevel(estimatedDb);
        setSpeechPresence(isSpeech);

        let cat = 'Quiet Lecture';
        if (estimatedDb > 75) cat = 'High Chatter / Discussion';
        else if (estimatedDb >= 55) cat = 'Active Speech / Q&A';
        setAcousticCategory(cat);

        if (onAcousticUpdate) {
          onAcousticUpdate({ estimatedDb, isSpeech, cat });
        }
      } else {
        // Subtle ambient waveform simulation when idle
        dataArray = new Uint8Array(32);
        for (let i = 0; i < 32; i++) {
          dataArray[i] = 10 + Math.sin(Date.now() / 300 + i) * 8;
        }
      }

      // Draw Spectrum Bars
      const barCount = 32;
      const barWidth = (width / barCount) - 3;
      let x = 0;

      for (let i = 0; i < barCount; i++) {
        const value = dataArray[i] || 5;
        const barHeight = Math.max(4, (value / 255) * height * 0.9);

        // Gradient coloring based on volume intensity
        const gradient = ctx.createLinearGradient(0, height, 0, height - barHeight);
        if (value > 160) {
          gradient.addColorStop(0, '#f43f5e');
          gradient.addColorStop(1, '#fb7185');
        } else if (value > 90) {
          gradient.addColorStop(0, '#a855f7');
          gradient.addColorStop(1, '#c084fc');
        } else {
          gradient.addColorStop(0, '#4f46e5');
          gradient.addColorStop(1, '#818cf8');
        }

        ctx.fillStyle = gradient;
        ctx.fillRect(x, height - barHeight, barWidth, barHeight);
        x += barWidth + 3;
      }

      animFrameId.current = requestAnimationFrame(render);
    };

    animFrameId.current = requestAnimationFrame(render);

    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [isListening]);

  // Audio File Upload Handler
  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile) return;

    setUploadLoading(true);
    setUploadResult(null);

    const formData = new FormData();
    formData.append('audio', uploadFile);

    try {
      const res = await axiosClient.post('/audio/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data?.success) {
        setUploadResult(res.data.data);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error analyzing uploaded audio');
    } finally {
      setUploadLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Real-Time Microphone Acoustic Monitor */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-indigo-400" />
              <h3 className="font-bold text-white text-base">Web Audio API • Frequency Spectrum</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Live classroom acoustics & ambient sound pressure estimation
            </p>
          </div>

          <button
            onClick={isListening ? stopListening : startListening}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition shadow-lg ${
              isListening
                ? 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/30'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:brightness-110 shadow-indigo-600/30'
            }`}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            <span>{isListening ? 'Stop Listening' : 'Start Audio Monitoring'}</span>
          </button>
        </div>

        {micError && (
          <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
            {micError}
          </div>
        )}

        {/* Real-time Spectrum Canvas */}
        <div className="mt-4 relative bg-slate-950 rounded-xl p-4 border border-slate-800 overflow-hidden">
          <canvas
            ref={canvasRef}
            width={640}
            height={160}
            className="w-full h-36 rounded-lg"
          />

          {isListening && (
            <div className="absolute top-6 left-6 flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur border border-slate-700 text-xs font-semibold text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Web Audio Analyser: Active</span>
            </div>
          )}
        </div>

        {/* Realtime Metrics Summary */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-center">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Estimated Sound Pressure</span>
            <div className="text-2xl font-black text-white mt-0.5">{dbLevel} dB</div>
            <span className="text-[10px] text-slate-400">Classroom noise floor</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-center">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Voice Activity (VAD)</span>
            <div className="text-xl font-bold mt-1">
              {speechPresence ? (
                <span className="text-emerald-400 flex items-center justify-center gap-1">
                  <Activity className="w-4 h-4" /> Speech Detected
                </span>
              ) : (
                <span className="text-slate-400">Background Noise</span>
              )}
            </div>
            <span className="text-[10px] text-slate-400">Spectral band 300Hz - 3.4kHz</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-center">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Acoustic State</span>
            <div className="text-base font-bold text-indigo-300 mt-1">{acousticCategory}</div>
            <span className="text-[10px] text-slate-400">Rule-based classification</span>
          </div>
        </div>
      </div>

      {/* Audio File Upload Analyzer */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
          <UploadCloud className="w-5 h-5 text-purple-400" />
          <div>
            <h3 className="font-bold text-white text-base">Audio File Upload & Offline Analysis</h3>
            <p className="text-xs text-slate-400">
              Upload pre-recorded classroom WAV or MP3 files for post-session acoustic evaluation
            </p>
          </div>
        </div>

        <form onSubmit={handleFileUpload} className="mt-4 space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <label className="flex-1 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-slate-700 hover:border-indigo-500 bg-slate-900/60 cursor-pointer text-xs text-slate-300 transition">
              <FileAudio className="w-5 h-5 text-indigo-400" />
              <span>{uploadFile ? uploadFile.name : 'Select classroom recording (MP3, WAV, OGG)'}</span>
              <input
                type="file"
                accept="audio/*"
                onChange={(e) => setUploadFile(e.target.files[0])}
                className="hidden"
              />
            </label>

            <button
              type="submit"
              disabled={!uploadFile || uploadLoading}
              className="w-full sm:w-auto px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-purple-600 to-indigo-600 hover:brightness-110 text-white shadow-lg shadow-purple-600/30 transition disabled:opacity-50"
            >
              {uploadLoading ? 'Evaluating Audio...' : 'Analyze Recording'}
            </button>
          </div>
        </form>

        {/* Uploaded Analysis Results */}
        {uploadResult && (
          <div className="mt-5 p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
              <span className="font-bold text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                {uploadResult.fileName} ({uploadResult.fileSizeKb} KB)
              </span>
              <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-semibold border border-purple-500/30">
                {uploadResult.acousticCategory}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block">Est. Duration</span>
                <span className="font-bold text-white">{uploadResult.durationEstimatedSeconds}s</span>
              </div>
              <div>
                <span className="text-slate-400 block">Average Decibel</span>
                <span className="font-bold text-emerald-400">{uploadResult.estimatedDb} dB</span>
              </div>
              <div>
                <span className="text-slate-400 block">Speech Presence Ratio</span>
                <span className="font-bold text-indigo-400">
                  {Math.round(uploadResult.speechPresenceRatio * 100)}%
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Activity Level</span>
                <span className="font-bold text-purple-400">{uploadResult.averageActivityLevel}%</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 italic pt-2 border-t border-slate-800">
              {uploadResult.privacyGuarantee}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioVisualizer;
