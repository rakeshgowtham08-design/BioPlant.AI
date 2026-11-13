// Training dataset for BioPlant.AI Machine Learning Engine
// Features: [N (mg/kg), P (mg/kg), K (mg/kg), Temperature (°C), Humidity (%), pH, Rainfall (mm)]
// Labels: 'Rice', 'Maize', 'Cotton', 'Wheat', 'Groundnuts'

export interface TrainingSample {
  features: [number, number, number, number, number, number, number];
  label: string;
}

export const FEATURE_NAMES = [
  'Nitrogen',
  'Phosphorus',
  'Potassium',
  'Temperature',
  'Humidity',
  'pH',
  'Rainfall'
] as const;

// Base clusters for generating realistic training points with natural variance
const CROP_PROFILES = [
  {
    name: 'Rice',
    ranges: {
      n: [60, 98],
      p: [35, 60],
      k: [35, 48],
      temp: [21.0, 27.5],
      humidity: [75, 95],
      ph: [5.4, 6.9],
      rainfall: [165, 290]
    }
  },
  {
    name: 'Maize',
    ranges: {
      n: [65, 102],
      p: [42, 68],
      k: [30, 52],
      temp: [19.0, 27.0],
      humidity: [56, 78],
      ph: [5.8, 7.1],
      rainfall: [62, 115]
    }
  },
  {
    name: 'Cotton',
    ranges: {
      n: [88, 138],
      p: [36, 64],
      k: [48, 82],
      temp: [23.0, 33.5],
      humidity: [42, 68],
      ph: [6.1, 7.9],
      rainfall: [55, 110]
    }
  },
  {
    name: 'Wheat',
    ranges: {
      n: [42, 72],
      p: [48, 74],
      k: [26, 44],
      temp: [14.5, 23.5],
      humidity: [38, 62],
      ph: [6.1, 7.4],
      rainfall: [42, 88]
    }
  },
  {
    name: 'Groundnuts',
    ranges: {
      n: [18, 38],
      p: [42, 72],
      k: [22, 44],
      temp: [22.5, 30.5],
      humidity: [52, 74],
      ph: [5.9, 6.9],
      rainfall: [54, 102]
    }
  }
];

// Pseudorandom generator with fixed seed for deterministic, reproducible ML initialization
function seededRandom(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function generateTrainingDataset(samplesPerCrop: number = 30): TrainingSample[] {
  const rng = seededRandom(42069);
  const dataset: TrainingSample[] = [];

  for (const crop of CROP_PROFILES) {
    for (let i = 0; i < samplesPerCrop; i++) {
      const lerp = (min: number, max: number) => min + rng() * (max - min);
      
      const n = Math.round(lerp(crop.ranges.n[0], crop.ranges.n[1]));
      const p = Math.round(lerp(crop.ranges.p[0], crop.ranges.p[1]));
      const k = Math.round(lerp(crop.ranges.k[0], crop.ranges.k[1]));
      const temp = parseFloat(lerp(crop.ranges.temp[0], crop.ranges.temp[1]).toFixed(1));
      const humidity = Math.round(lerp(crop.ranges.humidity[0], crop.ranges.humidity[1]));
      const ph = parseFloat(lerp(crop.ranges.ph[0], crop.ranges.ph[1]).toFixed(2));
      const rainfall = parseFloat(lerp(crop.ranges.rainfall[0], crop.ranges.rainfall[1]).toFixed(1));

      dataset.push({
        features: [n, p, k, temp, humidity, ph, rainfall],
        label: crop.name
      });
    }
  }

  // Shuffle dataset deterministically
  for (let i = dataset.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [dataset[i], dataset[j]] = [dataset[j], dataset[i]];
  }

  return dataset;
}

