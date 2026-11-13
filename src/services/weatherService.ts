import { WeatherMetrics } from '../types';

export interface WeatherPreset {
  id: string;
  name: string;
  tag: string;
  metrics: WeatherMetrics;
}

export const WEATHER_PRESETS: WeatherPreset[] = [
  {
    id: 'monsoon-humid',
    name: 'Tropical Monsoon (Wet Season)',
    tag: 'Optimal for Wetland Rice',
    metrics: {
      temperature: 26.5,
      humidity: 88,
      rainfall: 240,
      conditions: 'Monsoonal Rain & Heavy Overcast',
      windSpeed: 16,
      pressure: 1009,
      uvIndex: 3
    }
  },
  {
    id: 'warm-prairie',
    name: 'Temperate Warm Plains',
    tag: 'Optimal for Maize / Corn',
    metrics: {
      temperature: 24.0,
      humidity: 68,
      rainfall: 95,
      conditions: 'Partly Sunny & Mild Breeze',
      windSpeed: 15,
      pressure: 1016,
      uvIndex: 7
    }
  },
  {
    id: 'subtropical-dry',
    name: 'Warm Subtropical Sun',
    tag: 'Optimal for Cotton',
    metrics: {
      temperature: 29.8,
      humidity: 50,
      rainfall: 75,
      conditions: 'Clear Sky & High Solar Radiation',
      windSpeed: 12,
      pressure: 1012,
      uvIndex: 9
    }
  },
  {
    id: 'cool-winter',
    name: 'Cool Temperate Winter',
    tag: 'Optimal for Rabi Wheat',
    metrics: {
      temperature: 17.2,
      humidity: 46,
      rainfall: 55,
      conditions: 'Cool Crisp Air & Clear Sun',
      windSpeed: 19,
      pressure: 1021,
      uvIndex: 5
    }
  },
  {
    id: 'semi-arid',
    name: 'Warm Semi-Arid Ridge',
    tag: 'Optimal for Groundnuts',
    metrics: {
      temperature: 27.5,
      humidity: 58,
      rainfall: 70,
      conditions: 'Moderate Dry Breeze & Sun',
      windSpeed: 14,
      pressure: 1013,
      uvIndex: 8
    }
  }
];

export function simulateLiveWeatherVariance(base: WeatherMetrics): WeatherMetrics {
  // Add small micro-climatic jitter (-1 to +1 °C, -3 to +3% humidity, -5 to +5mm rainfall)
  const tempDelta = (Math.random() - 0.5) * 1.5;
  const humDelta = (Math.random() - 0.5) * 4;
  const rainDelta = (Math.random() - 0.5) * 6;

  const newTemp = Math.min(45, Math.max(10, parseFloat((base.temperature + tempDelta).toFixed(1))));
  const newHum = Math.min(100, Math.max(20, Math.round(base.humidity + humDelta)));
  const newRain = Math.min(400, Math.max(10, Math.round(base.rainfall + rainDelta)));

  return {
    ...base,
    temperature: newTemp,
    humidity: newHum,
    rainfall: newRain,
    windSpeed: Math.max(5, Math.round(base.windSpeed + (Math.random() - 0.5) * 3))
  };
}

