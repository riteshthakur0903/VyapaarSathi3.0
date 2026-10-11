import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { UserProfile, BusinessIdea, LoanCalculation, FeasibilityReport } from '../types';

const envUrl = import.meta.env.VITE_SUPABASE_URL;
const envAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if credentials exist in localStorage if not in env
const localStoredUrl = typeof window !== 'undefined' ? localStorage.getItem('vyapaarsathi_supabase_url') : null;
const localStoredKey = typeof window !== 'undefined' ? localStorage.getItem('vyapaarsathi_supabase_key') : null;

const activeUrl = envUrl || localStoredUrl || '';
const activeKey = envAnonKey || localStoredKey || '';

export let supabase: SupabaseClient | null = null;
export let isUsingSupabaseCloud = false;

if (activeUrl && activeKey && activeUrl !== 'https://your-project-id.supabase.co') {
  try {
    supabase = createClient(activeUrl, activeKey);
    isUsingSupabaseCloud = true;
  } catch (e) {
    console.warn('Failed to initialize Supabase client:', e);
    supabase = null;
    isUsingSupabaseCloud = false;
  }
}

export function configureSupabase(url: string, key: string) {
  if (url && key) {
    localStorage.setItem('vyapaarsathi_supabase_url', url);
    localStorage.setItem('vyapaarsathi_supabase_key', key);
    try {
      supabase = createClient(url, key);
      isUsingSupabaseCloud = true;
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  } else {
    localStorage.removeItem('vyapaarsathi_supabase_url');
    localStorage.removeItem('vyapaarsathi_supabase_key');
    supabase = null;
    isUsingSupabaseCloud = false;
    return false;
  }
}

// SQL Schema for users to run in Supabase SQL editor
export const SUPABASE_SQL_SCHEMA = `-- VyapaarSathi Database Schema
-- Run this in your Supabase SQL Editor:

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'en',
  occupation TEXT,
  skills TEXT,
  monthly_income NUMERIC DEFAULT 0,
  investment NUMERIC DEFAULT 0,
  loan_openness TEXT DEFAULT 'yes',
  state TEXT,
  district TEXT,
  block TEXT,
  village TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  has_gps_permission BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own profile" 
ON public.profiles FOR ALL 
USING (auth.uid() = user_id OR user_id IS NULL)
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- 2. Saved Businesses Table
CREATE TABLE IF NOT EXISTS public.saved_businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  business_id TEXT NOT NULL,
  business_title TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.saved_businesses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their saved businesses" 
ON public.saved_businesses FOR ALL 
USING (auth.uid() = user_id OR user_id IS NULL)
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- 3. Loan Calculations Table
CREATE TABLE IF NOT EXISTS public.loan_calculations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  business_id TEXT NOT NULL,
  business_title TEXT NOT NULL,
  total_cost NUMERIC NOT NULL,
  own_investment NUMERIC NOT NULL,
  loan_amount NUMERIC NOT NULL,
  interest_rate NUMERIC NOT NULL,
  tenure_months INTEGER NOT NULL,
  monthly_emi NUMERIC NOT NULL,
  total_interest NUMERIC NOT NULL,
  total_repayment NUMERIC NOT NULL,
  feasibility_rating TEXT,
  feasibility_reason TEXT,
  cost_breakdown JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.loan_calculations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their loan calculations" 
ON public.loan_calculations FOR ALL 
USING (auth.uid() = user_id OR user_id IS NULL)
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- 4. Feasibility Reports Table
CREATE TABLE IF NOT EXISTS public.feasibility_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  business_id TEXT NOT NULL,
  business_title TEXT NOT NULL,
  user_profile JSONB NOT NULL,
  calculation JSONB NOT NULL,
  swot_analysis JSONB NOT NULL,
  recommended_scheme_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.feasibility_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their feasibility reports" 
ON public.feasibility_reports FOR ALL 
USING (auth.uid() = user_id OR user_id IS NULL)
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
`;

// Unified Data Layer Methods
const STORAGE_KEYS = {
  PROFILE: 'vyapaarsathi_profile',
  SAVED_BUSINESSES: 'vyapaarsathi_saved_businesses',
  CALCULATIONS: 'vyapaarsathi_calculations',
  REPORTS: 'vyapaarsathi_reports',
};

// 1. Profile
export async function saveProfileToDb(profile: UserProfile): Promise<boolean> {
  // Always update local cache
  localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));

  if (isUsingSupabaseCloud && supabase) {
    try {
      const { error } = await supabase.from('profiles').upsert({
        id: profile.id,
        name: profile.name,
        language: profile.language,
        occupation: profile.occupation,
        skills: profile.skills,
        monthly_income: profile.monthlyIncome,
        investment: profile.investment,
        loan_openness: profile.loanOpenness,
        state: profile.state,
        district: profile.district,
        block: profile.block,
        village: profile.village,
        latitude: profile.latitude,
        longitude: profile.longitude,
        has_gps_permission: profile.hasGpsPermission,
        updated_at: new Date().toISOString(),
      });
      if (error) {
        console.warn('Supabase profile save error, local fallback active:', error.message);
      }
    } catch (err) {
      console.warn('Supabase network error:', err);
    }
  }
  return true;
}

export async function getProfileFromDb(): Promise<UserProfile | null> {
  const local = localStorage.getItem(STORAGE_KEYS.PROFILE);
  const localProfile = local ? JSON.parse(local) : null;

  if (isUsingSupabaseCloud && supabase) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data && !error) {
        return {
          id: data.id,
          name: data.name,
          language: data.language,
          occupation: data.occupation,
          skills: data.skills,
          monthlyIncome: Number(data.monthly_income),
          investment: Number(data.investment),
          loanOpenness: data.loan_openness,
          state: data.state,
          district: data.district,
          block: data.block,
          village: data.village,
          latitude: data.latitude,
          longitude: data.longitude,
          hasGpsPermission: data.has_gps_permission,
          updatedAt: data.updated_at,
        };
      }
    } catch (e) {
      console.warn('Supabase fetch failed, returning local profile:', e);
    }
  }

  return localProfile;
}

// 2. Saved Businesses
export async function saveBusinessBookmark(businessId: string, businessTitle: string): Promise<boolean> {
  const current = getSavedBusinessBookmarksLocal();
  if (!current.includes(businessId)) {
    current.push(businessId);
    localStorage.setItem(STORAGE_KEYS.SAVED_BUSINESSES, JSON.stringify(current));
  }

  if (isUsingSupabaseCloud && supabase) {
    try {
      await supabase.from('saved_businesses').upsert({
        business_id: businessId,
        business_title: businessTitle,
      });
    } catch (e) {
      console.warn('Supabase save error:', e);
    }
  }
  return true;
}

export function getSavedBusinessBookmarksLocal(): string[] {
  const data = localStorage.getItem(STORAGE_KEYS.SAVED_BUSINESSES);
  return data ? JSON.parse(data) : [];
}

// 3. Loan Calculations
export async function saveLoanCalculationToDb(calc: LoanCalculation): Promise<boolean> {
  const current = getSavedCalculationsLocal();
  const updated = [calc, ...current.filter((c) => c.id !== calc.id)];
  localStorage.setItem(STORAGE_KEYS.CALCULATIONS, JSON.stringify(updated));

  if (isUsingSupabaseCloud && supabase) {
    try {
      await supabase.from('loan_calculations').insert({
        id: calc.id,
        business_id: calc.businessId,
        business_title: calc.businessTitle,
        total_cost: calc.totalCost,
        own_investment: calc.ownInvestment,
        loan_amount: calc.loanAmount,
        interest_rate: calc.interestRate,
        tenure_months: calc.tenureMonths,
        monthly_emi: calc.monthlyEmi,
        total_interest: calc.totalInterest,
        total_repayment: calc.totalRepayment,
        feasibility_rating: calc.feasibilityRating,
        feasibility_reason: calc.feasibilityReason,
        cost_breakdown: calc.costBreakdown,
        created_at: calc.createdAt,
      });
    } catch (e) {
      console.warn('Supabase calculation save error:', e);
    }
  }
  return true;
}

export function getSavedCalculationsLocal(): LoanCalculation[] {
  const data = localStorage.getItem(STORAGE_KEYS.CALCULATIONS);
  return data ? JSON.parse(data) : [];
}

// 4. Feasibility Reports
export async function saveFeasibilityReportToDb(report: FeasibilityReport): Promise<boolean> {
  const current = getSavedReportsLocal();
  const updated = [report, ...current.filter((r) => r.id !== report.id)];
  localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(updated));

  if (isUsingSupabaseCloud && supabase) {
    try {
      await supabase.from('feasibility_reports').insert({
        id: report.id,
        business_id: report.business.id,
        business_title: report.business.title,
        user_profile: report.userProfile,
        calculation: report.calculation,
        swot_analysis: report.swotAnalysis,
        recommended_scheme_id: report.recommendedSchemeId,
        created_at: report.createdAt,
      });
    } catch (e) {
      console.warn('Supabase report save error:', e);
    }
  }
  return true;
}

export function getSavedReportsLocal(): FeasibilityReport[] {
  const data = localStorage.getItem(STORAGE_KEYS.REPORTS);
  return data ? JSON.parse(data) : [];
}
