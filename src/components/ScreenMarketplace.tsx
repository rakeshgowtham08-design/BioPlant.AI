// ==============================================================================
// BioPlant.AI - [💰] B2B Crop Direct Marketplace & Regional Mandi Rate Matrix
// Wholesale Buyer Network, Real-Time APMC Mandi Bidding & Direct Cargo Escrow
// All values in Indian Rupees (₹) with Government MSP & Routing Optimization
// ==============================================================================

import React, { useState, useEffect } from 'react';
import { MarketplaceBuyer, FieldProfile, PredictionResult, MarketplaceDeal } from '../types';
import { VERIFIED_BUYERS } from '../services/supabaseService';
import { EscrowTransferModal } from './EscrowTransferModal';
import { REGIONAL_MANDI_RATES, MANDI_AI_ADVICE } from '../data/mandiData';
import { formatINR } from '../utils/currency';
import { useLanguage } from '../context/LanguageContext';

interface ScreenMarketplaceProps {
  predictionResult: PredictionResult | null;
  selectedField: FieldProfile;
  fields: FieldProfile[];
  onNavigateToCustomers: () => void;
}

export const ScreenMarketplace: React.FC<ScreenMarketplaceProps> = ({
  predictionResult,
  selectedField,
  fields,
  onNavigateToCustomers
}) => {
  const { language, t } = useLanguage();
  const recommendedCropName = predictionResult?.primaryCrop?.name || 'Rice';
  const [selectedCropFilter, setSelectedCropFilter] = useState<string>(recommendedCropName);
  const [activeBuyerModal, setActiveBuyerModal] = useState<MarketplaceBuyer | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync default filter with prediction result when it changes
  useEffect(() => {
    if (predictionResult?.primaryCrop?.name) {
      setSelectedCropFilter(predictionResult.primaryCrop.name);
    }
  }, [predictionResult]);

  // Filter buyers based on active crop tab
  const filteredBuyers = selectedCropFilter === 'All'
    ? VERIFIED_BUYERS
    : VERIFIED_BUYERS.filter(b => b.cropType.toLowerCase() === selectedCropFilter.toLowerCase());

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleDealSuccess = (deal: MarketplaceDeal) => {
    showToast(`✓ Cargo Escrow Authorized: ${deal.quantity_sold} MT sold to ${deal.buyer_name} for ${formatINR(deal.total_amount)}`);
  };

  const cropTabs = ['Rice', 'Maize', 'Cotton', 'Wheat', 'Groundnuts', 'All'];

  // Average Bidding Price in INR
  const avgBiddingPriceINR = filteredBuyers.length
    ? Math.round(filteredBuyers.reduce((acc, b) => acc + b.biddingPrice, 0) / filteredBuyers.length)
    : 0;

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto px-gutter-sm space-y-space-md py-space-md pb-28 animate-in fade-in duration-200">

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-full bg-primary-container text-on-primary font-bold text-xs shadow-xl border border-primary-fixed flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-[16px]">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Marketplace Header Hero with Visual Anchor [💰] */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1B4D3E] via-[#0f382c] to-[#002218] p-space-md text-on-primary shadow-sm">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#c1ecda_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

        <div className="relative z-10 flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-bright/20 backdrop-blur-sm text-primary-fixed border border-primary-fixed/30 text-xs">
              <span className="material-symbols-outlined text-[14px]">storefront</span>
              <span className="font-label-sm font-semibold">[💰] APMC Mandi &amp; Wholesale Network</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onNavigateToCustomers}
                className="px-2 py-1 rounded-full bg-surface-bright/20 hover:bg-surface-bright/30 text-white text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-all"
                title="View Customer Contracts"
              >
                <span className="material-symbols-outlined text-[14px]">groups</span>
                <span>Contracts</span>
              </button>
              <div className="flex items-center gap-1.5 text-secondary-fixed text-[11px] font-mono">
                <span className="inline-block w-2 h-2 rounded-full bg-primary-fixed animate-ping"></span>
                <span>INR ₹</span>
              </div>
            </div>
          </div>

          <div>
            <h1 className="font-headline-lg-mobile text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
              {t('market.title')}
            </h1>
            <p className="font-body-sm text-xs sm:text-sm text-primary-fixed-dim/90 mt-1 max-w-lg leading-relaxed">
              {t('market.desc')}
            </p>
          </div>

          {/* AI Recommendation Match Indicator */}
          {predictionResult && (
            <div className="mt-1 p-2.5 rounded-xl bg-surface-bright/15 backdrop-blur-md border border-primary-fixed/30 flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-primary-fixed text-primary flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[16px]">psychology</span>
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-label-sm tracking-wider text-primary-fixed block truncate">
                    Active AI Agronomic Directive
                  </span>
                  <span className="font-title-md text-xs sm:text-sm font-bold text-white truncate block">
                    {predictionResult.primaryCrop.name} ({predictionResult.confidence}% Affinity Match)
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCropFilter(predictionResult.primaryCrop.name)}
                className="px-2.5 py-1 rounded-lg bg-primary-fixed text-primary font-label-sm text-xs font-bold hover:bg-white transition-colors cursor-pointer flex-shrink-0"
              >
                Filter {predictionResult.primaryCrop.name}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ============================================================================== */}
      {/* 1. PRIMARY AI SMART ADVICE PROFIT BANNER (Requirement 2)                      */}
      {/* "💡 AI Advice / ఏఐ సలహా: Route your crop cargo to Guntur Mandi today..."       */}
      {/* ============================================================================== */}
      <div className="rounded-2xl p-4 sm:p-5 bg-gradient-to-r from-amber-500/15 via-emerald-500/10 to-transparent border-2 border-amber-500/40 shadow-sm flex flex-col space-y-2">
        <div className="flex items-center gap-2">
          <span className="flex-shrink-0 text-xl">💡</span>
          <h2 className="font-title-md text-sm sm:text-base font-extrabold text-primary">
            {language === 'te' ? MANDI_AI_ADVICE.headlineTe : language === 'hi' ? MANDI_AI_ADVICE.headlineHi : MANDI_AI_ADVICE.headlineEn}
          </h2>
          <span className="ml-auto px-2 py-0.5 rounded-full bg-amber-500 text-black text-[10px] font-extrabold uppercase tracking-wider">
            +9.4% Premium
          </span>
        </div>
        <p className="font-body-sm text-xs sm:text-sm text-on-surface leading-relaxed pl-7">
          {language === 'te' ? MANDI_AI_ADVICE.bodyTe : language === 'hi' ? MANDI_AI_ADVICE.bodyHi : MANDI_AI_ADVICE.bodyEn}
        </p>
        <div className="flex items-center gap-2 pl-7 pt-1">
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-secondary">
            <span className="material-symbols-outlined text-[13px]">local_shipping</span>
            <span>Guntur APMC Mandi (42 km)</span>
          </span>
          <span className="text-[11px] text-on-surface-variant">•</span>
          <span className="text-[11px] font-bold text-primary font-mono">
            Net Surplus: +₹1,850 / MT
          </span>
        </div>
      </div>

      {/* ============================================================================== */}
      {/* 2. REGIONAL APMC MANDI PRICE ANALYTICS MATRIX TABLE (Requirement 2)          */}
      {/* Displays: Crop Name, Govt MSP (కనీస మద్దతు ధర), Highest Local Mandi Bid,      */}
      {/* Transport Distance, and Net Profit Advantage                                 */}
      {/* ============================================================================== */}
      <div className="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 shadow-sm border border-surface-container-high/70 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">📊</span>
            <div>
              <h2 className="font-title-md text-sm sm:text-base font-bold text-primary">
                {t('market.mandi_matrix_title')}
              </h2>
              <span className="text-[11px] text-on-surface-variant">
                Live Mandi Arrivals &amp; Government Minimum Support Price (MSP) Benchmarks
              </span>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-container text-secondary font-bold">
            All prices in INR (₹)
          </span>
        </div>

        {/* Scrollable Responsive Table */}
        <div className="overflow-x-auto -mx-1 sm:mx-0">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-surface-container-high bg-surface-container-low text-on-surface-variant font-label-sm uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3 rounded-l-lg">{t('market.col_crop')}</th>
                <th className="py-2.5 px-2">{t('market.col_msp')}</th>
                <th className="py-2.5 px-2">{t('market.col_mandi')}</th>
                <th className="py-2.5 px-2">{t('market.col_distance')}</th>
                <th className="py-2.5 px-3 rounded-r-lg text-right">{t('market.col_net')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-high/60">
              {REGIONAL_MANDI_RATES.map((rate) => {
                const isTargetCrop = rate.cropNameEn.toLowerCase().includes(selectedCropFilter.toLowerCase()) ||
                  selectedCropFilter === 'All';

                return (
                  <tr
                    key={rate.id}
                    className={`hover:bg-surface-container transition-colors ${
                      isTargetCrop ? 'bg-surface-bright/50' : 'opacity-70'
                    }`}
                  >
                    {/* Crop Name */}
                    <td className="py-3 px-3 font-semibold text-primary">
                      <div className="flex flex-col">
                        <span>{language === 'te' ? rate.cropNameTe : language === 'hi' ? rate.cropNameHi : rate.cropNameEn}</span>
                        <span className="text-[10px] text-on-surface-variant font-normal">
                          {rate.mandiLocation.split(',')[0]}
                        </span>
                      </div>
                    </td>

                    {/* Government MSP */}
                    <td className="py-3 px-2 font-mono">
                      <div className="flex flex-col">
                        <span className="font-bold text-on-surface">
                          ₹{rate.govtMspPerQuintal.toLocaleString('en-IN')}<span className="text-[9px] font-normal text-on-surface-variant">/q</span>
                        </span>
                        <span className="text-[10px] text-on-surface-variant">
                          ₹{rate.govtMspPerMT.toLocaleString('en-IN')}/MT
                        </span>
                      </div>
                    </td>

                    {/* Highest Mandi Bid */}
                    <td className="py-3 px-2 font-mono">
                      <div className="flex flex-col">
                        <span className="font-bold text-primary flex items-center gap-1">
                          ₹{rate.highestMandiBidPerMT.toLocaleString('en-IN')}
                          <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1 py-0.2 rounded">
                            {rate.trend}
                          </span>
                        </span>
                        <span className="text-[10px] text-secondary">
                          {rate.mandiLocation.split(',')[1] || rate.mandiLocation}
                        </span>
                      </div>
                    </td>

                    {/* Distance */}
                    <td className="py-3 px-2 font-mono text-on-surface-variant">
                      <span className="inline-flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-[12px] text-secondary">distance</span>
                        {rate.distanceKm} km
                      </span>
                    </td>

                    {/* Net Advantage */}
                    <td className="py-3 px-3 text-right font-mono">
                      <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold text-[11px]">
                        +₹{rate.netAdvantagePerMT.toLocaleString('en-IN')}/MT
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Crop Filter Segmented Control Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {cropTabs.map((crop) => {
          const isSelected = selectedCropFilter.toLowerCase() === crop.toLowerCase();
          const isAIRecommended = predictionResult?.primaryCrop?.name.toLowerCase() === crop.toLowerCase();

          return (
            <button
              key={crop}
              type="button"
              onClick={() => setSelectedCropFilter(crop)}
              className={`px-3 py-1.5 rounded-full text-label-sm font-label-sm flex items-center gap-1.5 flex-shrink-0 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-primary-container text-on-primary font-bold shadow-sm'
                  : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              <span>{crop}</span>
              {isAIRecommended && (
                <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold ${
                  isSelected ? 'bg-primary-fixed text-primary' : 'bg-primary-container text-on-primary'
                }`}>
                  AI Pick
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Market Statistics Strip (All in INR ₹) */}
      <div className="grid grid-cols-3 gap-2">
        <div className="p-3 rounded-xl bg-surface-container-lowest border border-surface-container-high/60 flex flex-col justify-between">
          <span className="text-[10px] font-label-sm text-secondary uppercase tracking-wider">
            Active Bids Listed
          </span>
          <span className="font-title-lg text-title-lg font-bold text-primary font-mono mt-1">
            {filteredBuyers.length} Off-takers
          </span>
          <span className="text-[10px] text-on-surface-variant">Instant Escrow</span>
        </div>

        <div className="p-3 rounded-xl bg-surface-container-lowest border border-surface-container-high/60 flex flex-col justify-between">
          <span className="text-[10px] font-label-sm text-secondary uppercase tracking-wider">
            Average Bidding Price
          </span>
          <span className="font-title-lg text-title-lg font-bold text-primary font-mono mt-1">
            {formatINR(avgBiddingPriceINR)} <span className="text-xs font-normal">/ MT</span>
          </span>
          <span className="text-[10px] text-primary font-semibold">+9.4% vs APMC</span>
        </div>

        <div className="p-3 rounded-xl bg-surface-container-lowest border border-surface-container-high/60 flex flex-col justify-between">
          <span className="text-[10px] font-label-sm text-secondary uppercase tracking-wider">
            Settlement Protection
          </span>
          <span className="font-title-lg text-title-lg font-bold text-primary font-mono mt-1">
            100% Escrow
          </span>
          <span className="text-[10px] text-secondary">Zero Broker Risk</span>
        </div>
      </div>

      {/* Verified Buyer Bidding Cards List */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <h2 className="font-headline-sm text-headline-sm font-serif font-bold text-primary flex items-center gap-1.5">
            <span>[💰]</span>
            <span>{t('market.b2b_buyers')} ({filteredBuyers.length})</span>
          </h2>
          <span className="text-body-sm text-xs text-on-surface-variant font-mono">
            Sorted by Top Net Yield
          </span>
        </div>

        {filteredBuyers.length === 0 ? (
          <div className="p-8 rounded-2xl bg-surface-container-lowest text-center space-y-2 border border-surface-container-high">
            <span className="material-symbols-outlined text-4xl text-secondary">search_off</span>
            <p className="font-title-md text-title-md text-primary font-semibold">No direct buyers for {selectedCropFilter} currently</p>
            <p className="text-body-sm text-on-surface-variant">Switch filter tabs to explore other commodity off-takers.</p>
          </div>
        ) : (
          filteredBuyers.map((buyer) => (
            <div
              key={buyer.id}
              className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-surface-container-high/70 hover:shadow-md transition-all flex flex-col space-y-3"
            >
              {/* Card Top: Buyer Identity & Verification */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-surface-container-high overflow-hidden flex-shrink-0 border border-surface-container-high">
                    <img
                      src={buyer.avatarUrl}
                      alt={buyer.buyerName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-title-md text-title-md font-bold text-primary truncate">
                        {buyer.buyerName}
                      </h3>
                      <span className="material-symbols-outlined text-primary text-[16px]" title="Verified Buyer">
                        verified
                      </span>
                    </div>
                    <span className="font-body-sm text-xs text-on-surface-variant flex items-center gap-1 truncate">
                      <span className="material-symbols-outlined text-[13px] text-secondary">location_on</span>
                      {buyer.location}
                    </span>
                  </div>
                </div>

                {/* Rating & Trust badge */}
                <div className="flex flex-col items-end flex-shrink-0">
                  <div className="flex items-center gap-1 bg-surface-container px-2 py-0.5 rounded-full text-[11px] font-semibold text-primary">
                    <span className="material-symbols-outlined text-[14px] text-amber-500">star</span>
                    <span>{buyer.rating}</span>
                  </div>
                  <span className="text-[10px] text-on-surface-variant mt-0.5">
                    {buyer.dealsCompleted} lots settled
                  </span>
                </div>
              </div>

              {/* Card Middle: Commercial Terms Matrix in INR (₹) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                <div className="bg-surface-container-low rounded-xl p-2.5">
                  <span className="text-[10px] font-label-sm text-on-surface-variant uppercase tracking-wider block">
                    Bidding Price
                  </span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="font-headline-sm text-sm sm:text-base font-bold text-primary font-mono">
                      {formatINR(buyer.biddingPrice)}
                    </span>
                    <span className="text-[10px] text-on-surface-variant font-mono">/ MT</span>
                  </div>
                </div>

                <div className="bg-surface-container-low rounded-xl p-2.5">
                  <span className="text-[10px] font-label-sm text-on-surface-variant uppercase tracking-wider block">
                    Demanded Volume
                  </span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="font-headline-sm text-sm sm:text-base font-bold text-primary font-mono">
                      {buyer.demandedQuantity.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-on-surface-variant font-mono">MT</span>
                  </div>
                </div>

                <div className="bg-surface-container-low rounded-xl p-2.5">
                  <span className="text-[10px] font-label-sm text-on-surface-variant uppercase tracking-wider block">
                    Quality Spec Tier
                  </span>
                  <span className="font-title-md text-xs font-semibold text-primary block truncate mt-1">
                    {buyer.qualityTier}
                  </span>
                </div>

                <div className="bg-surface-container-low rounded-xl p-2.5">
                  <span className="text-[10px] font-label-sm text-on-surface-variant uppercase tracking-wider block">
                    Settlement Method
                  </span>
                  <span className="font-title-md text-xs font-semibold text-secondary block truncate mt-1">
                    Smart Escrow (100%)
                  </span>
                </div>
              </div>

              {/* Delivery and logistics note */}
              <div className="px-3 py-2 rounded-xl bg-surface-bright border border-surface-container-high/50 flex items-center justify-between text-xs text-on-surface-variant">
                <span className="flex items-center gap-1.5 truncate">
                  <span className="material-symbols-outlined text-[15px] text-secondary">local_shipping</span>
                  <span><strong>Fulfillment Terms:</strong> {buyer.deliveryTerms}</span>
                </span>
                <span className="px-2 py-0.5 rounded bg-secondary-container text-on-secondary-container text-[10px] font-bold uppercase tracking-wider flex-shrink-0">
                  {buyer.verifiedTier}
                </span>
              </div>

              {/* Card Action: SELL CARGO DIRECTLY Button */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setActiveBuyerModal(buyer)}
                  className="w-full h-12 bg-primary-container text-on-primary rounded-xl font-label-lg font-bold flex items-center justify-center gap-2 shadow-sm hover:opacity-95 active:scale-[0.99] transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">sell</span>
                  <span>{t('market.sell_btn')}</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Escrow Transfer Handshake Modal */}
      {activeBuyerModal && (
        <EscrowTransferModal
          buyer={activeBuyerModal}
          selectedField={selectedField}
          fields={fields}
          onClose={() => setActiveBuyerModal(null)}
          onSuccess={(deal) => {
            handleDealSuccess(deal);
            setActiveBuyerModal(null);
          }}
        />
      )}

    </div>
  );
};
