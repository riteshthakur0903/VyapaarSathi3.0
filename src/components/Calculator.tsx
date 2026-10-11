import React, { useState, useEffect } from 'react';
import { BusinessIdea, CostBreakdown, LoanCalculation, Language, UserProfile } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import {
  Calculator as CalcIcon,
  HelpCircle,
  Save,
  Check,
  FileText,
  Sliders,
  DollarSign,
  TrendingUp,
  Percent,
  Calendar,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';

interface CalculatorProps {
  business: BusinessIdea;
  userProfile: UserProfile;
  language: Language;
  onSaveCalculation: (calc: LoanCalculation) => void;
  onGenerateReport: (calc: LoanCalculation) => void;
}

export const Calculator: React.FC<CalculatorProps> = ({
  business,
  userProfile,
  language,
  onSaveCalculation,
  onGenerateReport,
}) => {
  const t = TRANSLATIONS[language];

  // Editable Cost Breakdown State
  const [costs, setCosts] = useState<CostBreakdown>({ ...business.defaultCosts });

  // Own Investment available
  const [ownCapital, setOwnCapital] = useState<number>(userProfile.investment || 50000);

  // Total Project Cost
  const totalCost =
    (costs.machineryEquipment || 0) +
    (costs.setupCivilElectrification || 0) +
    (costs.initialInventory || 0) +
    (costs.rentDeposit || 0) +
    (costs.licensesRegistrations || 0) +
    (costs.workingCapitalReserve || 0);

  // Funding Gap = Total Cost - Own Capital
  const fundingGap = Math.max(0, totalCost - ownCapital);

  // Loan parameters (Defaults based on funding gap)
  const [loanAmount, setLoanAmount] = useState<number>(fundingGap);
  const [interestRate, setInterestRate] = useState<number>(9.5); // 9.5% standard priority sector bank lending
  const [tenureMonths, setTenureMonths] = useState<number>(36); // 36 months / 3 years

  // Keep loan amount synced when cost or own capital changes initially
  useEffect(() => {
    setLoanAmount(fundingGap);
  }, [totalCost, ownCapital]);

  // Standard Reducing Balance Monthly EMI calculation
  // EMI = P * r * (1 + r)^n / ((1 + r)^n - 1)
  const calculateEmi = (P: number, annualRate: number, n: number): number => {
    if (P <= 0 || n <= 0) return 0;
    const r = annualRate / 12 / 100;
    if (r === 0) return P / n;
    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    return Math.round(emi);
  };

  const monthlyEmi = calculateEmi(loanAmount, interestRate, tenureMonths);
  const totalRepayment = monthlyEmi * tenureMonths;
  const totalInterest = Math.max(0, totalRepayment - loanAmount);

  // Monthly surplus after paying EMI
  const projectedSurplus = business.projectedMonthlyProfit;
  const netFamilyCashflow = projectedSurplus - monthlyEmi;

  // Debt Service Coverage Ratio (DSCR) = Net Operating Income / Monthly Debt Service
  const dscr = monthlyEmi > 0 ? projectedSurplus / monthlyEmi : 99;

  // Feasibility assessment
  let feasibilityRating: 'high' | 'moderate' | 'caution' = 'high';
  let feasibilityReason = '';

  if (dscr >= 2.0) {
    feasibilityRating = 'high';
    feasibilityReason = `High Feasibility: Your estimated monthly business profit (~₹${projectedSurplus.toLocaleString('en-IN')}) is over 2.0x the loan EMI (₹${monthlyEmi.toLocaleString('en-IN')}), leaving a strong safety buffer.`;
  } else if (dscr >= 1.25) {
    feasibilityRating = 'moderate';
    feasibilityReason = `Moderate Feasibility: Estimated profit covers the EMI with a reasonable margin. Ensure working capital reserve is maintained.`;
  } else {
    feasibilityRating = 'caution';
    feasibilityReason = `Caution: The monthly EMI (₹${monthlyEmi.toLocaleString('en-IN')}) consumes over 80% of projected monthly operating surplus. Consider increasing tenure or applying for PMEGP subsidy to lower loan amount.`;
  }

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showAssumptionsModal, setShowAssumptionsModal] = useState(false);

  const currentCalculationObj: LoanCalculation = {
    id: `calc-${Date.now()}`,
    businessId: business.id,
    businessTitle: business.title,
    totalCost,
    ownInvestment: ownCapital,
    fundingGap,
    costBreakdown: costs,
    loanAmount,
    interestRate,
    tenureMonths,
    monthlyEmi,
    totalInterest,
    totalRepayment,
    monthlySurplus: projectedSurplus,
    dscr: parseFloat(dscr.toFixed(2)),
    feasibilityRating,
    feasibilityReason,
    assumptions: [
      'Standard reducing balance monthly amortization schedule.',
      'Priority Sector Lending (PSL) micro-enterprise interest rate assumptions (9.0% - 11.0%).',
      'Does not include 1-2% upfront bank processing fees, stamp duty, or optional loan insurance.',
      'Revenue projections assume standard capacity utilization after a 60-day ramp-up period.',
    ],
    createdAt: new Date().toISOString(),
  };

  const handleSave = () => {
    onSaveCalculation(currentCalculationObj);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
            {business.title}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            {t.calculatorTitle}
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm mt-1">{t.calculatorSubtitle}</p>
        </div>

        <button
          onClick={() => setShowAssumptionsModal(!showAssumptionsModal)}
          className="px-3.5 py-2 rounded-xl border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto shrink-0"
        >
          <HelpCircle className="w-4 h-4 text-emerald-700" />
          <span>{t.assumptionsTitle}</span>
        </button>
      </div>

      {/* Assumptions Banner / Accordion */}
      {showAssumptionsModal && (
        <div className="p-4 bg-stone-100 rounded-2xl border border-stone-200 text-xs text-stone-700 space-y-2">
          <p className="font-bold text-stone-900">Mathematical & Banking Assumptions Used:</p>
          <ul className="list-disc list-inside space-y-1 text-stone-600">
            {currentCalculationObj.assumptions.map((asm, idx) => (
              <li key={idx}>{asm}</li>
            ))}
          </ul>
        </div>
      )}

      {/* 2-Column Split: Cost Breakdown (Left) vs Loan Simulator & Output (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Column: Editable Cost Breakdown */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h2 className="text-sm font-bold text-stone-900">{t.costBreakdownTitle}</h2>
            <span className="text-xs font-mono font-bold text-emerald-950">
              Total: ₹{totalCost.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <div className="flex justify-between font-semibold text-stone-700 mb-1">
                <span>{t.costEquipment}</span>
                <span className="font-mono text-stone-900">
                  ₹{costs.machineryEquipment.toLocaleString('en-IN')}
                </span>
              </div>
              <input
                type="number"
                step="2000"
                value={costs.machineryEquipment}
                onChange={(e) =>
                  setCosts({ ...costs, machineryEquipment: Number(e.target.value) || 0 })
                }
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs font-mono"
              />
            </div>

            <div>
              <div className="flex justify-between font-semibold text-stone-700 mb-1">
                <span>{t.costSetup}</span>
                <span className="font-mono text-stone-900">
                  ₹{costs.setupCivilElectrification.toLocaleString('en-IN')}
                </span>
              </div>
              <input
                type="number"
                step="1000"
                value={costs.setupCivilElectrification}
                onChange={(e) =>
                  setCosts({
                    ...costs,
                    setupCivilElectrification: Number(e.target.value) || 0,
                  })
                }
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs font-mono"
              />
            </div>

            <div>
              <div className="flex justify-between font-semibold text-stone-700 mb-1">
                <span>{t.costInventory}</span>
                <span className="font-mono text-stone-900">
                  ₹{costs.initialInventory.toLocaleString('en-IN')}
                </span>
              </div>
              <input
                type="number"
                step="2000"
                value={costs.initialInventory}
                onChange={(e) =>
                  setCosts({ ...costs, initialInventory: Number(e.target.value) || 0 })
                }
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs font-mono"
              />
            </div>

            <div>
              <div className="flex justify-between font-semibold text-stone-700 mb-1">
                <span>{t.costRent}</span>
                <span className="font-mono text-stone-900">
                  ₹{costs.rentDeposit.toLocaleString('en-IN')}
                </span>
              </div>
              <input
                type="number"
                step="1000"
                value={costs.rentDeposit}
                onChange={(e) =>
                  setCosts({ ...costs, rentDeposit: Number(e.target.value) || 0 })
                }
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs font-mono"
              />
            </div>

            <div>
              <div className="flex justify-between font-semibold text-stone-700 mb-1">
                <span>{t.costLicenses}</span>
                <span className="font-mono text-stone-900">
                  ₹{costs.licensesRegistrations.toLocaleString('en-IN')}
                </span>
              </div>
              <input
                type="number"
                step="500"
                value={costs.licensesRegistrations}
                onChange={(e) =>
                  setCosts({ ...costs, licensesRegistrations: Number(e.target.value) || 0 })
                }
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs font-mono"
              />
            </div>

            <div>
              <div className="flex justify-between font-semibold text-stone-700 mb-1">
                <span>{t.costWorkingCapital}</span>
                <span className="font-mono text-stone-900">
                  ₹{costs.workingCapitalReserve.toLocaleString('en-IN')}
                </span>
              </div>
              <input
                type="number"
                step="2000"
                value={costs.workingCapitalReserve}
                onChange={(e) =>
                  setCosts({ ...costs, workingCapitalReserve: Number(e.target.value) || 0 })
                }
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs font-mono"
              />
            </div>
          </div>

          {/* Self Investment & Gap Card */}
          <div className="bg-stone-50 rounded-2xl p-4 border border-stone-100 space-y-3 text-xs">
            <div>
              <div className="flex justify-between font-semibold text-stone-700 mb-1">
                <span>{t.ownCapitalContribution}</span>
                <span className="font-mono font-bold text-stone-900">
                  ₹{ownCapital.toLocaleString('en-IN')}
                </span>
              </div>
              <input
                type="number"
                step="5000"
                value={ownCapital}
                onChange={(e) => setOwnCapital(Number(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs font-mono bg-white"
              />
            </div>

            <div className="pt-2 border-t border-stone-200 flex justify-between items-center">
              <span className="font-bold text-stone-900">{t.fundingGapLabel}:</span>
              <span className="font-mono font-extrabold text-sm text-amber-900">
                ₹{fundingGap.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive What-If Loan Simulator */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-800" />
                <h2 className="text-sm font-bold text-stone-900">{t.loanParametersTitle}</h2>
              </div>
              <span className="text-[11px] font-semibold text-stone-500">What-if Simulator</span>
            </div>

            {/* Sliders */}
            <div className="space-y-4 text-xs">
              {/* Slider 1: Loan Amount */}
              <div className="space-y-1.5">
                <div className="flex justify-between font-semibold text-stone-700">
                  <span>{t.loanAmountLabel}</span>
                  <span className="font-mono font-bold text-stone-900">
                    ₹{loanAmount.toLocaleString('en-IN')}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={Math.max(totalCost, 500000)}
                  step="5000"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full accent-emerald-800 cursor-pointer"
                />
              </div>

              {/* Slider 2: Interest Rate */}
              <div className="space-y-1.5">
                <div className="flex justify-between font-semibold text-stone-700">
                  <span>{t.interestRateLabel}</span>
                  <span className="font-mono font-bold text-stone-900">{interestRate}% p.a.</span>
                </div>
                <input
                  type="range"
                  min="6.0"
                  max="16.0"
                  step="0.25"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full accent-emerald-800 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-stone-600">
                  <span>6.0% (Subsidized AIF/SHG)</span>
                  <span>9.5% (Mudra/Bank PSL)</span>
                  <span>14.0% (Private NBFC)</span>
                </div>
              </div>

              {/* Slider 3: Tenure Months */}
              <div className="space-y-1.5">
                <div className="flex justify-between font-semibold text-stone-700">
                  <span>{t.tenureLabel}</span>
                  <span className="font-mono font-bold text-stone-900">
                    {tenureMonths} Months ({(tenureMonths / 12).toFixed(1)} Yrs)
                  </span>
                </div>
                <input
                  type="range"
                  min="12"
                  max="84"
                  step="6"
                  value={tenureMonths}
                  onChange={(e) => setTenureMonths(Number(e.target.value))}
                  className="w-full accent-emerald-800 cursor-pointer"
                />
              </div>
            </div>

            {/* Core Calculated Results Card */}
            <div className="bg-gradient-to-br from-emerald-900 to-teal-950 text-white rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-emerald-200 font-medium">
                    {t.monthlyEmiLabel}
                  </span>
                  <div className="text-3xl font-extrabold font-mono tracking-tight mt-0.5">
                    ₹{monthlyEmi.toLocaleString('en-IN')}
                    <span className="text-xs font-normal text-emerald-200 font-sans"> / month</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-emerald-300 block">Total Interest</span>
                  <span className="text-sm font-bold font-mono">
                    ₹{totalInterest.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-emerald-800/60 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-emerald-300 block text-[10px]">Projected Monthly Profit</span>
                  <span className="font-mono font-bold text-white">
                    ~₹{projectedSurplus.toLocaleString('en-IN')}
                  </span>
                </div>
                <div>
                  <span className="text-emerald-300 block text-[10px]">Net Cashflow After EMI</span>
                  <span className="font-mono font-bold text-emerald-300">
                    ~₹{netFamilyCashflow.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            {/* Feasibility Assessment Alert */}
            <div
              className={`p-4 rounded-2xl border text-xs leading-relaxed flex items-start gap-3 ${
                feasibilityRating === 'high'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                  : feasibilityRating === 'moderate'
                  ? 'bg-amber-50 border-amber-200 text-amber-950'
                  : 'bg-rose-50 border-rose-200 text-rose-950'
              }`}
            >
              <div className="shrink-0 mt-0.5">
                {feasibilityRating === 'high' ? (
                  <ShieldCheck className="w-5 h-5 text-emerald-700" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-700" />
                )}
              </div>
              <div className="space-y-1">
                <span className="font-bold block">{feasibilityReason}</span>
                <span className="text-[11px] opacity-80 block">
                  Debt Service Coverage Ratio (DSCR): {dscr.toFixed(2)}x (Recommended: &gt; 1.5x)
                </span>
              </div>
            </div>

            {/* Actions: Save & Generate Report */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleSave}
                className="flex-1 py-3 px-4 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-700" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>{t.saveCalculationBtn}</span>
                  </>
                )}
              </button>

              <button
                onClick={() => onGenerateReport(currentCalculationObj)}
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <FileText className="w-4 h-4" />
                <span>{t.generateReportBtn}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
