// ==============================================================================
// BioPlant.AI - Real-Time Regional APMC Mandi Price Analytics Matrix
// Benchmarks against Government MSP (కనీస మద్దతు ధర) & Local Middlemen Rates
// ==============================================================================

export interface MandiRateRecord {
  id: string;
  cropNameEn: string;
  cropNameTe: string;
  cropNameHi: string;
  govtMspPerQuintal: number;  // ₹ / Quintal
  govtMspPerMT: number;       // ₹ / Metric Ton (1 MT = 10 Quintals)
  highestMandiBidPerMT: number; // ₹ / Metric Ton
  mandiLocation: string;
  distanceKm: number;
  middlemenRatePerMT: number; // Local broker price
  netAdvantagePerMT: number;  // Profit delta after deducting ~₹450/MT freight
  trend: '+9.4%' | '+8.1%' | '+6.5%' | '+11.2%' | '+5.8%';
  marketArrivalsTodayMT: number;
}

export const REGIONAL_MANDI_RATES: MandiRateRecord[] = [
  {
    id: 'mandi-rice',
    cropNameEn: 'Rice (Paddy - Grade A)',
    cropNameTe: 'వరి (Grade A)',
    cropNameHi: 'धान (ग्रेड ए)',
    govtMspPerQuintal: 2320,
    govtMspPerMT: 23200,
    highestMandiBidPerMT: 26040,
    mandiLocation: 'Guntur APMC Mandi, AP',
    distanceKm: 42,
    middlemenRatePerMT: 23740,
    netAdvantagePerMT: 1850,
    trend: '+9.4%',
    marketArrivalsTodayMT: 3450
  },
  {
    id: 'mandi-wheat',
    cropNameEn: 'Wheat (Sharbati Prime)',
    cropNameTe: 'గోధుమలు (ప్రీమియం)',
    cropNameHi: 'गेहूं (शरबती प्रीमियम)',
    govtMspPerQuintal: 2275,
    govtMspPerMT: 22750,
    highestMandiBidPerMT: 24780,
    mandiLocation: 'Nizamabad Mandi, TS',
    distanceKm: 68,
    middlemenRatePerMT: 23150,
    netAdvantagePerMT: 1210,
    trend: '+6.5%',
    marketArrivalsTodayMT: 1980
  },
  {
    id: 'mandi-cotton',
    cropNameEn: 'Cotton (Medium Staple)',
    cropNameTe: 'పత్తి (మధ్యస్థ రకం)',
    cropNameHi: 'कपास (मध्यम रेशा)',
    govtMspPerQuintal: 7121,
    govtMspPerMT: 71210,
    highestMandiBidPerMT: 76500,
    mandiLocation: 'Warangal Enamamula Mandi, TS',
    distanceKm: 55,
    middlemenRatePerMT: 72800,
    netAdvantagePerMT: 3180,
    trend: '+8.1%',
    marketArrivalsTodayMT: 1420
  },
  {
    id: 'mandi-maize',
    cropNameEn: 'Maize (Yellow Dent)',
    cropNameTe: 'మొక్కజొన్న (హైబ్రిడ్)',
    cropNameHi: 'मक्का (हाइब्रिड)',
    govtMspPerQuintal: 2090,
    govtMspPerMT: 20900,
    highestMandiBidPerMT: 22800,
    mandiLocation: 'Khammam Mandi, TS',
    distanceKm: 38,
    middlemenRatePerMT: 21300,
    netAdvantagePerMT: 1150,
    trend: '+5.8%',
    marketArrivalsTodayMT: 2600
  },
  {
    id: 'mandi-groundnut',
    cropNameEn: 'Groundnuts (Pod Pods)',
    cropNameTe: 'వేరుశనగ (కాయలు)',
    cropNameHi: 'मूंगफली (पॉड)',
    govtMspPerQuintal: 6377,
    govtMspPerMT: 63770,
    highestMandiBidPerMT: 71900,
    mandiLocation: 'Kurnool APMC Market, AP',
    distanceKm: 82,
    middlemenRatePerMT: 67200,
    netAdvantagePerMT: 3950,
    trend: '+11.2%',
    marketArrivalsTodayMT: 890
  }
];

export const MANDI_AI_ADVICE = {
  headlineEn: '💡 AI Advice: Optimal Mandi Cargo Routing',
  headlineTe: '💡 ఏఐ సలహా: లాభదాయక మండి రూటింగ్',
  headlineHi: '💡 एआई सलाह: सर्वोत्तम मंडी मार्ग',
  bodyEn: 'Route your crop cargo to Guntur Mandi today. Prices are 9.4% higher than local middle-men brokers, yielding an extra ₹1,850 net profit per metric ton even after accounting for local logistics transport overhead costs.',
  bodyTe: 'ఈరోజు మీ పంట సరుకును గుంటూరు మండికి తరలించండి. స్థానిక దళారుల కంటే 9.4% అధిక ధర లభిస్తుంది. స్థానిక రవాణా ఖర్చులు పోను ప్రతి మెట్రిక్ టన్నుకు అదనంగా ₹1,850 నికర లాభం వస్తుంది.',
  bodyHi: 'अपनी फसल को आज गुंटूर मंडी भेजें। स्थानीय दलालों की तुलना में 9.4% अधिक कीमत मिल रही है, जिससे परिवहन लागत के बाद भी ₹1,850 प्रति मीट्रिक टन का अतिरिक्त शुद्ध लाभ होगा।'
};
