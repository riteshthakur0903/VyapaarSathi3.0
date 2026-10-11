import React, { useState } from 'react';
import { UserProfile, Language, Occupation } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { INDIAN_STATES } from '../data/locations';
import { MapPin, HelpCircle, ChevronDown, ChevronUp, Check, Navigation, AlertCircle } from 'lucide-react';

interface ProfileSetupProps {
  profile: UserProfile;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onSaveProfile: (updatedProfile: UserProfile) => void;
  onSkipOptional: () => void;
}

export const ProfileSetup: React.FC<ProfileSetupProps> = ({
  profile,
  language,
  onLanguageChange,
  onSaveProfile,
  onSkipOptional,
}) => {
  const t = TRANSLATIONS[language];

  // Local form state
  const [formData, setFormData] = useState<UserProfile>({ ...profile });
  const [showWhySensitive, setShowWhySensitive] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsMessage, setGpsMessage] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Selected State object
  const currentStateObj = INDIAN_STATES.find(
    (s) => s.name.toLowerCase() === (formData.state || '').toLowerCase()
  ) || INDIAN_STATES[0];

  // Selected District object
  const currentDistrictObj = currentStateObj?.districts.find(
    (d) => d.name.toLowerCase() === (formData.district || '').toLowerCase()
  ) || currentStateObj?.districts[0];

  const handleStateChange = (stateName: string) => {
    const sObj = INDIAN_STATES.find((s) => s.name === stateName);
    const firstDistrict = sObj?.districts[0]?.name || '';
    const firstBlock = sObj?.districts[0]?.blocks[0] || '';
    setFormData((prev) => ({
      ...prev,
      state: stateName,
      district: firstDistrict,
      block: firstBlock,
    }));
  };

  const handleDistrictChange = (distName: string) => {
    const dObj = currentStateObj?.districts.find((d) => d.name === distName);
    const firstBlock = dObj?.blocks[0] || '';
    setFormData((prev) => ({
      ...prev,
      district: distName,
      block: firstBlock,
    }));
  };

  // Device GPS Location Handler
  const handleRequestLocation = () => {
    if (!('geolocation' in navigator)) {
      setGpsMessage('Geolocation is not supported by your browser. Please select manually below.');
      return;
    }

    setGpsLoading(true);
    setGpsMessage(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGpsLoading(false);
        const { latitude, longitude } = position.coords;
        setFormData((prev) => ({
          ...prev,
          hasGpsPermission: true,
          latitude,
          longitude,
        }));
        setGpsMessage(
          `Location detected (${latitude.toFixed(3)}°N, ${longitude.toFixed(3)}°E). District and nearest mandi benchmark mapped.`
        );
      },
      (error) => {
        setGpsLoading(false);
        setFormData((prev) => ({ ...prev, hasGpsPermission: false }));
        if (error.code === error.PERMISSION_DENIED) {
          setGpsMessage('Location access was denied. You can easily pick your district and tehsil manually below.');
        } else {
          setGpsMessage('Could not retrieve GPS coordinates. Please select manually.');
        }
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      ...formData,
      updatedAt: new Date().toISOString(),
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const occupations: { value: Occupation; label: string }[] = [
    { value: 'farmer', label: t.occupationFarmer },
    { value: 'daily_wager', label: t.occupationDailyWager },
    { value: 'artisan', label: t.occupationArtisan },
    { value: 'shopkeeper', label: t.occupationShopkeeper },
    { value: 'homemaker', label: t.occupationHomemaker },
    { value: 'unemployed_youth', label: t.occupationYouth },
    { value: 'driver_operator', label: t.occupationDriver },
    { value: 'other', label: t.occupationOther },
  ];

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          {t.profileTitle}
        </h1>
        <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
          {t.profileSubtitle}
        </p>
      </div>

      {/* Explainer Accordion: Why sensitive details are asked */}
      <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 sm:p-5 text-stone-800">
        <button
          type="button"
          onClick={() => setShowWhySensitive(!showWhySensitive)}
          className="w-full flex items-center justify-between text-left font-semibold text-xs sm:text-sm text-amber-950 focus:outline-none"
        >
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-amber-800 shrink-0" />
            <span>{t.whyWeAskTitle}</span>
          </div>
          {showWhySensitive ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showWhySensitive && (
          <div className="mt-3 pt-3 border-t border-amber-200 text-xs text-amber-900 leading-relaxed space-y-2">
            <p>{t.whyWeAskDesc}</p>
            <ul className="list-disc list-inside space-y-1 text-amber-950/80">
              <li><strong>Monthly Income:</strong> Ensures proposed loan EMI does not exceed 25% of your family earnings.</li>
              <li><strong>Own Investment:</strong> Determines how much margin money or subsidy you qualify for under PMEGP or Mudra.</li>
              <li><strong>Location:</strong> Maps nearest APMC market yard, local crop varieties, and competitor distances.</li>
            </ul>
          </div>
        )}
      </div>

      {/* Main Profile Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-8 shadow-xs">
        {/* Section 1: Basic Identity & Language */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-2">
            1. Basic Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {t.fullNameLabel} <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={t.fullNamePlaceholder}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Preferred Language
              </label>
              <select
                value={formData.language}
                onChange={(e) => {
                  const newLang = e.target.value as Language;
                  setFormData({ ...formData, language: newLang });
                  onLanguageChange(newLang);
                }}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 bg-white"
              >
                <option value="hi">हिंदी (Hindi)</option>
                <option value="mr">मराठी (Marathi)</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>

          {/* Occupation & Skills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {t.occupationLabel}
              </label>
              <select
                value={formData.occupation}
                onChange={(e) => setFormData({ ...formData, occupation: e.target.value as Occupation })}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 bg-white"
              >
                {occupations.map((occ) => (
                  <option key={occ.value} value={occ.value}>
                    {occ.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {t.skillsLabel}
              </label>
              <input
                type="text"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                placeholder={t.skillsPlaceholder}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
              />
              <p className="text-[11px] text-stone-600 mt-1">{t.skillsHint}</p>
            </div>
          </div>
        </div>

        {/* Section 2: Financial Capacity */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-2">
            2. Financial Position & Loan Preferences
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {t.monthlyIncomeLabel} (₹)
              </label>
              <input
                type="number"
                min="0"
                step="1000"
                value={formData.monthlyIncome || ''}
                onChange={(e) => setFormData({ ...formData, monthlyIncome: Number(e.target.value) })}
                placeholder="e.g. 15000"
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 font-mono"
              />
              <p className="text-[11px] text-stone-600 mt-1">{t.monthlyIncomeHint}</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {t.investmentLabel} (₹) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                min="5000"
                step="5000"
                value={formData.investment || ''}
                onChange={(e) => setFormData({ ...formData, investment: Number(e.target.value) })}
                placeholder="e.g. 50000"
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 font-mono"
              />
              <p className="text-[11px] text-stone-600 mt-1">{t.investmentHint}</p>
            </div>
          </div>

          {/* Open to Loan Radio Selector */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-2">
              {t.loanOpennessLabel}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { value: 'yes', label: t.loanOpennessYes },
                { value: 'unsure', label: t.loanOpennessUnsure },
                { value: 'no', label: t.loanOpennessNo },
              ].map((opt) => (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => setFormData({ ...formData, loanOpenness: opt.value as any })}
                  className={`p-3 rounded-xl border text-xs text-left font-medium transition-all flex items-start gap-2 ${
                    formData.loanOpenness === opt.value
                      ? 'border-emerald-700 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-700'
                      : 'border-stone-200 hover:border-stone-300 text-stone-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                      formData.loanOpenness === opt.value
                        ? 'border-emerald-700 bg-emerald-700 text-white'
                        : 'border-stone-300'
                    }`}
                  >
                    {formData.loanOpenness === opt.value && <Check className="w-2.5 h-2.5" />}
                  </div>
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section 3: Location (GPS + Manual Fallback) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-2">
            <div>
              <h2 className="text-base font-bold text-stone-900">{t.locationSectionTitle}</h2>
              <p className="text-xs text-stone-600">{t.locationSectionDesc}</p>
            </div>
          </div>

          {/* Device GPS Prompt with Clear Permission Ask */}
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-emerald-800" />
                <span className="text-xs font-bold text-stone-900">Device Location Request</span>
              </div>
              <p className="text-xs text-stone-600">{t.locationPermissionNote}</p>
            </div>

            <button
              type="button"
              onClick={handleRequestLocation}
              disabled={gpsLoading}
              className="px-4 py-2.5 rounded-xl bg-white border border-stone-300 text-stone-800 text-xs font-semibold hover:bg-stone-100 transition-colors flex items-center gap-2 shrink-0"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-800" />
              <span>{gpsLoading ? t.detectingLocation : t.detectLocationBtn}</span>
            </button>
          </div>

          {gpsMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{gpsMessage}</span>
            </div>
          )}

          {/* Manual Location Selection */}
          <div className="pt-2">
            <p className="text-xs font-semibold text-stone-700 mb-3">{t.orManualLocation}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* State */}
              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                  {t.stateLabel}
                </label>
                <select
                  value={formData.state}
                  onChange={(e) => handleStateChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-stone-900 text-xs font-medium bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
                >
                  {INDIAN_STATES.map((s) => (
                    <option key={s.name} value={s.name}>
                      {language === 'hi' ? s.nameHi : language === 'mr' ? s.nameMr : s.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* District */}
              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                  {t.districtLabel}
                </label>
                <select
                  value={formData.district}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-stone-900 text-xs font-medium bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
                >
                  {currentStateObj?.districts.map((d) => (
                    <option key={d.name} value={d.name}>
                      {language === 'hi' ? d.nameHi : language === 'mr' ? d.nameMr : d.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Block / Tehsil */}
              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                  {t.blockLabel}
                </label>
                <select
                  value={formData.block}
                  onChange={(e) => setFormData({ ...formData, block: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-stone-900 text-xs font-medium bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
                >
                  {currentDistrictObj?.blocks.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              {/* Village */}
              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                  {t.villageLabel}
                </label>
                <input
                  type="text"
                  value={formData.village}
                  onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                  placeholder={t.villagePlaceholder}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-stone-900 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
                />
              </div>
            </div>

            {/* Mandi & Crops Benchmark Badge */}
            {currentDistrictObj && (
              <div className="mt-3 p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-700 flex flex-wrap items-center gap-x-4 gap-y-1">
                <span>
                  <strong>Nearest APMC Mandi:</strong> {currentDistrictObj.mandiHub}
                </span>
                <span aria-hidden="true">·</span>
                <span>
                  <strong>Key Crops:</strong> {currentDistrictObj.primaryCrops.join(', ')}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Buttons Row */}
        <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={onSkipOptional}
            className="text-stone-600 hover:text-stone-900 text-xs font-semibold py-2 px-3 underline cursor-pointer"
          >
            {t.skipOptional}
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-sm rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>{t.saveProfileBtn}</span>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
