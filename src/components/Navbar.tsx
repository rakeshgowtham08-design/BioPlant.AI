// ==============================================================================
// BioPlant.AI - Fixed Top Header & Floating Bottom Pill Navigation
// 6-Tab Navigation with Universal Visual Anchors: [🌾], [📸], [💰], [⚠️], [🌐], [☀️]
// Includes reactive Language Selector [🌐] (English, Telugu తెలుగు, Hindi हिन्दी)
// ==============================================================================

import React, { useState } from 'react';
import { ActiveScreen } from '../types';
import { useLanguage, Language } from '../context/LanguageContext';

interface NavbarProps {
  currentScreen: ActiveScreen;
  onNavigate: (screen: ActiveScreen) => void;
  hasResults: boolean;
  onOpenDfd: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentScreen,
  onNavigate,
  hasResults,
  onOpenDfd
}) => {
  const { language, setLanguage, t } = useLanguage();
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const getSubTitle = () => {
    switch (currentScreen) {
      case 'dashboard':
        return t('anchor.forecast');
      case 'diagnostics':
        return t('anchor.diagnostics');
      case 'cropscan':
        return t('anchor.camera');
      case 'results':
        return 'AI Insights';
      case 'marketplace':
        return t('anchor.market');
      case 'customers':
        return t('nav.customers');
      default:
        return 'BioPlant.AI';
    }
  };

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'te', label: 'తెలుగు (Telugu)', flag: '🇮🇳' },
    { code: 'hi', label: 'हिन्दी (Hindi)', flag: '🇮🇳' }
  ];

  return (
    <>
      {/* Fixed Top Header */}
      <header className="fixed top-0 w-full z-50 pt-safe bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.03)] border-b border-surface-container-high/40">
        <div className="max-w-2xl mx-auto h-16 px-gutter-sm flex items-center justify-between gap-2">

          {/* Logo & Brand Identity */}
          <div
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2 min-w-0 cursor-pointer"
          >
            <img
              alt="BioPlant.AI Logo"
              className="h-8 w-auto object-contain flex-shrink-0"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCeW_EWZB2MsF99eJAEcshYQRgHwRPjNAD9wa20BZHv9h0zBjYfXNVndCBo_xKvyJSQygS3vB2vkuz0jh4Fygzzm3eZ1BsDTfYja-W7tTEV5s9XPHUJ0bYuMbkRJW1EETk1UBgB6iWhfH6SeIGBljkiXRH9WDRyPlNgZ58tYugnNxOspHzqTRGYhrXz6dW5YJhTKdX7AuL7cqKVHUbiv9bEu-mj7wRdiUuBiy7k6ZI"
            />
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-title-md text-sm sm:text-base text-primary tracking-tight font-bold truncate">
                  BioPlant.AI
                </span>
                <span className="relative flex h-2 w-2 flex-shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-fixed opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-container"></span>
                </span>
              </div>
              <span className="font-label-sm text-[10px] text-on-surface-variant truncate">
                {getSubTitle()}
              </span>
            </div>
          </div>

          {/* Right Action Icons: Language Selector [🌐], Camera Quick Launch [📸], DFD */}
          <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">

            {/* Universal Visual Anchor: [🌐] Language Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="px-2 py-1 text-xs rounded-full bg-surface-container text-primary font-bold hover:bg-surface-container-high transition-colors flex items-center gap-1 cursor-pointer border border-surface-container-high"
                title={t('anchor.language')}
              >
                <span className="text-[13px]">🌐</span>
                <span className="text-[11px] font-mono uppercase font-bold">
                  {language === 'te' ? 'తెలుగు' : language === 'hi' ? 'हिन्दी' : 'EN'}
                </span>
                <span className="material-symbols-outlined text-[14px]">arrow_drop_down</span>
              </button>

              {/* Language Dropdown Menu */}
              {isLangMenuOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-44 bg-surface-container-lowest rounded-xl shadow-xl p-1.5 border border-surface-container-high z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-2 py-1 text-[10px] font-label-sm text-secondary uppercase tracking-wider font-bold">
                    Select Language / భాష
                  </div>
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => {
                        setLanguage(l.code);
                        setIsLangMenuOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                        language === l.code
                          ? 'bg-primary-container text-on-primary font-bold'
                          : 'hover:bg-surface-container text-on-surface'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <span>{l.flag}</span>
                        <span>{l.label}</span>
                      </span>
                      {language === l.code && (
                        <span className="material-symbols-outlined text-[14px]">check</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Action: [📸] Crop Scan Camera */}
            <button
              onClick={() => onNavigate('cropscan')}
              className={`p-1.5 sm:px-2 sm:py-1 rounded-full text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all ${
                currentScreen === 'cropscan'
                  ? 'bg-[#1B4D3E] text-white shadow-sm'
                  : 'bg-surface-container hover:bg-surface-container-high text-primary'
              }`}
              title="📸 Crop Scan / Disease Finder"
            >
              <span className="text-sm">📸</span>
              <span className="hidden sm:inline text-[11px] font-bold">Scan</span>
            </button>

            {/* Level 1 Architecture DFD */}
            <button
              onClick={onOpenDfd}
              className="px-2 py-1 text-[11px] rounded-full bg-surface-container text-primary font-label-sm hover:bg-surface-container-high transition-colors flex items-center gap-0.5 cursor-pointer"
              title="View Level 1 Data Flow Architecture"
            >
              <span className="material-symbols-outlined text-[15px]">account_tree</span>
              <span>DFD</span>
            </button>

          </div>

        </div>
      </header>

      {/* Floating Bottom Pill Navigation Bar */}
      {/* 6 Tabs with Visual Anchors: [☀️] Overview | [🌾] Diag | [📸] Scan | [💰] Market | Insights | Customers */}
      <div className="fixed bottom-0 w-full z-50 pb-safe pointer-events-none px-gutter-sm mb-2 sm:mb-3">
        <nav
          className="pointer-events-auto mx-auto max-w-xl bg-surface-container-lowest/95 backdrop-blur-xl rounded-full shadow-[0_8px_24px_rgba(15,56,44,0.14)] p-1 flex items-center justify-between border border-surface-container-high/70"
        >
          {/* Tab 1: Overview [☀️] */}
          <button
            onClick={() => onNavigate('dashboard')}
            aria-current={currentScreen === 'dashboard' ? 'page' : undefined}
            data-path="overview"
            className={`flex-1 flex flex-col items-center justify-center py-1 px-0.5 min-h-[42px] rounded-full transition-all cursor-pointer ${
              currentScreen === 'dashboard'
                ? 'bg-primary-container text-on-primary font-bold shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="text-xs">☀️</span>
            <span className="font-label-sm text-[9px] sm:text-[10px] tracking-tight truncate max-w-[55px]">
              {t('nav.overview')}
            </span>
          </button>

          {/* Tab 2: Diagnostics [🌾] */}
          <button
            onClick={() => onNavigate('diagnostics')}
            aria-current={currentScreen === 'diagnostics' ? 'page' : undefined}
            data-path="diagnostics"
            className={`flex-1 flex flex-col items-center justify-center py-1 px-0.5 min-h-[42px] rounded-full transition-all cursor-pointer ${
              currentScreen === 'diagnostics'
                ? 'bg-primary-container text-on-primary font-bold shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="text-xs">🌾</span>
            <span className="font-label-sm text-[9px] sm:text-[10px] tracking-tight truncate max-w-[55px]">
              {t('nav.diagnostics')}
            </span>
          </button>

          {/* Tab 3: Crop Scan [📸] (Disease Finder) */}
          <button
            onClick={() => onNavigate('cropscan')}
            aria-current={currentScreen === 'cropscan' ? 'page' : undefined}
            data-path="cropscan"
            className={`flex-1 flex flex-col items-center justify-center py-1 px-0.5 min-h-[42px] rounded-full transition-all cursor-pointer ${
              currentScreen === 'cropscan'
                ? 'bg-[#1B4D3E] text-white font-bold shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="text-xs">📸</span>
            <span className="font-label-sm text-[9px] sm:text-[10px] tracking-tight truncate max-w-[55px]">
              {t('nav.cropscan')}
            </span>
          </button>

          {/* Tab 4: AI Insights */}
          <button
            onClick={() => onNavigate('results')}
            aria-current={currentScreen === 'results' ? 'page' : undefined}
            data-path="ai-insights"
            className={`flex-1 flex flex-col items-center justify-center py-1 px-0.5 min-h-[42px] rounded-full transition-all cursor-pointer ${
              currentScreen === 'results'
                ? 'bg-primary-container text-on-primary font-bold shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <div className="relative">
              <span className="material-symbols-outlined text-[17px]">psychology</span>
              {hasResults && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400"></span>
              )}
            </div>
            <span className="font-label-sm text-[9px] sm:text-[10px] tracking-tight truncate max-w-[55px]">
              {t('nav.insights')}
            </span>
          </button>

          {/* Tab 5: Marketplace [💰] */}
          <button
            onClick={() => onNavigate('marketplace')}
            aria-current={currentScreen === 'marketplace' ? 'page' : undefined}
            data-path="marketplace"
            className={`flex-1 flex flex-col items-center justify-center py-1 px-0.5 min-h-[42px] rounded-full transition-all cursor-pointer ${
              currentScreen === 'marketplace'
                ? 'bg-primary-container text-on-primary font-bold shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="text-xs">💰</span>
            <span className="font-label-sm text-[9px] sm:text-[10px] tracking-tight truncate max-w-[55px]">
              {t('nav.marketplace')}
            </span>
          </button>

          {/* Tab 6: Customers */}
          <button
            onClick={() => onNavigate('customers')}
            aria-current={currentScreen === 'customers' ? 'page' : undefined}
            data-path="customers"
            className={`flex-1 flex flex-col items-center justify-center py-1 px-0.5 min-h-[42px] rounded-full transition-all cursor-pointer ${
              currentScreen === 'customers'
                ? 'bg-primary-container text-on-primary font-bold shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">groups</span>
            <span className="font-label-sm text-[9px] sm:text-[10px] tracking-tight truncate max-w-[55px]">
              {t('nav.customers')}
            </span>
          </button>
        </nav>
      </div>
    </>
  );
};
