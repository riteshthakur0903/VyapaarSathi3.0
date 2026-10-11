import React from 'react';
import { BusinessIdea, Language } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { Scale, Check, ArrowRight, ArrowLeft, TrendingUp, AlertTriangle } from 'lucide-react';

interface BusinessComparisonProps {
  businessA: BusinessIdea;
  businessB: BusinessIdea;
  language: Language;
  onSelectBusiness: (business: BusinessIdea) => void;
  onBackToBusinesses: () => void;
}

export const BusinessComparison: React.FC<BusinessComparisonProps> = ({
  businessA,
  businessB,
  language,
  onSelectBusiness,
  onBackToBusinesses,
}) => {
  const t = TRANSLATIONS[language];

  const getLocalizedTitle = (b: BusinessIdea) => {
    if (language === 'hi') return b.titleHi;
    if (language === 'mr') return b.titleMr;
    return b.title;
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

  const comparisonRows = [
    {
      label: 'Estimated Capital Range',
      valA: `₹${(businessA.minCapital / 1000).toFixed(0)}k - ${(businessA.maxCapital / 1000).toFixed(0)}k`,
      valB: `₹${(businessB.minCapital / 1000).toFixed(0)}k - ${(businessB.maxCapital / 1000).toFixed(0)}k`,
      isMono: true,
    },
    {
      label: 'Estimated Payback Period',
      valA: `${businessA.estimatedPaybackMonths} Months`,
      valB: `${businessB.estimatedPaybackMonths} Months`,
      isMono: true,
    },
    {
      label: 'Projected Monthly Operating Profit',
      valA: `~₹${businessA.projectedMonthlyProfit.toLocaleString('en-IN')}`,
      valB: `~₹${businessB.projectedMonthlyProfit.toLocaleString('en-IN')}`,
      isMono: true,
    },
    {
      label: 'Local Demand Status',
      valA: businessA.estimatedDemand,
      valB: businessB.estimatedDemand,
      isMono: false,
    },
    {
      label: 'Potential Customer Base',
      valA: getLocalizedCustomers(businessA),
      valB: getLocalizedCustomers(businessB),
      isMono: false,
    },
    {
      label: 'Competitor Density & Gap',
      valA: getLocalizedCompetitors(businessA),
      valB: getLocalizedCompetitors(businessB),
      isMono: false,
    },
    {
      label: 'Identified Village Market Opportunity',
      valA: getLocalizedMarketGap(businessA),
      valB: getLocalizedMarketGap(businessB),
      isMono: false,
    },
    {
      label: 'Key Machinery Needed',
      valA: businessA.equipmentList.slice(0, 3).join(', '),
      valB: businessB.equipmentList.slice(0, 3).join(', '),
      isMono: false,
    },
    {
      label: 'Prerequisite Skills',
      valA: businessA.requiredSkills.slice(0, 2).join(', '),
      valB: businessB.requiredSkills.slice(0, 2).join(', '),
      isMono: false,
    },
    {
      label: 'Primary Risk Factor',
      valA: businessA.risks[0],
      valB: businessB.risks[0],
      isMono: false,
    },
  ];

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8">
      {/* Back Button & Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToBusinesses}
          className="text-stone-600 hover:text-stone-900 text-xs font-semibold flex items-center gap-1.5 py-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Ideas</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
          <Scale className="w-4 h-4" />
          <span>Side-by-Side Evaluation</span>
        </div>
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          Compare Business Ideas Side by Side
        </h1>
        <p className="text-stone-600 text-xs sm:text-sm">
          Contrast financial commitments, equipment requirements, and local market demand before making your choice.
        </p>
      </div>

      {/* Comparison Matrix Table */}
      <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs">
        {/* Table Header: The Two Businesses */}
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-stone-200 bg-stone-50 border-b border-stone-200 p-6">
          <div className="space-y-3 pb-4 md:pb-0 md:pr-6">
            <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider">
              Option 1 · {businessA.category.replace('_', ' ')}
            </span>
            <h2 className="text-xl font-bold text-stone-900">{getLocalizedTitle(businessA)}</h2>
            <p className="text-xs text-stone-600">{businessA.tagline}</p>
            <button
              onClick={() => onSelectBusiness(businessA)}
              className="mt-2 w-full py-2.5 px-4 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <span>Calculate Option 1</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 pt-4 md:pt-0 md:pl-6">
            <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider">
              Option 2 · {businessB.category.replace('_', ' ')}
            </span>
            <h2 className="text-xl font-bold text-stone-900">{getLocalizedTitle(businessB)}</h2>
            <p className="text-xs text-stone-600">{businessB.tagline}</p>
            <button
              onClick={() => onSelectBusiness(businessB)}
              className="mt-2 w-full py-2.5 px-4 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <span>Calculate Option 2</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Detailed Rows */}
        <div className="divide-y divide-stone-100 text-xs">
          {comparisonRows.map((row, idx) => (
            <div
              key={idx}
              className={`grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-stone-100 ${
                idx % 2 === 0 ? 'bg-white' : 'bg-stone-50/50'
              }`}
            >
              <div className="p-4 sm:p-5 space-y-1">
                <span className="text-[11px] font-bold text-stone-600 block uppercase tracking-wider">
                  {row.label}
                </span>
                <p
                  className={`text-stone-900 font-medium ${
                    row.isMono ? 'font-mono text-sm font-bold text-emerald-900' : 'text-xs'
                  }`}
                >
                  {row.valA}
                </p>
              </div>

              <div className="p-4 sm:p-5 space-y-1">
                <span className="text-[11px] font-bold text-stone-600 block uppercase tracking-wider md:hidden">
                  {row.label}
                </span>
                <p
                  className={`text-stone-900 font-medium ${
                    row.isMono ? 'font-mono text-sm font-bold text-emerald-900' : 'text-xs'
                  }`}
                >
                  {row.valB}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
