import React from 'react';

const StatCard = ({ title, value, subtitle, icon: Icon, color = 'indigo', badge }) => {
  const colorMap = {
    indigo: 'from-indigo-500/20 to-purple-500/20 text-indigo-400 border-indigo-500/30',
    emerald: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30',
    amber: 'from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30',
    rose: 'from-rose-500/20 to-pink-500/20 text-rose-400 border-rose-500/30',
    cyan: 'from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/30',
    purple: 'from-purple-500/20 to-fuchsia-500/20 text-purple-400 border-purple-500/30',
  };

  const selectedTheme = colorMap[color] || colorMap.indigo;

  return (
    <div className="glass-panel glass-panel-hover rounded-2xl p-5 relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-400 tracking-wider uppercase mb-1">{title}</p>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{value}</h3>
          {subtitle && <p className="text-xs text-slate-400 mt-1 font-medium">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${selectedTheme} border shrink-0`}>
          {Icon && <Icon className="w-5 h-5" />}
        </div>
      </div>
      {badge && (
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <span className="text-slate-400">{badge.label}</span>
          <span className={`font-semibold ${badge.isPositive ? 'text-emerald-400' : 'text-slate-300'}`}>
            {badge.value}
          </span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
