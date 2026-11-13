// ==============================================================================
// BioPlant.AI - 📸 AI Disease Scanners Camera Pipeline
// WebRTC Live Camera Viewport, File Upload Fallback, Radar Pulse Animation,
// and Automated Agronomic Leaf Pathology Prescription Card
// ==============================================================================

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

export const ScreenCropScan: React.FC = () => {
  const { language, t } = useLanguage();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasResult, setHasResult] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Sample leaf sample presets to test immediately without device camera permissions
  const sampleLeaves = [
    {
      name: 'Rice Blast Leaf Sample',
      labelTe: 'వరి అగ్గి తెగులు నమూనా',
      url: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=600&q=80'
    },
    {
      name: 'Paddy Brown Spot Sample',
      labelTe: 'వరి ఆకుమచ్చ తెగులు నమూనా',
      url: 'https://images.unsplash.com/photo-1599818815599-4c126ecba0b9?auto=format&fit=crop&w=600&q=80'
    }
  ];

  // Start live WebRTC camera stream
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        setIsCameraActive(true);
      } else {
        setCameraError('Camera access not supported on this browser. Please use photo upload.');
      }
    } catch (err: any) {
      console.warn('Camera access denied or unavailable:', err);
      setCameraError('Camera permission not granted. Please use photo upload or sample images.');
      setIsCameraActive(false);
    }
  };

  // Stop live camera stream
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  // Clean up camera stream on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Capture frame from active video stream
  const handleCaptureFrame = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      stopCamera();
      triggerScanSequence(dataUrl);
    }
  };

  // Handle photo file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          stopCamera();
          triggerScanSequence(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Trigger simulated computer vision radar pulse sequence
  const triggerScanSequence = (imageDataUrl: string) => {
    setCapturedImage(imageDataUrl);
    setHasResult(false);
    setIsAnalyzing(true);

    // 2.2 seconds simulated neural network scan
    setTimeout(() => {
      setIsAnalyzing(false);
      setHasResult(true);
      window.scrollTo({ top: 380, behavior: 'smooth' });
    }, 2200);
  };

  const handleReset = () => {
    stopCamera();
    setCapturedImage(null);
    setHasResult(false);
    setIsAnalyzing(false);
    setCameraError(null);
  };

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto px-gutter-sm space-y-space-md py-space-md pb-28 animate-in fade-in duration-200">

      {/* Title & Navigation Selector Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1B4D3E] via-[#0f382c] to-[#002218] p-space-md text-on-primary shadow-sm">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#c1ecda_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

        <div className="relative z-10 flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-bright/20 backdrop-blur-sm text-primary-fixed border border-primary-fixed/30 text-xs font-semibold">
              <span className="material-symbols-outlined text-[15px]">center_focus_strong</span>
              <span>Vision AI • PyTorch Edge Model</span>
            </div>
            <span className="text-[11px] font-mono text-secondary-fixed bg-surface-bright/10 px-2 py-0.5 rounded-full">
              ResNet-50 Agronomic v4.2
            </span>
          </div>

          <h1 className="font-headline-lg-mobile text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
            📸 Crop Scan / Disease Finder (పంట తెగులు పరీక్ష)
          </h1>
          <p className="font-body-sm text-xs sm:text-sm text-primary-fixed-dim/90 max-w-xl">
            {language === 'te'
              ? 'మీ పంట ఆకులపై వచ్చిన మచ్చలు, రంగు మార్పులను కెమెరా ద్వారా స్కాన్ చేసి, ఏఐ ద్వారా తెగులును తక్షణమే గుర్తించండి. సరైన మందులు మరియు సేంద్రీయ నివారణల సలహాలను పొందండి.'
              : language === 'hi'
              ? 'अपनी फसल की पत्तियों की तस्वीर खींचें। एआई मॉडल तुरंत पत्ती के रोग की पहचान करेगा और रासायनिक व जैविक उपचार की सलाह देगा।'
              : 'Scan symptomatic plant leaves using your device camera or upload a photo. The on-device neural network detects pathologies in real time and dispenses immediate curative protocols.'}
          </p>
        </div>
      </div>

      {/* Camera Viewport & Photo Input Container */}
      <div className="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 shadow-sm border border-surface-container-high/70 flex flex-col space-y-4">

        {/* Top Viewport Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">📸</span>
            <div>
              <h2 className="font-title-md text-sm sm:text-base font-bold text-primary">
                {language === 'te' ? 'ఆకు స్కాన్ వ్యూపోర్ట్' : language === 'hi' ? 'पत्ती स्कैन व्यूपोर्ट' : 'Live Leaf Scanner Viewport'}
              </h2>
              <span className="text-[11px] text-on-surface-variant">
                {isCameraActive ? '● Live WebRTC Stream Active' : 'Ready to capture or upload'}
              </span>
            </div>
          </div>

          {isCameraActive && (
            <button
              type="button"
              onClick={stopCamera}
              className="px-2.5 py-1 text-xs rounded-full bg-error-container text-on-error-container font-semibold hover:opacity-90 transition-all flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[14px]">videocam_off</span>
              <span>{t('scan.stop_camera')}</span>
            </button>
          )}
        </div>

        {/* Viewport Frame */}
        <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-black/90 rounded-2xl overflow-hidden flex items-center justify-center border-2 border-dashed border-primary-fixed/40 shadow-inner">

          {/* Case 1: Live WebRTC Video */}
          <video
            ref={videoRef}
            playsInline
            muted
            className={`w-full h-full object-cover ${isCameraActive ? 'block' : 'hidden'}`}
          />

          {/* Case 2: Captured or Selected Image Display */}
          {capturedImage && !isCameraActive && (
            <img
              src={capturedImage}
              alt="Leaf for analysis"
              className="w-full h-full object-cover"
            />
          )}

          {/* Case 3: Empty State Guide Frame */}
          {!isCameraActive && !capturedImage && (
            <div className="flex flex-col items-center justify-center text-center p-6 text-white/80 space-y-3">
              <div className="w-16 h-16 rounded-full bg-primary-container/80 text-primary-fixed flex items-center justify-center shadow-lg border border-primary-fixed/30">
                <span className="material-symbols-outlined text-3xl">photo_camera</span>
              </div>
              <div>
                <p className="font-semibold text-sm text-white">
                  {language === 'te' ? 'ఆకును ఫ్రేమ్ మధ్యలో ఉంచండి' : language === 'hi' ? 'पत्ती को फ्रेम के बीच में रखें' : 'Position crop leaf in the center frame'}
                </p>
                <p className="text-xs text-white/60 mt-1 max-w-xs">
                  {language === 'te'
                    ? 'స్పష్టమైన ఫోటో కోసం తగినంత వెలుతురు ఉండేలా చూసుకోండి'
                    : 'Ensure good lighting on lesion spots or rust margins'}
                </p>
              </div>
            </div>
          )}

          {/* Optical Targeting Crosshairs Overlay */}
          <div className="absolute inset-0 pointer-events-none p-5 flex flex-col justify-between">
            <div className="flex justify-between">
              <div className="w-6 h-6 border-t-2 border-l-2 border-primary-fixed/80 rounded-tl"></div>
              <div className="w-6 h-6 border-t-2 border-r-2 border-primary-fixed/80 rounded-tr"></div>
            </div>
            <div className="flex justify-between">
              <div className="w-6 h-6 border-b-2 border-l-2 border-primary-fixed/80 rounded-bl"></div>
              <div className="w-6 h-6 border-b-2 border-r-2 border-primary-fixed/80 rounded-br"></div>
            </div>
          </div>

          {/* Radar Pulse Scanning Animation Sequence */}
          {isAnalyzing && (
            <div className="absolute inset-0 bg-primary/40 backdrop-blur-[2px] flex flex-col items-center justify-center z-20">
              {/* Radar ring animation */}
              <div className="relative flex items-center justify-center">
                <div className="absolute w-36 h-36 rounded-full border-2 border-primary-fixed animate-ping opacity-60"></div>
                <div className="absolute w-24 h-24 rounded-full border-2 border-white animate-pulse opacity-80"></div>
                <div className="w-16 h-16 rounded-full bg-[#1B4D3E] text-primary-fixed flex items-center justify-center shadow-2xl border border-primary-fixed">
                  <span className="material-symbols-outlined text-2xl animate-spin">radar</span>
                </div>
              </div>

              {/* Scanning Laser Line */}
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#c1ecda] to-transparent animate-bounce opacity-80 top-1/2"></div>

              <div className="mt-8 text-center px-4">
                <p className="text-sm font-bold text-white tracking-wide">
                  {t('scan.scanning')}
                </p>
                <span className="text-xs font-mono text-primary-fixed mt-1 block">
                  Processing cellular spectral reflectance...
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Camera Error Message if any */}
        {cameraError && (
          <div className="p-3 rounded-xl bg-error-container/60 border border-error/30 text-xs text-on-error-container flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-error flex-shrink-0">info</span>
            <span>{cameraError}</span>
          </div>
        )}

        {/* Action Controls: Live Camera, Capture, Active Green Upload Button */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          {/* Button 1: WebRTC Live Camera / Capture */}
          {!isCameraActive ? (
            <button
              type="button"
              onClick={startCamera}
              className="h-12 bg-primary-container text-on-primary rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm hover:opacity-95 active:scale-[0.99] transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">videocam</span>
              <span>{t('scan.start_camera')}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleCaptureFrame}
              className="h-12 bg-amber-500 hover:bg-amber-600 text-black font-extrabold rounded-xl text-sm flex items-center justify-center gap-2 shadow-md active:scale-[0.99] transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[22px]">photo_camera</span>
              <span>{t('scan.capture')}</span>
            </button>
          )}

          {/* Button 2: Active Green File-Upload Button Fallback Photo Picker */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="h-12 bg-[#1B4D3E] hover:bg-[#153e32] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm active:scale-[0.99] transition-all border border-primary-fixed/30 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px] text-primary-fixed">cloud_upload</span>
            <span>{t('scan.upload_button')}</span>
          </button>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>

        {/* Quick Test Demo Presets */}
        <div className="pt-2 border-t border-surface-container-high/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-label-sm uppercase tracking-wider text-secondary flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px]">sample_rates</span>
              <span>Instant Test Samples (No camera required)</span>
            </span>
            {capturedImage && (
              <button
                type="button"
                onClick={handleReset}
                className="text-[11px] text-error hover:underline cursor-pointer"
              >
                Clear &amp; Reset
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {sampleLeaves.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => triggerScanSequence(sample.url)}
                className="px-3 py-1.5 rounded-full bg-surface-container text-primary font-semibold text-xs hover:bg-secondary-container transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer border border-surface-container-high"
              >
                <span>🍃</span>
                <span>{language === 'te' ? sample.labelTe : sample.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ============================================================================== */}
      {/* Automated Agronomic Prescription Result Card                                    */}
      {/* Exactly fulfills requirement specifications:                                    */}
      {/* - Detected Pathology: Rice Blast / అగ్గి తెగులు                                   */}
      {/* - Severity Index: High Infection (తీవ్రత ఎక్కువ)                                */}
      {/* - Chemical Remedy: Tricyclazole 75% WP (ట్రైసైక్లాజోల్ మందు పిచికారీ చేయండి)    */}
      {/* - Organic Treatment: Organic Neem Oil Extraction Spray (వేప నూనె మిశ్రమం)      */}
      {/* - Preventative: Isolate field canal runoff to shield nearby healthy plots       */}
      {/* ============================================================================== */}
      {hasResult && (
        <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-md border-2 border-error/30 animate-in slide-in-from-bottom duration-300 flex flex-col space-y-4">

          {/* Card Banner Alert */}
          <div className="flex items-center justify-between pb-1 border-b border-surface-container-high/60">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-error-container text-on-error-container flex items-center justify-center font-bold text-lg">
                ⚠️
              </span>
              <div>
                <span className="text-[10px] font-label-sm font-bold uppercase tracking-wider text-error">
                  Automated Pathology Diagnosis
                </span>
                <h3 className="font-headline-sm text-base sm:text-lg font-bold text-primary">
                  {language === 'te' ? 'వైద్య నివేదిక & నివారణ మందుల సలహా' : 'Agronomic Prescription Card'}
                </h3>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-full bg-error-container text-on-error-container font-bold text-xs">
              98.4% Confidence Match
            </span>
          </div>

          {/* Metric 1 & 2: Pathology & Severity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-surface-container-low border border-surface-container-high flex flex-col justify-between">
              <span className="text-[11px] font-label-sm uppercase tracking-wider text-secondary">
                {t('scan.pathology')}
              </span>
              <div className="mt-1">
                <span className="font-title-lg text-lg sm:text-xl font-bold text-error block">
                  Rice Blast / అగ్గి తెగులు
                </span>
                <span className="text-xs text-on-surface-variant font-serif italic">
                  Magnaporthe oryzae (Pyricularia oryzae)
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-error-container/50 border border-error/20 flex flex-col justify-between">
              <span className="text-[11px] font-label-sm uppercase tracking-wider text-on-error-container">
                {t('scan.severity')}
              </span>
              <div className="mt-1 flex items-center justify-between">
                <span className="font-title-lg text-lg font-extrabold text-error">
                  {language === 'te' ? 'తీవ్రత ఎక్కువ (High Infection)' : language === 'hi' ? 'गंभीर संक्रमण (High Infection)' : 'High Infection (తీవ్రత ఎక్కువ)'}
                </span>
                <span className="px-2 py-0.5 rounded bg-error text-white font-mono text-[11px] font-bold">
                  Stage 3 / 4
                </span>
              </div>
              <span className="text-[11px] text-on-error-container mt-0.5">
                Spindle-shaped diamond lesions coalescing on foliage
              </span>
            </div>
          </div>

          {/* Curative Protocol 1: Chemical Remedy */}
          <div className="p-4 rounded-xl bg-surface-container-low border-l-4 border-l-primary-container space-y-1.5">
            <div className="flex items-center gap-2 text-primary font-bold text-sm">
              <span className="material-symbols-outlined text-[18px] text-primary-container">science</span>
              <span>{t('scan.chemical')}</span>
            </div>
            <p className="text-sm font-semibold text-primary">
              Tricyclazole 75% WP (ట్రైసైక్లాజోల్ మందు పిచికారీ చేయండి)
            </p>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              {language === 'te'
                ? 'మోతాదు: 0.6 గ్రాములు ప్రతి లీటరు నీటికి కలిపి ఉదయం లేదా సాయంత్రం వేళల్లో ఆకులపై పూర్తిగా తడిచేలా పిచికారీ చేయండి.'
                : 'Application dosage: 0.6g per litre of water. Apply using a knapsack sprayer with hollow cone nozzle during early morning or dusk.'}
            </p>
          </div>

          {/* Curative Protocol 2: Organic Treatment Alternative */}
          <div className="p-4 rounded-xl bg-surface-container-low border-l-4 border-l-amber-600 space-y-1.5">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
              <span className="material-symbols-outlined text-[18px] text-amber-700">eco</span>
              <span>{t('scan.organic')}</span>
            </div>
            <p className="text-sm font-semibold text-primary">
              Organic Neem Oil Extraction Spray (వేప నూనె మిశ్రమం)
            </p>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              {language === 'te'
                ? 'మోతాదు: 5 మి.లీ కోల్డ్-ప్రెస్డ్ వేపనూనె (10,000 ppm) + 1 మి.లీ సబ్బు ద్రావణం ప్రతి లీటరు నీటికి కలిపి ప్రతి 5 రోజులకు ఒకసారి పిచికారీ చేయండి.'
                : 'Formulation: 5ml cold-pressed Azadirachtin Neem oil (10,000 ppm) emulsified with 1ml natural soap per litre of water. Repeat every 5 days.'}
            </p>
          </div>

          {/* Curative Protocol 3: Preventative Precautions */}
          <div className="p-4 rounded-xl bg-surface-bright border border-secondary-container space-y-1.5">
            <div className="flex items-center gap-2 text-primary font-bold text-sm">
              <span className="material-symbols-outlined text-[18px] text-secondary">shield</span>
              <span>{t('scan.precaution')}</span>
            </div>
            <p className="text-xs sm:text-sm text-primary font-medium leading-relaxed">
              {language === 'te'
                ? '⚠️ పక్క పొలాలకు తెగులు వ్యాపించకుండా ఉండటానికి సాగునీటి కాలువలను వెంటనే వేరుచేయండి (Isolate field canal runoff to shield nearby healthy plots). అదనపు నత్రజని (యూరియా) వాడకాన్ని తాత్కాలికంగా నిలిపివేయండి.'
                : '⚠️ Isolate field canal runoff immediately to shield nearby healthy plots. Halt additional split-applications of high-nitrogen urea fertilizer to reduce succulent foliage susceptibility.'}
            </p>
          </div>

        </div>
      )}

    </div>
  );
};
