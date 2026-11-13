// ==============================================================================
// BioPlant.AI - [🌾] Soil & Climate Diagnostics Lab
// Complete Telugu (నత్రజని, భాస్వరం, పొటాషియం, నేల pH), Hindi, and English integration
// Universal accessibility visual anchors [🌾], [☀️], [⚠️]
// ==============================================================================

import React, { useState } from 'react';
import { SoilMetrics, WeatherMetrics, FieldProfile } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface ScreenDiagnosticsProps {
  soil: SoilMetrics;
  onSoilChange: (newSoil: SoilMetrics) => void;
  weather: WeatherMetrics;
  onWeatherChange: (newWeather: WeatherMetrics) => void;
  selectedField: FieldProfile;
  onSubmit: () => void;
  isLoading: boolean;
}

export const ScreenDiagnostics: React.FC<ScreenDiagnosticsProps> = ({
  soil,
  onSoilChange,
  weather,
  onWeatherChange,
  selectedField,
  onSubmit,
  isLoading
}) => {
  const { language, t } = useLanguage();
  const [stationSync, setStationSync] = useState(true);
  const [btnText, setBtnText] = useState<'normal' | 'loading' | 'ready'>('normal');

  // Dynamic status evaluation with localized labels
  const getNitrogenStatus = (val: number) => {
    if (val < 50) {
      return {
        label: language === 'te' ? `నత్రజని లోపం (${val})` : `Deficient (${val})`,
        badgeClass: 'px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm'
      };
    }
    if (val <= 110) {
      return {
        label: language === 'te' ? 'సరైన పరిమాణం (60-100)' : 'Optimal Range (60-100)',
        badgeClass: 'px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm'
      };
    }
    return {
      label: language === 'te' ? `అధిక నత్రజని (${val})` : `High Nitrate (${val})`,
      badgeClass: 'px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant font-label-sm text-label-sm'
    };
  };

  const getPhosphorusStatus = (val: number) => {
    if (val < 35) {
      return {
        label: language === 'te' ? `తక్కువ భాస్వరం (${val})` : `Low Phos (${val})`,
        badgeClass: 'px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm'
      };
    }
    if (val <= 65) {
      return {
        label: language === 'te' ? 'మధ్యస్థ స్థాయి (35-60)' : 'Moderate (35-60)',
        badgeClass: 'px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm'
      };
    }
    return {
      label: language === 'te' ? `అధిక భాస్వరం (${val})` : `Saturated (${val})`,
      badgeClass: 'px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant font-label-sm text-label-sm'
    };
  };

  const getPotassiumStatus = (val: number) => {
    if (val < 30) {
      return {
        label: language === 'te' ? 'పొటాష్ కొరత' : 'Potash Depleted',
        badgeClass: 'px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm'
      };
    }
    if (val <= 55) {
      return {
        label: language === 'te' ? 'సరైన పొటాష్ (30-50)' : 'Moderate-High (30-50)',
        badgeClass: 'px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm'
      };
    }
    return {
      label: language === 'te' ? 'అధిక పొటాషియం' : 'Excess K',
      badgeClass: 'px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant font-label-sm text-label-sm'
    };
  };

  const getPHStatus = (val: number) => {
    if (val < 5.5) {
      return {
        boxClass: 'p-2.5 rounded-md bg-error-container/70 flex items-start gap-2.5 transition-colors',
        iconClass: 'material-symbols-outlined text-[20px] text-error mt-0.5',
        iconName: 'warning',
        titleClass: 'font-label-md text-label-md text-on-error-container',
        title: language === 'te' ? `తీవ్ర ఆమ్ల నేల (${val.toFixed(1)} pH)` : `Strongly Acidic Soil (${val.toFixed(1)} pH)`,
        desc: language === 'te'
          ? 'అల్యూమినియం విషపూరితమయ్యే ప్రమాదం ఉంది. సున్నం (Lime) వేసి నేల pH ని సరిచేయండి.'
          : 'High aluminum/manganese toxicity risk. Calcified lime amendment advised.'
      };
    } else if (val <= 7.5) {
      return {
        boxClass: 'p-2.5 rounded-md bg-secondary-container/50 flex items-start gap-2.5 transition-colors',
        iconClass: 'material-symbols-outlined text-[20px] text-primary-container mt-0.5',
        iconName: 'check_circle',
        titleClass: 'font-label-md text-label-md text-primary font-semibold',
        title: language === 'te' ? 'తటస్థ నేల — పంటలకు అత్యంత అనుకూలం' : 'Slightly Acidic to Neutral (Ideal for crops)',
        desc: language === 'te'
          ? 'ధాన్యపు పంటలు, పప్పుదినుసులు వేయడానికి నేల సంపూర్ణంగా అనుకూలంగా ఉంది.'
          : 'Optimal ion-absorption channel for cereal grains, legumes, and brassicas.'
      };
    } else {
      return {
        boxClass: 'p-2.5 rounded-md bg-tertiary-fixed/70 flex items-start gap-2.5 transition-colors',
        iconClass: 'material-symbols-outlined text-[20px] text-tertiary-container mt-0.5',
        iconName: 'info',
        titleClass: 'font-label-md text-label-md text-on-tertiary-fixed-variant',
        title: language === 'te' ? `క్షార నేల హెచ్చరిక (${val.toFixed(1)} pH)` : `Alkaline Soil Warning (${val.toFixed(1)} pH)`,
        desc: language === 'te'
          ? 'భాస్వరం మరియు సూక్ష్మపోషకాల లభ్యత తగ్గుతుంది. జిప్సం వాడకం అవసరం.'
          : 'Phosphorus & micronutrient precipitation likely. Gypsum application recommended.'
      };
    }
  };

  const getLiveCandidate = () => {
    if (weather.rainfall > 170) return 'Oryza sativa (Rice / వరి) • 96.4%';
    if (weather.temperature < 21 && weather.rainfall < 95) return 'Triticum aestivum (Wheat / గోధుమ) • 94.1%';
    if (soil.nitrogen > 90) return 'Zea mays (Maize / మొక్కజొన్న) • 91.8%';
    if (soil.potassium > 60) return 'Gossypium (Cotton / పత్తి) • 93.5%';
    return 'Glycine max (Soybean / సోయాబీన్) • 89.2%';
  };

  const applyPreset = (presetName: string) => {
    setStationSync(false);
    if (presetName === 'rice') {
      onSoilChange({ nitrogen: 85, phosphorus: 48, potassium: 42, ph: 6.5 });
      onWeatherChange({ ...weather, temperature: 25.2, humidity: 82, rainfall: 220 });
    } else if (presetName === 'wheat') {
      onSoilChange({ nitrogen: 55, phosphorus: 38, potassium: 30, ph: 6.8 });
      onWeatherChange({ ...weather, temperature: 19.5, humidity: 48, rainfall: 75 });
    } else if (presetName === 'loam') {
      onSoilChange({ nitrogen: 70, phosphorus: 50, potassium: 45, ph: 6.4 });
      onWeatherChange({ ...weather, temperature: 22.0, humidity: 65, rainfall: 130 });
    } else if (presetName === 'maize') {
      onSoilChange({ nitrogen: 105, phosphorus: 55, potassium: 50, ph: 6.2 });
      onWeatherChange({ ...weather, temperature: 27.0, humidity: 70, rainfall: 160 });
    }
  };

  const resetToProbes = () => {
    setStationSync(true);
    onSoilChange({ nitrogen: 85, phosphorus: 48, potassium: 42, ph: 6.5 });
    onWeatherChange({
      ...weather,
      temperature: 24.8,
      humidity: 78,
      rainfall: 185
    });
  };

  const handleExecute = () => {
    setBtnText('loading');
    setTimeout(() => {
      setBtnText('ready');
      setTimeout(() => {
        setBtnText('normal');
        onSubmit();
      }, 600);
    }, 750);
  };

  const nStatus = getNitrogenStatus(soil.nitrogen);
  const pStatus = getPhosphorusStatus(soil.phosphorus);
  const kStatus = getPotassiumStatus(soil.potassium);
  const phStatus = getPHStatus(soil.ph);

  return (
    <div className="flex flex-col w-full max-w-md mx-auto px-gutter-sm space-y-space-lg pb-12 animate-in fade-in duration-200">

      {/* Sub-header Breadcrumb / Parcel Meta */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-space-xs">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-secondary-container text-on-secondary-container">
            <span className="material-symbols-outlined text-[16px]">science</span>
          </span>
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
            {selectedField.name} • {selectedField.location}
          </span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-high text-primary-container">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-fixed opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-container"></span>
          </span>
          <span className="font-label-sm text-label-sm">Live Probe Telemetry</span>
        </div>
      </div>

      {/* Page Title & Scientific Brief Banner with Visual Anchor [🌾] */}
      <div className="space-y-space-xs">
        <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary tracking-tight font-serif">
          {t('diag.title')}
        </h1>
        <div className="p-space-md rounded-xl bg-surface-container-low shadow-sm space-y-2">
          <div className="flex items-start gap-space-sm">
            <span className="material-symbols-outlined text-primary-container text-[20px] mt-0.5">neurology</span>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              {t('diag.desc')}
            </p>
          </div>

          {/* Preset Quick-Fill Chips */}
          <div className="pt-1">
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="material-symbols-outlined text-[14px] text-secondary">tune</span>
              <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider">
                {t('diag.presets')}
              </span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1">
              <button
                type="button"
                className="preset-btn whitespace-nowrap px-3 py-1.5 rounded-full bg-surface-container-highest text-primary font-label-sm text-label-sm hover:bg-secondary-container transition-colors shadow-sm cursor-pointer"
                onClick={() => applyPreset('rice')}
              >
                🌾 {language === 'te' ? 'వరి (Rice)' : 'High Rainfall Rice'}
              </button>
              <button
                type="button"
                className="preset-btn whitespace-nowrap px-3 py-1.5 rounded-full bg-surface-container-highest text-primary font-label-sm text-label-sm hover:bg-secondary-container transition-colors shadow-sm cursor-pointer"
                onClick={() => applyPreset('wheat')}
              >
                🌾 {language === 'te' ? 'గోధుమ (Wheat)' : 'Semi-Arid Wheat'}
              </button>
              <button
                type="button"
                className="preset-btn whitespace-nowrap px-3 py-1.5 rounded-full bg-surface-container-highest text-primary font-label-sm text-label-sm hover:bg-secondary-container transition-colors shadow-sm cursor-pointer"
                onClick={() => applyPreset('loam')}
              >
                🌱 {language === 'te' ? 'సారవంతమైన నేల' : 'Balanced Loam'}
              </button>
              <button
                type="button"
                className="preset-btn whitespace-nowrap px-3 py-1.5 rounded-full bg-surface-container-highest text-primary font-label-sm text-label-sm hover:bg-secondary-container transition-colors shadow-sm cursor-pointer"
                onClick={() => applyPreset('maize')}
              >
                🌽 {language === 'te' ? 'మొక్కజొన్న (Maize)' : 'Heavy Clay Maize'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <form className="space-y-space-lg" id="diagnosticsForm" onSubmit={(e) => { e.preventDefault(); handleExecute(); }}>

        {/* SECTION 1: Primary Soil Nutrients (NPK) with Exact Telugu Translations */}
        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm space-y-space-md">
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[18px]">biotech</span>
              </div>
              <div>
                <h2 className="font-title-md text-title-md text-primary font-serif">
                  {language === 'te' ? '[🌾] ముఖ్య పోషకాలు (NPK)' : '[🌾] Macro-Nutrients (NPK)'}
                </h2>
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  {language === 'te' ? 'మట్టి నమూనా రీడింగులు' : 'Spectrometric soil core readings'}
                </span>
              </div>
            </div>
            <span className="font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-mono">
              mg/kg (ppm)
            </span>
          </div>

          {/* 1. Nitrogen (N) -> నత్రజని */}
          <div className="p-3 rounded-lg bg-surface-container-low space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-label-sm text-[10px]">N</span>
                <span className="font-label-lg text-label-lg text-primary font-semibold">
                  {t('diag.nitrogen')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={nStatus.badgeClass} id="nChip">
                  {nStatus.label}
                </span>
                <span className="font-label-lg text-label-lg px-2.5 py-0.5 rounded-md bg-surface-container-highest text-primary font-mono font-bold" id="nValBadge">
                  {soil.nitrogen} mg/kg
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <input
                type="range"
                className="w-full h-2 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary-container"
                id="inputN"
                min="0"
                max="150"
                value={soil.nitrogen}
                onChange={(e) => onSoilChange({ ...soil, nitrogen: Number(e.target.value) })}
              />
              <div className="flex justify-between font-label-sm text-[10px] text-on-surface-variant font-mono">
                <span>0</span>
                <span>{language === 'te' ? 'లోపం (<40)' : 'Deficient (<40)'}</span>
                <span className="text-primary font-semibold">{language === 'te' ? 'సరైనది (60-100)' : 'Optimal (60-100)'}</span>
                <span>{language === 'te' ? 'అధికం (>120)' : 'Excess (>120)'}</span>
                <span>150</span>
              </div>
            </div>
          </div>

          {/* 2. Phosphorus (P) -> భాస్వరం */}
          <div className="p-3 rounded-lg bg-surface-container-low space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-label-sm text-[10px]">P</span>
                <span className="font-label-lg text-label-lg text-primary font-semibold">
                  {t('diag.phosphorus')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={pStatus.badgeClass} id="pChip">
                  {pStatus.label}
                </span>
                <span className="font-label-lg text-label-lg px-2.5 py-0.5 rounded-md bg-surface-container-highest text-primary font-mono font-bold" id="pValBadge">
                  {soil.phosphorus} mg/kg
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <input
                type="range"
                className="w-full h-2 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary-container"
                id="inputP"
                min="0"
                max="150"
                value={soil.phosphorus}
                onChange={(e) => onSoilChange({ ...soil, phosphorus: Number(e.target.value) })}
              />
              <div className="flex justify-between font-label-sm text-[10px] text-on-surface-variant font-mono">
                <span>0</span>
                <span>{language === 'te' ? 'తక్కువ (<20)' : 'Low (<20)'}</span>
                <span className="text-primary font-semibold">{language === 'te' ? 'లక్ష్యం (35-60)' : 'Target (35-60)'}</span>
                <span>{language === 'te' ? 'ఎక్కువ (>80)' : 'High (>80)'}</span>
                <span>150</span>
              </div>
            </div>
          </div>

          {/* 3. Potassium (K) -> పొటాషియం */}
          <div className="p-3 rounded-lg bg-surface-container-low space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-label-sm text-[10px]">K</span>
                <span className="font-label-lg text-label-lg text-primary font-semibold">
                  {t('diag.potassium')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={kStatus.badgeClass} id="kChip">
                  {kStatus.label}
                </span>
                <span className="font-label-lg text-label-lg px-2.5 py-0.5 rounded-md bg-surface-container-highest text-primary font-mono font-bold" id="kValBadge">
                  {soil.potassium} mg/kg
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <input
                type="range"
                className="w-full h-2 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary-container"
                id="inputK"
                min="0"
                max="150"
                value={soil.potassium}
                onChange={(e) => onSoilChange({ ...soil, potassium: Number(e.target.value) })}
              />
              <div className="flex justify-between font-label-sm text-[10px] text-on-surface-variant font-mono">
                <span>0</span>
                <span>{language === 'te' ? 'తక్కువ (<25)' : 'Low (<25)'}</span>
                <span className="text-primary font-semibold">{language === 'te' ? 'ప్రామాణికం (30-50)' : 'Standard (30-50)'}</span>
                <span>{language === 'te' ? 'అధికం (>75)' : 'Heavy (>75)'}</span>
                <span>150</span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: Soil Acidity & Chemical Balance (Soil pH -> నేల pH విలువ) */}
        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm space-y-space-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[18px]">opacity</span>
              </div>
              <div>
                <h2 className="font-title-md text-title-md text-primary font-serif">
                  {t('diag.ph')}
                </h2>
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  {language === 'te' ? 'హైడ్రోజన్ అయాన్ చురుకుదనపు సూచిక' : 'Potentiometric hydrogen active index'}
                </span>
              </div>
            </div>
            <div className="flex items-baseline gap-1 bg-surface-container-high px-3 py-1 rounded-lg">
              <span className="font-headline-sm text-headline-sm text-primary font-bold font-mono" id="phDisplay">
                {soil.ph.toFixed(1)}
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">pH</span>
            </div>
          </div>

          {/* Visual Spectrum pH Meter */}
          <div className="p-3.5 rounded-lg bg-surface-container-low space-y-3">
            <div className="space-y-1.5">
              <div className="relative w-full h-4 rounded-full overflow-hidden bg-gradient-to-r from-error via-tertiary-fixed-dim via-primary to-secondary">
              </div>
              <input
                type="range"
                className="w-full h-2 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary-container"
                id="inputPH"
                min="0.0"
                max="14.0"
                step="0.1"
                value={soil.ph}
                onChange={(e) => onSoilChange({ ...soil, ph: parseFloat(e.target.value) })}
              />
              <div className="flex justify-between font-label-sm text-[10px] text-on-surface-variant">
                <span className="text-error font-medium">{language === 'te' ? '0.0 ఆమ్లం (Acidic)' : '0.0 Acidic'}</span>
                <span>4.5</span>
                <span className="text-primary font-bold">{language === 'te' ? '7.0 తటస్థం (Neutral)' : '7.0 Neutral'}</span>
                <span>9.5</span>
                <span className="text-secondary font-medium">{language === 'te' ? '14.0 క్షారం (Alkaline)' : '14.0 Alkaline'}</span>
              </div>
            </div>

            {/* Dynamic pH Diagnostic Card */}
            <div className={phStatus.boxClass} id="phStatusBox">
              <span className={phStatus.iconClass} id="phStatusIcon">
                {phStatus.iconName}
              </span>
              <div className="flex flex-col">
                <span className={phStatus.titleClass} id="phStatusTitle">
                  {phStatus.title}
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant" id="phStatusDesc">
                  {phStatus.desc}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: Microclimate & Atmospheric Sensors with Visual Anchor [☀️] */}
        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm space-y-space-md">
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[18px]">routine</span>
              </div>
              <div>
                <h2 className="font-title-md text-title-md text-primary font-serif">
                  {t('anchor.forecast')}
                </h2>
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  {language === 'te' ? 'వాతావరణ కేంద్రం రీడింగులు' : 'Field Station #FS-088 sync'}
                </span>
              </div>
            </div>

            {/* Manual Override Toggle */}
            <label className="flex items-center gap-2 cursor-pointer">
              <span className="font-label-sm text-label-sm text-on-surface-variant">Station Sync</span>
              <div className="relative">
                <input
                  type="checkbox"
                  id="overrideToggle"
                  checked={stationSync}
                  onChange={(e) => {
                    setStationSync(e.target.checked);
                    if (e.target.checked) {
                      onWeatherChange({
                        ...weather,
                        temperature: 24.8,
                        humidity: 78,
                        rainfall: 185
                      });
                    }
                  }}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-container"></div>
              </div>
            </label>
          </div>

          {/* Temperature Slider */}
          <div className="p-3 rounded-lg bg-surface-container-low space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[20px]">thermostat</span>
                <div>
                  <span className="font-label-lg text-label-lg text-primary block font-semibold">
                    {t('diag.temperature')}
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    {language === 'te' ? 'రోజువారీ సగటు ఉష్ణోగ్రత' : '24h diurnally weighted'}
                  </span>
                </div>
              </div>
              <span className="font-headline-sm text-headline-sm text-primary font-mono font-bold" id="tempBadge">
                {weather.temperature.toFixed(1)}°C
              </span>
            </div>
            <input
              type="range"
              className={`weather-slider w-full h-2 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary-container ${
                stationSync ? 'opacity-60' : ''
              }`}
              id="inputTemp"
              min="10.0"
              max="45.0"
              step="0.1"
              disabled={stationSync}
              value={weather.temperature}
              onChange={(e) => onWeatherChange({ ...weather, temperature: parseFloat(e.target.value) })}
            />
            <div className="flex justify-between font-label-sm text-[10px] text-on-surface-variant font-mono">
              <span>10.0°C</span>
              <span>{language === 'te' ? 'చలి తీవ్రత' : 'Frost Threshold'}</span>
              <span className="text-primary font-semibold">{language === 'te' ? '22°-28° అనుకూలం' : '22°-28° Optimal'}</span>
              <span>45.0°C</span>
            </div>
          </div>

          {/* Relative Humidity Slider */}
          <div className="p-3 rounded-lg bg-surface-container-low space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[20px]">humidity_mid</span>
                <div>
                  <span className="font-label-lg text-label-lg text-primary block font-semibold">
                    {t('diag.humidity')}
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    {language === 'te' ? 'గాలిలో తేమ శాతం' : 'Canopy boundary vapor'}
                  </span>
                </div>
              </div>
              <span className="font-headline-sm text-headline-sm text-primary font-mono font-bold" id="humidityBadge">
                {weather.humidity}%
              </span>
            </div>
            <input
              type="range"
              className={`weather-slider w-full h-2 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary-container ${
                stationSync ? 'opacity-60' : ''
              }`}
              id="inputHumidity"
              min="10"
              max="100"
              disabled={stationSync}
              value={weather.humidity}
              onChange={(e) => onWeatherChange({ ...weather, humidity: parseInt(e.target.value) })}
            />
            <div className="flex justify-between font-label-sm text-[10px] text-on-surface-variant font-mono">
              <span>10% {language === 'te' ? 'పొడి' : 'Arid'}</span>
              <span>40%</span>
              <span className="text-primary font-semibold">70-85% {language === 'te' ? 'తేమ' : 'Humid'}</span>
              <span>100%</span>
            </div>
          </div>

          {/* Cumulative Precipitation Slider */}
          <div className="p-3 rounded-lg bg-surface-container-low space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[20px]">rainy</span>
                <div>
                  <span className="font-label-lg text-label-lg text-primary block font-semibold">
                    {t('diag.rainfall')}
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    {language === 'te' ? 'మొత్తం వర్షపాతం అంచనా' : 'Forecast model 30-day projection'}
                  </span>
                </div>
              </div>
              <span className="font-headline-sm text-headline-sm text-primary font-mono font-bold" id="rainfallBadge">
                {weather.rainfall} mm
              </span>
            </div>
            <input
              type="range"
              className={`weather-slider w-full h-2 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary-container ${
                stationSync ? 'opacity-60' : ''
              }`}
              id="inputRainfall"
              min="20"
              max="300"
              disabled={stationSync}
              value={weather.rainfall}
              onChange={(e) => onWeatherChange({ ...weather, rainfall: parseInt(e.target.value) })}
            />
            <div className="flex justify-between font-label-sm text-[10px] text-on-surface-variant font-mono">
              <span>20 mm</span>
              <span>100 mm</span>
              <span className="text-primary font-semibold">180-220 mm</span>
              <span>300 mm</span>
            </div>
          </div>
        </div>

        {/* Live Model Inference Preview */}
        <div className="p-space-md rounded-xl bg-surface-container-high/60 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">psychology</span>
            </div>
            <div>
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider block">
                {language === 'te' ? 'ప్రస్తుత ఉత్తమ ఎంపిక' : 'Real-time Top Candidate'}
              </span>
              <span className="font-headline-sm text-sm sm:text-base text-primary font-semibold font-serif" id="predictedCrop">
                {getLiveCandidate()}
              </span>
            </div>
          </div>
          <span className="material-symbols-outlined text-secondary">verified</span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-1 pb-4">
          <button
            type="submit"
            id="executeBtn"
            disabled={isLoading || btnText === 'loading'}
            className="relative w-full py-3.5 px-4 rounded-xl bg-primary-container text-on-primary font-label-lg text-label-lg flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-[0.99] transition-all overflow-hidden group cursor-pointer"
          >
            {btnText === 'loading' ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[20px]">sync</span>
                <span>{t('diag.running')}</span>
              </>
            ) : btnText === 'ready' ? (
              <>
                <span className="material-symbols-outlined text-[20px]">check_circle</span>
                <span>{t('diag.ready')}</span>
              </>
            ) : (
              <>
                <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                <span className="material-symbols-outlined text-[20px] animate-pulse">model_training</span>
                <span>{t('diag.run_button')}</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={resetToProbes}
            className="w-full py-3 px-4 rounded-xl bg-surface-container text-primary font-label-lg text-label-lg flex items-center justify-center gap-2 hover:bg-surface-container-highest transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">history</span>
            <span>{language === 'te' ? 'సెన్సార్ల ప్రారంభ విలువలకు మార్చండి' : 'Reset to Field Probe Sensors'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};
