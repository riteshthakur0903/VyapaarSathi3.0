export type Language = 'en' | 'hi' | 'mr';

export type Occupation =
  | 'farmer'
  | 'daily_wager'
  | 'artisan'
  | 'shopkeeper'
  | 'homemaker'
  | 'unemployed_youth'
  | 'driver_operator'
  | 'other';

export interface UserProfile {
  id: string;
  name: string;
  language: Language;
  occupation: Occupation;
  skills: string;
  monthlyIncome: number;
  investment: number;
  loanOpenness: 'yes' | 'unsure' | 'no';
  state: string;
  district: string;
  block: string;
  village: string;
  hasGpsPermission: boolean;
  latitude?: number;
  longitude?: number;
  updatedAt: string;
}

export interface CostBreakdown {
  machineryEquipment: number;
  setupCivilElectrification: number;
  initialInventory: number;
  rentDeposit: number;
  licensesRegistrations: number;
  workingCapitalReserve: number;
}

export interface BusinessIdea {
  id: string;
  title: string;
  titleHi: string;
  titleMr: string;
  category: 'agri_processing' | 'retail_services' | 'animal_husbandry' | 'manufacturing' | 'clean_tech';
  tagline: string;
  taglineHi: string;
  taglineMr: string;
  minCapital: number;
  maxCapital: number;
  estimatedDemand: 'High' | 'Moderate' | 'Seasonal' | 'Growing';
  potentialCustomers: string;
  potentialCustomersHi: string;
  potentialCustomersMr: string;
  competitorDensity: 'Low' | 'Moderate' | 'High';
  competitorDetail: string;
  competitorDetailHi: string;
  competitorDetailMr: string;
  marketGaps: string;
  marketGapsHi: string;
  marketGapsMr: string;
  requiredSkills: string[];
  equipmentList: string[];
  opportunities: string[];
  risks: string[];
  defaultCosts: CostBreakdown;
  projectedMonthlyRevenue: number;
  projectedMonthlyExpense: number;
  projectedMonthlyProfit: number;
  estimatedPaybackMonths: number;
  dataSource: string;
  confidenceLevel: 'District Benchmark' | 'Pilot Estimate' | 'Government Model Project';
  confidenceNote: string;
}

export interface LoanCalculation {
  id: string;
  businessId: string;
  businessTitle: string;
  totalCost: number;
  ownInvestment: number;
  fundingGap: number;
  costBreakdown: CostBreakdown;
  loanAmount: number;
  interestRate: number;
  tenureMonths: number;
  monthlyEmi: number;
  totalInterest: number;
  totalRepayment: number;
  monthlySurplus: number;
  dscr: number; // Debt Service Coverage Ratio
  feasibilityRating: 'high' | 'moderate' | 'caution';
  feasibilityReason: string;
  assumptions: string[];
  createdAt: string;
}

export interface GovernmentScheme {
  id: string;
  name: string;
  nameHi: string;
  nameMr: string;
  agency: string;
  tagline: string;
  maxSubsidyText: string;
  maxSubsidyTextHi: string;
  maxSubsidyTextMr: string;
  maxLoanText: string;
  targetAudience: string;
  interestSubvention: string;
  eligibilityCriteria: string[];
  eligibilityCriteriaHi: string[];
  eligibilityCriteriaMr: string[];
  requiredDocuments: string[];
  requiredDocumentsHi: string[];
  requiredDocumentsMr: string[];
  applicationSteps: string[];
  officialUrl: string;
  isVerifiedOfficial: boolean;
  notes: string;
}

export interface FeasibilityReport {
  id: string;
  createdAt: string;
  userProfile: UserProfile;
  business: BusinessIdea;
  calculation: LoanCalculation;
  recommendedSchemeId: string;
  swotAnalysis: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  pricingStrategy: string;
  implementationRoadmap: {
    week: string;
    task: string;
  }[];
  riskMitigation: {
    risk: string;
    mitigation: string;
  }[];
}

export interface AdvisorMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ExtractedSummary {
  preferredSector?: string;
  dailyTimeAvailable?: string;
  spaceAvailable?: string;
  familySupport?: string;
  electricityAccess?: string;
  keyTargetAudience?: string;
}
