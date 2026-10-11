import React from 'react';
import { UserProfile, Language, LoanCalculation, FeasibilityReport, BusinessIdea } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { BUSINESS_IDEAS } from '../data/businesses';
import {
  FileText,
  Calculator,
  Bookmark,
  MapPin,
  ArrowRight,
  Printer,
  Calendar,
  DollarSign,
  TrendingUp,
  User,
  PlusCircle,
} from 'lucide-react';

interface DashboardProps {
  userProfile: UserProfile;
  language: Language;
  savedCalculations: LoanCalculation[];
  savedReports: FeasibilityReport[];
  bookmarkedBusinessIds: string[];
  onOpenReport: (report: FeasibilityReport) => void;
  onOpenCalculation: (calc: LoanCalculation) => void;
  onExploreBusinesses: () => void;
  onEditProfile: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  userProfile,
  language,
  savedCalculations,
  savedReports,
  bookmarkedBusinessIds,
  onOpenReport,
  onOpenCalculation,
  onExploreBusinesses,
  onEditProfile,
}) => {
  const t = TRANSLATIONS[language];

  const bookmarkedBusinesses = BUSINESS_IDEAS.filter((b) =>
    bookmarkedBusinessIds.includes(b.id)
  );

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            {t.dashboardTitle}
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm mt-1">{t.dashboardSubtitle}</p>
        </div>

        <button
          onClick={onExploreBusinesses}
          className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-xs self-start sm:self-auto shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Business Evaluation</span>
        </button>
      </div>

      {/* User Profile Card */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-2xl shrink-0">
            {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-stone-900">{userProfile.name || 'Rural Entrepreneur'}</h2>
              <span className="text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md capitalize">
                {userProfile.occupation.replace('_', ' ')}
              </span>
            </div>
            <p className="text-xs text-stone-600 mt-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-stone-600 shrink-0" />
              <span>
                {userProfile.village ? `${userProfile.village}, ` : ''}
                {userProfile.block ? `Block ${userProfile.block}, ` : ''}
                {userProfile.district}, {userProfile.state}
              </span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs pt-4 md:pt-0 border-t md:border-t-0 border-stone-100">
          <div className="bg-stone-50 p-3 rounded-2xl border border-stone-100">
            <span className="text-[10px] text-stone-600 block uppercase font-medium">Available Capital</span>
            <span className="font-bold text-stone-900 font-mono text-sm">
              ₹{userProfile.investment.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="bg-stone-50 p-3 rounded-2xl border border-stone-100">
            <span className="text-[10px] text-stone-600 block uppercase font-medium">Monthly Household Income</span>
            <span className="font-bold text-stone-900 font-mono text-sm">
              ₹{(userProfile.monthlyIncome || 0).toLocaleString('en-IN')}
            </span>
          </div>

          <button
            onClick={onEditProfile}
            className="px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-semibold transition-colors"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* 2-Column Split: Saved Feasibility Reports & Loan Calculations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Saved Feasibility Reports */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-800" />
              <h2 className="text-sm font-bold text-stone-900">Saved Feasibility Reports</h2>
            </div>
            <span className="text-xs font-mono text-stone-600">{savedReports.length} reports</span>
          </div>

          {savedReports.length === 0 ? (
            <div className="py-8 text-center text-xs text-stone-600 space-y-2">
              <p>{t.noSavedReports}</p>
              <button
                onClick={onExploreBusinesses}
                className="text-emerald-800 font-semibold hover:underline"
              >
                Start an evaluation now →
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {savedReports.map((report) => (
                <div
                  key={report.id}
                  className="p-4 rounded-2xl border border-stone-200 hover:border-emerald-300 transition-colors flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <h3 className="text-xs font-bold text-stone-900">{report.business.title}</h3>
                    <div className="flex items-center gap-2 text-[11px] text-stone-600">
                      <span>Total: ₹{report.calculation.totalCost.toLocaleString('en-IN')}</span>
                      <span aria-hidden="true">·</span>
                      <span>EMI: ₹{report.calculation.monthlyEmi.toLocaleString('en-IN')}/mo</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onOpenReport(report)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 text-xs font-semibold flex items-center gap-1 transition-colors shrink-0"
                  >
                    <span>View DPR</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Saved Loan Calculations */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-emerald-800" />
              <h2 className="text-sm font-bold text-stone-900">Saved Cost & EMI Calculations</h2>
            </div>
            <span className="text-xs font-mono text-stone-600">
              {savedCalculations.length} scenarios
            </span>
          </div>

          {savedCalculations.length === 0 ? (
            <div className="py-8 text-center text-xs text-stone-600 space-y-2">
              <p>{t.noSavedCalculations}</p>
              <button
                onClick={onExploreBusinesses}
                className="text-emerald-800 font-semibold hover:underline"
              >
                Run a loan simulation →
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {savedCalculations.map((calc) => (
                <div
                  key={calc.id}
                  className="p-4 rounded-2xl border border-stone-200 hover:border-emerald-300 transition-colors flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <h3 className="text-xs font-bold text-stone-900">{calc.businessTitle}</h3>
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-stone-600 font-mono">
                      <span>Loan: ₹{calc.loanAmount.toLocaleString('en-IN')}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-bold text-emerald-900">
                        EMI: ₹{calc.monthlyEmi.toLocaleString('en-IN')}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{calc.tenureMonths} Mo @ {calc.interestRate}%</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onOpenCalculation(calc)}
                    className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold flex items-center gap-1 transition-colors shrink-0"
                  >
                    <span>Recall</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
