import React, { useState, useEffect } from 'react';
import {
  UserProfile,
  Language,
  BusinessIdea,
  LoanCalculation,
  FeasibilityReport as IFeasibilityReport,
} from './types';
import { TRANSLATIONS } from './i18n/translations';
import { BUSINESS_IDEAS } from './data/businesses';
import { GOVERNMENT_SCHEMES } from './data/schemes';
import {
  getProfileFromDb,
  saveProfileToDb,
  getSavedCalculationsLocal,
  saveLoanCalculationToDb,
  getSavedReportsLocal,
  saveFeasibilityReportToDb,
  getSavedBusinessBookmarksLocal,
  saveBusinessBookmark,
} from './services/supabase';

// Components
import { Header } from './components/Header';
import { WelcomeScreen } from './components/WelcomeScreen';
import { ProfileSetup } from './components/ProfileSetup';
import { AiAdvisor } from './components/AiAdvisor';
import { BusinessList } from './components/BusinessList';
import { BusinessComparison } from './components/BusinessComparison';
import { Calculator } from './components/Calculator';
import { LoanSchemes } from './components/LoanSchemes';
import { FeasibilityReport } from './components/FeasibilityReport';
import { Dashboard } from './components/Dashboard';
import { SupabaseModal } from './components/SupabaseModal';

export default function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [currentTab, setCurrentTab] = useState<string>('welcome');

  // Default initial profile
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: 'user-default-1',
    name: 'Ramesh Patil',
    language: 'en',
    occupation: 'farmer',
    skills: 'Dairy management, tractor operation, basic repair',
    monthlyIncome: 18000,
    investment: 60000,
    loanOpenness: 'yes',
    state: 'Maharashtra',
    district: 'Pune',
    block: 'Baramati',
    village: 'Malegaon Budruk',
    hasGpsPermission: false,
    updatedAt: new Date().toISOString(),
  });

  // Selected business for calculator & report
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessIdea>(BUSINESS_IDEAS[0]);

  // Selected businesses for side-by-side comparison
  const [comparisonPair, setComparisonPair] = useState<[BusinessIdea, BusinessIdea]>([
    BUSINESS_IDEAS[0],
    BUSINESS_IDEAS[1],
  ]);

  // Generated feasibility report
  const [activeReport, setActiveReport] = useState<IFeasibilityReport | null>(null);

  // Saved items
  const [savedCalculations, setSavedCalculations] = useState<LoanCalculation[]>([]);
  const [savedReports, setSavedReports] = useState<IFeasibilityReport[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  // Supabase modal state
  const [supabaseModalOpen, setSupabaseModalOpen] = useState(false);

  // Initialize data on mount
  useEffect(() => {
    async function loadInitialData() {
      const storedProfile = await getProfileFromDb();
      if (storedProfile) {
        setUserProfile(storedProfile);
        if (storedProfile.language) {
          setLanguage(storedProfile.language);
        }
      }
      setSavedCalculations(getSavedCalculationsLocal());
      setSavedReports(getSavedReportsLocal());
      setBookmarkedIds(getSavedBusinessBookmarksLocal());
    }
    loadInitialData();
  }, []);

  // Update profile handler
  const handleSaveProfile = async (updated: UserProfile) => {
    setUserProfile(updated);
    setLanguage(updated.language);
    await saveProfileToDb(updated);
    setCurrentTab('advisor');
  };

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    setUserProfile((prev) => ({ ...prev, language: newLang }));
  };

  // Business List actions
  const handleSelectBusinessForCalculator = (business: BusinessIdea) => {
    setSelectedBusiness(business);
    setCurrentTab('calculator');
  };

  const handleSelectBusinessesForCompare = (b1: BusinessIdea, b2: BusinessIdea) => {
    setComparisonPair([b1, b2]);
    setCurrentTab('compare');
  };

  const handleBookmarkBusiness = async (id: string, title: string) => {
    await saveBusinessBookmark(id, title);
    setBookmarkedIds(getSavedBusinessBookmarksLocal());
  };

  // Save calculation
  const handleSaveCalculation = async (calc: LoanCalculation) => {
    await saveLoanCalculationToDb(calc);
    setSavedCalculations(getSavedCalculationsLocal());
  };

  // Generate Feasibility Report
  const handleGenerateReport = (calc: LoanCalculation) => {
    const reportObj: IFeasibilityReport = {
      id: `dpr-${Date.now()}`,
      createdAt: new Date().toISOString(),
      userProfile,
      business: selectedBusiness,
      calculation: calc,
      recommendedSchemeId:
        selectedBusiness.category === 'agri_processing'
          ? 'pmegp'
          : selectedBusiness.category === 'animal_husbandry'
          ? 'mudra-yojana'
          : 'pmegp',
      swotAnalysis: {
        strengths: [
          `Promoter possesses relevant skills: ${userProfile.skills || 'Practical rural work experience'}.`,
          `High recurring village demand for ${selectedBusiness.title}.`,
          `Low operational overhead when situated in promoter’s own village premises.`,
        ],
        weaknesses: [
          `Limited self-equity (₹${userProfile.investment.toLocaleString('en-IN')}) requires bank leverage.`,
          `Dependence on seasonal harvests and regional electricity stability.`,
        ],
        opportunities: [
          `Credit-linked capital subsidy under ${GOVERNMENT_SCHEMES[0].name}.`,
          `Expanding distribution to neighboring weekly haat markets within 10 km.`,
          `Bulk direct farm-to-door sales avoiding middleman cuts.`,
        ],
        threats: [
          `Sudden raw material price hikes during off-season months.`,
          `Delay in bank loan disbursement without complete paperwork.`,
        ],
      },
      pricingStrategy: `Price service charges or finished goods at a 5-8% discount compared to Tehsil town retail prices to capture village volume, while ensuring at least 22% gross operating margin.`,
      implementationRoadmap: [
        { week: 'Week 1', task: 'Complete Udyam registration & collect 3 competitive machinery quotations.' },
        { week: 'Week 2', task: 'Submit PMEGP / Mudra application on official portal & meet lead bank branch manager.' },
        { week: 'Week 3', task: 'Carry out site electrical wiring, water setup & complete vendor advance for machinery.' },
        { week: 'Week 4', task: 'Receive equipment delivery, conduct trial runs & launch village awareness campaign.' },
      ],
      riskMitigation: [
        {
          risk: 'Power supply cuts during harvest weeks',
          mitigation: 'Install dual power switch or negotiate generator backup sharing with neighboring workshop.',
        },
        {
          risk: 'Delay in customer credit repayments',
          mitigation: 'Implement cash-and-carry or UPI discount policy; limit ledger credit to maximum 7 days.',
        },
      ],
    };

    setActiveReport(reportObj);
    setCurrentTab('report');
  };

  // Save report
  const handleSaveReport = async (report: IFeasibilityReport) => {
    await saveFeasibilityReportToDb(report);
    setSavedReports(getSavedReportsLocal());
  };

  const handleOpenReportFromDashboard = (report: IFeasibilityReport) => {
    setActiveReport(report);
    setCurrentTab('report');
  };

  const handleOpenCalculationFromDashboard = (calc: LoanCalculation) => {
    const matched = BUSINESS_IDEAS.find((b) => b.id === calc.businessId) || BUSINESS_IDEAS[0];
    setSelectedBusiness(matched);
    setCurrentTab('calculator');
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] text-stone-900 flex flex-col selection:bg-emerald-100 selection:text-emerald-900">
      {/* Header complying with Top Bar Contract */}
      <Header
        currentTab={currentTab}
        onTabChange={(tab) => setCurrentTab(tab)}
        language={language}
        onLanguageChange={handleLanguageChange}
        onOpenDatabaseModal={() => setSupabaseModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {currentTab === 'welcome' && (
          <WelcomeScreen
            language={language}
            onLanguageChange={handleLanguageChange}
            onStartDiscovery={() => setCurrentTab('profile')}
            onExploreBusinesses={() => setCurrentTab('businesses')}
          />
        )}

        {currentTab === 'profile' && (
          <ProfileSetup
            profile={userProfile}
            language={language}
            onLanguageChange={handleLanguageChange}
            onSaveProfile={handleSaveProfile}
            onSkipOptional={() => setCurrentTab('advisor')}
          />
        )}

        {currentTab === 'advisor' && (
          <AiAdvisor
            userProfile={userProfile}
            language={language}
            onProceedToRecommendations={() => setCurrentTab('businesses')}
            onEditProfile={() => setCurrentTab('profile')}
          />
        )}

        {currentTab === 'businesses' && (
          <BusinessList
            userProfile={userProfile}
            language={language}
            onSelectBusinessForCalculator={handleSelectBusinessForCalculator}
            onSelectBusinessesForCompare={handleSelectBusinessesForCompare}
            onBookmarkBusiness={handleBookmarkBusiness}
            bookmarkedIds={bookmarkedIds}
          />
        )}

        {currentTab === 'compare' && (
          <BusinessComparison
            businessA={comparisonPair[0]}
            businessB={comparisonPair[1]}
            language={language}
            onSelectBusiness={handleSelectBusinessForCalculator}
            onBackToBusinesses={() => setCurrentTab('businesses')}
          />
        )}

        {currentTab === 'calculator' && (
          <Calculator
            business={selectedBusiness}
            userProfile={userProfile}
            language={language}
            onSaveCalculation={handleSaveCalculation}
            onGenerateReport={handleGenerateReport}
          />
        )}

        {currentTab === 'schemes' && <LoanSchemes language={language} />}

        {currentTab === 'report' && activeReport && (
          <FeasibilityReport
            report={activeReport}
            language={language}
            onSaveReport={handleSaveReport}
          />
        )}

        {currentTab === 'dashboard' && (
          <Dashboard
            userProfile={userProfile}
            language={language}
            savedCalculations={savedCalculations}
            savedReports={savedReports}
            bookmarkedBusinessIds={bookmarkedIds}
            onOpenReport={handleOpenReportFromDashboard}
            onOpenCalculation={handleOpenCalculationFromDashboard}
            onExploreBusinesses={() => setCurrentTab('businesses')}
            onEditProfile={() => setCurrentTab('profile')}
          />
        )}
      </main>

      {/* Supabase Integration & Schema Modal */}
      <SupabaseModal
        isOpen={supabaseModalOpen}
        onClose={() => setSupabaseModalOpen(false)}
      />

      {/* Quiet, Clean Minimal Footer */}
      <footer className="border-t border-stone-200 bg-white py-6 px-4 sm:px-6 lg:px-8 no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-600">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-800">VyapaarSathi</span>
            <span>·</span>
            <span>Rural Business & Loan Advisory Platform</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setSupabaseModalOpen(true)}
              className="hover:text-stone-900 transition-colors"
            >
              Supabase Schema
            </button>
            <button
              onClick={() => setCurrentTab('schemes')}
              className="hover:text-stone-900 transition-colors"
            >
              Govt Portals
            </button>
            <span>© 2026 VyapaarSathi</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
