import React, { useState } from 'react';
import { WeatherMetrics } from '../types';
import { CloudRain, Sun, Wind, Droplets, Gauge, Thermometer, RefreshCw, Sparkles } from 'lucide-react';
import { simulateLiveWeatherVariance } from '../services/weatherService';

interface WeatherWidgetProps {
  weather: WeatherMetrics;
  onWeatherChange: (newWeather: WeatherMetrics) => void;
  fieldName: string;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({
  weather,
  onWeatherChange,
  fieldName
}) => {
  const [isSimulating, setIsSimulating] = useState(false);

  const handleSimulateJitter = () => {
    setIsSimulating(true);
    setTimeout(() => {
      const updated = simulateLiveWeatherVariance(weather);
      onWeatherChange(updated);
      setIsSimulating(false);
    }, 400);
  };

  const getWeatherIcon = () => {
    if (weather.rainfall > 140) return <CloudRain className="w-8 h-8 text-sky-600" />;
    if (weather.humidity > 70) return <CloudRain className="w-8 h-8 text-teal-600" />;
    return <Sun className="w-8 h-8 text-amber-500" />;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 relative overflow-hidden">
      {/* Background Subtle Gradient & Accents */}
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-mint-100 rounded-full blur-2xl pointer-events-none opacity-60" />
      <div className="absolute bottom-0 right-0 w-24 h-24 bg-forest-50 rounded-full blur-xl pointer-events-none opacity-80" />

      {/* Header bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-forest-700"></span>
          </span>
          <span className="text-xs uppercase font-bold tracking-wider text-forest-800">
            Simulated Local Weather Telemetry
          </span>
        </div>

        <button
          onClick={handleSimulateJitter}
          disabled={isSimulating}
          className="inline-flex items-center space-x-1.5 text-xs text-forest-700 hover:text-forest-900 bg-mint-50 hover:bg-mint-100 px-2.5 py-1 rounded-md border border-mint-200 transition-colors"
          title="Simulate live sensor reading variation"
        >
          <RefreshCw className={`w-3 h-3 ${isSimulating ? 'animate-spin' : ''}`} />
          <span>{isSimulating ? 'Sampling...' : 'Live Resample'}</span>
        </button>
      </div>

      {/* Location / Field Tag */}
      <p className="text-xs text-slate-500 mb-3 truncate font-medium">
        Target Field: <span className="text-slate-800 font-semibold">{fieldName}</span>
      </p>

      {/* Hero Temperature & Condition */}
      <div className="flex items-center justify-between py-2 border-b border-slate-100 mb-4">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            {getWeatherIcon()}
          </div>
          <div>
            <div className="flex items-baseline space-x-1">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
                {weather.temperature}
              </span>
              <span className="text-lg font-bold text-slate-500">°C</span>
            </div>
            <p className="text-xs font-medium text-slate-600 mt-0.5">
              {weather.conditions}
            </p>
          </div>
        </div>

        {/* Rain badge */}
        <div className="text-right">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
            Precipitation
          </span>
          <span className="text-lg font-bold text-forest-800 font-mono">
            {weather.rainfall} <span className="text-xs font-normal text-slate-500">mm</span>
          </span>
        </div>
      </div>

      {/* Environmental Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Humidity */}
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100/80">
          <div className="flex items-center space-x-1.5 text-slate-400 text-xs mb-1">
            <Droplets className="w-3.5 h-3.5 text-sky-600" />
            <span>Humidity</span>
          </div>
          <span className="text-base font-bold text-slate-800 font-mono">
            {weather.humidity}%
          </span>
          <span className="text-[10px] text-slate-400 block">Relative</span>
        </div>

        {/* Wind Speed */}
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100/80">
          <div className="flex items-center space-x-1.5 text-slate-400 text-xs mb-1">
            <Wind className="w-3.5 h-3.5 text-teal-600" />
            <span>Wind</span>
          </div>
          <span className="text-base font-bold text-slate-800 font-mono">
            {weather.windSpeed} <span className="text-xs font-normal">km/h</span>
          </span>
          <span className="text-[10px] text-slate-400 block">Steady Breeze</span>
        </div>

        {/* Barometric Pressure */}
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100/80">
          <div className="flex items-center space-x-1.5 text-slate-400 text-xs mb-1">
            <Gauge className="w-3.5 h-3.5 text-indigo-600" />
            <span>Pressure</span>
          </div>
          <span className="text-base font-bold text-slate-800 font-mono">
            {weather.pressure} <span className="text-xs font-normal">hPa</span>
          </span>
          <span className="text-[10px] text-slate-400 block">Standard Baro</span>
        </div>

        {/* UV Index */}
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100/80">
          <div className="flex items-center space-x-1.5 text-slate-400 text-xs mb-1">
            <Sun className="w-3.5 h-3.5 text-amber-500" />
            <span>UV Index</span>
          </div>
          <span className="text-base font-bold text-slate-800 font-mono">
            {weather.uvIndex} <span className="text-xs font-normal text-slate-500">/ 11</span>
          </span>
          <span className="text-[10px] text-slate-400 block">
            {weather.uvIndex > 6 ? 'High Radiation' : 'Moderate'}
          </span>
        </div>
      </div>

      {/* Micro-climate simulation note */}
      <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <span className="flex items-center space-x-1 text-forest-700 font-medium">
          <Sparkles className="w-3 h-3 text-forest-600" />
          <span>Synced with Field Biosensors</span>
        </span>
        <span className="text-slate-400 font-mono">Sampling Cycle: 15m</span>
      </div>
    </div>
  );
};

