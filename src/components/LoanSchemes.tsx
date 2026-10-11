import React, { useState } from 'react';
import { GovernmentScheme, Language } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { GOVERNMENT_SCHEMES } from '../data/schemes';
import {
  Award,
  ExternalLink,
  CheckSquare,
  Square,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  FileCheck,
  Building,
  AlertCircle,
} from 'lucide-react';

interface LoanSchemesProps {
  language: Language;
}

export const LoanSchemes: React.FC<LoanSchemesProps> = ({ language }) => {
  const t = TRANSLATIONS[language];

  const [expandedSchemeId, setExpandedSchemeId] = useState<string>(GOVERNMENT_SCHEMES[0].id);
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({});

  const toggleDoc = (docName: string) => {
    setCheckedDocs((prev) => ({ ...prev, [docName]: !prev[docName] }));
  };

  const getLocalizedName = (s: GovernmentScheme) => {
    if (language === 'hi') return s.nameHi;
    if (language === 'mr') return s.nameMr;
    return s.name;
  };

  const getLocalizedSubsidy = (s: GovernmentScheme) => {
    if (language === 'hi') return s.maxSubsidyTextHi;
    if (language === 'mr') return s.maxSubsidyTextMr;
    return s.maxSubsidyText;
  };

  const getLocalizedEligibility = (s: GovernmentScheme) => {
    if (language === 'hi') return s.eligibilityCriteriaHi;
    if (language === 'mr') return s.eligibilityCriteriaMr;
    return s.eligibilityCriteria;
  };

  const getLocalizedDocs = (s: GovernmentScheme) => {
    if (language === 'hi') return s.requiredDocumentsHi;
    if (language === 'mr') return s.requiredDocumentsMr;
    return s.requiredDocuments;
  };

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          {t.schemesTitle}
        </h1>
        <p className="text-stone-600 text-xs sm:text-sm mt-1 max-w-2xl">
          {t.schemesSubtitle}
        </p>
      </div>

      {/* Official Guidelines Disclaimer */}
      <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200 text-xs text-emerald-950 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold">Official Government Sources Verified:</span>
          <p>{t.sampleNotice}</p>
        </div>
      </div>

      {/* Schemes List Accordion Cards */}
      <div className="space-y-4">
        {GOVERNMENT_SCHEMES.map((scheme) => {
          const isExpanded = expandedSchemeId === scheme.id;
          const docs = getLocalizedDocs(scheme);
          const eligibility = getLocalizedEligibility(scheme);

          return (
            <div
              key={scheme.id}
              className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden transition-all"
            >
              {/* Header Bar */}
              <div
                onClick={() => setExpandedSchemeId(isExpanded ? '' : scheme.id)}
                className="p-5 sm:p-6 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-stone-50/50 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wide">
                      {scheme.agency}
                    </span>
                    <span aria-hidden="true" className="text-stone-300">·</span>
                    <span className="text-[11px] font-medium text-stone-500">
                      {scheme.isVerifiedOfficial ? t.verifiedBadge : 'Standard Benchmark'}
                    </span>
                  </div>

                  <h2 className="text-base sm:text-lg font-bold text-stone-900">
                    {getLocalizedName(scheme)}
                  </h2>
                  <p className="text-xs text-stone-600">{scheme.tagline}</p>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right hidden sm:block">
                    <span className="text-[10px] text-stone-500 block uppercase font-medium">
                      Benefit
                    </span>
                    <span className="text-xs font-bold text-emerald-900 font-mono">
                      {scheme.maxSubsidyText.split('(')[0]}
                    </span>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-600">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {/* Expanded Detail Section */}
              {isExpanded && (
                <div className="px-5 pb-6 sm:px-6 pt-2 border-t border-stone-100 space-y-6 text-xs text-stone-800">
                  {/* Highlights Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-stone-50 p-4 rounded-2xl border border-stone-200">
                    <div>
                      <span className="text-[10px] text-stone-600 uppercase font-semibold block">
                        {t.subsidyBenefitLabel}
                      </span>
                      <span className="text-xs font-bold text-emerald-900 font-mono">
                        {getLocalizedSubsidy(scheme)}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-stone-600 uppercase font-semibold block">
                        {t.loanCeilingLabel}
                      </span>
                      <span className="text-xs font-bold text-stone-900 font-mono">
                        {scheme.maxLoanText}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-stone-600 uppercase font-semibold block">
                        Interest Subvention
                      </span>
                      <span className="text-xs font-medium text-stone-700">
                        {scheme.interestSubvention}
                      </span>
                    </div>
                  </div>

                  {/* 2-Column Split: Eligibility vs Document Checklist */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Key Eligibility */}
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                        <CheckSquare className="w-3.5 h-3.5 text-emerald-800" />
                        <span>Key Eligibility Criteria</span>
                      </h3>
                      <ul className="space-y-2 text-stone-700">
                        {eligibility.map((crit, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-emerald-700 font-bold">•</span>
                            <span>{crit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Interactive Document Checklist */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                          <FileCheck className="w-3.5 h-3.5 text-indigo-700" />
                          <span>{t.documentsChecklistTitle}</span>
                        </h3>
                        <span className="text-[10px] text-stone-500">Tap to check off</span>
                      </div>

                      <div className="space-y-2">
                        {docs.map((doc, idx) => {
                          const isDone = !!checkedDocs[`${scheme.id}-${idx}`];
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => toggleDoc(`${scheme.id}-${idx}`)}
                              className={`w-full p-2.5 rounded-xl border text-left text-xs flex items-center gap-2.5 transition-colors ${
                                isDone
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-medium'
                                  : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                              }`}
                            >
                              {isDone ? (
                                <CheckSquare className="w-4 h-4 text-emerald-700 shrink-0" />
                              ) : (
                                <Square className="w-4 h-4 text-stone-400 shrink-0" />
                              )}
                              <span>{doc}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Application Steps */}
                  <div className="space-y-2 pt-2 border-t border-stone-100">
                    <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                      {t.stepsTitle}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
                      {scheme.applicationSteps.map((step, idx) => (
                        <div
                          key={idx}
                          className="bg-stone-50 p-2.5 rounded-xl border border-stone-200 text-[11px] text-stone-700"
                        >
                          {step}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* External Official Link Button */}
                  <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-stone-100">
                    <span className="text-[11px] text-stone-600">
                      Always submit official applications via the secure government portal:
                    </span>
                    <a
                      href={scheme.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs rounded-xl flex items-center gap-2 transition-colors shrink-0"
                    >
                      <span>{t.officialPortalBtn}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
