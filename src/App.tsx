import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ScreenDashboard } from './components/ScreenDashboard';
import { ScreenDiagnostics } from './components/ScreenDiagnostics';
import { ScreenResults } from './components/ScreenResults';
import { ScreenMarketplace } from './components/ScreenMarketplace';
import { ScreenCustomers } from './components/ScreenCustomers';
import { ScreenCropScan } from './components/ScreenCropScan';
import { DFDModal } from './components/DFDModal';
import { STITCH_FIELDS, STITCH_INITIAL_HISTORY } from './services/fieldsData';
import { FieldProfile, HistoricalRecord, SoilMetrics, WeatherMetrics, PredictionResult, ActiveScreen } from './types';
import { initializeRandomForest, runBioPlantIntelligence } from './ml/engine';
import { LanguageProvider } from './context/LanguageContext';
import { isBackendAvailable, getCropPrediction, checkBackendHealth } from './services/apiService';

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    console.error('App Error:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', textAlign: 'center', backgroundColor: '#fff', minHeight: '100vh' }}>
          <h1>⚠️ App Error</h1>
          <p>{this.state.error?.message}</p>
          <button onClick={() => window.location.reload()}>Reload App</button>
          <details style={{ marginTop: '20px', textAlign: 'left', maxWidth: '600px', margin: '20px auto' }}>
            <summary>Error Details</summary>
            <pre style={{ background: '#f5f5f5', padding: '10px', overflow: 'auto' }}>
              {this.state.error?.stack}
            </pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

export function AppContent() {
  const [currentScreen, setCurrentScreen] = useState<ActiveScreen>('dashboard');

  // Fields and active selection from Stitch reference
  const [fields, setFields] = useState<FieldProfile[]>(STITCH_FIELDS);
  const [selectedField, setSelectedField] = useState<FieldProfile>(STITCH_FIELDS[0]);

  // Soil & Weather inputs
  const [soil, setSoil] = useState<SoilMetrics>(STITCH_FIELDS[0].currentMetrics);
  const [weather, setWeather] = useState<WeatherMetrics>(STITCH_FIELDS[0].weatherProfile);

  // History logbook
  const [history, setHistory] = useState<HistoricalRecord[]>(STITCH_INITIAL_HISTORY);

  // ML Prediction Results & loading
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSavedInHistory, setIsSavedInHistory] = useState<boolean>(false);

  // Architecture modal state
  const [isDfdOpen, setIsDfdOpen] = useState<boolean>(false);

  // Initialize Random Forest Classifier and prepare baseline recommendation on boot
  useEffect(() => {
    initializeRandomForest();
    const baseline = runBioPlantIntelligence(
      STITCH_FIELDS[0].currentMetrics,
      STITCH_FIELDS[0].weatherProfile,
      STITCH_FIELDS[0].id
    );
    setPredictionResult(baseline);
  }, []);

  // When user switches active field
  const handleSelectField = (field: FieldProfile) => {
    setSelectedField(field);
    setSoil(field.currentMetrics);
    setWeather(field.weatherProfile);
  };

  // Run BioPlant Intelligence Random Forest Classifier
  const handleExecuteIntelligence = () => {
    setIsLoading(true);

    setTimeout(() => {
      const result = runBioPlantIntelligence(soil, weather, selectedField.id);
      setPredictionResult(result);
      setIsLoading(false);
      setIsSavedInHistory(false);
      setCurrentScreen('results');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 600);
  };

  // Jump from Dashboard to Diagnostics
  const handleRunFromDashboard = () => {
    setCurrentScreen('diagnostics');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Load a historical record's values into diagnostics
  const handleLoadHistoricalRecord = (record: HistoricalRecord) => {
    setSoil({
      nitrogen: record.nitrogen,
      phosphorus: record.phosphorus,
      potassium: record.potassium,
      ph: record.ph
    });
    const match = fields.find(f => f.name.includes(record.fieldName.split('(')[0].trim()));
    if (match) {
      setSelectedField(match);
      setWeather(match.weatherProfile);
    }
    setCurrentScreen('diagnostics');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Save current recommendation to field history logbook
  const handleSaveToHistory = () => {
    if (!predictionResult || isSavedInHistory) return;

    const newRecord: HistoricalRecord = {
      id: `hist-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      fieldName: selectedField.name,
      recommendedCrop: predictionResult.primaryCrop.name,
      confidence: predictionResult.confidence,
      nitrogen: soil.nitrogen,
      phosphorus: soil.phosphorus,
      potassium: soil.potassium,
      ph: soil.ph,
      status: 'In Rotation',
      yieldRealization: `Projected: ${predictionResult.primaryCrop.expectedYield.split('(')[0].trim()}`
    };

    setHistory([newRecord, ...history]);
    setIsSavedInHistory(true);
  };

  return (
    <div className="bg-surface text-on-surface flex flex-col min-h-screen">

      {/* Fixed Top Header & Floating Bottom Pill Navigation (6 Tabs with Visual Anchors) */}
      <Navbar
        currentScreen={currentScreen}
        onNavigate={(screen) => {
          setCurrentScreen(screen);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        hasResults={predictionResult !== null}
        onOpenDfd={() => setIsDfdOpen(true)}
      />

      {/* Main Content Shell with safe area paddings matching Stitch */}
      <main className="flex flex-col relative w-full pt-16 pb-28 bg-surface min-h-screen">

        {/* Screen 1: Field Dashboard & 7-Day Weather Forecast */}
        {currentScreen === 'dashboard' && (
          <ScreenDashboard
            fields={fields}
            selectedField={selectedField}
            onSelectField={handleSelectField}
            activeHistory={history}
            weather={weather}
            onWeatherChange={setWeather}
            onRunIntelligence={handleRunFromDashboard}
            onLoadHistoricalRecord={handleLoadHistoricalRecord}
            onNavigateToCropScan={() => {
              setCurrentScreen('cropscan');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateToMarketplace={() => {
              setCurrentScreen('marketplace');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* Screen 2: Soil & Telemetry Diagnostics Form */}
        {currentScreen === 'diagnostics' && (
          <ScreenDiagnostics
            soil={soil}
            onSoilChange={setSoil}
            weather={weather}
            onWeatherChange={setWeather}
            selectedField={selectedField}
            onSubmit={handleExecuteIntelligence}
            isLoading={isLoading}
          />
        )}

        {/* Screen 3: 📸 Crop Scan / Disease Finder (పంట తెగులు పరీక్ష) */}
        {currentScreen === 'cropscan' && (
          <ScreenCropScan />
        )}

        {/* Screen 4: AI Crop Recommendation & Precision Envelopes */}
        {currentScreen === 'results' && predictionResult && (
          <ScreenResults
            result={predictionResult}
            selectedField={selectedField}
            onBackToDiagnostics={() => {
              setCurrentScreen('diagnostics');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSaveToHistory={handleSaveToHistory}
            isSaved={isSavedInHistory}
            onNavigateToMarketplace={() => {
              setCurrentScreen('marketplace');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* Screen 5: B2B Crop Direct Marketplace & Mandi Rate Matrix */}
        {currentScreen === 'marketplace' && (
          <ScreenMarketplace
            predictionResult={predictionResult}
            selectedField={selectedField}
            fields={fields}
            onNavigateToCustomers={() => {
              setCurrentScreen('customers');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* Screen 6: Customer & Contract Portal */}
        {currentScreen === 'customers' && (
          <ScreenCustomers />
        )}

      </main>

      {/* Level 1 DFD Architecture Modal */}
      <DFDModal
        isOpen={isDfdOpen}
        onClose={() => setIsDfdOpen(false)}
      />

    </div>
  );
}

export function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App;
