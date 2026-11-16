// BioPlant.AI - API Service for Backend Communication

import { SoilMetrics, WeatherMetrics, MarketplaceDeal, CustomerRecord, PredictionResult, CropInfo, MetricBenchmark } from '../types';
import { CROPS_CATALOG } from '../ml/benchmarks';
import { computeBenchmarks } from '../ml/engine';

// Get API URL from environment or use default
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Maps a raw backend /api/predict response into the frontend PredictionResult shape
function normalizeBackendPrediction(
  raw: any,
  soil: SoilMetrics,
  weather: WeatherMetrics,
  fieldId?: string
): PredictionResult {
  const rc = raw.recommendedCrop;
  const im = rc.ideal_metrics;
  const catalogCrop = CROPS_CATALOG[rc.name] || CROPS_CATALOG['Rice'];

  const primaryCrop: CropInfo = {
    ...catalogCrop,
    name: rc.name || catalogCrop.name,
    scientificName: rc.scientific_name || catalogCrop.scientificName,
    family: rc.family || catalogCrop.family,
    cycle: rc.cycle || catalogCrop.cycle,
    description: rc.description || catalogCrop.description,
    expectedYield: rc.expected_yield || catalogCrop.expectedYield,
    waterRequirement: rc.water_requirement || catalogCrop.waterRequirement,
    sowingSeason: rc.cycle || catalogCrop.sowingSeason,
    fertilizerAdvice: rc.fertilizer_advice || catalogCrop.fertilizerAdvice,
    idealMetrics: {
      nitrogen: im?.nitrogen || catalogCrop.idealMetrics.nitrogen,
      phosphorus: im?.phosphorus || catalogCrop.idealMetrics.phosphorus,
      potassium: im?.potassium || catalogCrop.idealMetrics.potassium,
      ph: im?.ph || catalogCrop.idealMetrics.ph,
      temperature: im?.temperature || catalogCrop.idealMetrics.temperature,
      humidity: im?.humidity || catalogCrop.idealMetrics.humidity,
      rainfall: im?.rainfall || catalogCrop.idealMetrics.rainfall,
    },
  };

  const defaultBenchmarks = computeBenchmarks(rc.name, soil, weather);
  const mappedBenchmarks: MetricBenchmark[] = Array.isArray(raw.benchmarks)
    ? (raw.benchmarks as any[]).map((b: any) => {
        const idealOptimal = (b.idealMin + b.idealMax) / 2;
        const diff = idealOptimal !== 0
          ? Math.round(((b.userValue - idealOptimal) / idealOptimal) * 100)
          : 0;
        let recommendation = '';
        if (b.status === 'Low') recommendation = `Increase ${b.name} to reach the ${b.idealMin}–${b.idealMax} ${b.unit} optimal range.`;
        else if (b.status === 'High') recommendation = `Reduce ${b.name} to fall within the ${b.idealMin}–${b.idealMax} ${b.unit} optimal range.`;
        else recommendation = `${b.name} is within the optimal range (${b.idealMin}–${b.idealMax} ${b.unit}).`;

        return {
          name: b.name,
          key: b.key as MetricBenchmark['key'],
          unit: b.unit,
          userValue: b.userValue,
          idealMin: b.idealMin,
          idealMax: b.idealMax,
          idealOptimal,
          status: b.status,
          percentageDifference: diff,
          recommendation,
        };
      })
    : [];

  // Guarantee all 6 benchmarks are present so UI never crashes
  const benchmarks = defaultBenchmarks.map(db => {
    const found = mappedBenchmarks.find(mb => mb.key === db.key);
    return found || db;
  });

  return {
    primaryCrop,
    confidence: raw.confidence,
    distribution: raw.distribution,
    benchmarks,
    timestamp: new Date().toISOString(),
    fieldId,
    diagnosticsInput: { ...soil, ...weather },
  };
}

export async function checkBackendHealth(): Promise<{ status: string; database: string }> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    const response = await fetch(`${API_URL}/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (!response.ok) throw new Error(`Health check failed: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.warn('Backend health check failed, using frontend ML only:', error);
    throw error;
  }
}

export async function getCropPrediction(
  soil: SoilMetrics,
  weather: WeatherMetrics,
  fieldId?: string
): Promise<PredictionResult> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(`${API_URL}/api/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nitrogen: soil.nitrogen,
        phosphorus: soil.phosphorus,
        potassium: soil.potassium,
        ph: soil.ph,
        temperature: weather.temperature,
        humidity: weather.humidity,
        rainfall: weather.rainfall,
        field_id: fieldId,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Prediction request failed: ${response.status}`);
    }

    const raw = await response.json();
    return normalizeBackendPrediction(raw, soil, weather, fieldId);
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

/**
 * Get marketplace deals from backend
 */
export async function getMarketplaceDeals(): Promise<MarketplaceDeal[]> {
  try {
    const response = await fetch(`${API_URL}/api/marketplace/deals`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch deals: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.warn('Failed to fetch deals from backend:', error);
    // Return empty array to allow fallback to frontend service
    return [];
  }
}

/**
 * Create a new marketplace deal via backend
 */
export async function createMarketplaceDeal(
  fieldId: string,
  buyerName: string,
  cropType: string,
  pricePerTon: number,
  quantitySold: number
): Promise<MarketplaceDeal> {
  try {
    const response = await fetch(`${API_URL}/api/marketplace/deals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        field_id: fieldId,
        buyer_name: buyerName,
        crop_type: cropType,
        price_per_ton: pricePerTon,
        quantity_sold: quantitySold
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create deal: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.warn('Failed to create deal via backend:', error);
    throw error;
  }
}

/**
 * Get customer records from backend
 */
export async function getCustomerRecords(): Promise<CustomerRecord[]> {
  try {
    const response = await fetch(`${API_URL}/api/customers`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch customers: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.warn('Failed to fetch customers from backend:', error);
    // Return empty array to allow fallback to frontend service
    return [];
  }
}

/**
 * Create a new customer via backend
 */
export async function createCustomerRecord(
  companyName: string,
  contactPerson: string,
  email: string,
  phone: string,
  cropType: string,
  totalVolumeMt: number = 1000.0
): Promise<CustomerRecord> {
  try {
    const response = await fetch(`${API_URL}/api/customers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        company_name: companyName,
        contact_person: contactPerson,
        email: email,
        phone: phone,
        crop_type: cropType,
        total_volume_mt: totalVolumeMt
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create customer: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.warn('Failed to create customer via backend:', error);
    throw error;
  }
}

// Check if backend is available
export async function isBackendAvailable(): Promise<boolean> {
  try {
    await checkBackendHealth();
    return true;
  } catch (error) {
    return false;
  }
}