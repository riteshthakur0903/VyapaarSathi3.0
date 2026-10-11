import React, { useState } from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { Globe, Database, Menu, X, Check } from 'lucide-react';
import { isUsingSupabaseCloud } from '../services/supabase';

interface HeaderProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenDatabaseModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  language,
  onLanguageChange,
  onOpenDatabaseModal,
}) => {
  const t = TRANSLATIONS[language];
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'welcome', label: t.navHome },
    { id: 'profile', label: t.navProfile },
    { id: 'advisor', label: t.navAdvisor },
    { id: 'businesses', label: t.navBusinesses },
    { id: 'calculator', label: t.navCalculator },
    { id: 'schemes', label: t.navSchemes },
    { id: 'dashboard', label: t.navDashboard },
  ];

  const languages: { code: Language; label: string; script: string }[] = [
    { code: 'hi', label: 'हिंदी', script: 'Hindi' },
    { code: 'mr', label: 'मराठी', script: 'Marathi' },
    { code: 'en', label: 'English', script: 'English' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => onTabChange('welcome')}
            className="flex items-center gap-2.5 text-left text-stone-900 focus:outline-none whitespace-nowrap shrink-0"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              व्य
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-emerald-950 font-serif">
                {t.appName}
              </span>
            </div>
          </button>

          {/* Zone 2: 4-5 concise single-line nav links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 text-sm font-medium ${
                  currentTab === item.id
                    ? 'border-emerald-800 text-emerald-900 font-semibold'
                    : 'border-transparent hover:text-stone-900 hover:border-stone-300'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Zone 3: 1 primary action area */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Supabase Status Button */}
            <button
              onClick={onOpenDatabaseModal}
              title={isUsingSupabaseCloud ? 'Supabase Connected' : 'Local Storage Mode'}
              className={`p-2 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
                isUsingSupabaseCloud
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                  : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">
                {isUsingSupabaseCloud ? 'Supabase Cloud' : 'Local Data'}
              </span>
            </button>

            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="px-3 py-1.5 rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-800 text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-800" />
                <span>
                  {language === 'hi' ? 'हिंदी' : language === 'mr' ? 'मराठी' : 'English'}
                </span>
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-stone-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        onLanguageChange(l.code);
                        setLangMenuOpen(false);
                      }}
                      className={`w-full px-3.5 py-2 text-left text-xs flex items-center justify-between transition-colors ${
                        language === l.code
                          ? 'bg-emerald-50 text-emerald-900 font-semibold'
                          : 'text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{l.label}</span>
                        <span className="text-[10px] text-stone-600">{l.script}</span>
                      </div>
                      {language === l.code && <Check className="w-3.5 h-3.5 text-emerald-700" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-stone-600 hover:bg-stone-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-stone-200 px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onTabChange(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium ${
                currentTab === item.id
                  ? 'bg-emerald-50 text-emerald-900 font-semibold'
                  : 'text-stone-700 hover:bg-stone-50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
