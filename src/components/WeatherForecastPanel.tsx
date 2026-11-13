// ==============================================================================
// BioPlant.AI - Advanced Weather Forecasting & Micro-Climate Dashboard
// 7-Day Predictive Chart, Spraying Windows, Evapotranspiration, Soil Frost Alerts
// ==============================================================================

import React, { useState } from 'react';
import { WeatherMetrics, DailyForecast } from '../types';
import { SEVEN_DAY_FORECAST, WEATHER_ADVISORY_METRICS } from '../services/weatherForecastData';

interface WeatherForecastPanelProps {
  weather: WeatherMetrics;
  onWeatherChange: (newWeather: WeatherMetrics) => void;
  fieldName: string;
}

export const WeatherForecastPanel: React.FC<WeatherForecastPanelProps> = ({
  weather,
  onWeatherChange,
  fieldName
}) => {
  const [activeTab, setActiveTab] = useState<'current' | '7day'>('current');
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [isResampling, setIsResampling] = useState<boolean>(false);

  const selectedDay: DailyForecast = SEVEN_DAY_FORECAST[selectedDayIndex];
  const advisory = WEATHER_ADVISORY_METRICS;

  const handleLiveResample = () => {
    setIsResampling(true);
    setTimeout(() => {
      const tempJitter = Number((weather.temperature + (Math.random() * 0.8 - 0.4)).toFixed(1));
      const humJitter = Math.min(100, Math.max(30, Math.round(weather.humidity + (Math.random() * 4 - 2))));
      const windJitter = Number((weather.windSpeed + (Math.random() * 1.5 - 0.75)).toFixed(1));

      onWeatherChange({
        ...weather,
        temperature: tempJitter,
        humidity: humJitter,
        windSpeed: windJitter
      });
      setIsResampling(false);
    }, 400);
  };

  return (
    <section className="px-gutter-sm">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-surface-container-lowest via-surface-container-low to-surface-container-high/60 p-space-md shadow-sm border border-surface-container-high/60 flex flex-col space-y-4">
        
        {/* Top Header & Mode Toggle */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-tertiary-fixed flex items-center justify-center text-tertiary flex-shrink-0 shadow-sm">
              <span className="material-symbols-outlined text-[24px]">
                {weather.rainfall > 100 ? 'rainy' : weather.humidity > 70 ? 'partly_cloudy_day' : 'wb_sunny'}
              </span>
            </div>
            <div>
              <span className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider block">
                Atmosphere Local • {fieldName.split('(')[0].trim()}
              </span>
              <h2 className="font-title-lg text-title-lg text-primary leading-tight font-serif">
                {weather.conditions} • {weather.temperature}°C
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              type="button"
              onClick={handleLiveResample}
              disabled={isResampling}
              title="Resample Local Micro-Sensors"
              className="w-8 h-8 rounded-lg bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-secondary transition-colors cursor-pointer"
            >
              <span className={`material-symbols-outlined text-[16px] ${isResampling ? 'animate-spin' : ''}`}>
                sync
              </span>
            </button>
            <span className="font-label-sm text-xs px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-semibold">
              Par-Optimal
            </span>
          </div>
        </div>

        {/* View Switcher: Current Micro-Metrics vs 7-Day Predictive Forecast */}
        <div className="flex items-center justify-between border-b border-surface-container-high/80 pb-2">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setActiveTab('current')}
              className={`px-3 py-1 rounded-lg text-xs font-label-sm font-semibold transition-colors cursor-pointer ${
                activeTab === 'current'
                  ? 'bg-primary-container text-on-primary'
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              Live Telemetry
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('7day')}
              className={`px-3 py-1 rounded-lg text-xs font-label-sm font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
                activeTab === '7day'
                  ? 'bg-primary-container text-on-primary'
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">calendar_month</span>
              <span>7-Day Predictive Chart</span>
            </button>
          </div>

          <span className="text-[11px] font-mono text-secondary">
            Station Sync: Active
          </span>
        </div>

        {/* Content A: Live Micro Metrics Matrix */}
        {activeTab === 'current' ? (
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-surface-container-lowest/90 rounded-xl p-2.5 flex flex-col justify-between border border-surface-container-high/40">
              <div className="flex items-center justify-between text-secondary">
                <span className="material-symbols-outlined text-[16px]">thermostat</span>
                <span className="font-label-sm text-[10px]">Air Temp</span>
              </div>
              <span className="font-title-md text-title-md text-primary font-bold mt-1 font-mono">
                {weather.temperature}°C
              </span>
              <span className="font-label-sm text-[10px] text-secondary">Target: 24-28°C</span>
            </div>

            <div className="bg-surface-container-lowest/90 rounded-xl p-2.5 flex flex-col justify-between border border-surface-container-high/40">
              <div className="flex items-center justify-between text-secondary">
                <span className="material-symbols-outlined text-[16px]">humidity_mid</span>
                <span className="font-label-sm text-[10px]">Ambient RH</span>
              </div>
              <span className="font-title-md text-title-md text-primary font-bold mt-1 font-mono">
                {weather.humidity}%
              </span>
              <span className="font-label-sm text-[10px] text-secondary">+4% vs dusk</span>
            </div>

            <div className="bg-surface-container-lowest/90 rounded-xl p-2.5 flex flex-col justify-between border border-surface-container-high/40">
              <div className="flex items-center justify-between text-secondary">
                <span className="material-symbols-outlined text-[16px]">rainy</span>
                <span className="font-label-sm text-[10px]">24h Precip</span>
              </div>
              <span className="font-title-md text-title-md text-primary font-bold mt-1 font-mono">
                {weather.rainfall} mm
              </span>
              <span className="font-label-sm text-[10px] text-primary-container font-semibold">Sub-soil soak</span>
            </div>

            <div className="bg-surface-container-lowest/90 rounded-xl p-2.5 flex flex-col justify-between border border-surface-container-high/40">
              <div className="flex items-center justify-between text-secondary">
                <span className="material-symbols-outlined text-[16px]">solar_power</span>
                <span className="font-label-sm text-[10px]">Solar Rad</span>
              </div>
              <span className="font-title-md text-title-md text-primary font-bold mt-1 font-mono">
                680 <span className="text-[10px] font-normal">W/m²</span>
              </span>
              <span className="font-label-sm text-[10px] text-tertiary-container font-semibold">High DLI</span>
            </div>

            <div className="bg-surface-container-lowest/90 rounded-xl p-2.5 flex flex-col justify-between border border-surface-container-high/40">
              <div className="flex items-center justify-between text-secondary">
                <span className="material-symbols-outlined text-[16px]">air</span>
                <span className="font-label-sm text-[10px]">Wind Flow</span>
              </div>
              <span className="font-title-md text-title-md text-primary font-bold mt-1 font-mono">
                {weather.windSpeed} <span className="text-[10px] font-normal">km/h</span>
              </span>
              <span className="font-label-sm text-[10px] text-secondary">Vector SW • Calm</span>
            </div>

            <div className="bg-surface-container-lowest/90 rounded-xl p-2.5 flex flex-col justify-between border border-surface-container-high/40">
              <div className="flex items-center justify-between text-secondary">
                <span className="material-symbols-outlined text-[16px]">compress</span>
                <span className="font-label-sm text-[10px]">Barometer</span>
              </div>
              <span className="font-title-md text-title-md text-primary font-bold mt-1 font-mono">
                {weather.pressure} <span className="text-[10px] font-normal">hPa</span>
              </span>
              <span className="font-label-sm text-[10px] text-secondary">Stable Trend</span>
            </div>
          </div>
        ) : (
          /* Content B: 7-Day Predictive Weather Forecasting Chart Panel */
          <div className="space-y-3 animate-in fade-in duration-200">
            {/* Visual Temperature Trend Sparkline SVG */}
            <div className="p-3 bg-surface-container-lowest/90 rounded-xl border border-surface-container-high/50">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-label-sm text-secondary font-semibold">7-Day Max/Min Temperature Trajectory (°C)</span>
                <span className="font-mono text-[11px] text-primary">Range: 16.0° - 29.0°C</span>
              </div>
              
              {/* Scaled SVG chart */}
              <div className="w-full h-16 relative">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 350 50">
                  <defs>
                    <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1B4D3E" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#1B4D3E" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  {/* Fill area */}
                  <polygon
                    points="0,20 58,14 116,28 175,34 233,12 291,8 350,18 350,50 0,50"
                    fill="url(#tempGradient)"
                  />
                  {/* Curve line */}
                  <polyline
                    fill="none"
                    stroke="#002218"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points="0,20 58,14 116,28 175,34 233,12 291,8 350,18"
                  />
                  {/* Data points */}
                  {[
                    { cx: 0, cy: 20, t: '26.4°' },
                    { cx: 58, cy: 14, t: '27.8°' },
                    { cx: 116, cy: 28, t: '25.1°' },
                    { cx: 175, cy: 34, t: '23.6°' },
                    { cx: 233, cy: 12, t: '28.5°' },
                    { cx: 291, cy: 8, t: '29.0°' },
                    { cx: 350, cy: 18, t: '27.2°' }
                  ].map((p, i) => (
                    <g key={i}>
                      <circle cx={p.cx} cy={p.cy} r={selectedDayIndex === i ? 4.5 : 3} fill={selectedDayIndex === i ? '#FFB300' : '#0f382c'} stroke="#ffffff" strokeWidth="1.5" />
                    </g>
                  ))}
                </svg>
              </div>
            </div>

            {/* 7-Day Selectable Horizontal Scroll Strip */}
            <div className="grid grid-cols-7 gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {SEVEN_DAY_FORECAST.map((day, idx) => {
                const isSelected = selectedDayIndex === idx;
                return (
                  <button
                    key={day.day}
                    type="button"
                    onClick={() => setSelectedDayIndex(idx)}
                    className={`p-2 rounded-xl flex flex-col items-center justify-between text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-primary-container text-on-primary shadow-sm scale-[1.03]'
                        : 'bg-surface-container-lowest/80 text-on-surface-variant hover:bg-surface-container'
                    }`}
                  >
                    <span className="font-label-sm text-[11px] font-bold">{day.day}</span>
                    <span className="text-[9px] opacity-75">{day.date}</span>
                    <span className="material-symbols-outlined text-[18px] my-1">
                      {day.icon}
                    </span>
                    <div className="font-mono text-[11px] font-bold">
                      {Math.round(day.tempMax)}°
                    </div>
                    <div className="font-mono text-[9px] opacity-75">
                      {Math.round(day.tempMin)}°
                    </div>
                    <div className="mt-1 flex items-center gap-0.5 text-[9px]">
                      <span className="material-symbols-outlined text-[10px]">water_drop</span>
                      <span>{day.precipitationProb}%</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Day Expanded Detail Card */}
            <div className="p-3 bg-surface-container-lowest rounded-xl border border-surface-container-high flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-primary text-[22px]">
                  {selectedDay.icon}
                </span>
                <div>
                  <h4 className="font-title-md text-sm font-bold text-primary">
                    {selectedDay.day} ({selectedDay.date}): {selectedDay.conditions}
                  </h4>
                  <p className="text-body-sm text-xs text-on-surface-variant mt-0.5">
                    {selectedDay.advisoryText}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs font-mono text-secondary self-end sm:self-center flex-shrink-0">
                <span>Rain: <strong>{selectedDay.precipitationMm} mm</strong></span>
                <span>•</span>
                <span>Wind: <strong>{selectedDay.windSpeed} km/h</strong></span>
              </div>
            </div>
          </div>
        )}

        {/* Actionable Farming Weather Insights (Requirement 4 Micro-Cards) */}
        <div className="space-y-2 pt-1 border-t border-surface-container-high/60">
          <span className="font-label-sm text-[10px] text-secondary uppercase tracking-wider block font-semibold">
            Actionable Farming Micro-Climate Advisory
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            
            {/* Micro-Card 1: Optimal Spraying Windows (Wind < 15km/h) */}
            <div className="p-3 rounded-xl bg-surface-container-lowest/90 border border-surface-container-high/60 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-label-sm text-on-surface-variant uppercase tracking-wider">
                    Spraying Window
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-secondary-container text-on-secondary-container">
                    {advisory.sprayingWindow.status}
                  </span>
                </div>
                <h4 className="font-title-md text-xs font-bold text-primary mt-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px] text-secondary">routine</span>
                  <span>{advisory.sprayingWindow.hours}</span>
                </h4>
                <p className="text-[11px] text-on-surface-variant mt-1 leading-tight">
                  {advisory.sprayingWindow.windThreshold}. {advisory.sprayingWindow.summary}
                </p>
              </div>
              <div className="mt-2 pt-1.5 border-t border-surface-container-high/40 flex items-center justify-between text-[10px] text-secondary font-mono">
                <span>Safe Drift Zone</span>
                <span className="text-primary font-bold">11.2 km/h</span>
              </div>
            </div>

            {/* Micro-Card 2: Evapotranspiration Index */}
            <div className="p-3 rounded-xl bg-surface-container-lowest/90 border border-surface-container-high/60 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-label-sm text-on-surface-variant uppercase tracking-wider">
                    Evapotranspiration
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-surface-container text-on-surface-variant">
                    {advisory.evapotranspiration.demandLevel} Demand
                  </span>
                </div>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="font-headline-sm text-lg font-bold text-primary font-mono">
                    ET₀: {advisory.evapotranspiration.index}
                  </span>
                  <span className="text-[10px] text-on-surface-variant font-mono">mm/day</span>
                </div>
                <p className="text-[11px] text-on-surface-variant mt-1 leading-tight">
                  {advisory.evapotranspiration.rechargeGuidance}
                </p>
              </div>
              <div className="mt-2 pt-1.5 border-t border-surface-container-high/40 flex items-center justify-between text-[10px] text-secondary font-mono">
                <span>Pulse Drip Trigger</span>
                <span className="text-primary font-bold">+12 mm Net</span>
              </div>
            </div>

            {/* Micro-Card 3: Impending Soil Frost Alerts */}
            <div className="p-3 rounded-xl bg-surface-container-lowest/90 border border-surface-container-high/60 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-label-sm text-on-surface-variant uppercase tracking-wider">
                    Soil Frost Alert
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-secondary-container text-on-secondary-container flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[11px]">shield_check</span>
                    <span>{advisory.soilFrost.riskLevel}</span>
                  </span>
                </div>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="font-headline-sm text-lg font-bold text-primary font-mono">
                    {advisory.soilFrost.minGroundTemp}°C
                  </span>
                  <span className="text-[10px] text-on-surface-variant font-mono">Min Ground Level</span>
                </div>
                <p className="text-[11px] text-on-surface-variant mt-1 leading-tight">
                  {advisory.soilFrost.advisoryText}
                </p>
              </div>
              <div className="mt-2 pt-1.5 border-t border-surface-container-high/40 flex items-center justify-between text-[10px] text-secondary font-mono">
                <span>Inversion Threshold</span>
                <span className="text-primary font-bold">Safe (&gt; +8.0°C Buffer)</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

