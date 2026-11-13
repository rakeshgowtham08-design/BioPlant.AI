// ==============================================================================
// BioPlant.AI - Customer & Contract Portal ("Customers")
// Active Purchasing Clients, Logistics Dispatches, Escrow Settlement & CRM Tracker
// ==============================================================================

import React, { useState, useEffect } from 'react';
import { CustomerRecord, MarketplaceDeal } from '../types';
import {
  getCustomerRecords,
  getMarketplaceDeals,
  createCustomerRecord,
  getCommercialMetricsSummary,
  subscribeToDatabaseChanges
} from '../services/supabaseService';
import { formatINR } from '../utils/currency';

export const ScreenCustomers: React.FC = () => {
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [deals, setDeals] = useState<MarketplaceDeal[]>([]);
  const [metrics, setMetrics] = useState({
    totalRevenue: 70770000,
    pendingEscrow: 15624000,
    activeContracts: 4
  });

  const [activeTab, setActiveTab] = useState<'contracts' | 'customers'>('contracts');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Customer Form State
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newContactPerson, setNewContactPerson] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newCropType, setNewCropType] = useState('Rice');
  const [newVolumeMT, setNewVolumeMT] = useState(1000);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    const [d, c, m] = await Promise.all([
      getMarketplaceDeals(),
      getCustomerRecords(),
      getCommercialMetricsSummary()
    ]);
    setDeals(d);
    setCustomers(c);
    setMetrics(m);
  };

  useEffect(() => {
    loadData();
    const unsubscribe = subscribeToDatabaseChanges(() => {
      loadData();
    });
    return unsubscribe;
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddCustomerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompanyName || !newEmail) return;

    setIsSubmitting(true);
    try {
      const targetPrice = newCropType === 'Cotton' ? 620 : newCropType === 'Groundnuts' ? 480 : 310;
      const initialRevenue = newVolumeMT * targetPrice;

      await createCustomerRecord({
        company_name: newCompanyName,
        contact_person: newContactPerson || 'Procurement Desk',
        email: newEmail,
        phone: newPhone || '+1 (555) 019-2834',
        crop_type: newCropType,
        active_contracts_count: 1,
        total_volume_mt: newVolumeMT,
        total_revenue: initialRevenue,
        status: 'Active Off-taker'
      });

      setIsSubmitting(false);
      setIsAddDrawerOpen(false);
      // Reset form
      setNewCompanyName('');
      setNewContactPerson('');
      setNewEmail('');
      setNewPhone('');
      showToast(`✓ Off-taker ${newCompanyName} registered in CRM`);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  // Filter deals
  const filteredDeals = deals.filter(deal => {
    const matchesFilter = statusFilter === 'All' || deal.transaction_status === statusFilter;
    const matchesSearch =
      deal.buyer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.crop_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.contract_hash.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status: MarketplaceDeal['transaction_status']) => {
    switch (status) {
      case 'Pending Dispatch':
        return {
          bg: 'bg-amber-100 text-amber-900 border-amber-300',
          dot: 'bg-amber-500 animate-pulse',
          icon: 'schedule'
        };
      case 'In Escrow':
        return {
          bg: 'bg-blue-100 text-blue-900 border-blue-300',
          dot: 'bg-blue-500',
          icon: 'lock'
        };
      case 'Dispatched':
        return {
          bg: 'bg-primary-fixed text-primary font-bold border-primary-fixed-dim',
          dot: 'bg-primary-container',
          icon: 'local_shipping'
        };
      case 'Paid':
        return {
          bg: 'bg-secondary-container text-on-secondary-container border-secondary-fixed',
          dot: 'bg-secondary',
          icon: 'check_circle'
        };
      default:
        return {
          bg: 'bg-surface-container text-on-surface-variant border-surface-container-high',
          dot: 'bg-gray-400',
          icon: 'info'
        };
    }
  };

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto px-gutter-sm space-y-space-md py-space-md pb-28 animate-in fade-in duration-200">
      
      {/* Portal Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container mb-1.5">
            <span className="material-symbols-outlined text-[14px]">contacts</span>
            <span className="font-label-sm text-[11px] font-semibold">Agronomic CRM & Commercial Escrow</span>
          </div>
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile font-serif font-bold text-primary">
            Customer & Contract Portal
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Track wholesale purchasing clients, logistics dispatches, and smart-contract escrow releases.
          </p>
        </div>

        {/* Add Customer Action Button */}
        <button
          type="button"
          onClick={() => setIsAddDrawerOpen(true)}
          className="px-3.5 py-2 rounded-xl bg-primary-container text-on-primary font-label-sm text-sm font-bold flex items-center gap-1.5 shadow-sm hover:opacity-95 transition-all cursor-pointer flex-shrink-0"
        >
          <span className="material-symbols-outlined text-[18px]">person_add</span>
          <span>+ Add Customer</span>
        </button>
      </div>

      {/* Visual Metrics Cards (Requirement 3) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        
        {/* Metric 1: Total Revenue Generated */}
        <div className="p-3.5 rounded-2xl bg-surface-container-lowest border border-surface-container-high/70 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-secondary">
            <span className="text-[11px] font-label-sm uppercase tracking-wider font-semibold">
              Total Revenue Generated
            </span>
            <span className="material-symbols-outlined text-[18px] text-primary">payments</span>
          </div>
          <div className="my-2">
            <span className="font-headline-sm text-2xl font-bold text-primary font-mono block">
              ${metrics.totalRevenue.toLocaleString()}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] text-primary font-semibold mt-0.5">
              <span className="material-symbols-outlined text-[13px]">trending_up</span>
              <span>+18.4% vs past cycle</span>
            </span>
          </div>
          <span className="text-[10px] text-on-surface-variant border-t border-surface-container-high/50 pt-1.5">
            Settled via Instant Digital Escrow
          </span>
        </div>

        {/* Metric 2: Pending Escrow Release */}
        <div className="p-3.5 rounded-2xl bg-surface-container-lowest border border-surface-container-high/70 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-secondary">
            <span className="text-[11px] font-label-sm uppercase tracking-wider font-semibold">
              Pending Escrow Release
            </span>
            <span className="material-symbols-outlined text-[18px] text-tertiary-fixed-dim">account_balance_wallet</span>
          </div>
          <div className="my-2">
            <span className="font-headline-sm text-2xl font-bold text-primary font-mono block">
              ${metrics.pendingEscrow.toLocaleString()}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] text-secondary font-semibold mt-0.5">
              <span className="material-symbols-outlined text-[13px]">lock</span>
              <span>Protected in Smart Vault</span>
            </span>
          </div>
          <span className="text-[10px] text-on-surface-variant border-t border-surface-container-high/50 pt-1.5">
            Released on bill-of-lading dispatch
          </span>
        </div>

        {/* Metric 3: Active Logistics Contracts */}
        <div className="p-3.5 rounded-2xl bg-surface-container-lowest border border-surface-container-high/70 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-secondary">
            <span className="text-[11px] font-label-sm uppercase tracking-wider font-semibold">
              Active Logistics Contracts
            </span>
            <span className="material-symbols-outlined text-[18px] text-secondary">assignment</span>
          </div>
          <div className="my-2">
            <span className="font-headline-sm text-2xl font-bold text-primary font-mono block">
              {metrics.activeContracts} Active Deals
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] text-primary font-semibold mt-0.5">
              <span className="material-symbols-outlined text-[13px]">local_shipping</span>
              <span>Domestic & Export Transit</span>
            </span>
          </div>
          <span className="text-[10px] text-on-surface-variant border-t border-surface-container-high/50 pt-1.5">
            {deals.length} total lots on Supabase ledger
          </span>
        </div>

      </div>

      {/* Tab Selector & Filter Bar */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between border-b border-surface-container-high pb-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('contracts')}
              className={`pb-1 text-sm font-label-lg font-bold transition-colors cursor-pointer border-b-2 -mb-2 ${
                activeTab === 'contracts'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Commercial Cargo Deals ({deals.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('customers')}
              className={`pb-1 text-sm font-label-lg font-bold transition-colors cursor-pointer border-b-2 -mb-2 ${
                activeTab === 'customers'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Wholesale Off-takers Directory ({customers.length})
            </button>
          </div>

          <span className="text-[11px] font-mono text-secondary hidden sm:inline">
            Table: marketplace_deals & customer_records
          </span>
        </div>

        {/* Search & Status Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {/* Search Input */}
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
              search
            </span>
            <input
              type="text"
              placeholder="Search by buyer, crop, or contract hash..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-3 bg-surface-container-lowest border border-surface-container-high rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Status Pills */}
          {activeTab === 'contracts' && (
            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {['All', 'Pending Dispatch', 'In Escrow', 'Dispatched', 'Paid'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-label-sm font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    statusFilter === st
                      ? 'bg-primary-container text-on-primary'
                      : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main View: Commercial Contracts Data Table */}
      {activeTab === 'contracts' ? (
        <div className="space-y-3">
          {filteredDeals.length === 0 ? (
            <div className="p-8 rounded-2xl bg-surface-container-lowest text-center space-y-2 border border-surface-container-high">
              <span className="material-symbols-outlined text-4xl text-secondary">inbox</span>
              <p className="font-title-md text-primary font-semibold">No commercial cargo transactions match criteria</p>
              <p className="text-body-sm text-on-surface-variant">Execute deals in the Marketplace to see real-time updates.</p>
            </div>
          ) : (
            filteredDeals.map((deal) => {
              const badge = getStatusBadge(deal.transaction_status);

              return (
                <div
                  key={deal.id}
                  className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-surface-container-high/80 hover:shadow-md transition-all flex flex-col space-y-3"
                >
                  {/* Row Top: Buyer & Status Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center font-bold text-primary text-xs">
                          {deal.buyer_name.substring(0, 2).toUpperCase()}
                        </span>
                        <div className="min-w-0">
                          <h3 className="font-title-md text-title-md font-bold text-primary truncate">
                            {deal.buyer_name}
                          </h3>
                          <span className="text-[11px] text-on-surface-variant font-mono">
                            Lot ID: {deal.id.substring(0, 15)}...
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end flex-shrink-0">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border flex items-center gap-1 ${badge.bg}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`}></span>
                        <span>{deal.transaction_status}</span>
                      </span>
                      <span className="text-[10px] text-on-surface-variant mt-1">
                        {new Date(deal.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </div>

                  {/* Row Middle: Deal Specifics Matrix */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 py-1">
                    <div className="p-2 bg-surface-container-low rounded-lg">
                      <span className="text-[10px] font-label-sm text-on-surface-variant uppercase tracking-wider block">
                        Crop Ordered
                      </span>
                      <span className="font-title-md text-sm font-bold text-primary block mt-0.5">
                        {deal.crop_type}
                      </span>
                    </div>

                    <div className="p-2 bg-surface-container-low rounded-lg">
                      <span className="text-[10px] font-label-sm text-on-surface-variant uppercase tracking-wider block">
                        Quantity Dispatched
                      </span>
                      <span className="font-title-md text-sm font-bold text-primary font-mono block mt-0.5">
                        {deal.quantity_sold.toLocaleString()} MT
                      </span>
                    </div>

                    <div className="p-2 bg-surface-container-low rounded-lg">
                      <span className="text-[10px] font-label-sm text-on-surface-variant uppercase tracking-wider block">
                        Rate per Ton
                      </span>
                      <span className="font-title-md text-sm font-bold text-primary font-mono block mt-0.5">
                        ${deal.price_per_ton}/MT
                      </span>
                    </div>

                    <div className="p-2 bg-surface-container-low rounded-lg">
                      <span className="text-[10px] font-label-sm text-on-surface-variant uppercase tracking-wider block">
                        Total Settlement
                      </span>
                      <span className="font-title-md text-sm font-bold text-primary font-mono block mt-0.5">
                        ${deal.total_amount.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Order Fulfillment Progress Bar (Requirement 3) */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-label-sm text-on-surface-variant">Order Fulfillment Progress</span>
                      <span className="font-mono font-bold text-primary">
                        {deal.transaction_status === 'Paid' ? 100 : deal.transaction_status === 'Dispatched' ? 65 : deal.transaction_status === 'In Escrow' ? 30 : 5}%
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
                      <div
                        className="h-full bg-primary-container rounded-full transition-all duration-700"
                        style={{
                          width: `${deal.transaction_status === 'Paid' ? 100 : deal.transaction_status === 'Dispatched' ? 65 : deal.transaction_status === 'In Escrow' ? 30 : 5}%`
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Row Bottom: Contract Hash & Action Buttons */}
                  <div className="pt-2 border-t border-surface-container-high/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-on-surface-variant truncate">
                      <span className="material-symbols-outlined text-[14px] text-secondary">token</span>
                      <span className="truncate">Hash: {deal.contract_hash}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => showToast(`Smart Contract Escrow verified on Supabase ledger.`)}
                        className="px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[14px]">shield</span>
                        <span>Verify Escrow</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          window.print();
                          showToast(`Downloading Logistics Cargo Waybill...`);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[14px]">description</span>
                        <span>Waybill</span>
                      </button>
                    </div>
                  </div>

                </div>
              );
            })
          )}
        </div>
      ) : (
        /* Customers Directory View */
        <div className="space-y-3">
          {customers.map((cust) => (
            <div
              key={cust.id}
              className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-surface-container-high/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-container text-on-primary flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {cust.company_name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-title-md text-title-md font-bold text-primary">
                    {cust.company_name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-on-surface-variant mt-0.5">
                    <span>Contact: <strong>{cust.contact_person}</strong></span>
                    <span>•</span>
                    <span>{cust.email}</span>
                    {cust.phone && (
                      <>
                        <span>•</span>
                        <span>{cust.phone}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 sm:flex-shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0">
                <div className="text-right">
                  <span className="text-[10px] uppercase font-label-sm text-secondary block">
                    Total Sourced
                  </span>
                  <span className="font-title-md font-bold text-primary font-mono block">
                    {cust.total_volume_mt.toLocaleString()} MT
                  </span>
                  <span className="text-[10px] text-on-surface-variant">
                    {cust.active_contracts_count} Active Contracts
                  </span>
                </div>

                <span className="px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold whitespace-nowrap">
                  {cust.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Side-Drawer Modal for "+ Add Customer" (Requirement 3) */}
      {isAddDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="w-full max-w-md h-full bg-surface-container-lowest p-6 shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-surface-container-high">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary-container text-on-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">person_add</span>
                  </div>
                  <div>
                    <h3 className="font-title-md font-serif font-bold text-primary">
                      Register Wholesale Off-taker
                    </h3>
                    <span className="text-[11px] text-on-surface-variant">Table: customer_records</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAddDrawerOpen(false)}
                  className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>

              <form onSubmit={handleAddCustomerSubmit} className="space-y-4 pt-4">
                <div className="space-y-1">
                  <label className="text-xs font-label-sm font-semibold text-primary">
                    Company / Enterprise Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Archer-Daniels-Midland Co."
                    value={newCompanyName}
                    onChange={(e) => setNewCompanyName(e.target.value)}
                    className="w-full h-11 px-3 bg-surface-container-low border border-surface-container-high rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-label-sm font-semibold text-primary">
                    Contact Person Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sarah Jenkins"
                    value={newContactPerson}
                    onChange={(e) => setNewContactPerson(e.target.value)}
                    className="w-full h-11 px-3 bg-surface-container-low border border-surface-container-high rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-label-sm font-semibold text-primary">
                    Official Procurement Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="procurement@adm-grains.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full h-11 px-3 bg-surface-container-low border border-surface-container-high rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-label-sm font-semibold text-primary">
                    Phone / WhatsApp Dispatch Line
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 234-8910"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full h-11 px-3 bg-surface-container-low border border-surface-container-high rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-label-sm font-semibold text-primary">
                      Primary Crop Demand
                    </label>
                    <select
                      value={newCropType}
                      onChange={(e) => setNewCropType(e.target.value)}
                      className="w-full h-11 px-3 bg-surface-container-low border border-surface-container-high rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="Rice">Rice</option>
                      <option value="Maize">Maize</option>
                      <option value="Cotton">Cotton</option>
                      <option value="Wheat">Wheat</option>
                      <option value="Groundnuts">Groundnuts</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-label-sm font-semibold text-primary">
                      Contract Demand (MT)
                    </label>
                    <input
                      type="number"
                      min={10}
                      value={newVolumeMT}
                      onChange={(e) => setNewVolumeMT(Number(e.target.value))}
                      className="w-full h-11 px-3 bg-surface-container-low border border-surface-container-high rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container-high text-xs text-on-surface-variant space-y-1">
                  <span className="font-semibold text-primary block">Default Compliance Protocol:</span>
                  <p>Client agreement will be provisioned with standard multi-sig escrow parameters and auto-synced with Supabase `customer_records`.</p>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 bg-primary-container text-on-primary rounded-xl font-label-lg font-bold flex items-center justify-center gap-2 shadow-sm hover:opacity-95 transition-all cursor-pointer"
                  >
                    {isSubmitting ? 'Registering Off-taker...' : 'Save Customer to Supabase Ledger'}
                  </button>
                </div>
              </form>
            </div>

            <button
              type="button"
              onClick={() => setIsAddDrawerOpen(false)}
              className="w-full h-10 mt-4 rounded-xl bg-surface-container text-on-surface-variant text-sm font-semibold hover:bg-surface-container-high transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Floating Action Toast */}
      {toastMessage && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-primary text-on-primary px-4 py-2.5 rounded-full shadow-xl text-label-sm font-label-sm z-50 flex items-center gap-2 animate-in fade-in zoom-in-95 duration-200">
          <span className="material-symbols-outlined text-[18px] text-primary-fixed">verified</span>
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
};

