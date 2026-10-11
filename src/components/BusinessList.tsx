import React, { useState } from 'react';
import { BusinessIdea, Language, UserProfile } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { BUSINESS_IDEAS } from '../data/businesses';
import {
  TrendingUp,
  Users,
  Store,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Scale,
  CheckCircle,
  HelpCircle,
  Clock,
  Layers,
  ShieldAlert,
} from 'lucide-react';

interface BusinessListProps {
  userProfile: UserProfile;
  language: Language;
  onSelectBusinessForCalculator: (business: BusinessIdea) => void;
  onSelectBusinessesForCompare: (b1: BusinessIdea, b2: BusinessIdea) => void;
  onBookmarkBusiness: (businessId: string, businessTitle: string) => void;
  bookmarkedIds: string[];
}

export const BusinessList: React.FC<BusinessListProps> = ({
  userProfile,
  language,
  onSelectBusinessForCalculator,
  onSelectBusinessesForCompare,
  onBookmarkBusiness,
  bookmarkedIds,
}) => {
  const t = TRANSLATIONS[language];
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [compareQueue, setCompareQueue] = useState<string[]>([]);

  // Filter ideas
  const filteredIdeas = BUSINESS_IDEAS.filter((b) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'agri') return b.category === 'agri_processing';
    if (selectedCategory === 'animal') return b.category === 'animal_husbandry';
    if (selectedCategory === 'services') return b.category === 'retail_services' || b.category === 'manufacturing';
    if (selectedCategory === 'cleantech') return b.category === 'clean_tech';
    return true;
  });

  const handleToggleCompare = (id: string) => {
    if (compareQueue.includes(id)) {
      setCompareQueue(compareQueue.filter((item) => item !== id));
    } else {
      if (compareQueue.length >= 2) {
        setCompareQueue([compareQueue[1], id]);
      } else {
        setCompareQueue([...compareQueue, id]);
      }
    }
  };

  const handleTriggerCompare = () => {
    if (compareQueue.length < 2) return;
    const b1 = BUSINESS_IDEAS.find((b) => b.id === compareQueue[0]);
    const b2 = BUSINESS_IDEAS.find((b) => b.id === compareQueue[1]);
    if (b1 && b2) {
      onSelectBusinessesForCompare(b1, b2);
    }
  };

  const getLocalizedTitle = (b: BusinessIdea) => {
    if (language === 'hi') return b.titleHi;
    if (language === 'mr') return b.titleMr;
    return b.title;
  };

  const getLocalizedTagline = (b: BusinessIdea) => {
    if (language === 'hi') return b.taglineHi;
    if (language === 'mr') return b.taglineMr;
    return b.tagline;
  };

  const getLocalizedCustomers = (b: BusinessIdea) => {
    if (language === 'hi') return b.potentialCustomersHi;
    if (language === 'mr') return b.potentialCustomersMr;
    return b.potentialCustomers;
  };

  const getLocalizedCompetitors = (b: BusinessIdea) => {
    if (language === 'hi') return b.competitorDetailHi;
    if (language === 'mr') return b.competitorDetailMr;
    return b.competitorDetail;
  };

  const getLocalizedMarketGap = (b: BusinessIdea) => {
    if (language === 'hi') return b.marketGapsHi;
    if (language === 'mr') return b.marketGapsMr;
    return b.marketGaps;
  };

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            {t.recommendedTitle}
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm mt-1 max-w-2xl">
            {t.recommendedSubtitle} (
            {userProfile.district ? `${userProfile.district}, ${userProfile.state}` : 'Your Area'})
          </p>
        </div>

        {/* Compare Floating Bar or Action */}
        {compareQueue.length > 0 && (
          <div className="bg-emerald-900 text-white rounded-2xl p-3 px-4 flex items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-2 text-xs">
              <Scale className="w-4 h-4 text-emerald-300" />
              <span>
                {compareQueue.length}/2 selected for comparison
              </span>
            </div>
            {compareQueue.length === 2 ? (
              <button
                onClick={handleTriggerCompare}
                className="px-3.5 py-1.5 bg-white text-emerald-950 font-bold text-xs rounded-xl hover:bg-stone-100 transition-colors"
              >
                {t.compareNowBtn}
              </button>
            ) : (
              <span className="text-[11px] text-emerald-200">Select 1 more</span>
            )}
          </div>
        )}
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl overflow-x-auto whitespace-nowrap">
        {[
          { id: 'all', label: t.filterAll },
          { id: 'agri', label: t.filterAgri },
          { id: 'animal', label: t.filterAnimal },
          { id: 'services', label: t.filterServices },
          { id: 'cleantech', label: t.filterCleanTech },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedCategory(tab.id)}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors shrink-0 ${
              selectedCategory === tab.id
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Business Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredIdeas.map((idea) => {
          const isComparing = compareQueue.includes(idea.id);
          const isBookmarked = bookmarkedIds.includes(idea.id);
          const fitsCapital = userProfile.investment >= idea.minCapital * 0.2; // Qualifies for 20% margin + bank/subsidy

          return (
            <div
              key={idea.id}
              className="bg-white rounded-3xl border border-stone-200 hover:border-stone-300 transition-shadow p-6 flex flex-col justify-between space-y-6 shadow-xs"
            >
              {/* Header & Badges */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider">
                      {idea.category.replace('_', ' ')}
                    </span>
                    <h2 className="text-lg sm:text-xl font-bold text-stone-900 leading-snug">
                      {getLocalizedTitle(idea)}
                    </h2>
                  </div>

                  <button
                    onClick={() => handleToggleCompare(idea.id)}
                    className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-colors shrink-0 ${
                      isComparing
                        ? 'bg-emerald-800 text-white border-emerald-800'
                        : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                    title="Compare side by side"
                  >
                    <Scale className="w-3.5 h-3.5" />
                    <span>{isComparing ? 'Selected' : 'Compare'}</span>
                  </button>
                </div>

                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {getLocalizedTagline(idea)}
                </p>
              </div>

              {/* Financial Metrics Strip */}
              <div className="grid grid-cols-3 gap-2 bg-stone-50 p-3.5 rounded-2xl border border-stone-100 text-stone-800">
                <div>
                  <span className="text-[10px] text-stone-600 block uppercase font-medium">
                    {t.capitalNeededLabel}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-stone-900 font-mono">
                    ₹{(idea.minCapital / 1000).toFixed(0)}k - {(idea.maxCapital / 1000).toFixed(0)}k
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-stone-600 block uppercase font-medium">
                    Est. Profit / mo
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-emerald-900 font-mono">
                    ~₹{(idea.projectedMonthlyProfit / 1000).toFixed(0)}k
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-stone-600 block uppercase font-medium">
                    {t.paybackLabel}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-stone-900 font-mono">
                    {idea.estimatedPaybackMonths} mo
                  </span>
                </div>
              </div>

              {/* Local Market Demand & Competitor Intelligence */}
              <div className="space-y-2.5 text-xs text-stone-700 border-t border-stone-100 pt-4">
                <div className="flex items-start gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-stone-900">{t.demandLabel}: </strong>
                    <span>{idea.estimatedDemand} in {userProfile.district || 'district'}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Users className="w-4 h-4 text-indigo-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-stone-900">{t.customersLabel}: </strong>
                    <span>{getLocalizedCustomers(idea)}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Store className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-stone-900">{t.competitorsLabel}: </strong>
                    <span>{getLocalizedCompetitors(idea)}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-stone-900">{t.marketGapLabel}: </strong>
                    <span>{getLocalizedMarketGap(idea)}</span>
                  </div>
                </div>
              </div>

              {/* Data Transparency & Confidence Badge */}
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-100 text-[11px] text-stone-600 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span><strong>Source:</strong> {idea.dataSource}</span>
                  <span className="font-semibold text-stone-700">{idea.confidenceLevel}</span>
                </div>
                <p className="italic text-stone-600">{idea.confidenceNote}</p>
              </div>

              {/* Primary Action Button */}
              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  onClick={() => onSelectBusinessForCalculator(idea)}
                  className="flex-1 py-3 px-4 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs sm:text-sm rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2"
                >
                  <span>{t.openCalculatorBtn}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
