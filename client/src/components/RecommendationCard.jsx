import React from 'react';
import { AlertTriangle, CheckCircle, Clock, Lightbulb, ArrowRight, X } from 'lucide-react';

const RecommendationCard = ({ recommendation, onApply, onDismiss }) => {
  const { _id, type, triggerReason, recommendationText, suggestedAction, priority, status } = recommendation;

  const priorityColors = {
    high: 'border-rose-500/30 bg-rose-950/20 text-rose-400',
    medium: 'border-amber-500/30 bg-amber-950/20 text-amber-400',
    low: 'border-indigo-500/30 bg-indigo-950/20 text-indigo-400',
  };

  const isPending = status === 'pending';

  return (
    <div
      className={`glass-panel rounded-2xl p-4 sm:p-5 border transition-all ${
        priority === 'high' ? 'border-rose-500/40' : 'border-slate-800'
      } relative overflow-hidden`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
              priorityColors[priority] || priorityColors.medium
            }`}
          >
            {priority} Priority
          </span>
          <span className="text-xs text-slate-400 capitalize px-2 py-0.5 rounded bg-slate-800/80">
            {type} Signal
          </span>
        </div>

        {isPending && onDismiss && (
          <button
            onClick={() => onDismiss(_id)}
            title="Dismiss recommendation"
            className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <p className="text-sm font-semibold text-white mt-1 leading-snug">{recommendationText}</p>

      <div className="mt-2.5 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
        <div className="flex items-start gap-2 text-indigo-300">
          <Lightbulb className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
          <div>
            <span className="font-semibold text-slate-200">Suggested Action: </span>
            <span>{suggestedAction}</span>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/60">
        <span className="italic truncate pr-2">Trigger: {triggerReason}</span>
        {isPending ? (
          onApply && (
            <button
              onClick={() => onApply(_id)}
              className="flex items-center gap-1 font-semibold text-indigo-400 hover:text-indigo-300 hover:underline shrink-0"
            >
              <span>Apply Action</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )
        ) : (
          <span className="capitalize font-semibold text-emerald-400 flex items-center gap-1 shrink-0">
            <CheckCircle className="w-3.5 h-3.5" /> {status}
          </span>
        )}
      </div>
    </div>
  );
};

export default RecommendationCard;
