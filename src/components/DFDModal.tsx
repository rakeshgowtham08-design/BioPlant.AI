import React from 'react';
import { X, ArrowRight, Database, Cpu, CloudRain, UserCheck, Layers, CheckCircle2 } from 'lucide-react';

interface DFDModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DFDModal: React.FC<DFDModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-forest-800 text-white">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 bg-forest-700 rounded-lg">
              <Cpu className="w-5 h-5 text-mint-300" />
            </div>
            <div>
              <h3 className="font-bold text-lg">BioPlant.AI — Level 1 Data Flow Diagram (DFD)</h3>
              <p className="text-xs text-mint-100/80">Architecture Flow: Sensor & User Inputs ➔ Random Forest Ensemble ➔ Agronomic Benchmarks</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-forest-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          <div className="bg-mint-50/60 border border-mint-200 rounded-xl p-4 text-xs text-forest-900 leading-relaxed">
            <strong>System Process Overview:</strong> BioPlant.AI implements a certified Level 1 DFD pipeline where soil telemetry (N, P, K, pH) is joined with localized microclimate vectors (Temperature, Humidity, Precipitation) into a 7-dimensional feature array, evaluated across a 45-tree Random Forest classifier, and cross-referenced with FAO agronomic thresholds.
          </div>

          {/* DFD Visual Diagram */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            
            {/* Step 1: User & Sensor Entity */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Entity 1.0</span>
                <div className="flex items-center space-x-2 text-forest-800 font-bold text-sm mb-2">
                  <UserCheck className="w-4 h-4 text-forest-700" />
                  <span>User / Soil Biosensors</span>
                </div>
                <p className="text-xs text-slate-600 mb-2">Inputs soil chemical parameters:</p>
                <div className="space-y-1 font-mono text-[11px] text-slate-700 bg-white p-2 rounded border border-slate-200">
                  <div>• N (0-150 mg/kg)</div>
                  <div>• P (0-150 mg/kg)</div>
                  <div>• K (0-150 mg/kg)</div>
                  <div>• Soil pH (0-14.0)</div>
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-200 text-[11px] text-forest-700 font-semibold flex items-center justify-between">
                <span>Data Flow 1</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Step 2: Weather Simulation Service */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Service 2.0</span>
                <div className="flex items-center space-x-2 text-teal-800 font-bold text-sm mb-2">
                  <CloudRain className="w-4 h-4 text-teal-600" />
                  <span>Weather Simulation</span>
                </div>
                <p className="text-xs text-slate-600 mb-2">Environmental climate stream:</p>
                <div className="space-y-1 font-mono text-[11px] text-slate-700 bg-white p-2 rounded border border-slate-200">
                  <div>• Temperature (°C)</div>
                  <div>• Rel. Humidity (%)</div>
                  <div>• Rainfall (mm)</div>
                  <div>• Real-time Jitter Sync</div>
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-200 text-[11px] text-teal-700 font-semibold flex items-center justify-between">
                <span>Data Flow 2</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Step 3: Random Forest Machine Learning */}
            <div className="bg-forest-50 border border-forest-200 rounded-xl p-4 flex flex-col justify-between ring-2 ring-forest-500/20">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-forest-700 block mb-1">Process 3.0</span>
                <div className="flex items-center space-x-2 text-forest-900 font-bold text-sm mb-2">
                  <Cpu className="w-4 h-4 text-forest-700" />
                  <span>Random Forest Engine</span>
                </div>
                <p className="text-xs text-forest-800 mb-2">Multi-Tree Ensemble Voting:</p>
                <div className="space-y-1 text-[11px] text-forest-900 bg-white/90 p-2 rounded border border-forest-200">
                  <div>• 45 Decision Trees</div>
                  <div>• Gini Impurity Splits</div>
                  <div>• Bagging Aggregation</div>
                  <div>• Confidence % Calc</div>
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-forest-200 text-[11px] text-forest-800 font-semibold flex items-center justify-between">
                <span>Data Flow 3</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Step 4: Decision & Agronomic Benchmarking */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Data Store 4.0</span>
                <div className="flex items-center space-x-2 text-indigo-800 font-bold text-sm mb-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                  <span>Optimal Recommendation</span>
                </div>
                <p className="text-xs text-slate-600 mb-2">Output & Comparison Engine:</p>
                <div className="space-y-1 text-[11px] text-slate-700 bg-white p-2 rounded border border-slate-200">
                  <div>• Winning Crop Badge</div>
                  <div>• Confidence % (e.g. 96%)</div>
                  <div>• Mini-Horizontal Gauges</div>
                  <div>• Field History Logging</div>
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-200 text-[11px] text-indigo-700 font-semibold flex items-center justify-between">
                <span>Output Delivery</span>
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            </div>

          </div>

          {/* DFD Legend & Dataset Spec */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs text-slate-600">
            <h4 className="font-bold text-slate-800 mb-1">Validated Agro-Ecological Dataset:</h4>
            <p className="leading-relaxed">
              Trained instantly on 5 foundational crop classes: <strong className="text-forest-800">Rice</strong> (high water, Kharif monsoon), <strong className="text-amber-700">Maize</strong> (high energy, balanced NPK), <strong className="text-sky-700">Cotton</strong> (warm sunny, high K), <strong className="text-yellow-700">Wheat</strong> (cool temperate, Rabi cycle), and <strong className="text-emerald-700">Groundnuts</strong> (nitrogen-fixing legume, sandy loam).
            </p>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-forest-800 hover:bg-forest-900 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            Close Architecture Flow
          </button>
        </div>

      </div>
    </div>
  );
};

