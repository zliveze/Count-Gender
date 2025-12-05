import React from 'react';

interface StatsCardProps {
  title: string;
  count: number;
  total: number;
  colorClass: string;
  icon: React.ReactNode;
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, count, total, colorClass, icon }) => {
  const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : '0.0';

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4 transition-transform hover:scale-[1.02]">
      <div className={`p-4 rounded-full ${colorClass} bg-opacity-10 text-opacity-100`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">{title}</p>
        <div className="flex items-baseline space-x-2">
            <h3 className="text-2xl font-bold text-slate-800">{count}</h3>
            <span className="text-xs font-medium text-slate-400">({percentage}%)</span>
        </div>
      </div>
    </div>
  );
};