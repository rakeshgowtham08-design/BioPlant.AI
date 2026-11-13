// ==============================================================================
// BioPlant.AI - [☀️] Field Dashboard & Crop Telemetry Overview
// Integrated with Universal Visual Anchors: [🌾], [📸], [💰], [⚠️], [🌐], [☀️]
// Includes prominent entry to [📸] Crop Scan / Disease Finder (పంట తెగులు పరీక్ష)
// and multi-language support (English, Telugu తెలుగు, Hindi हिन्दी)
// ==============================================================================

import React, { useState } from 'react';
import { FieldProfile, HistoricalRecord, WeatherMetrics } from '../types';
import { WeatherForecastPanel } from './WeatherForecastPanel';
import { useLanguage } from '../context/LanguageContext';

interface ScreenDashboardProps {
  fields: FieldProfile[];
  selectedField: FieldProfile;
  onSelectField: (field: FieldProfile) => void;
  activeHistory: HistoricalRecord[];
  weather: WeatherMetrics;
  onWeatherChange: (w: WeatherMetrics) => void;
  onRunIntelligence: () => void;
  onLoadHistoricalRecord: (record: HistoricalRecord) => void;
  onNavigateToCropScan?: () => void;
  onNavigateToMarketplace?: () => void;
}

export const ScreenDashboard: React.FC<ScreenDashboardProps> = ({
  fields,
  selectedField,
  onSelectField,
  activeHistory,
  weather,
  onWeatherChange,
  onRunIntelligence,
  onLoadHistoricalRecord,
  onNavigateToCropScan,
  onNavigateToMarketplace
}) => {
  const { language, t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  const handleRunClick = () => {
    setToastVisible(true);
    setTimeout(() => {
      setToastVisible(false);
      onRunIntelligence();
    }, 1200);
  };

  return (
    <div className="flex flex-col w-full max-w-md mx-auto pb-8 space-y-space-md animate-in fade-in duration-200">

      {/* Top Greeting & Agronomist Identity Panel */}
      <section className="px-gutter-sm pt-space-xs flex flex-col space-y-space-sm">
        <div className="flex items-center justify-between gap-space-sm">
          <div className="flex items-center gap-1.5 bg-secondary-container/60 px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse"></span>
            <span className="font-label-sm text-label-sm text-on-secondary-container">
              {t('dash.telemetry_live')}
            </span>
          </div>
          <div className="flex items-center gap-1 bg-surface-container-high px-2.5 py-1 rounded-full">
            <span className="material-symbols-outlined text-primary-container text-[14px]">format_image_left</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              {t('dash.validated_node')}
            </span>
          </div>
        </div>
        <div>
          <div className="flex items-baseline gap-2">
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary tracking-tight font-serif">
              {t('dash.title')}
            </h1>
          </div>
          <p className="font-label-md text-label-md text-secondary mt-0.5 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[15px] text-primary-container">biotech</span>
            {t('dash.role')}
          </p>
        </div>
      </section>

      {/* ============================================================================== */}
      {/* 📸 PRIMARY CROP SCAN / DISEASE FINDER MODULE BANNER (Requirement 4)           */}
      {/* "📸 Crop Scan / Disease Finder (పంట తెగులు పరీక్ష)"                            */}
      {/* ============================================================================== */}
      <section className="px-gutter-sm">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#1B4D3E] to-[#0f382c] p-4 text-white shadow-md border border-primary-fixed/30 flex flex-col space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/20 text-xs font-semibold">
              <span>📸</span>
              <span>{t('anchor.camera')}</span>
            </div>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-400 text-black font-extrabold">
              AI Vision Ready
            </span>
          </div>

          <div>
            <h2 className="font-headline-sm text-base sm:text-lg font-bold text-white font-serif">
              {t('dash.crop_scan_title')}
            </h2>
            <p className="text-xs text-primary-fixed-dim/90 mt-1 leading-relaxed">
              {t('dash.crop_scan_desc')}
            </p>
          </div>

          <div className="pt-1">
            <button
              type="button"
              onClick={onNavigateToCropScan}
              className="w-full h-11 bg-primary-fixed hover:bg-white text-primary rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm active:scale-[0.99] transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">photo_camera</span>
              <span>{t('dash.scan_now')}</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </section>

      {/* Interactive Field Switcher Selector */}
      <section className="px-gutter-sm">
        <div className="relative w-full">
          <button
            type="button"
            id="fieldSwitcherBtn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            className="w-full text-left bg-surface-container-lowest rounded-xl p-space-sm shadow-sm flex flex-col gap-2 transition-all duration-200 hover:bg-surface-container-low active:scale-[0.99]"
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-primary-fixed/50 flex items-center justify-center text-primary-container flex-shrink-0">
                  <span className="material-symbols-outlined text-[20px]">terrain</span>
                </div>
                <div className="min-w-0">
                  <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider block">
                    {t('dash.active_field')}
                  </span>
                  <span className="font-title-md text-title-md text-on-surface font-semibold truncate block" id="currentFieldTitle">
                    {selectedField.name}
                  </span>
                </div>
              </div>
              <div className="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant flex-shrink-0">
                <span
                  className="material-symbols-outlined text-[18px] transition-transform duration-200"
                  id="switcherChevron"
                  style={{ transform: isMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                >
                  expand_more
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1 border-t-0">
              <div className="bg-surface-container-low/70 rounded-lg px-2.5 py-1.5 flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-secondary">crop_free</span>
                <div className="flex flex-col min-w-0">
                  <span className="font-label-sm text-label-sm text-on-surface-variant text-[10px]">
                    {language === 'te' ? 'విస్తీర్ణం' : 'Acreage Area'}
                  </span>
                  <span className="font-title-md text-title-md text-primary font-bold" id="currentFieldAcreage">
                    {selectedField.acreage} Ha
                  </span>
                </div>
              </div>
              <div className="bg-surface-container-low/70 rounded-lg px-2.5 py-1.5 flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-secondary">science</span>
                <div className="flex flex-col min-w-0">
                  <span className="font-label-sm text-label-sm text-on-surface-variant text-[10px]">
                    {language === 'te' ? 'నేల రకం' : 'Substrate Matrix'}
                  </span>
                  <span className="font-body-sm text-body-sm text-primary font-semibold truncate" id="currentFieldSoil">
                    {selectedField.soilType}
                  </span>
                </div>
              </div>
            </div>
          </button>

          {/* Dropdown Flyout */}
          <div className={`${isMenuOpen ? '' : 'hidden'} absolute top-full left-0 right-0 mt-2 z-30 bg-surface-container-lowest rounded-xl shadow-xl p-1.5 flex flex-col space-y-1 border border-surface-container-high`} id="fieldMenu">
            {fields.map((field) => {
              const isSelected = field.id === selectedField.id;
              return (
                <button
                  key={field.id}
                  type="button"
                  onClick={() => {
                    onSelectField(field);
                    setIsMenuOpen(false);
                  }}
                  className={`field-option w-full p-2.5 rounded-lg flex items-center justify-between text-left transition-colors cursor-pointer ${
                    isSelected ? 'bg-surface-container-low' : 'hover:bg-surface-container'
                  }`}
                >
                  <div>
                    <p className={`font-title-md text-title-md ${isSelected ? 'text-primary font-semibold' : 'text-on-surface'}`}>
                      {field.name}
                    </p>
                    <p className={`font-body-sm text-body-sm ${isSelected ? 'text-secondary' : 'text-on-surface-variant'}`}>
                      {field.acreage} Ha • {field.soilType}
                    </p>
                  </div>
                  <span className={`material-symbols-outlined text-[18px] ${isSelected ? 'text-primary' : 'text-on-surface-variant'}`}>
                    {isSelected ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Visual Anchor: [☀️] 7-Day Precision Agronomic Weather Forecast */}
      <WeatherForecastPanel
        weather={weather}
        onWeatherChange={onWeatherChange}
        fieldName={selectedField.name}
      />

      {/* Visual Anchor: [⚠️] Local Field Alerts & Advisories */}
      <section className="px-gutter-sm">
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5">
          <span className="text-xl flex-shrink-0">⚠️</span>
          <div className="min-w-0">
            <span className="text-[10px] font-label-sm font-bold uppercase tracking-wider text-amber-900 block">
              {t('dash.alerts_title')}
            </span>
            <p className="text-xs text-on-surface mt-0.5 leading-relaxed">
              {language === 'te'
                ? 'రాత్రి వేళల్లో గాలిలో అధిక తేమ (84%) వల్ల వరి పైరులో అగ్గి తెగులు వ్యాపించే అవకాశం ఉంది. వెంటనే ఆకుల పరీక్ష [📸] పూర్తి చేయండి.'
                : 'Elevated nocturnal humidity (84%) detected across Sector 4B. High susceptibility to foliar fungal blast. Immediate leaf scan recommended.'}
            </p>
          </div>
        </div>
      </section>

      {/* Quick Launch: [💰] Market Prices / Mandi Rates Shortcut */}
      {onNavigateToMarketplace && (
        <section className="px-gutter-sm">
          <div
            onClick={onNavigateToMarketplace}
            className="p-3.5 rounded-xl bg-surface-container-lowest border border-surface-container-high/70 shadow-sm flex items-center justify-between hover:bg-surface-container-low transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold text-lg">
                💰
              </div>
              <div>
                <span className="text-[10px] font-label-sm text-secondary uppercase tracking-wider block">
                  {t('anchor.market')}
                </span>
                <span className="font-title-md text-xs sm:text-sm font-bold text-primary block">
                  Guntur Mandi: Paddy Grade A at ₹26,040 / MT
                </span>
              </div>
            </div>
            <span className="material-symbols-outlined text-[18px] text-secondary">arrow_forward</span>
          </div>
        </section>
      )}

      {/* Agronomic Bio-Snapshot: Visual Photo & Parcel Story */}
      <section className="px-gutter-sm">
        <div className="rounded-xl overflow-hidden bg-surface-container-lowest shadow-sm flex flex-col border border-surface-container-high/60">
          <div className="relative h-36 w-full">
            <img
              className="w-full h-full object-cover"
              alt="High-resolution aerial view of agricultural fields"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJ-gN_w70GSOzNrrQ4MIYkJe23OZ5YOH4A9io6QO7TTQNqjTUHQC2GJHxE9JPV3b_k45BvzZsERhv3KEDQGTJx8x9r4_sBR1QXZs9uOtTAwsJzqJ_nKIPPTf_76Ud8lsvCiEoy37VaRrULCN3PyaX7qogSUH8dHlgG4-R4OIvriECnK0eJz7GRWQbbl_NgUHr02QA-zBodGRdYvAWJUrL38rLr7adaFLb5sETXfUc"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent flex items-end p-space-sm">
              <div className="flex items-center justify-between w-full">
                <div>
                  <span className="font-label-sm text-label-sm text-primary-fixed block uppercase tracking-wider">
                    Bio-Spectral Imagery
                  </span>
                  <h3 className="font-headline-sm text-headline-sm text-on-primary font-serif">
                    Vegetation Index: NDVI 0.84
                  </h3>
                </div>
                <span className="bg-primary-container text-on-primary font-label-sm text-label-sm px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                  <span className="material-symbols-outlined text-[14px]">check</span> Healthy Stems
                </span>
              </div>
            </div>
          </div>

          {/* Quick KPI Stats Bar */}
          <div className="grid grid-cols-3 divide-x-0 p-3 bg-surface-container-low gap-2 text-center">
            <div className="flex flex-col items-center">
              <span className="font-label-sm text-label-sm text-secondary">
                {language === 'te' ? 'నేల తేమ' : 'Soil Moisture'}
              </span>
              <span className="font-headline-sm text-headline-sm text-primary font-bold mt-0.5">38%</span>
              <div className="w-12 h-1 bg-surface-container-highest rounded-full mt-1.5 overflow-hidden">
                <div className="w-[76%] h-full bg-primary-container rounded-full"></div>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-label-sm text-label-sm text-secondary">
                {language === 'te' ? 'సేంద్రీయ కార్బన్' : 'Organic Carbon'}
              </span>
              <span className="font-headline-sm text-headline-sm text-primary font-bold mt-0.5">2.1%</span>
              <div className="w-12 h-1 bg-surface-container-highest rounded-full mt-1.5 overflow-hidden">
                <div className="w-[85%] h-full bg-primary-container rounded-full"></div>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-label-sm text-label-sm text-secondary">
                {language === 'te' ? 'ఉపరితల ఉష్ణోగ్రత' : 'Surface Temp'}
              </span>
              <span className="font-headline-sm text-headline-sm text-primary font-bold mt-0.5">22.8°C</span>
              <div className="w-12 h-1 bg-surface-container-highest rounded-full mt-1.5 overflow-hidden">
                <div className="w-[60%] h-full bg-tertiary-fixed-dim rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Historical Records Logbook Quick Review */}
      {activeHistory && activeHistory.length > 0 && (
        <section className="px-gutter-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider font-bold">
              {t('dash.history_title')} ({activeHistory.length})
            </span>
          </div>
          <div className="space-y-2">
            {activeHistory.slice(0, 2).map((rec) => (
              <div
                key={rec.id}
                onClick={() => onLoadHistoricalRecord(rec)}
                className="p-3 rounded-xl bg-surface-container-lowest border border-surface-container-high/60 shadow-sm flex items-center justify-between hover:bg-surface-container-low transition-colors cursor-pointer"
              >
                <div>
                  <span className="font-title-md text-xs font-bold text-primary block">
                    {rec.fieldName} — {rec.recommendedCrop} ({rec.confidence}% Match)
                  </span>
                  <span className="text-[10px] text-on-surface-variant">
                    {rec.date} • N:{rec.nitrogen} P:{rec.phosphorus} K:{rec.potassium} pH:{rec.ph}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-secondary-container text-on-secondary-container">
                  {rec.status}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* High-Visibility CTA Hero Action Card: [🌾] Run Diagnostics */}
      <section className="px-gutter-sm pt-space-xs">
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#0F382C] via-[#144436] to-[#002218] p-space-md shadow-lg text-on-primary">
          <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-primary-fixed/10 blur-2xl pointer-events-none"></div>
          <div className="absolute right-4 top-4 opacity-15 pointer-events-none">
            <span className="material-symbols-outlined text-[100px] text-primary-fixed">psychology_alt</span>
          </div>

          <div className="relative z-10 flex flex-col space-y-3">
            <div className="inline-flex items-center gap-1.5 bg-primary-fixed/20 border-0 px-2.5 py-1 rounded-full w-fit">
              <span className="material-symbols-outlined text-primary-fixed text-[15px] animate-spin">auto_awesome</span>
              <span className="font-label-sm text-label-sm text-primary-fixed font-bold tracking-wide">
                AI Recommendation Engine
              </span>
            </div>

            <div>
              <h2 className="font-headline-md text-headline-md text-on-primary font-medium tracking-tight font-serif">
                {language === 'te' ? 'పంట సాగు అనుకూలత విశ్లేషణ' : 'Crop Cycle Ready for Optimization'}
              </h2>
              <p className="font-body-md text-body-md text-surface-container-low/90 mt-1 leading-relaxed text-xs sm:text-sm">
                {language === 'te'
                  ? 'బయోప్లాంట్ ఏఐ మోడల్ మీ నేల మరియు వాతావరణ పరిస్థితులకు సరిపోయే అత్యుత్తమ పంటలను తక్షణమే విశ్లేషిస్తుంది.'
                  : 'BioPlant ML Engine has detected microclimate shifts and nitrate equilibria ideal for launching a high-yield planting cycle.'}
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                id="runIntelligenceBtn"
                onClick={handleRunClick}
                className="w-full py-3.5 px-space-md rounded-lg bg-primary-fixed text-primary font-title-md text-title-md font-bold flex items-center justify-center gap-2 shadow-md hover:bg-white active:scale-[0.98] transition-all duration-150 cursor-pointer"
              >
                <span>🌾</span>
                <span>{t('dash.run_diagnostics')}</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 text-center pt-1">
              <span className="material-symbols-outlined text-[14px] text-primary-fixed/70">verified</span>
              <span className="font-label-sm text-label-sm text-primary-fixed/80">
                Continuous calibration with regional soil sensors
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Micro Interaction Feedback Toast */}
      <div
        className={`fixed bottom-20 left-4 right-4 max-w-md mx-auto bg-primary text-on-primary p-3 rounded-xl shadow-2xl flex items-center justify-between transition-transform duration-300 z-50 ${
          toastVisible ? 'translate-y-0 opacity-100' : 'translate-y-32 opacity-0 pointer-events-none'
        }`}
        id="simToast"
      >
        <div className="flex items-center gap-2.5">
          <span className="material-symbols-outlined text-primary-fixed animate-spin">sync</span>
          <div className="flex flex-col">
            <span className="font-title-md text-title-md text-white font-semibold">Running Neural Diagnostics</span>
            <span className="font-body-sm text-body-sm text-primary-fixed-dim">Analyzing Parcel biosensors...</span>
          </div>
        </div>
        <span className="font-label-sm text-label-sm bg-primary-container px-2 py-1 rounded text-primary-fixed">Step 1/4</span>
      </div>

    </div>
  );
};
