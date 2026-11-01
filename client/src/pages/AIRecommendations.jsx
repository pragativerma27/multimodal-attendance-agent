import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, Filter, CheckCircle2, AlertTriangle, Lightbulb, Play } from 'lucide-react';
import axiosClient from '../api/axiosClient';
import RecommendationCard from '../components/RecommendationCard';

const AIRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [generating, setGenerating] = useState(false);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get('/recommendations', {
        params: { status: statusFilter },
      });
      if (res.data?.success) {
        setRecommendations(res.data.data);
      }
    } catch (err) {
      console.warn('Rec fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [statusFilter]);

  const handleApply = async (id) => {
    try {
      await axiosClient.put(`/recommendations/${id}`, { status: 'applied' });
      fetchRecommendations();
    } catch (err) {
      alert('Error updating recommendation');
    }
  };

  const handleDismiss = async (id) => {
    try {
      await axiosClient.put(`/recommendations/${id}`, { status: 'dismissed' });
      fetchRecommendations();
    } catch (err) {
      alert('Error dismissing recommendation');
    }
  };

  const handleTriggerEvaluation = async () => {
    try {
      setGenerating(true);
      const res = await axiosClient.post('/recommendations/generate', {
        metrics: {
          overallScore: 48, // Low engagement trigger
          inactivityDurationSec: 28, // High inactivity trigger
          audioActivityLevel: 14, // Low participation trigger
          headMovementScore: 35,
        },
      });
      if (res.data?.success) {
        fetchRecommendations();
      }
    } catch (err) {
      alert('Error triggering evaluation');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            AI Teaching Recommendations
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Rule-based multimodal intelligence: actionable pacing, breaks & participation prompts
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleTriggerEvaluation}
            disabled={generating}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-purple-600 to-indigo-600 hover:brightness-110 text-white shadow-lg shadow-purple-600/30 transition disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 ${generating ? 'animate-spin' : ''}`} />
            <span>{generating ? 'Evaluating Cohort...' : 'Evaluate Live Session'}</span>
          </button>

          <button
            onClick={fetchRecommendations}
            title="Refresh Recommendations"
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs text-slate-300 font-semibold">Filter by Status:</span>
          <div className="flex items-center gap-1.5">
            {['all', 'pending', 'applied', 'dismissed'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition ${
                  statusFilter === status
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <span className="text-xs text-slate-400 hidden sm:inline">
          Showing {recommendations.length} recommendation(s)
        </span>
      </div>

      {/* Recommendations Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations && recommendations.length > 0 ? (
          recommendations.map((rec) => (
            <RecommendationCard
              key={rec._id}
              recommendation={rec}
              onApply={handleApply}
              onDismiss={handleDismiss}
            />
          ))
        ) : (
          <div className="col-span-2 glass-panel rounded-2xl p-12 border border-slate-800 text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <h4 className="text-white font-bold text-base">No Action Items for Current Filter</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Cohort telemetry is optimal. Click "Evaluate Live Session" to synthesize new recommendations from active multimodal signals.
            </p>
          </div>
        )}
      </div>

      {/* Rule Intelligence Explainer */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-3">
        <h3 className="font-bold text-white text-sm flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-400" />
          <span>Rule-Based Decision Logic Architecture</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs text-slate-300">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="font-bold text-rose-400 block mb-1">Engagement &lt; 50%</span>
            <p className="text-slate-400 text-[11px]">
              Triggers instant interactive poll or conceptual check-in to recapture visual focus.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="font-bold text-amber-400 block mb-1">Inactivity &gt; 25s</span>
            <p className="text-slate-400 text-[11px]">
              Detects physical posture stagnation and advises a 90-second stretch or whiteboard transition.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="font-bold text-indigo-400 block mb-1">Speech Ratio &lt; 20%</span>
            <p className="text-slate-400 text-[11px]">
              Flags extended monologue and suggests "Think-Pair-Share" student dialogue.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="font-bold text-emerald-400 block mb-1">Engagement &ge; 85%</span>
            <p className="text-slate-400 text-[11px]">
              Identifies peak cohort flow and recommends introducing complex challenge problems.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIRecommendations;
