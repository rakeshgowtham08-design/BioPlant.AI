import React, { useState } from 'react';
import { MetricBenchmark } from '../types';
import { CheckCircle2, AlertTriangle, ArrowUpRight, ArrowDownRight, Info } from 'lucide-react';

interface GaugeMeterProps {
  benchmark: MetricBenchmark;
}

export const GaugeMeter: React.FC<GaugeMeterProps> = ({ benchmark }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  // Compute maximum scale for the horizontal bar
  let scaleMax = 150;
  if (benchmark.key === 'ph') scaleMax = 14;
  else if (benchmark.key === 'rainfall') scaleMax = 350;
  else if (benchmark.key === 'temperature') scaleMax = 45;

  // Compute percentage positions along the bar
  const userPercent = Math.min(100, Math.max(0, (benchmark.userValue / scaleMax) * 100));
  const idealMinPercent = Math.min(100, Math.max(0, (benchmark.idealMin / scaleMax) * 100));
  const idealMaxPercent = Math.min(100, Math.max(0, (benchmark.idealMax / scaleMax) * 100));
  const idealWidthPercent = Math.max(2, idealMaxPercent - idealMinPercent);

  // Status badge styling
  const isPh = benchmark.key === 'ph';
  let badgeClasses = 'bg-emerald-100 text-forest-800 border-emerald-300';
  let statusIcon = <CheckCircle2 className="w-3.5 h-3.5 text-forest-700" />;

  if (benchmark.status === 'Optimal') {
    badgeClasses = isPh 
      ? 'bg-amber-100 text-amber-900 border-amber-400 font-semibold' 
      : 'bg-mint-100 text-forest-800 border-forest-400';
  } else if (benchmark.status === 'Low' || benchmark.status === 'Deficient') {
    badgeClasses = isPh 
      ? 'bg-amber-200 text-amber-950 border-amber-500 font-semibold' 
      : 'bg-rose-100 text-rose-800 border-rose-300';
    statusIcon = <ArrowDownRight className="w-3.5 h-3.5 text-rose-600" />;
  } else if (benchmark.status === 'High' || benchmark.status === 'Excess') {
    badgeClasses = isPh 
      ? 'bg-amber-200 text-amber-950 border-amber-500 font-semibold' 
      : 'bg-amber-100 text-amber-800 border-amber-300';
    statusIcon = <ArrowUpRight className="w-3.5 h-3.5 text-amber-700" />;
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-slate-800 text-sm">{benchmark.name}</span>
          {isPh && (
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
              pH Alert Gauge
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {/* User Value Chip */}
          <span className="font-mono text-sm font-bold text-forest-900 bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200">
            {benchmark.userValue} {benchmark.unit}
          </span>
          {/* Status Pill */}
          <span className={`inline-flex items-center space-x-1 text-xs px-2 py-0.5 rounded-full border ${badgeClasses}`}>
            {statusIcon}
            <span>{benchmark.status}</span>
          </span>
        </div>
      </div>

      {/* Mini-Horizontal Gauge Bar */}
      <div className="relative my-3 pt-3 pb-1">
        {/* Track Background */}
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200 relative">
          {/* Ideal Range Band */}
          <div
            className={`absolute top-0 bottom-0 ${
              isPh ? 'bg-amber-200/80 border-x border-amber-400' : 'bg-mint-200/90 border-x border-forest-400'
            }`}
            style={{
              left: `${idealMinPercent}%`,
              width: `${idealWidthPercent}%`
            }}
            title={`Ideal range: ${benchmark.idealMin} - ${benchmark.idealMax} ${benchmark.unit}`}
          />
        </div>

        {/* User Pointer Marker */}
        <div
          className="absolute top-0 transform -translate-x-1/2 flex flex-col items-center group cursor-pointer"
          style={{ left: `${userPercent}%` }}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          {/* Pin Arrow */}
          <div className="w-2.5 h-2.5 bg-forest-800 rotate-45 transform -translate-y-0.5 shadow-sm rounded-xs border border-white" />
          <div className="w-1 h-3.5 bg-forest-800 rounded-full" />
        </div>
      </div>

      {/* Axis Scale Labels */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <span>0 {benchmark.unit}</span>
        <span className="text-slate-600 font-medium">
          Ideal Range: <strong className="text-forest-800">{benchmark.idealMin} – {benchmark.idealMax} {benchmark.unit}</strong>
        </span>
        <span>{scaleMax} {benchmark.unit}</span>
      </div>

      {/* Recommendation & Agronomic Guidance */}
      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-start space-x-2 text-xs text-slate-600 bg-slate-50/70 p-2 rounded-lg">
        <Info className="w-3.5 h-3.5 text-forest-700 mt-0.5 flex-shrink-0" />
        <p className="leading-snug">
          <strong className="text-slate-800">Biotech Insight: </strong>
          {benchmark.recommendation}
        </p>
      </div>
    </div>
  );
};

