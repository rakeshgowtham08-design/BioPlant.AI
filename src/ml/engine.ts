import { SoilMetrics, WeatherMetrics, PredictionResult, MetricBenchmark } from '../types';
import { generateTrainingDataset } from './dataset';
import { RandomForestClassifier } from './randomForest';
import { CROPS_CATALOG } from './benchmarks';

let globalForest: RandomForestClassifier | null = null;

export function initializeRandomForest(): RandomForestClassifier {
  if (!globalForest) {
    const dataset = generateTrainingDataset(35); // 175 calibrated samples
    globalForest = new RandomForestClassifier({
      numTrees: 45,
      maxDepth: 8,
      minSamplesSplit: 2,
      maxFeatures: 4
    });
    globalForest.fit(dataset);
  }
  return globalForest;
}

export function computeBenchmarks(
  cropKey: string,
  soil: SoilMetrics,
  weather: WeatherMetrics
): MetricBenchmark[] {
  const crop = CROPS_CATALOG[cropKey] || CROPS_CATALOG['Rice'];
  const ideal = crop.idealMetrics;

  const evaluateMetric = (
    name: string,
    key: keyof SoilMetrics | 'rainfall' | 'temperature',
    unit: string,
    userVal: number,
    min: number,
    max: number,
    optimal: number,
    tips: { low: string; optimal: string; high: string }
  ): MetricBenchmark => {
    let status: 'Optimal' | 'Low' | 'High' | 'Deficient' | 'Excess' = 'Optimal';
    let recommendation = tips.optimal;

    if (userVal < min) {
      status = userVal < min * 0.7 ? 'Deficient' : 'Low';
      recommendation = tips.low;
    } else if (userVal > max) {
      status = userVal > max * 1.3 ? 'Excess' : 'High';
      recommendation = tips.high;
    }

    const diff = userVal - optimal;
    const percentageDiff = Math.round((diff / optimal) * 100);

    return {
      name,
      key,
      unit,
      userValue: userVal,
      idealMin: min,
      idealMax: max,
      idealOptimal: optimal,
      status,
      percentageDifference: percentageDiff,
      recommendation
    };
  };

  const benchmarks: MetricBenchmark[] = [
    evaluateMetric(
      'Nitrogen (N)',
      'nitrogen',
      'mg/kg',
      soil.nitrogen,
      ideal.nitrogen[0],
      ideal.nitrogen[1],
      Math.round((ideal.nitrogen[0] + ideal.nitrogen[1]) / 2),
      {
        low: 'Supplement with urea or composted cattle manure at basal dressing stage.',
        optimal: 'Nitrogen level is in prime range for vigorous vegetative canopy growth.',
        high: 'High nitrogen may cause lodging and delayed flowering. Reduce top-dressing.'
      }
    ),
    evaluateMetric(
      'Phosphorus (P)',
      'phosphorus',
      'mg/kg',
      soil.phosphorus,
      ideal.phosphorus[0],
      ideal.phosphorus[1],
      Math.round((ideal.phosphorus[0] + ideal.phosphorus[1]) / 2),
      {
        low: 'Apply Diammonium Phosphate (DAP) or Single Super Phosphate (SSP) at root zone.',
        optimal: 'Phosphorus reserves are well-aligned for robust root elongation and energy transfer.',
        high: 'Elevated P. Avoid additional phosphate fertilizers to prevent iron/zinc lockout.'
      }
    ),
    evaluateMetric(
      'Potassium (K)',
      'potassium',
      'mg/kg',
      soil.potassium,
      ideal.potassium[0],
      ideal.potassium[1],
      Math.round((ideal.potassium[0] + ideal.potassium[1]) / 2),
      {
        low: 'Apply Muriate of Potash (MOP) to improve plant disease resistance and grain filling.',
        optimal: 'Potassium is well-balanced for osmotic regulation and stalk strength.',
        high: 'Sufficient potassium in reserve. Monitor calcium/magnesium balance.'
      }
    ),
    evaluateMetric(
      'Soil pH',
      'ph',
      'pH',
      soil.ph,
      ideal.ph[0],
      ideal.ph[1],
      parseFloat(((ideal.ph[0] + ideal.ph[1]) / 2).toFixed(1)),
      {
        low: 'Acidic soil. Apply agricultural lime (calcium carbonate) or dolomite to raise pH.',
        optimal: 'Ideal pH facilitates maximum micronutrient bioavailability.',
        high: 'Alkaline soil. Apply agricultural gypsum or elemental sulfur to moderate alkalinity.'
      }
    ),
    evaluateMetric(
      'Precipitation / Rainfall',
      'rainfall',
      'mm',
      weather.rainfall,
      ideal.rainfall[0],
      ideal.rainfall[1],
      Math.round((ideal.rainfall[0] + ideal.rainfall[1]) / 2),
      {
        low: 'Rainfall is below optimal. Supplemental drip or furrow irrigation required.',
        optimal: 'Rainfall volume matches optimal transpiration demand.',
        high: 'High precipitation. Ensure field drainage ditches are clear to avoid waterlogging.'
      }
    ),
    evaluateMetric(
      'Ambient Temperature',
      'temperature',
      '°C',
      weather.temperature,
      ideal.temperature[0],
      ideal.temperature[1],
      parseFloat(((ideal.temperature[0] + ideal.temperature[1]) / 2).toFixed(1)),
      {
        low: 'Cooler than optimal. Consider mulching or delayed sowing until soil warms.',
        optimal: 'Ambient temperature is directly in thermal growth sweet spot.',
        high: 'Higher thermal load. Ensure adequate soil moisture to buffer evaporative loss.'
      }
    )
  ];

  return benchmarks;
}

export function runBioPlantIntelligence(
  soil: SoilMetrics,
  weather: WeatherMetrics,
  fieldId?: string
): PredictionResult {
  const forest = initializeRandomForest();

  // Vector order: [N, P, K, Temp, Humidity, pH, Rainfall]
  const featureVector = [
    soil.nitrogen,
    soil.phosphorus,
    soil.potassium,
    weather.temperature,
    weather.humidity,
    soil.ph,
    weather.rainfall
  ];

  const prediction = forest.predict(featureVector);
  const primaryCropInfo = CROPS_CATALOG[prediction.winner] || CROPS_CATALOG['Rice'];
  const benchmarks = computeBenchmarks(prediction.winner, soil, weather);

  return {
    primaryCrop: primaryCropInfo,
    confidence: prediction.confidence,
    distribution: prediction.distribution,
    benchmarks,
    timestamp: new Date().toISOString(),
    fieldId,
    diagnosticsInput: {
      ...soil,
      ...weather
    }
  };
}

