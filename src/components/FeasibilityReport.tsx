import React, { useState } from 'react';
import { FeasibilityReport as IFeasibilityReport, Language } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import {
  Printer,
  Save,
  Check,
  Share2,
  MapPin,
  Calendar,
  Building,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  Lightbulb,
  FileCheck,
} from 'lucide-react';

interface FeasibilityReportProps {
  report: IFeasibilityReport;
  language: Language;
  onSaveReport: (report: IFeasibilityReport) => void;
}

export const FeasibilityReport: React.FC<FeasibilityReportProps> = ({
  report,
  language,
  onSaveReport,
}) => {
  const t = TRANSLATIONS[language];
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const { userProfile, business, calculation, swotAnalysis, implementationRoadmap, riskMitigation } = report;

  const handlePrint = () => {
    window.print();
  };

  const handleSave = () => {
    onSaveReport(report);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${business.title} - Feasibility Report`,
        text: `VyapaarSathi Feasibility Report for ${business.title} in ${userProfile.district}, ${userProfile.state}. Total Cost: ₹${calculation.totalCost.toLocaleString('en-IN')}, EMI: ₹${calculation.monthlyEmi.toLocaleString('en-IN')}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(
        `VyapaarSathi Feasibility Report for ${business.title}\nLocation: ${userProfile.district}, ${userProfile.state}\nTotal Project Cost: ₹${calculation.totalCost.toLocaleString('en-IN')}\nMonthly EMI: ₹${calculation.monthlyEmi.toLocaleString('en-IN')}`
      );
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8 print:p-0 print:max-w-none">
      {/* Top Action Bar (Hidden when printing) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
            Project Feasibility Report
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            {t.reportTitle}
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm">{t.reportSubtitle}</p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleShare}
            className="px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5 text-stone-600" />
            <span>{copiedLink ? 'Copied!' : 'Share'}</span>
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            {savedSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-700" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5 text-stone-600" />
                <span>{t.saveReportBtn}</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{t.printReportBtn}</span>
          </button>
        </div>
      </div>

      {/* Printable Report Document Card */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-10 space-y-8 shadow-xs print-page print:border-none print:shadow-none">
        {/* Report Document Header */}
        <div className="border-b border-stone-200 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-900 text-white">
                VYAPAARSATHI
              </span>
              <span className="text-xs text-stone-600 font-mono">DPR-{report.id.slice(-6).toUpperCase()}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 mt-2">
              {business.title}
            </h2>
            <p className="text-xs text-stone-600 mt-0.5">{business.tagline}</p>
          </div>

          <div className="text-left sm:text-right text-xs text-stone-600 space-y-1">
            <p>
              <strong>Date:</strong> {new Date(report.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
            </p>
            <p>
              <strong>Prepared For:</strong> {userProfile.name}
            </p>
            <p>
              <strong>Location:</strong> {userProfile.village ? `${userProfile.village}, ` : ''}
              {userProfile.block ? `Block ${userProfile.block}, ` : ''}
              {userProfile.district}, {userProfile.state}
            </p>
          </div>
        </div>

        {/* Section 1: Executive Summary & Rationale */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider border-b border-stone-100 pb-1">
            1. Executive Summary & Business Rationale
          </h3>
          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
            This project report outlines the establishment of a <strong>{business.title}</strong> in{' '}
            <strong>
              {userProfile.district}, {userProfile.state}
            </strong>. The proposed enterprise matches the promoter’s existing skills (
            {userProfile.skills || 'hands-on agricultural / local operations'}) and available equity capital of ₹
            {calculation.ownInvestment.toLocaleString('en-IN')}. The village and tehsil face a distinct market gap:{' '}
            {business.marketGaps}.
          </p>
        </div>

        {/* Section 2: Local Market Demand & Competitor Intelligence */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider border-b border-stone-100 pb-1">
            2. Local Market Analysis & Competitor Mapping
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100 space-y-1.5">
              <span className="font-bold text-stone-900 block">Target Customer Segments</span>
              <p className="text-stone-700">{business.potentialCustomers}</p>
            </div>
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100 space-y-1.5">
              <span className="font-bold text-stone-900 block">Competitor Density & Supply Barrier</span>
              <p className="text-stone-700">{business.competitorDetail}</p>
            </div>
          </div>
        </div>

        {/* Section 3: Financial Capital Breakdown Table */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider border-b border-stone-100 pb-1">
            3. Project Capital Cost Breakdown
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-stone-200 text-stone-600 bg-stone-50">
                  <th className="py-2.5 px-3 font-semibold">Expense Component</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Estimated Amount (₹)</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Share of Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-mono">
                <tr>
                  <td className="py-2 px-3 font-sans text-stone-800">Machinery & Core Equipment</td>
                  <td className="py-2 px-3 text-right">₹{calculation.costBreakdown.machineryEquipment.toLocaleString('en-IN')}</td>
                  <td className="py-2 px-3 text-right text-stone-600">
                    {((calculation.costBreakdown.machineryEquipment / calculation.totalCost) * 100).toFixed(1)}%
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-sans text-stone-800">Shop Setup, Shed & Electrification</td>
                  <td className="py-2 px-3 text-right">₹{calculation.costBreakdown.setupCivilElectrification.toLocaleString('en-IN')}</td>
                  <td className="py-2 px-3 text-right text-stone-600">
                    {((calculation.costBreakdown.setupCivilElectrification / calculation.totalCost) * 100).toFixed(1)}%
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-sans text-stone-800">Initial Inventory / Raw Stock</td>
                  <td className="py-2 px-3 text-right">₹{calculation.costBreakdown.initialInventory.toLocaleString('en-IN')}</td>
                  <td className="py-2 px-3 text-right text-stone-600">
                    {((calculation.costBreakdown.initialInventory / calculation.totalCost) * 100).toFixed(1)}%
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-sans text-stone-800">Premises Advance / Lease Deposit</td>
                  <td className="py-2 px-3 text-right">₹{calculation.costBreakdown.rentDeposit.toLocaleString('en-IN')}</td>
                  <td className="py-2 px-3 text-right text-stone-600">
                    {((calculation.costBreakdown.rentDeposit / calculation.totalCost) * 100).toFixed(1)}%
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-sans text-stone-800">Licenses & Registrations (FSSAI/Udyam)</td>
                  <td className="py-2 px-3 text-right">₹{calculation.costBreakdown.licensesRegistrations.toLocaleString('en-IN')}</td>
                  <td className="py-2 px-3 text-right text-stone-600">
                    {((calculation.costBreakdown.licensesRegistrations / calculation.totalCost) * 100).toFixed(1)}%
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-sans text-stone-800">Working Capital Reserve Cushion</td>
                  <td className="py-2 px-3 text-right">₹{calculation.costBreakdown.workingCapitalReserve.toLocaleString('en-IN')}</td>
                  <td className="py-2 px-3 text-right text-stone-600">
                    {((calculation.costBreakdown.workingCapitalReserve / calculation.totalCost) * 100).toFixed(1)}%
                  </td>
                </tr>
                <tr className="font-bold bg-stone-50 border-t border-stone-200">
                  <td className="py-2.5 px-3 font-sans text-stone-900">Total Project Outlay</td>
                  <td className="py-2.5 px-3 text-right text-emerald-950 font-bold">
                    ₹{calculation.totalCost.toLocaleString('en-IN')}
                  </td>
                  <td className="py-2.5 px-3 text-right">100%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 4: Financing Structure, Loan & EMI */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider border-b border-stone-100 pb-1">
            4. Financing Structure, Repayment & EMI Viability
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-stone-50 p-4 rounded-2xl border border-stone-100 text-xs">
            <div>
              <span className="text-[10px] text-stone-600 block uppercase font-medium">Own Contribution</span>
              <span className="text-sm font-bold text-stone-900 font-mono">
                ₹{calculation.ownInvestment.toLocaleString('en-IN')}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-stone-600 block uppercase font-medium">Proposed Loan</span>
              <span className="text-sm font-bold text-stone-900 font-mono">
                ₹{calculation.loanAmount.toLocaleString('en-IN')}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-stone-600 block uppercase font-medium">Monthly EMI</span>
              <span className="text-sm font-bold text-emerald-900 font-mono">
                ₹{calculation.monthlyEmi.toLocaleString('en-IN')}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-stone-600 block uppercase font-medium">Tenure & Rate</span>
              <span className="text-xs font-bold text-stone-800 font-mono">
                {calculation.tenureMonths} Mo @ {calculation.interestRate}%
              </span>
            </div>
          </div>
          <p className="text-xs text-stone-600 mt-1 italic">{calculation.feasibilityReason}</p>
        </div>

        {/* Section 5: SWOT Analysis Grid */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider border-b border-stone-100 pb-1">
            5. SWOT Analysis Matrix
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Strengths */}
            <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 space-y-1.5">
              <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-700" />
                <span>Strengths</span>
              </span>
              <ul className="list-disc list-inside space-y-1 text-emerald-900/90">
                {swotAnalysis.strengths.map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-100 space-y-1.5">
              <span className="font-bold text-amber-950 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                <span>Weaknesses / Constraints</span>
              </span>
              <ul className="list-disc list-inside space-y-1 text-amber-900/90">
                {swotAnalysis.weaknesses.map((w, idx) => (
                  <li key={idx}>{w}</li>
                ))}
              </ul>
            </div>

            {/* Opportunities */}
            <div className="bg-teal-50/50 p-4 rounded-2xl border border-teal-100 space-y-1.5">
              <span className="font-bold text-teal-950 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-teal-700" />
                <span>Market Opportunities</span>
              </span>
              <ul className="list-disc list-inside space-y-1 text-teal-900/90">
                {swotAnalysis.opportunities.map((o, idx) => (
                  <li key={idx}>{o}</li>
                ))}
              </ul>
            </div>

            {/* Threats */}
            <div className="bg-rose-50/50 p-4 rounded-2xl border border-rose-100 space-y-1.5">
              <span className="font-bold text-rose-950 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-rose-700" />
                <span>External Threats & Risks</span>
              </span>
              <ul className="list-disc list-inside space-y-1 text-rose-900/90">
                {swotAnalysis.threats.map((t, idx) => (
                  <li key={idx}>{t}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Section 6: Risk Mitigation */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider border-b border-stone-100 pb-1">
            6. Risk Factors & Practical Mitigations
          </h3>
          <div className="space-y-2 text-xs">
            {riskMitigation.map((rm, idx) => (
              <div key={idx} className="bg-stone-50 p-3 rounded-xl border border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="font-semibold text-rose-950">⚠️ Risk: {rm.risk}</span>
                <span className="text-emerald-950">✅ Mitigation: {rm.mitigation}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 7: Suggested Pricing Strategy */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider border-b border-stone-100 pb-1">
            7. Suggested Pricing Strategy
          </h3>
          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed bg-stone-50 p-4 rounded-2xl border border-stone-100">
            {report.pricingStrategy}
          </p>
        </div>

        {/* Section 8: 30-Day Step-by-Step Action Roadmap */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider border-b border-stone-100 pb-1">
            8. Immediate 30-Day Implementation Roadmap
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            {implementationRoadmap.map((step, idx) => (
              <div key={idx} className="bg-stone-50 p-3.5 rounded-2xl border border-stone-100 space-y-1">
                <span className="font-bold text-emerald-800 uppercase text-[10px] block">
                  {step.week}
                </span>
                <p className="text-stone-700 leading-relaxed">{step.task}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Document Footer Disclaimer */}
        <div className="pt-6 border-t border-stone-200 text-[11px] text-stone-600 leading-relaxed">
          <p>
            <strong>Note on Feasibility:</strong> This document is an advisory assessment formulated by VyapaarSathi based on official KVIC model project benchmarks and rural credit guidelines. It serves as an informative business blueprint. Final loan sanctions and subsidy disbursements depend on the commercial bank branch’s appraisal, credit score verification, and government portal quotas.
          </p>
        </div>
      </div>
    </div>
  );
};
