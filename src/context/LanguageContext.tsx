// ==============================================================================
// BioPlant.AI - Global Multi-Language System (English, Telugu తెలుగు, Hindi हिन्दी)
// Provides instant reactive language switching across all screens and components
// ==============================================================================

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'te' | 'hi';

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Universal Visual Anchors
    'anchor.diagnostics': '[🌾] Crop Diagnostics',
    'anchor.camera': '[📸] AI Health Camera',
    'anchor.market': '[💰] Market Prices',
    'anchor.alerts': '[⚠️] Local Alerts',
    'anchor.language': '[🌐] Language Selector',
    'anchor.forecast': '[☀️] Atmosphere Forecast',

    // Navigation & Tabs
    'nav.overview': 'Overview',
    'nav.diagnostics': 'Diagnostics',
    'nav.insights': 'AI Insights',
    'nav.marketplace': 'Marketplace',
    'nav.customers': 'Customers',
    'nav.cropscan': 'Crop Scan',

    // Dashboard
    'dash.telemetry_live': 'Telemetry Live • 2m ago',
    'dash.validated_node': 'Validated Node #08',
    'dash.title': 'BioPlant Agronomy Center',
    'dash.role': 'Chief Agronomist — Andhra & Telangana Zone',
    'dash.active_field': 'Active Field Parcel',
    'dash.switch_parcel': 'Switch Parcel',
    'dash.soil_health': 'Overall Soil Health Index',
    'dash.run_diagnostics': '[🌾] Run BioPlant Soil Intelligence',
    'dash.weather_title': '[☀️] 7-Day Precision Agronomic Forecast',
    'dash.crop_scan_title': '[📸] Crop Scan / Disease Finder (పంట తెగులు పరీక్ష)',
    'dash.crop_scan_desc': 'Scan crop leaves using device camera for instant pathology detection and remedies.',
    'dash.scan_now': 'Open Camera Scanner',
    'dash.history_title': 'Historical Agronomic Logbook',
    'dash.alerts_title': '[⚠️] Local Field Alerts & Advisories',
    'dash.recent_deals': '[💰] Recent Mandi Escrow Deals',

    // Diagnostics Form (Screen 2)
    'diag.title': '[🌾] Soil & Climate Diagnostics Lab',
    'diag.desc': 'Enter laboratory or IoT probe metrics. The Random Forest bio-classifier will compute multi-factor agronomic suitability across 22 target cultivars.',
    'diag.nitrogen': '[🌾] Nitrogen (నత్రజని - N)',
    'diag.phosphorus': '[🌾] Phosphorus (భాస్వరం - P)',
    'diag.potassium': '[🌾] Potassium (పొటాషియం - K)',
    'diag.ph': '[🌾] Soil pH Value (నేల pH విలువ)',
    'diag.temperature': '[☀️] Canopy Temperature (°C)',
    'diag.humidity': '[☀️] Relative Humidity (%)',
    'diag.rainfall': '[☀️] Seasonal Rainfall (mm)',
    'diag.run_button': 'Execute BioPlant Random Forest (45 Trees)',
    'diag.running': 'Running Random Forest Model...',
    'diag.ready': 'Calculations Complete! Loading...',
    'diag.presets': 'Diagnostic Presets',

    // Results (Screen 3)
    'res.title': 'Optimal Agronomic Recommendation',
    'res.inference_complete': 'Inference Complete',
    'res.confidence': 'Affinity Confidence',
    'res.yield': 'Expected Yield',
    'res.cycle': 'Growth Cycle',
    'res.water': 'Water Requirement',
    'res.season': 'Sowing Season',
    'res.save_history': 'Save to History Log',
    'res.saved': 'Saved in History Database',
    'res.go_marketplace': '[💰] View Live Mandi Buyers & Prices',

    // Marketplace (Screen 4)
    'market.title': '[💰] B2B Crop Direct Marketplace & Mandi Rates',
    'market.desc': 'Bypass middle-men brokers. Real-time regional Mandi price discovery, Government MSP benchmarks, and direct escrow contracts.',
    'market.ai_advice_title': '💡 AI Advice / ఏఐ సలహా: Optimal Mandi Routing',
    'market.ai_advice_text': 'Route your crop cargo to Guntur Mandi today. Prices are 9.4% higher than local middle-men brokers, yielding an extra ₹1,850 net profit per metric ton even after accounting for local logistics transport overhead costs.',
    'market.mandi_matrix_title': 'Live Regional APMC Mandi Price Analytics Matrix',
    'market.col_crop': 'Crop Name',
    'market.col_msp': 'Govt MSP (కనీస మద్దతు ధర)',
    'market.col_mandi': 'Highest Mandi Bid',
    'market.col_distance': 'Transport Distance',
    'market.col_net': 'Net Profit Advantage',
    'market.b2b_buyers': 'Verified B2B Wholesale Off-takers',
    'market.sell_btn': 'Sell Cargo Directly',

    // Crop Scan (Screen 6 / Module)
    'scan.title': '[📸] Crop Scan / Disease Finder (పంట తెగులు పరీక్ష)',
    'scan.subtitle': 'Instant AI Computer Vision Leaf Pathology Diagnosis',
    'scan.start_camera': 'Start Live Device Camera',
    'scan.stop_camera': 'Stop Camera',
    'scan.capture': '📸 Capture Leaf Photo',
    'scan.upload_button': 'Upload Leaf Photo (Drag & Drop)',
    'scan.scanning': 'Scanning Leaf Cellular Matrix & Spectral Signature...',
    'scan.pathology': 'Detected Pathology',
    'scan.severity': 'Severity Index',
    'scan.chemical': 'Chemical Remedy',
    'scan.organic': 'Organic Treatment Alternative',
    'scan.precaution': 'Preventative Precautions',

    // Farmer-Specific Enhancements
    'dash.farmer_hub_title': "Today's Farm Action Hub",
    'dash.farmer_hub_subtitle': 'Live field conditions & actionable advice for your parcel',
    'dash.spraying_title': 'Safe Spraying Window',
    'dash.spraying_desc': 'Wind speed 8 km/h. Safe to spray insecticides & foliar nutrients until 11:30 AM.',
    'dash.irrigation_title': 'Soil Moisture & Irrigation',
    'dash.irrigation_desc': 'Root zone moisture at 38%. Delay irrigation by 48 hours to conserve groundwater.',
    'dash.disease_risk_title': 'Fungal Blast Risk',
    'dash.disease_risk_desc': 'Night humidity 84%. Keep field bunds clear and monitor lower leaves for spots.',
    'dash.quick_actions_title': 'Essential Farmer Tools',
    'dash.action_crop_scan': '📸 Scan Sick Leaf',
    'dash.action_crop_scan_sub': 'Identify pests & fungus',
    'dash.action_find_crop': '🌾 Find Best Crop',
    'dash.action_find_crop_sub': 'Soil test recommendation',
    'dash.action_weather': '🌦️ 7-Day Weather',
    'dash.action_weather_sub': 'Rain & wind forecast',
    'dash.action_mandi': '💰 Mandi Rates',
    'dash.action_mandi_sub': 'Govt MSP vs Mandi prices',
    'dash.helpline_title': 'Kisan Call Centre (Toll Free)',
    'dash.helpline_btn': 'Call 1800-180-1551',
    'dash.helpline_sub': 'Government agricultural officers available 6 AM - 10 PM daily',

    'res.fertilizer_bags_title': 'Recommended Fertilizer Dosage (Bags Per Acre)',
    'res.fertilizer_bags_subtitle': 'Calculated based on your field NPK assay',
    'res.urea_label': 'Urea (46% Nitrogen)',
    'res.dap_label': 'DAP / SSP (Phosphorus)',
    'res.mop_label': 'MOP (Potash)',
    'res.spray_schedule': 'Crop Growth Stage & Water Management',
    'res.water_depth_label': 'Standing Water Depth',
    'res.critical_stage': 'Critical Irrigation Stage',
    'res.organic_tip_title': 'Organic Soil Vitality Recommendation',
    'res.organic_tip_desc': 'Incorporate 2 to 3 tons of well-decomposed Farm Yard Manure (FYM) or vermicompost per acre before the final ploughing to boost beneficial microbes and retain root-zone moisture.'
  },

  te: {
    // Universal Visual Anchors
    'anchor.diagnostics': '[🌾] పంట పరీక్ష (Crop Diagnostics)',
    'anchor.camera': '[📸] ఏఐ కెమెరా (AI Health Camera)',
    'anchor.market': '[💰] మార్కెట్ ధరలు (Market Prices)',
    'anchor.alerts': '[⚠️] స్థానిక హెచ్చరికలు (Local Alerts)',
    'anchor.language': '[🌐] భాష ఎంపిక (Language Selector)',
    'anchor.forecast': '[☀️] వాతావరణం (Atmosphere Forecast)',

    // Navigation & Tabs
    'nav.overview': 'సమీక్ష (Overview)',
    'nav.diagnostics': 'నేల పరీక్ష',
    'nav.insights': 'ఏఐ సలహాలు',
    'nav.marketplace': 'మార్కెట్',
    'nav.customers': 'కొనుగోలుదారులు',
    'nav.cropscan': 'తెగులు స్కానర్',

    // Dashboard
    'dash.telemetry_live': 'లైవ్ సెన్సార్ సమాచారం • 2 నిమిషాల క్రితం',
    'dash.validated_node': 'ధృవీకరించబడిన ఫీల్డ్ #08',
    'dash.title': 'బయోప్లాంట్ వ్యవసాయ కేంద్రం',
    'dash.role': 'ప్రధాన వ్యవసాయ నిపుణులు — ఆంధ్ర & తెలంగాణ ప్రాంతం',
    'dash.active_field': 'ప్రస్తుత సాగు పొలం',
    'dash.switch_parcel': 'పొలం మార్చుకోండి',
    'dash.soil_health': 'మొత్తం నేల ఆరోగ్య సూచిక',
    'dash.run_diagnostics': '[🌾] బయోప్లాంట్ నేల పరీక్ష ప్రారంభించండి',
    'dash.weather_title': '[☀️] 7-రోజుల కచ్చితమైన వ్యవసాయ వాతావరణ అంచనా',
    'dash.crop_scan_title': '[📸] పంట తెగులు పరీక్ష (Crop Scan / Disease Finder)',
    'dash.crop_scan_desc': 'పంట ఆకుల ఫోటో తీసి వెంటనే తెగుళ్లను గుర్తించండి మరియు సరైన నివారణ మందులను పొందండి.',
    'dash.scan_now': 'కెమెరా పరీక్ష ప్రారంభించండి',
    'dash.history_title': 'గత వ్యవసాయ సిఫార్సుల లాగ్‌బుక్',
    'dash.alerts_title': '[⚠️] స్థానిక పొలం హెచ్చరికలు & సూచనలు',
    'dash.recent_deals': '[💰] తాజా మండి ఎస్క్రో ఒప్పందాలు',

    // Diagnostics Form (Screen 2)
    'diag.title': '[🌾] నేల & వాతావరణ పరీక్ష కేంద్రం',
    'diag.desc': 'మీ పొలం మట్టి మరియు వాతావరణ వివరాలను నమోదు చేయండి. బయోప్లాంట్ రాండమ్ ఫారెస్ట్ మోడల్ 22 పంటలలో అత్యధిక దిగుబడి ఇచ్చే పంటను సిఫార్సు చేస్తుంది.',
    'diag.nitrogen': '[🌾] నత్రజని (Nitrogen - N)',
    'diag.phosphorus': '[🌾] భాస్వరం (Phosphorus - P)',
    'diag.potassium': '[🌾] పొటాషియం (Potassium - K)',
    'diag.ph': '[🌾] నేల pH విలువ (Soil pH)',
    'diag.temperature': '[☀️] ఉష్ణోగ్రత (°C)',
    'diag.humidity': '[☀️] గాలిలో తేమ (%)',
    'diag.rainfall': '[☀️] వర్షపాతం (మి.మీ)',
    'diag.run_button': 'బయోప్లాంట్ ఏఐ విశ్లేషణను ప్రారంభించండి',
    'diag.running': 'మోడల్ లెక్కలు వేస్తోంది...',
    'diag.ready': 'విశ్లేషణ పూర్తయింది! లోడ్ అవుతోంది...',
    'diag.presets': 'పరీక్ష ముందస్తు నమూనాలు',

    // Results (Screen 3)
    'res.title': 'అత్యుత్తమ పంట సిఫార్సు',
    'res.inference_complete': 'విశ్లేషణ పూర్తయింది',
    'res.confidence': 'అనుకూలత శాతం',
    'res.yield': 'ఆశించిన దిగుబడి',
    'res.cycle': 'పంట కాలం',
    'res.water': 'నీటి అవసరం',
    'res.season': 'విత్తే కాలం',
    'res.save_history': 'హిస్టరీలో భద్రపరచండి',
    'res.saved': 'విజయవంతంగా భద్రపరచబడింది',
    'res.go_marketplace': '[💰] లైవ్ మండి కొనుగోలుదారులు & ధరలు చూడండి',

    // Marketplace (Screen 4)
    'market.title': '[💰] ప్రత్యక్ష పంట విక్రయ మార్కెట్ & మండి ధరలు',
    'market.desc': 'దళారులను దాటవేయండి. నిజ-సమయ మండి ధరలు, ప్రభుత్వ మద్దతు ధరలు (MSP), మరియు సురక్షిత డిజిటల్ ఎస్క్రో ఒప్పందాలు.',
    'market.ai_advice_title': '💡 AI Advice / ఏఐ సలహా: లాభదాయక మండి రూటింగ్',
    'market.ai_advice_text': 'ఈరోజు మీ పంటను గుంటూరు మండికి తరలించండి. స్థానిక దళారుల కంటే 9.4% అధిక ధర లభిస్తుంది. రవాణా ఖర్చులు పోను ప్రతి మెట్రిక్ టన్నుకు అదనంగా ₹1,850 నికర లాభం వస్తుంది.',
    'market.mandi_matrix_title': 'స్థానిక వ్యవసాయ మార్కెట్ (APMC మండి) ప్రత్యక్ష ధరల పట్టిక',
    'market.col_crop': 'పంట పేరు',
    'market.col_msp': 'ప్రభుత్వ MSP (కనీస మద్దతు ధర)',
    'market.col_mandi': 'అత్యధిక మండి ధర',
    'market.col_distance': 'రవాణా దూరం',
    'market.col_net': 'అదనపు నికర లాభం',
    'market.b2b_buyers': 'ధృవీకరించబడిన టోకు కొనుగోలుదారులు',
    'market.sell_btn': 'నేరుగా విక్రయించండి (ఎస్క్రో రక్షణ)',

    // Crop Scan (Screen 6 / Module)
    'scan.title': '[📸] పంట తెగులు పరీక్ష (Crop Scan / Disease Finder)',
    'scan.subtitle': 'కంప్యూటర్ విజన్ ద్వారా ఆకుల తెగులు తక్షణ నిర్ధారణ',
    'scan.start_camera': 'కెమెరా ఆన్ చేయండి',
    'scan.stop_camera': 'కెమెరా ఆఫ్ చేయండి',
    'scan.capture': '📸 ఆకు ఫోటో తీయండి',
    'scan.upload_button': 'ఆకు ఫోటో అప్‌లోడ్ చేయండి',
    'scan.scanning': 'ఆకు కణాలను మరియు తెగులు లక్షణాలను స్కాన్ చేస్తోంది...',
    'scan.pathology': 'గుర్తించిన తెగులు',
    'scan.severity': 'తీవ్రత స్థాయి',
    'scan.chemical': 'రసాయన మందు నివారణ',
    'scan.organic': 'సేంద్రీయ ప్రత్యామ్నాయ నివారణ',
    'scan.precaution': 'తీసుకోవాల్సిన ముందస్తు జాగ్రత్తలు'
  },

  hi: {
    // Universal Visual Anchors
    'anchor.diagnostics': '[🌾] फसल निदान (Crop Diagnostics)',
    'anchor.camera': '[📸] एआई कैमरा (AI Health Camera)',
    'anchor.market': '[💰] मंडी भाव (Market Prices)',
    'anchor.alerts': '[⚠️] स्थानीय अलर्ट (Local Alerts)',
    'anchor.language': '[🌐] भाषा चयन (Language Selector)',
    'anchor.forecast': '[☀️] मौसम पूर्वानुमान (Atmosphere Forecast)',

    // Navigation & Tabs
    'nav.overview': 'अवलोकन (Overview)',
    'nav.diagnostics': 'मृदा परीक्षण',
    'nav.insights': 'एआई सिफारिशें',
    'nav.marketplace': 'मंडी बाजार',
    'nav.customers': 'खरीदार',
    'nav.cropscan': 'रोग स्कैनर',

    // Dashboard
    'dash.telemetry_live': 'लाइव टेलीमेट्री • 2 मिनट पहले',
    'dash.validated_node': 'सत्यापित फील्ड #08',
    'dash.title': 'बायोप्लांट कृषि अनुसंधान केंद्र',
    'dash.role': 'मुख्य कृषि वैज्ञानिक — क्षेत्रीय प्रभाग',
    'dash.active_field': 'सक्रिय खेत पार्सल',
    'dash.switch_parcel': 'खेत बदलें',
    'dash.soil_health': 'मृदा स्वास्थ्य सूचकांक',
    'dash.run_diagnostics': '[🌾] बायोप्लांट मृदा परीक्षण शुरू करें',
    'dash.weather_title': '[☀️] 7-दिवसीय सटीक कृषि मौसम पूर्वानुमान',
    'dash.crop_scan_title': '[📸] फसल रोग स्कैनर (Crop Scan / Disease Finder)',
    'dash.crop_scan_desc': 'कैमरे से पत्ती की तस्वीर खींचें और तुरंत रोग की पहचान व उपचार पाएं।',
    'dash.scan_now': 'कैमरा स्कैनर खोलें',
    'dash.history_title': 'ऐतिहासिक कृषि लॉगबुक',
    'dash.alerts_title': '[⚠️] स्थानीय कृषि चेतावनियाँ एवं सलाह',
    'dash.recent_deals': '[💰] हाल के मंडी एस्क्रो सौदे',

    // Diagnostics Form (Screen 2)
    'diag.title': '[🌾] मृदा एवं जलवायु परीक्षण प्रयोगशाला',
    'diag.desc': 'मिट्टी और मौसम के पैरामीटर दर्ज करें। बायोप्लांट रैंडम फॉरेस्ट मॉडल 22 फसलों में से सबसे उपयुक्त फसल की सिफारिश करेगा।',
    'diag.nitrogen': '[🌾] नाइट्रोजन (नाइट्रोजन - N)',
    'diag.phosphorus': '[🌾] फास्फोरस (फास्फोरस - P)',
    'diag.potassium': '[🌾] पोटैशियम (पोटैशियम - K)',
    'diag.ph': '[🌾] मिट्टी का pH मान (Soil pH)',
    'diag.temperature': '[☀️] तापमान (°C)',
    'diag.humidity': '[☀️] सापेक्ष आर्द्रता (%)',
    'diag.rainfall': '[☀️] मौसमी वर्षा (मिमी)',
    'diag.run_button': 'बायोप्लांट एआई मॉडल चलाएं',
    'diag.running': 'मॉडल गणना कर रहा है...',
    'diag.ready': 'गणना पूरी हुई! लोड हो रहा है...',
    'diag.presets': 'परीक्षण पूर्व-निर्धारित नमूने',

    // Results (Screen 3)
    'res.title': 'सर्वोत्तम फसल सिफारिश',
    'res.inference_complete': 'विश्लेषण पूर्ण',
    'res.confidence': 'अनुकूलता विश्वास',
    'res.yield': 'अपेक्षित पैदावार',
    'res.cycle': 'फसल चक्र',
    'res.water': 'जल आवश्यकता',
    'res.season': 'बुवाई का मौसम',
    'res.save_history': 'इतिहास में सहेजें',
    'res.saved': 'सफलतापूर्वक सहेजा गया',
    'res.go_marketplace': '[💰] लाइव मंडी खरीदार और कीमतें देखें',

    // Marketplace (Screen 4)
    'market.title': '[💰] बी2बी फसल सीधा बाजार एवं मंडी भाव',
    'market.desc': 'बिचौलियों से बचें। वास्तविक समय के मंडी भाव, सरकारी एमएसपी (न्यूनतम समर्थन मूल्य) और सुरक्षित एस्क्रो अनुबंध।',
    'market.ai_advice_title': '💡 AI Advice / एआई सलाह: सर्वोत्तम मंडी रूटिंग',
    'market.ai_advice_text': 'अपनी फसल को आज गुंटूर मंडी भेजें। स्थानीय दलालों की तुलना में 9.4% अधिक कीमत मिल रही है, जिससे परिवहन लागत के बाद भी ₹1,850 प्रति मीट्रिक टन का अतिरिक्त शुद्ध लाभ होगा।',
    'market.mandi_matrix_title': 'क्षेत्रीय एपीएमसी मंडी लाइव मूल्य विश्लेषण तालिका',
    'market.col_crop': 'फसल का नाम',
    'market.col_msp': 'सरकारी MSP (न्यूनतम समर्थन मूल्य)',
    'market.col_mandi': 'सर्वोच्च मंडी बोली',
    'market.col_distance': 'परिवहन दूरी',
    'market.col_net': 'अतिरिक्त शुद्ध लाभ',
    'market.b2b_buyers': 'सत्यापित थोक खरीदार',
    'market.sell_btn': 'सीधे बेचें (एस्क्रो सुरक्षा)',

    // Crop Scan (Screen 6 / Module)
    'scan.title': '[📸] फसल रोग स्कैनर (Crop Scan / Disease Finder)',
    'scan.subtitle': 'कंप्यूटर विज़न द्वारा पत्ती रोग का त्वरित निदान',
    'scan.start_camera': 'कैमरा चालू करें',
    'scan.stop_camera': 'कैमरा बंद करें',
    'scan.capture': '📸 पत्ती की तस्वीर लें',
    'scan.upload_button': 'पत्ती की तस्वीर अपलोड करें',
    'scan.scanning': 'पत्ती की कोशिकीय संरचना और स्पेक्ट्रल हस्ताक्षर को स्कैन किया जा रहा है...',
    'scan.pathology': 'पहचाना गया रोग',
    'scan.severity': 'संक्रमण की गंभीरता',
    'scan.chemical': 'रासायनिक उपचार',
    'scan.organic': 'जैविक उपचार विकल्प',
    'scan.precaution': 'बचाव संबंधी सावधानियां'
  }
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key
});

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('bioplant_preferred_lang');
    return (saved === 'te' || saved === 'hi' || saved === 'en') ? saved : 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('bioplant_preferred_lang', lang);
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
