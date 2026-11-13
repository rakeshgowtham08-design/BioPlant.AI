// ==============================================================================
// BioPlant.AI - 7-Day Predictive Weather Forecasting & Micro-Climate Telemetry
// Actionable Agronomic Insights: Spraying Windows, Evapotranspiration, Frost Alerts
// ==============================================================================

import { DailyForecast, WeatherAdvisoryMetrics } from '../types';

export const SEVEN_DAY_FORECAST: DailyForecast[] = [
  {
    day: 'Today',
    date: 'Nov 07',
    tempMax: 26.4,
    tempMin: 18.2,
    precipitationMm: 12.0,
    precipitationProb: 35,
    humidity: 78,
    windSpeed: 11.2,
    conditions: 'Partly Sunny • Mild Breeze',
    icon: 'partly_cloudy_day',
    sprayingViability: 'Optimal',
    et0: 3.8,
    frostRisk: 'None',
    advisoryText: 'Ideal for systemic fungicide application before dusk. Low spray drift hazard.'
  },
  {
    day: 'Fri',
    date: 'Nov 08',
    tempMax: 27.8,
    tempMin: 19.0,
    precipitationMm: 2.5,
    precipitationProb: 15,
    humidity: 72,
    windSpeed: 9.8,
    conditions: 'Clear Sky & High DLI',
    icon: 'sunny',
    sprayingViability: 'Optimal',
    et0: 4.6,
    frostRisk: 'None',
    advisoryText: 'High solar irradiance will accelerate canopy uptake. Foliar micronutrients recommended.'
  },
  {
    day: 'Sat',
    date: 'Nov 09',
    tempMax: 25.1,
    tempMin: 17.5,
    precipitationMm: 28.0,
    precipitationProb: 80,
    humidity: 86,
    windSpeed: 18.4,
    conditions: 'Sub-soil Rain Inflow',
    icon: 'rainy',
    sprayingViability: 'Prohibited',
    et0: 2.4,
    frostRisk: 'None',
    advisoryText: 'High precipitation event expected. Postpone all chemical spraying; prep drainage culverts.'
  },
  {
    day: 'Sun',
    date: 'Nov 10',
    tempMax: 23.6,
    tempMin: 16.0,
    precipitationMm: 8.0,
    precipitationProb: 40,
    humidity: 82,
    windSpeed: 13.5,
    conditions: 'Scattered Showers',
    icon: 'rainy',
    sprayingViability: 'Marginal',
    et0: 3.1,
    frostRisk: 'None',
    advisoryText: 'Damp topsoil layer; wait for canopy dry-off before field machinery transit.'
  },
  {
    day: 'Mon',
    date: 'Nov 11',
    tempMax: 28.5,
    tempMin: 18.4,
    precipitationMm: 0.0,
    precipitationProb: 10,
    humidity: 68,
    windSpeed: 10.1,
    conditions: 'Sunny & High Thermal Gain',
    icon: 'wb_sunny',
    sprayingViability: 'Optimal',
    et0: 4.9,
    frostRisk: 'None',
    advisoryText: 'Peak photosynthetic activity. Optimal nitrogen side-dressing window.'
  },
  {
    day: 'Tue',
    date: 'Nov 12',
    tempMax: 29.0,
    tempMin: 19.2,
    precipitationMm: 0.0,
    precipitationProb: 5,
    humidity: 64,
    windSpeed: 12.0,
    conditions: 'Warm & Dry Air Flow',
    icon: 'wb_sunny',
    sprayingViability: 'Optimal',
    et0: 5.2,
    frostRisk: 'None',
    advisoryText: 'High evapotranspiration rate. Trigger supplemental drip cycle of 14mm.'
  },
  {
    day: 'Wed',
    date: 'Nov 13',
    tempMax: 27.2,
    tempMin: 17.8,
    precipitationMm: 1.0,
    precipitationProb: 20,
    humidity: 70,
    windSpeed: 14.2,
    conditions: 'Overcast & Mild',
    icon: 'cloud',
    sprayingViability: 'Optimal',
    et0: 3.9,
    frostRisk: 'None',
    advisoryText: 'Good equilibrium conditions for field scouts and pest vulnerability indexing.'
  }
];

export const WEATHER_ADVISORY_METRICS: WeatherAdvisoryMetrics = {
  sprayingWindow: {
    status: 'Favorable',
    hours: '06:00 - 11:30 AM (Next 24h)',
    windThreshold: 'Wind < 15 km/h (Current: 11.2 km/h)',
    summary: 'Low canopy turbulence. Inversion index safe for droplet deposition.'
  },
  evapotranspiration: {
    index: 4.2, // mm/day
    demandLevel: 'Moderate',
    rechargeGuidance: 'Projected moisture deficit: 12 mm across 48h. Schedule night-time pulse drip.'
  },
  soilFrost: {
    riskLevel: 'Zero Risk',
    minGroundTemp: 16.8, // °C
    advisoryText: 'Ground thermal profile is comfortably above freezing threshold (Min: 16.8°C).'
  }
};

