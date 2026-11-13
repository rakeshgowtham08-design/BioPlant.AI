import React, { useState, useEffect } from 'react';
import { PredictionResult, FieldProfile } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface ScreenResultsProps {
  result: PredictionResult;
  selectedField: FieldProfile;
  onBackToDiagnostics: () => void;
  onSaveToHistory: () => void;
  isSaved: boolean;
  onNavigateToMarketplace?: () => void;
}

export const ScreenResults: React.FC<ScreenResultsProps> = ({
  result,
  selectedField,
  onBackToDiagnostics,
  onSaveToHistory,
  isSaved,
  onNavigateToMarketplace
}) => {
  const { language, t } = useLanguage();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isDualGauge, setIsDualGauge] = useState(false);
  const [strokeOffset, setStrokeOffset] = useState(188.4);

  const crop = result.primaryCrop;
  const confidenceScore = result.confidence;

  // Animate circular radial progress bar
  useEffect(() => {
    const timer = setTimeout(() => {
      // Circumference = 2 * Math.PI * 30 = 188.495
      const offset = 188.4 * (1 - confidenceScore / 100);
      setStrokeOffset(offset);
    }, 150);
    return () => clearTimeout(timer);
  }, [confidenceScore]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleDownloadPdf = () => {
    window.print();
    showToast('Compiling Agronomic Plan (PDF)...');
  };

  const handleSave = () => {
    onSaveToHistory();
    showToast(`Successfully logged to ${selectedField.name} Database`);
  };

  const handleToggleDualGauge = () => {
    setIsDualGauge(!isDualGauge);
    showToast(!isDualGauge ? 'Displaying Normalized Relative Variance' : 'Displaying Dual Gauge Standard Units');
  };

  // Find benchmark items
  const nBench = result.benchmarks.find(b => b.key === 'nitrogen') || result.benchmarks[0];
  const pBench = result.benchmarks.find(b => b.key === 'phosphorus') || result.benchmarks[1];
  const kBench = result.benchmarks.find(b => b.key === 'potassium') || result.benchmarks[2];
  const phBench = result.benchmarks.find(b => b.key === 'ph') || result.benchmarks[3];
  const rainBench = result.benchmarks.find(b => b.key === 'rainfall') || result.benchmarks[4];
  const tempBench = result.benchmarks.find(b => b.key === 'temperature') || result.benchmarks[5];

  // Distribution helper status
  const getAltStatus = (index: number) => {
    if (index === 0) return { label: 'Primary Choice', badge: 'bg-secondary-container text-on-secondary-container' };
    if (index === 1) return { label: 'Viable Alt', badge: 'bg-surface-container text-on-surface-variant' };
    if (index === 2) return { label: 'Low Fit', badge: 'bg-surface-container text-on-surface-variant' };
    if (index === 3) return { label: 'Suboptimal Drainage', badge: 'bg-surface-container text-on-surface-variant' };
    return { label: 'Incompatible', badge: 'bg-error-container text-on-error-container' };
  };

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto px-gutter-sm space-y-space-lg py-space-md pb-24 animate-in fade-in duration-200">
      
      {/* Top Status Ribbon with Visual Anchor */}
      <div className="flex items-center justify-between bg-surface-container px-3.5 py-2 rounded-xl border border-surface-container-high/60">
        <div className="flex items-center gap-2">
          <span className="inline-flex w-2 h-2 rounded-full bg-primary-container animate-pulse"></span>
          <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider font-bold">
            [🌾] {t('res.inference_complete')}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-on-surface-variant">
          <span className="material-symbols-outlined text-[15px]">verified</span>
          <span className="font-label-sm text-label-sm">Random Forest (45 Trees) Evaluated</span>
        </div>
      </div>

      {/* Interactive Hero Section: Crop Recommendation Badge */}
      <div className="relative bg-surface-container-lowest rounded-2xl p-space-md shadow-sm overflow-hidden border border-surface-container-high/60">
        {/* Decorative Botanical Waveform Backing (SVG) */}
        <svg 
          className="absolute -right-10 -bottom-10 w-48 h-48 opacity-[0.06] text-primary pointer-events-none" 
          fill="currentColor" 
          viewBox="0 0 200 200"
        >
          <path d="M42.7,-64.1C55.6,-57.4,66.7,-47.5,73.8,-35.1C80.8,-22.7,83.8,-7.8,81.3,6.3C78.8,20.4,70.9,33.7,60.8,44.2C50.7,54.6,38.5,62.2,25.2,67.2C11.9,72.2,-2.4,74.5,-16.4,71.7C-30.4,68.9,-44,61,-54.6,50.1C-65.2,39.2,-72.8,25.2,-76.3,9.8C-79.8,-5.5,-79.1,-22.2,-71.9,-35.4C-64.8,-48.6,-51.2,-58.3,-37.2,-64.4C-23.2,-70.6,-8.8,-73.2,3.9,-79.6C16.6,-86,29.8,-70.8,42.7,-64.1Z" transform="translate(100 100)" />
        </svg>

        <div className="flex items-start justify-between gap-space-sm relative z-10">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container mb-2">
              <span className="material-symbols-outlined text-[14px]">eco</span>
              <span className="font-label-sm text-label-sm font-semibold">Primary Affinity Match</span>
            </div>
            <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-primary tracking-tight font-serif">
              {crop.name}
            </h2>
            <p className="font-display-lg-mobile text-body-md text-on-surface-variant italic font-serif">
              {crop.scientificName}
            </p>
          </div>

          {/* Radial Precision Gauge */}
          <div className="relative flex items-center justify-center flex-shrink-0 w-20 h-20">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 72 72">
              <circle 
                className="text-surface-container" 
                cx="36" 
                cy="36" 
                fill="transparent" 
                r="30" 
                stroke="currentColor" 
                strokeWidth="5" 
              />
              <circle 
                className="text-primary-container transition-all duration-1000 ease-out" 
                cx="36" 
                cy="36" 
                fill="transparent" 
                r="30" 
                stroke="currentColor" 
                strokeDasharray="188.4" 
                strokeDashoffset={strokeOffset} 
                strokeLinecap="round" 
                strokeWidth="5" 
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="font-headline-sm text-headline-sm text-primary font-bold leading-none font-mono">
                {confidenceScore}%
              </span>
              <span className="font-label-sm text-[9px] text-on-surface-variant uppercase tracking-tighter mt-0.5">
                Score
              </span>
            </div>
          </div>
        </div>

        {/* Crop Archetype & Visual Micro-Cards */}
        <div className="mt-space-md grid grid-cols-2 gap-space-sm relative z-10">
          <div className="bg-surface-container-low rounded-xl p-2.5 flex flex-col justify-between border border-surface-container-high/40">
            <span className="font-label-sm text-label-sm text-on-surface-variant">Cultivar Lineage</span>
            <span className="font-title-md text-title-md text-primary font-semibold truncate mt-1">
              KMR-3 Resilient
            </span>
            <span className="font-label-sm text-[10px] text-secondary mt-0.5">{crop.cycle}</span>
          </div>

          <div className="bg-surface-container-low rounded-xl p-2.5 flex flex-col justify-between border border-surface-container-high/40">
            <span className="font-label-sm text-label-sm text-on-surface-variant">Ensemble Model</span>
            <span className="font-title-md text-title-md text-primary font-semibold truncate mt-1">
              Random Forest
            </span>
            <span className="font-label-sm text-[10px] text-secondary mt-0.5">45 Estimators Evaluated</span>
          </div>
        </div>

        {/* Quick Soil Match Progress Banner */}
        <div className="mt-space-sm p-2.5 bg-surface-bright rounded-xl flex items-center gap-2.5 border border-surface-container-high/60 relative z-10">
          <div className="w-7 h-7 rounded-lg bg-primary-fixed flex items-center justify-center text-on-primary-fixed flex-shrink-0">
            <span className="material-symbols-outlined text-[16px]">water_lux</span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm text-primary font-semibold">Agronomic Congruence Index</span>
              <span className="font-label-sm text-label-sm text-primary font-bold">96.8 / 100</span>
            </div>
            <div className="w-full bg-surface-container h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div className="bg-primary-container h-full rounded-full transition-all duration-700" style={{ width: '96.8%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Field vs. Ideal Comparison Matrix */}
      <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm space-y-space-md border border-surface-container-high/60">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider block">Bio-Telemetry</span>
            <h3 className="font-headline-sm text-headline-sm text-primary font-serif">Field vs. Ideal Envelope</h3>
          </div>
          <button 
            type="button"
            onClick={handleToggleDualGauge}
            className="px-2.5 py-1 rounded-lg bg-surface-container text-on-surface font-label-sm text-label-sm flex items-center gap-1 hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-[14px]">tune</span>
            <span>{isDualGauge ? 'Standard View' : 'Dual Gauge'}</span>
          </button>
        </div>

        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Variance tolerances mapped to standard agronomic thresholds of <em className="text-primary font-medium">{crop.name}</em> cultivation.
        </p>

        <div className="space-y-3.5 pt-1">
          
          {/* 1. Nitrogen (N) */}
          <div className="p-3 bg-surface-container-low rounded-xl border border-surface-container-high/50">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-[11px]">N</span>
                <span className="font-title-md text-title-md text-primary font-semibold">Nitrogen</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-label-sm text-label-sm px-1.5 py-0.5 rounded bg-surface-container-highest text-on-surface font-semibold">
                  {nBench.status === 'Optimal' ? 'Match 96%' : `${nBench.status}`}
                </span>
                <span className="font-label-sm text-label-sm text-primary font-bold">
                  {nBench.userValue} <span className="font-normal text-on-surface-variant text-[10px]">mg/kg</span>
                </span>
              </div>
            </div>
            
            {/* Gauge Bar */}
            <div className="relative w-full h-3 bg-surface-container rounded-full overflow-hidden flex items-center">
              {/* Ideal Envelope zone */}
              <div 
                className="absolute h-full bg-secondary-fixed/60" 
                style={{ 
                  left: `${(nBench.idealMin / 150) * 100}%`, 
                  width: `${((nBench.idealMax - nBench.idealMin) / 150) * 100}%` 
                }}
              ></div>
              {/* Current Fill */}
              <div 
                className="h-full bg-primary-container rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(100, (nBench.userValue / 150) * 100)}%` }}
              ></div>
              {/* Ideal Center Target Pip */}
              <div 
                className="absolute top-0 bottom-0 w-1 bg-tertiary-fixed-dim rounded-full shadow-sm" 
                style={{ left: `${(nBench.idealOptimal / 150) * 100}%` }}
                title={`Ideal: ${nBench.idealOptimal} mg/kg`}
              ></div>
            </div>

            <div className="flex justify-between items-center text-[10px] text-on-surface-variant mt-1.5 font-mono">
              <span>Soil: <strong>{nBench.userValue} mg/kg</strong></span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary-fixed-dim inline-block"></span> 
                Ideal: {nBench.idealOptimal} mg/kg
              </span>
              <span className="text-primary font-semibold">{nBench.percentageDifference > 0 ? `+${nBench.percentageDifference}%` : `${nBench.percentageDifference}%`}</span>
            </div>
          </div>

          {/* 2. Phosphorus (P) */}
          <div className="p-3 bg-surface-container-low rounded-xl border border-surface-container-high/50">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-[11px]">P</span>
                <span className="font-title-md text-title-md text-primary font-semibold">Phosphorus</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-label-sm text-label-sm px-1.5 py-0.5 rounded bg-surface-container-highest text-on-surface font-semibold">
                  {pBench.status === 'Optimal' ? 'Match 94%' : `${pBench.status}`}
                </span>
                <span className="font-label-sm text-label-sm text-primary font-bold">
                  {pBench.userValue} <span className="font-normal text-on-surface-variant text-[10px]">mg/kg</span>
                </span>
              </div>
            </div>
            
            <div className="relative w-full h-3 bg-surface-container rounded-full overflow-hidden flex items-center">
              <div 
                className="absolute h-full bg-secondary-fixed/60" 
                style={{ 
                  left: `${(pBench.idealMin / 150) * 100}%`, 
                  width: `${((pBench.idealMax - pBench.idealMin) / 150) * 100}%` 
                }}
              ></div>
              <div 
                className="h-full bg-primary-container rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(100, (pBench.userValue / 150) * 100)}%` }}
              ></div>
              <div 
                className="absolute top-0 bottom-0 w-1 bg-tertiary-fixed-dim rounded-full shadow-sm" 
                style={{ left: `${(pBench.idealOptimal / 150) * 100}%` }}
                title={`Ideal: ${pBench.idealOptimal} mg/kg`}
              ></div>
            </div>

            <div className="flex justify-between items-center text-[10px] text-on-surface-variant mt-1.5 font-mono">
              <span>Soil: <strong>{pBench.userValue} mg/kg</strong></span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary-fixed-dim inline-block"></span> 
                Ideal: {pBench.idealOptimal} mg/kg
              </span>
              <span className="text-primary font-semibold">Near Optimum</span>
            </div>
          </div>

          {/* 3. Potassium (K) */}
          <div className="p-3 bg-surface-container-low rounded-xl border border-surface-container-high/50">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-[11px]">K</span>
                <span className="font-title-md text-title-md text-primary font-semibold">Potassium</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-label-sm text-label-sm px-1.5 py-0.5 rounded bg-surface-container-highest text-on-surface font-semibold">
                  {kBench.status === 'Optimal' ? 'Match 95%' : `${kBench.status}`}
                </span>
                <span className="font-label-sm text-label-sm text-primary font-bold">
                  {kBench.userValue} <span className="font-normal text-on-surface-variant text-[10px]">mg/kg</span>
                </span>
              </div>
            </div>
            
            <div className="relative w-full h-3 bg-surface-container rounded-full overflow-hidden flex items-center">
              <div 
                className="absolute h-full bg-secondary-fixed/60" 
                style={{ 
                  left: `${(kBench.idealMin / 150) * 100}%`, 
                  width: `${((kBench.idealMax - kBench.idealMin) / 150) * 100}%` 
                }}
              ></div>
              <div 
                className="h-full bg-primary-container rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(100, (kBench.userValue / 150) * 100)}%` }}
              ></div>
              <div 
                className="absolute top-0 bottom-0 w-1 bg-tertiary-fixed-dim rounded-full shadow-sm" 
                style={{ left: `${(kBench.idealOptimal / 150) * 100}%` }}
                title={`Ideal: ${kBench.idealOptimal} mg/kg`}
              ></div>
            </div>

            <div className="flex justify-between items-center text-[10px] text-on-surface-variant mt-1.5 font-mono">
              <span>Soil: <strong>{kBench.userValue} mg/kg</strong></span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary-fixed-dim inline-block"></span> 
                Ideal: {kBench.idealOptimal} mg/kg
              </span>
              <span className="text-primary font-semibold">Aligned</span>
            </div>
          </div>

          {/* 4. Soil pH Balance (Dual Amber/Green Gauge) */}
          <div className="p-3 bg-surface-container-low rounded-xl border border-surface-container-high/50">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center font-bold text-[11px]">pH</span>
                <span className="font-title-md text-title-md text-primary font-semibold">Soil pH Balance</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-label-sm text-label-sm px-1.5 py-0.5 rounded bg-surface-container-highest text-on-surface font-semibold">
                  Match 98%
                </span>
                <span className="font-label-sm text-label-sm text-primary font-bold">
                  {phBench.userValue.toFixed(1)} pH
                </span>
              </div>
            </div>
            
            <div className="relative w-full h-3 bg-surface-container rounded-full overflow-hidden flex items-center">
              {/* Optimal window 5.5 - 7.5 */}
              <div 
                className="absolute h-full bg-secondary-container" 
                style={{ 
                  left: `${(phBench.idealMin / 14) * 100}%`, 
                  width: `${((phBench.idealMax - phBench.idealMin) / 14) * 100}%` 
                }}
              ></div>
              <div 
                className="h-full bg-on-tertiary-container rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(100, (phBench.userValue / 14) * 100)}%` }}
              ></div>
              <div 
                className="absolute top-0 bottom-0 w-1.5 bg-primary-container rounded-full shadow-sm" 
                style={{ left: `${(phBench.userValue / 14) * 100}%` }}
              ></div>
            </div>

            <div className="flex justify-between items-center text-[10px] text-on-surface-variant mt-1.5">
              <span>Field: <strong>{phBench.userValue.toFixed(1)} ({phBench.userValue < 6 ? 'Acidic' : (phBench.userValue > 7.5 ? 'Alkaline' : 'Neutral')})</strong></span>
              <span>Ideal: {phBench.idealMin} – {phBench.idealMax}</span>
              <span className="text-on-tertiary-container font-semibold">Peak Nutrient Bio-availability</span>
            </div>
          </div>

          {/* 5. Rainfall & Temperature Pair */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* Precipitation */}
            <div className="p-3 bg-surface-container-low rounded-xl border border-surface-container-high/50">
              <div className="flex items-center justify-between mb-1">
                <span className="font-title-md text-body-md text-primary font-semibold">Precipitation</span>
                <span className="font-label-sm text-label-sm text-primary font-bold">99%</span>
              </div>
              <div className="relative w-full h-2.5 bg-surface-container rounded-full overflow-hidden my-1.5">
                <div 
                  className="h-full bg-primary-container rounded-full" 
                  style={{ width: `${Math.min(100, (rainBench.userValue / 300) * 100)}%` }}
                ></div>
                <div 
                  className="absolute top-0 bottom-0 w-1 bg-tertiary-fixed-dim" 
                  style={{ left: `${(rainBench.idealOptimal / 300) * 100}%` }}
                ></div>
              </div>
              <div className="text-[10px] text-on-surface-variant flex justify-between">
                <span><strong>{rainBench.userValue} mm</strong></span>
                <span>Req: {rainBench.idealMin}-{rainBench.idealMax} mm</span>
              </div>
            </div>

            {/* Ambient Temperature */}
            <div className="p-3 bg-surface-container-low rounded-xl border border-surface-container-high/50">
              <div className="flex items-center justify-between mb-1">
                <span className="font-title-md text-body-md text-primary font-semibold">Ambient Temp</span>
                <span className="font-label-sm text-label-sm text-primary font-bold">97%</span>
              </div>
              <div className="relative w-full h-2.5 bg-surface-container rounded-full overflow-hidden my-1.5">
                <div 
                  className="h-full bg-primary-container rounded-full" 
                  style={{ width: `${Math.min(100, (tempBench.userValue / 45) * 100)}%` }}
                ></div>
                <div 
                  className="absolute top-0 bottom-0 w-1 bg-tertiary-fixed-dim" 
                  style={{ left: `${(tempBench.idealOptimal / 45) * 100}%` }}
                ></div>
              </div>
              <div className="text-[10px] text-on-surface-variant flex justify-between">
                <span><strong>{tempBench.userValue}°C</strong></span>
                <span>Req: {tempBench.idealMin}-{tempBench.idealMax}°C</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Ensemble Multi-Crop Probability Distribution */}
      <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm space-y-space-md border border-surface-container-high/60">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider block">Model Ranking</span>
            <h3 className="font-headline-sm text-headline-sm text-primary font-serif">Affinity Distribution</h3>
          </div>
          <span className="material-symbols-outlined text-secondary text-[22px]">bar_chart</span>
        </div>

        <div className="space-y-3">
          {result.distribution.map((item, idx) => {
            const isWinner = idx === 0;
            const status = getAltStatus(idx);
            return (
              <div 
                key={idx} 
                className={`p-2.5 rounded-xl flex flex-col gap-1.5 border ${
                  isWinner ? 'bg-surface-bright border-secondary-container' : 'bg-surface-container-low border-surface-container-high/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                      isWinner ? 'bg-primary-container text-on-primary' : 'bg-surface-container-highest text-on-surface'
                    }`}>
                      {idx + 1}
                    </span>
                    <span className={`font-title-md text-title-md font-semibold ${isWinner ? 'text-primary' : 'text-on-surface'}`}>
                      {item.cropName}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full font-label-sm text-[10px] ${status.badge}`}>
                      {status.label}
                    </span>
                  </div>
                  <span className={`font-title-md text-title-md font-bold font-mono ${isWinner ? 'text-primary' : 'text-on-surface'}`}>
                    {item.probability}%
                  </span>
                </div>

                <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-700 ${
                      isWinner ? 'bg-primary-container' : (idx === 1 ? 'bg-secondary' : 'bg-secondary-fixed-dim')
                    }`} 
                    style={{ width: `${item.probability}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Agronomist Actionable Prescription */}
      <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm space-y-space-md border border-surface-container-high/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-[18px]">psychology</span>
          </div>
          <div>
            <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider block">Generated Directives</span>
            <h3 className="font-headline-sm text-headline-sm text-primary font-serif">Field Agronomic Prescription</h3>
          </div>
        </div>

        <div className="space-y-3">
          {/* Sowing Schedule */}
          <div className="p-3 rounded-xl bg-surface-container-low flex items-start gap-3 border border-surface-container-high/40">
            <div className="w-7 h-7 rounded-lg bg-surface-container-highest text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-[16px]">calendar_month</span>
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-title-md text-title-md text-primary font-semibold font-serif">Recommended Seeding Schedule</h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                Optimal sowing window opens in <strong className="text-primary font-semibold">72 hours</strong> following anticipated precipitation. Ensure mud consolidation index ≥ 4.2.
              </p>
            </div>
          </div>

          {/* Fertilizer Formulation */}
          <div className="p-3 rounded-xl bg-surface-container-low flex items-start gap-3 border border-surface-container-high/40">
            <div className="w-7 h-7 rounded-lg bg-surface-container-highest text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-[16px]">science</span>
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-title-md text-title-md text-primary font-semibold font-serif">Fertilizer Formulation</h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                {crop.fertilizerAdvice}
              </p>
            </div>
          </div>

          {/* Irrigation Schedule */}
          <div className="p-3 rounded-xl bg-surface-container-low flex items-start gap-3 border border-surface-container-high/40">
            <div className="w-7 h-7 rounded-lg bg-surface-container-highest text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-[16px]">water_drop</span>
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-title-md text-title-md text-primary font-semibold font-serif">Irrigation Depth Schedule</h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                {crop.waterRequirement}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons Panel with Visual Anchors */}
      <div className="space-y-2.5 pt-2">
        {/* Marketplace Direct Selling Action */}
        {onNavigateToMarketplace && (
          <button
            type="button"
            onClick={onNavigateToMarketplace}
            className="w-full h-12 bg-primary text-on-primary rounded-xl font-label-lg text-label-lg flex items-center justify-center gap-2 shadow-sm hover:opacity-95 active:scale-[0.99] transition-all cursor-pointer font-bold border border-primary-fixed/30"
          >
            <span>[💰]</span>
            <span>{t('res.go_marketplace')} ({crop.name})</span>
          </button>
        )}

        {/* Primary Action: Download PDF */}
        <button
          type="button"
          onClick={handleDownloadPdf}
          className="w-full h-12 bg-primary-container text-on-primary rounded-xl font-label-lg text-label-lg flex items-center justify-center gap-2 shadow-sm hover:opacity-95 active:scale-[0.99] transition-all cursor-pointer font-semibold"
        >
          <span className="material-symbols-outlined text-[20px]">description</span>
          <span>{language === 'te' ? 'వ్యవసాయ ప్రణాళికను డౌన్‌లోడ్ చేయండి (PDF)' : 'Download Agronomic Plan (PDF)'}</span>
        </button>

        {/* Secondary Action: Simulate Alternative */}
        <button
          type="button"
          onClick={onBackToDiagnostics}
          className="w-full h-12 bg-surface-container-lowest text-primary rounded-xl font-label-lg text-label-lg flex items-center justify-center gap-2 shadow-sm hover:bg-surface-container transition-all cursor-pointer border border-surface-container-high font-semibold"
        >
          <span>[🌾]</span>
          <span>{language === 'te' ? 'మరో నేల / వాతావరణాన్ని పరీక్షించండి' : 'Simulate Alternative Field or Climate'}</span>
        </button>

        {/* Tertiary Action: Save to Logbook */}
        <button
          type="button"
          onClick={handleSave}
          className="w-full h-11 bg-surface-container text-on-surface-variant rounded-xl font-label-lg text-label-lg flex items-center justify-center gap-2 hover:text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">bookmark</span>
          <span>{isSaved ? `✓ ${t('res.saved')}` : `[🌾] ${t('res.save_history')} (${selectedField.name})`}</span>
        </button>
      </div>

      {/* Toast Notification Overlay */}
      {toastMessage && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-primary text-on-primary px-4 py-2.5 rounded-full shadow-lg text-label-sm font-label-sm z-50 flex items-center gap-2 animate-in fade-in zoom-in-95 duration-200">
          <span className="material-symbols-outlined text-[16px] text-primary-fixed">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
};
