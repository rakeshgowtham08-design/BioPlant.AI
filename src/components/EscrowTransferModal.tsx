// ==============================================================================
// BioPlant.AI - Authorize Cargo Escrow Transfer Modal
// Real-time Smart-Contract Handshake, Weight Entry & Instant Payout Execution
// ==============================================================================

import React, { useState } from 'react';
import { MarketplaceBuyer, FieldProfile, MarketplaceDeal } from '../types';
import { createMarketplaceDeal, generateContractHash } from '../services/supabaseService';

interface EscrowTransferModalProps {
  buyer: MarketplaceBuyer;
  selectedField: FieldProfile;
  fields: FieldProfile[];
  onClose: () => void;
  onSuccess: (deal: MarketplaceDeal) => void;
}

export const EscrowTransferModal: React.FC<EscrowTransferModalProps> = ({
  buyer,
  selectedField,
  fields,
  onClose,
  onSuccess
}) => {
  const [weightMT, setWeightMT] = useState<number>(buyer.demandedQuantity > 1000 ? 500 : buyer.demandedQuantity);
  const [chosenFieldId, setChosenFieldId] = useState<string>(selectedField.id);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [completedDeal, setCompletedDeal] = useState<MarketplaceDeal | null>(null);
  const [contractHash] = useState<string>(() => generateContractHash());

  const pricePerTon = buyer.biddingPrice;
  const totalPayout = weightMT * pricePerTon;
  const platformFee = 0; // Zero fee for verified growers
  const netPayout = totalPayout - platformFee;

  const handleInitiatePayout = async () => {
    if (weightMT <= 0) return;
    setIsProcessing(true);

    try {
      // Simulate real smart-contract escrow cryptographic handshake
      await new Promise(resolve => setTimeout(resolve, 1400));

      const deal = await createMarketplaceDeal({
        field_id: chosenFieldId,
        buyer_name: buyer.buyerName,
        crop_type: buyer.cropType,
        price_per_ton: pricePerTon,
        quantity_sold: weightMT
      });

      setCompletedDeal(deal);
      setIsProcessing(false);
      setIsCompleted(true);
      onSuccess(deal);
    } catch (err) {
      console.error('Failed to initiate escrow transfer', err);
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-surface-container-lowest rounded-2xl shadow-2xl border border-surface-container-high/80 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 bg-primary-container text-on-primary flex items-center justify-between border-b border-primary/20">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-surface-bright/20 flex items-center justify-center text-primary-fixed">
              <span className="material-symbols-outlined text-[20px]">handshake</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-label-sm tracking-wider text-primary-fixed block">
                Direct B2B Cargo Settlement
              </span>
              <h3 className="font-title-md text-title-md font-serif font-bold text-on-primary">
                Authorize Cargo Escrow Transfer
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-on-primary transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {!isCompleted ? (
            <>
              {/* Smart-Contract Handshake Protocol Box */}
              <div className="p-3.5 rounded-xl bg-surface-container-low border border-primary/15 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-container opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    <span className="font-label-sm text-label-sm font-semibold text-primary">
                      Smart-Contract Handshake Protocol
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-secondary-container text-on-secondary-container font-semibold">
                    Multi-Sig Escrow Active
                  </span>
                </div>
                
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Funds for this harvest lot have been verified and placed into locked cryptographic escrow by the off-taker. Releasing cargo authorizes instantaneous bank transfer upon gate weight-scale slip dispatch.
                </p>

                {/* Simulated Contract Hash Key */}
                <div className="p-2 bg-surface-container-highest/60 rounded-lg flex items-center justify-between font-mono text-[11px] text-on-surface-variant">
                  <span className="truncate max-w-[280px]">Contract: {contractHash}</span>
                  <span className="text-secondary font-sans text-[10px] font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px] text-primary">verified</span>
                    Gas Validated
                  </span>
                </div>
              </div>

              {/* Buyer & Commodity Summary */}
              <div className="bg-surface-bright rounded-xl p-3.5 border border-surface-container-high/60 flex items-center justify-between">
                <div>
                  <span className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider block">
                    Verified Wholesale Buyer
                  </span>
                  <h4 className="font-title-md text-title-md text-primary font-bold">
                    {buyer.buyerName}
                  </h4>
                  <span className="font-body-sm text-body-sm text-secondary flex items-center gap-1 mt-0.5">
                    <span className="material-symbols-outlined text-[14px]">location_on</span>
                    {buyer.location}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider block">
                    Bidding Offer
                  </span>
                  <span className="font-headline-sm text-headline-sm text-primary font-bold font-mono">
                    ${buyer.biddingPrice}
                  </span>
                  <span className="font-label-sm text-[10px] text-on-surface-variant block">/ Metric Ton</span>
                </div>
              </div>

              {/* Cargo Weight Entry Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-label-sm text-label-sm font-semibold text-primary flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">scale</span>
                    <span>Cargo Weight to Dispatch (Metric Tons)</span>
                  </label>
                  <span className="font-label-sm text-label-sm text-secondary font-mono">
                    Max Demanded: {buyer.demandedQuantity} MT
                  </span>
                </div>
                
                <div className="relative">
                  <input
                    type="number"
                    min={1}
                    max={buyer.demandedQuantity}
                    step={10}
                    value={weightMT}
                    onChange={(e) => setWeightMT(Math.max(1, Number(e.target.value)))}
                    className="w-full h-12 px-3.5 pr-16 bg-surface-container-low border border-surface-container-high rounded-xl text-primary font-mono font-bold text-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 font-label-sm text-sm text-on-surface-variant font-semibold">
                    MT
                  </div>
                </div>

                {/* Quick Weight Presets */}
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[10px] font-label-sm text-on-surface-variant">Presets:</span>
                  {[100, 250, 500, 1000].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setWeightMT(preset)}
                      className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                        weightMT === preset 
                          ? 'bg-primary-container text-on-primary font-bold' 
                          : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                      }`}
                    >
                      {preset} MT
                    </button>
                  ))}
                </div>
              </div>

              {/* Field Parcel Origin Selector */}
              <div className="space-y-1.5">
                <label className="font-label-sm text-label-sm font-semibold text-primary flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">terrain</span>
                  <span>Origin Harvest Parcel</span>
                </label>
                <select
                  value={chosenFieldId}
                  onChange={(e) => setChosenFieldId(e.target.value)}
                  className="w-full h-11 px-3 bg-surface-container-low border border-surface-container-high rounded-xl text-primary font-body-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  {fields.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({f.soilType} — {f.acreage} Ha)
                    </option>
                  ))}
                </select>
              </div>

              {/* Real-Time Settlement Financial Breakdown */}
              <div className="p-3.5 rounded-xl bg-surface-container-low border border-surface-container-high/80 space-y-2">
                <div className="flex items-center justify-between text-body-sm text-on-surface-variant">
                  <span>Gross Crop Valuation ({weightMT} MT @ ${pricePerTon}/MT)</span>
                  <span className="font-mono font-semibold text-primary">
                    ${totalPayout.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-body-sm text-on-surface-variant">
                  <span className="flex items-center gap-1">
                    BioPlant Escrow & Smart Contract Gas
                    <span className="px-1.5 py-0.2 rounded text-[9px] bg-secondary-container text-on-secondary-container">0% Waived</span>
                  </span>
                  <span className="font-mono font-semibold text-secondary">$0.00</span>
                </div>
                <div className="pt-2 border-t border-surface-container-high flex items-center justify-between">
                  <div>
                    <span className="font-title-md text-title-md font-bold text-primary block">
                      Estimated Seller Settlement
                    </span>
                    <span className="text-[10px] text-secondary">
                      Deposited upon digital Bill of Lading generation
                    </span>
                  </div>
                  <span className="font-headline-sm text-headline-sm font-bold text-primary font-mono">
                    ${netPayout.toLocaleString()}
                  </span>
                </div>
              </div>
            </>
          ) : (
            /* Success State after Settlement */
            <div className="py-6 flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center animate-bounce">
                <span className="material-symbols-outlined text-[32px]">check_circle</span>
              </div>
              
              <div className="space-y-1">
                <span className="px-2.5 py-1 rounded-full bg-tertiary-fixed text-tertiary text-label-sm font-bold uppercase tracking-wider inline-block">
                  Status: Pending Dispatch
                </span>
                <h3 className="font-headline-sm text-headline-sm font-serif font-bold text-primary">
                  Cargo Escrow Transfer Authorized!
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-sm mx-auto">
                  A smart-contract escrow allocation of <strong className="text-primary font-bold font-mono">${netPayout.toLocaleString()}</strong> has been initiated with <strong className="text-primary font-semibold">{buyer.buyerName}</strong> for {weightMT} MT of {buyer.cropType}.
                </p>
              </div>

              <div className="w-full p-3 bg-surface-container-low rounded-xl font-mono text-[11px] text-on-surface-variant text-left space-y-1 border border-surface-container-high">
                <div className="flex justify-between">
                  <span className="text-secondary">Deal ID:</span>
                  <span className="font-semibold">{completedDeal?.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary">Contract Hash:</span>
                  <span className="truncate max-w-[220px]">{completedDeal?.contract_hash}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary">Database Sync:</span>
                  <span className="text-primary font-semibold">Supabase & Local CRM Synced ✓</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-surface-container-low border-t border-surface-container-high flex items-center gap-3">
          {!isCompleted ? (
            <>
              <button
                type="button"
                onClick={onClose}
                disabled={isProcessing}
                className="flex-1 h-12 rounded-xl bg-surface-container text-on-surface font-label-lg font-semibold hover:bg-surface-container-high transition-colors cursor-pointer"
              >
                Cancel
              </button>
              
              <button
                type="button"
                onClick={handleInitiatePayout}
                disabled={isProcessing || weightMT <= 0}
                className="flex-[2] h-12 rounded-xl bg-primary-container text-on-primary font-label-lg font-bold flex items-center justify-center gap-2 shadow-md hover:opacity-95 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span>Signing Escrow Smart Contract...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[20px]">payments</span>
                    <span>Initiate Instant Payout (${netPayout.toLocaleString()})</span>
                  </>
                )}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="w-full h-12 rounded-xl bg-primary-container text-on-primary font-label-lg font-bold flex items-center justify-center gap-2 shadow-md hover:opacity-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">done_all</span>
              <span>Complete & Review in Customers Portal</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

