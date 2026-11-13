import { FieldProfile, HistoricalRecord } from '../types';

export const STITCH_FIELDS: FieldProfile[] = [
  {
    id: 'parcel-08',
    name: 'North Ridge Valley (Parcel #08)',
    location: 'Sector 4B • Station #FS-088',
    soilType: 'Loamy Clay, pH 6.4',
    acreage: 42.5,
    lastTestedDate: '2026-11-05',
    healthIndex: 94,
    currentMetrics: {
      nitrogen: 85,
      phosphorus: 48,
      potassium: 42,
      ph: 6.5
    },
    weatherProfile: {
      temperature: 24.8,
      humidity: 78,
      rainfall: 185,
      conditions: 'Partly Sunny • Warm Humid',
      windSpeed: 14,
      pressure: 1014,
      uvIndex: 7
    }
  },
  {
    id: 'delta-02',
    name: 'Delta Lowlands #02',
    location: 'Sector 2A • Lowland Basin',
    soilType: 'Alluvial Silt, pH 6.8',
    acreage: 68.2,
    lastTestedDate: '2026-11-03',
    healthIndex: 91,
    currentMetrics: {
      nitrogen: 92,
      phosphorus: 52,
      potassium: 46,
      ph: 6.8
    },
    weatherProfile: {
      temperature: 26.4,
      humidity: 82,
      rainfall: 220,
      conditions: 'Overcast & Sub-tropical Soak',
      windSpeed: 12,
      pressure: 1012,
      uvIndex: 5
    }
  },
  {
    id: 'terrace-14',
    name: 'Highland Terrace #14',
    location: 'Sector 5D • Northern Tableland',
    soilType: 'Sandy Loam, pH 6.1',
    acreage: 31.0,
    lastTestedDate: '2026-10-29',
    healthIndex: 88,
    currentMetrics: {
      nitrogen: 55,
      phosphorus: 38,
      potassium: 30,
      ph: 6.1
    },
    weatherProfile: {
      temperature: 19.5,
      humidity: 48,
      rainfall: 75,
      conditions: 'Crisp Breeze & Clear Sun',
      windSpeed: 18,
      pressure: 1018,
      uvIndex: 6
    }
  },
  {
    id: 'greenhouse-01',
    name: 'Greenhouse Alpha #01',
    location: 'Indoor Agronomy Dome #01',
    soilType: 'Hydroponic Bio-Bed, pH 5.9',
    acreage: 12.4,
    lastTestedDate: '2026-11-06',
    healthIndex: 98,
    currentMetrics: {
      nitrogen: 70,
      phosphorus: 50,
      potassium: 45,
      ph: 5.9
    },
    weatherProfile: {
      temperature: 22.0,
      humidity: 65,
      rainfall: 130,
      conditions: 'Climate Controlled Bio-Dome',
      windSpeed: 4,
      pressure: 1015,
      uvIndex: 4
    }
  }
];

export const STITCH_INITIAL_HISTORY: HistoricalRecord[] = [
  {
    id: 'hist-201',
    date: '2026-11-04',
    fieldName: 'North Ridge Valley (Parcel #08)',
    recommendedCrop: 'Rice',
    confidence: 94.8,
    nitrogen: 85,
    phosphorus: 48,
    potassium: 42,
    ph: 6.5,
    status: 'In Rotation',
    yieldRealization: 'Hard Red Wheat (Archived: 91.2% Yield)'
  },
  {
    id: 'hist-202',
    date: '2026-10-22',
    fieldName: 'Delta Lowlands #02',
    recommendedCrop: 'Maize',
    confidence: 91.8,
    nitrogen: 105,
    phosphorus: 55,
    potassium: 50,
    ph: 6.2,
    status: 'Planted',
    yieldRealization: 'High Starch Bio-Yield'
  },
  {
    id: 'hist-203',
    date: '2026-10-10',
    fieldName: 'Highland Terrace #14',
    recommendedCrop: 'Wheat',
    confidence: 94.1,
    nitrogen: 55,
    phosphorus: 38,
    potassium: 30,
    ph: 6.8,
    status: 'Harvested',
    yieldRealization: 'Achieved 4.2 T/Ha'
  }
];
