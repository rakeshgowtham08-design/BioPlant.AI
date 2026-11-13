// BioPlant.AI - API Service for Backend Communication

import { SoilMetrics, WeatherMetrics, MarketplaceDeal, CustomerRecord } from '../types';

// Get API URL from environment or use default
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Get health status from backend
 */
export async function checkBackendHealth(): Promise<{ status: string; database: string }> {
  try {
    const response = await fetch(`${API_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Backend health check failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.warn('Backend health check failed, using frontend ML only:', error);
    throw error;
  }
}

/**
 * Get crop prediction from backend
 */
export async function getCropPrediction(
  soil: SoilMetrics,
  weather: WeatherMetrics,
  fieldId?: string
): Promise<any> {
  try {
    const response = await fetch(`${API_URL}/api/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nitrogen: soil.nitrogen,
        phosphorus: soil.phosphorus,
        potassium: soil.potassium,
        ph: soil.ph,
        temperature: weather.temperature,
        humidity: weather.humidity,
        rainfall: weather.rainfall,
        field_id: fieldId
      }),
    });

    if (!response.ok) {
      throw new Error(`Prediction request failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.warn('Backend prediction failed, using frontend ML:', error);
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