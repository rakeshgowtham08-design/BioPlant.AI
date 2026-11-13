// BioPlant.AI Data Types & Model Schemas

export interface SoilMetrics {
  nitrogen: number;    // N in mg/kg (0-150)
  phosphorus: number;  // P in mg/kg (0-150)
  potassium: number;   // K in mg/kg (0-150)
  ph: number;          // pH (0.0 - 14.0)
}

export interface WeatherMetrics {
  temperature: number; // °C (10 - 45)
  humidity: number;    // % (10 - 100)
  rainfall: number;    // mm (20 - 300)
  conditions: string;  // e.g. 'Humid & Overcast', 'Partly Sunny'
  windSpeed: number;   // km/h
  pressure: number;    // hPa
  uvIndex: number;     // 1-11+
}

export interface FieldProfile {
  id: string;
  name: string;
  location: string;
  soilType: string;
  acreage: number;
  lastTestedDate: string;
  currentMetrics: SoilMetrics;
  weatherProfile: WeatherMetrics;
  healthIndex: number; // 0-100
}

export interface HistoricalRecord {
  id: string;
  date: string;
  fieldName: string;
  recommendedCrop: string;
  confidence: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  ph: number;
  status: 'Planted' | 'Harvested' | 'In Rotation' | 'Soil Prep';
  yieldRealization?: string;
}

export interface MetricBenchmark {
  name: string;
  key: keyof SoilMetrics | 'rainfall' | 'temperature';
  unit: string;
  userValue: number;
  idealMin: number;
  idealMax: number;
  idealOptimal: number;
  status: 'Optimal' | 'Low' | 'High' | 'Deficient' | 'Excess';
  percentageDifference: number;
  recommendation: string;
}

export interface CropInfo {
  cropId: string;
  name: string;
  scientificName: string;
  family: string;
  cycle: string;
  description: string;
  idealMetrics: {
    nitrogen: [number, number];
    phosphorus: [number, number];
    potassium: [number, number];
    ph: [number, number];
    temperature: [number, number];
    humidity: [number, number];
    rainfall: [number, number];
  };
  expectedYield: string;
  waterRequirement: string;
  sowingSeason: string;
  fertilizerAdvice: string;
  color: string;
  badgeBg: string;
  iconName: string;
}

export interface PredictionResult {
  primaryCrop: CropInfo;
  confidence: number; // 0-100%
  distribution: { cropName: string; probability: number }[];
  benchmarks: MetricBenchmark[];
  timestamp: string;
  fieldId?: string;
  diagnosticsInput: SoilMetrics & WeatherMetrics;
}

// B2B Crop Marketplace Types
export interface MarketplaceBuyer {
  id: string;
  buyerName: string;
  location: string;
  cropType: string;
  biddingPrice: number;       // USD per Metric Ton (e.g. 310)
  demandedQuantity: number;   // Metric Tons (e.g. 2500)
  qualityTier: string;        // e.g. "Grade A Export", "Prime Milling Tier 1"
  verifiedTier: string;       // e.g. "AAA Sovereign Verified", "Certified Global Off-taker"
  deliveryTerms: string;      // e.g. "FOB Port / Free-on-Board", "Ex-Farm Gate Direct"
  paymentTerms: string;       // e.g. "100% Escrow via Smart Contract"
  rating: number;             // e.g. 4.95
  dealsCompleted: number;     // e.g. 142
  avatarUrl?: string;
}

// Table: marketplace_deals (as specified in requirement 5)
export interface MarketplaceDeal {
  id: string;
  field_id: string;
  buyer_name: string;
  crop_type: string;
  price_per_ton: number;
  quantity_sold: number;
  total_amount: number;
  transaction_status: 'Pending Dispatch' | 'In Escrow' | 'Dispatched' | 'Paid';
  created_at: string;
  contract_hash: string;
  fulfillment_percent: number;
}

// Table: customer_records (as specified in requirement 5)
export interface CustomerRecord {
  id: string;
  company_name: string;
  contact_person: string;
  email: string;
  phone?: string;
  crop_type: string;
  active_contracts_count: number;
  total_volume_mt: number;
  total_revenue: number;
  status: 'Active Off-taker' | 'Verified Partner' | 'Pending Review';
  created_at: string;
}

// Advanced 7-Day Weather Forecasting Types
export interface DailyForecast {
  day: string;             // e.g. "Mon", "Tue"
  date: string;            // e.g. "Nov 08"
  tempMax: number;         // °C
  tempMin: number;         // °C
  precipitationMm: number; // mm
  precipitationProb: number; // %
  humidity: number;        // %
  windSpeed: number;       // km/h
  conditions: string;      // e.g. "Sunny & Clear"
  icon: string;            // Material icon name
  sprayingViability: 'Optimal' | 'Marginal' | 'Prohibited';
  et0: number;             // Evapotranspiration mm/day
  frostRisk: 'None' | 'Low Advisory' | 'High Warning';
  advisoryText: string;
}

export interface WeatherAdvisoryMetrics {
  sprayingWindow: {
    status: 'Favorable' | 'Wind Restricted' | 'Rain Hazard';
    hours: string;
    windThreshold: string;
    summary: string;
  };
  evapotranspiration: {
    index: number;         // mm/day
    demandLevel: 'Low' | 'Moderate' | 'High' | 'Extreme';
    rechargeGuidance: string;
  };
  soilFrost: {
    riskLevel: 'Zero Risk' | 'Advisory' | 'Critical Frost Alert';
    minGroundTemp: number; // °C
    advisoryText: string;
  };
}

export type ActiveScreen = 'dashboard' | 'diagnostics' | 'results' | 'marketplace' | 'customers' | 'cropscan';


