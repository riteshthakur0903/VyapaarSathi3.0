import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, Language, Occupation } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { INDIAN_STATES, ensureStateAndDistrict } from '../data/locations';
import {
  MapPin,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Check,
  Navigation,
  AlertCircle,
  Search,
  Wifi,
  Compass,
  CheckCircle2,
  RefreshCw,
  Crosshair,
} from 'lucide-react';

interface ProfileSetupProps {
  profile: UserProfile;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onSaveProfile: (updatedProfile: UserProfile) => void;
  onSkipOptional: () => void;
}

interface PlaceSearchResult {
  displayName: string;
  latitude: number;
  longitude: number;
  village: string;
  block: string;
  district: string;
  state: string;
  pincode: string;
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
  const [ipLoading, setIpLoading] = useState(false);
  const [detectedAddress, setDetectedAddress] = useState<string | null>(null);
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [gpsMessage, setGpsMessage] = useState<{ type: 'success' | 'info' | 'error'; text: string } | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Search places state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<PlaceSearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchTimeoutRef = useRef<any>(null);

  // Selected State object
  const currentStateObj =
    INDIAN_STATES.find((s) => s.name.toLowerCase() === (formData.state || '').toLowerCase()) ||
    INDIAN_STATES[0];

  // Selected District object
  const currentDistrictObj =
    currentStateObj?.districts.find(
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

  // Process Geocoded Location data and update form
  const applyDetectedLocation = (loc: {
    latitude: number;
    longitude: number;
    village?: string;
    block?: string;
    district?: string;
    state?: string;
    pincode?: string;
    displayName?: string;
    accuracy?: number;
  }) => {
    const { matchedState, matchedDistrict, matchedBlock } = ensureStateAndDistrict(
      loc.state,
      loc.district,
      loc.block
    );

    const villageName = loc.village || formData.village || '';

    setFormData((prev) => ({
      ...prev,
      state: matchedState,
      district: matchedDistrict,
      block: matchedBlock,
      village: villageName,
      latitude: loc.latitude,
      longitude: loc.longitude,
      hasGpsPermission: true,
    }));

    if (loc.accuracy) {
      setGpsAccuracy(Math.round(loc.accuracy));
    }

    setDetectedAddress(
      [villageName, matchedBlock, matchedDistrict, matchedState].filter(Boolean).join(', ')
    );

    setGpsMessage({
      type: 'success',
      text: `Exact location identified: ${villageName ? `${villageName}, ` : ''}${matchedBlock ? `Tehsil ${matchedBlock}, ` : ''}${matchedDistrict}, ${matchedState}.`,
    });
  };

  // High-Accuracy GPS Device Location Handler
  const handleRequestLocation = () => {
    if (!('geolocation' in navigator)) {
      setGpsMessage({
        type: 'error',
        text: 'Geolocation is not supported by your browser. Please use search or select manually below.',
      });
      return;
    }

    setGpsLoading(true);
    setGpsMessage({ type: 'info', text: 'Accessing GPS sensors for high-precision coordinates...' });

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;

        try {
          setGpsMessage({
            type: 'info',
            text: `GPS coordinates acquired (±${Math.round(accuracy)}m). Identifying village, tehsil and district...`,
          });

          // Call reverse geocode server endpoint
          const res = await fetch('/api/location/reverse-geocode', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ latitude, longitude }),
          });

          if (res.ok) {
            const data = await res.json();
            if (data.location) {
              applyDetectedLocation({
                ...data.location,
                accuracy,
              });
              setGpsLoading(false);
              return;
            }
          }

          // Fallback direct reverse geocode via client if server error
          const bdcResp = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          if (bdcResp.ok) {
            const bdcData = await bdcResp.json();
            const village = bdcData.locality || bdcData.city || '';
            const state = bdcData.principalSubdivision || '';
            const adminLevels = bdcData.localityInfo?.administrative || [];
            const districtObj = adminLevels.find((a: any) => a.order === 4 || a.order === 5) || {};
            const district = districtObj.name || bdcData.city || '';

            applyDetectedLocation({
              latitude,
              longitude,
              village,
              district,
              state,
              accuracy,
            });
            setGpsLoading(false);
            return;
          }

          // Fallback if reverse geocode fails: still store exact coordinates
          setFormData((prev) => ({
            ...prev,
            latitude,
            longitude,
            hasGpsPermission: true,
          }));
          setGpsAccuracy(Math.round(accuracy));
          setGpsMessage({
            type: 'success',
            text: `Exact coordinates detected: ${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E (Accuracy: ±${Math.round(accuracy)}m).`,
          });
        } catch (err) {
          console.error('Reverse geocode fetch failed:', err);
          setFormData((prev) => ({
            ...prev,
            latitude,
            longitude,
            hasGpsPermission: true,
          }));
          setGpsAccuracy(Math.round(accuracy));
          setGpsMessage({
            type: 'success',
            text: `GPS coordinates detected (${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E). Please verify your district below.`,
          });
        } finally {
          setGpsLoading(false);
        }
      },
      (error) => {
        setGpsLoading(false);
        setFormData((prev) => ({ ...prev, hasGpsPermission: false }));

        if (error.code === error.PERMISSION_DENIED) {
          setGpsMessage({
            type: 'error',
            text: 'Device location access was blocked or denied in browser settings. You can click "Detect via Network/IP" or search your village below.',
          });
        } else if (error.code === error.TIMEOUT) {
          setGpsMessage({
            type: 'error',
            text: 'GPS sensor timed out. Trying network fallback or search below.',
          });
          // Auto fallback to IP lookup
          handleDetectViaIp();
        } else {
          setGpsMessage({
            type: 'error',
            text: 'Could not retrieve satellite GPS fix. Click "Detect via Network/IP" or search below.',
          });
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 0,
      }
    );
  };

  // Fallback Network IP-based location detection
  const handleDetectViaIp = async () => {
    setIpLoading(true);
    setGpsMessage({ type: 'info', text: 'Detecting regional location via network IP...' });

    try {
      const res = await fetch('/api/location/ip-lookup');
      if (res.ok) {
        const data = await res.json();
        if (data.location) {
          applyDetectedLocation(data.location);
          setIpLoading(false);
          return;
        }
      }

      // Client direct fallback
      const directIp = await fetch('https://ipapi.co/json/');
      if (directIp.ok) {
        const ipData = await directIp.json();
        applyDetectedLocation({
          latitude: ipData.latitude,
          longitude: ipData.longitude,
          village: ipData.city || '',
          district: ipData.region || ipData.city || '',
          state: ipData.region || '',
          pincode: ipData.postal || '',
        });
      }
    } catch (e) {
      setGpsMessage({
        type: 'error',
        text: 'Network lookup was unavailable. Please search or pick your district manually below.',
      });
    } finally {
      setIpLoading(false);
    }
  };

  // Real-time location search handler
  const handleSearchInputChange = (val: string) => {
    setSearchQuery(val);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (val.trim().length < 2) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setSearchLoading(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/location/search?q=${encodeURIComponent(val)}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.results || []);
          setShowSearchResults(true);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setSearchLoading(false);
      }
    }, 350);
  };

  const handleSelectSearchResult = (result: PlaceSearchResult) => {
    applyDetectedLocation({
      latitude: result.latitude,
      longitude: result.longitude,
      village: result.village,
      block: result.block,
      district: result.district,
      state: result.state,
      pincode: result.pincode,
      displayName: result.displayName,
    });
    setSearchQuery('');
    setShowSearchResults(false);
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

        {/* Section 2: Financial Position & Loan Preferences */}
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

        {/* Section 3: Exact Location Detection & Selection */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-2">
            <div>
              <h2 className="text-base font-bold text-stone-900">{t.locationSectionTitle}</h2>
              <p className="text-xs text-stone-600">{t.locationSectionDesc}</p>
            </div>
          </div>

          {/* Device GPS & Network Detection Action Box */}
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 sm:p-5 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Crosshair className="w-4 h-4 text-emerald-800 shrink-0" />
                  <span className="text-xs font-bold text-stone-900">
                    High-Precision Exact Location Detection
                  </span>
                </div>
                <p className="text-xs text-stone-600">
                  Detects your exact coordinates and automatically maps your village, tehsil, and district.
                </p>
              </div>

              {/* Action Buttons: GPS + IP Fallback */}
              <div className="flex flex-wrap items-center gap-2 shrink-0 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleRequestLocation}
                  disabled={gpsLoading || ipLoading}
                  className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-70"
                >
                  {gpsLoading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Detecting GPS...</span>
                    </>
                  ) : (
                    <>
                      <Compass className="w-3.5 h-3.5" />
                      <span>Use Device GPS</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleDetectViaIp}
                  disabled={gpsLoading || ipLoading}
                  className="px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 disabled:opacity-70"
                  title="Detect via Internet Connection IP"
                >
                  {ipLoading ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Wifi className="w-3.5 h-3.5 text-stone-600" />
                  )}
                  <span>Detect via Network</span>
                </button>
              </div>
            </div>

            {/* GPS Feedback Banner */}
            {gpsMessage && (
              <div
                className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                  gpsMessage.type === 'success'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950 font-medium'
                    : gpsMessage.type === 'info'
                    ? 'bg-blue-50 border-blue-200 text-blue-900'
                    : 'bg-amber-50 border-amber-200 text-amber-950'
                }`}
              >
                {gpsMessage.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                )}
                <div className="flex-1 space-y-0.5">
                  <p>{gpsMessage.text}</p>
                  {formData.latitude && formData.longitude && (
                    <p className="text-[11px] font-mono opacity-80">
                      Coordinates: {formData.latitude.toFixed(4)}°N, {formData.longitude.toFixed(4)}°E
                      {gpsAccuracy ? ` (Accuracy: ±${gpsAccuracy}m)` : ''}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Search Village / Town Bar */}
            <div className="pt-2 border-t border-stone-200/80">
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Search Any Village, Tehsil, Town or District in India:
              </label>
              <div className="relative">
                <div className="relative flex items-center">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearchInputChange(e.target.value)}
                    placeholder="e.g. Baramati, Phaltan, Varanasi, Pipraich, Chomu, Belagavi, Surat..."
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-stone-300 bg-white text-stone-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
                  />
                  {searchLoading && (
                    <RefreshCw className="w-4 h-4 text-emerald-700 animate-spin absolute right-3" />
                  )}
                </div>

                {/* Search Autocomplete Dropdown */}
                {showSearchResults && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-stone-200 py-1.5 z-30 max-h-56 overflow-y-auto">
                    {searchResults.map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectSearchResult(item)}
                        className="w-full px-4 py-2 text-left text-xs hover:bg-emerald-50 transition-colors flex items-start gap-2 border-b border-stone-50 last:border-none"
                      >
                        <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="font-semibold text-stone-900">
                            {item.village || item.district}
                            {item.block ? ` (${item.block})` : ''}
                          </p>
                          <p className="text-[11px] text-stone-500 truncate">{item.displayName}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Manual Verified Location Form Fields */}
          <div className="pt-2 space-y-3">
            <p className="text-xs font-semibold text-stone-700">
              Verify or adjust your location details:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* State */}
              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                  {t.stateLabel} <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.state}
                  onChange={(e) => handleStateChange(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-stone-900 text-xs font-medium bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
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
                  {t.districtLabel} <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.district}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-stone-900 text-xs font-medium bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
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
                <input
                  type="text"
                  value={formData.block || ''}
                  onChange={(e) => setFormData({ ...formData, block: e.target.value })}
                  placeholder="e.g. Baramati, Niphad..."
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-stone-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
                />
              </div>

              {/* Village */}
              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                  {t.villageLabel}
                </label>
                <input
                  type="text"
                  value={formData.village || ''}
                  onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                  placeholder={t.villagePlaceholder}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-stone-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
                />
              </div>
            </div>

            {/* Mandi & Crops Benchmark Badge */}
            {currentDistrictObj && (
              <div className="mt-3 p-3.5 bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-700 flex flex-wrap items-center gap-x-4 gap-y-1">
                <span>
                  <strong>APMC Mandi Hub:</strong> {currentDistrictObj.mandiHub}
                </span>
                <span aria-hidden="true" className="text-stone-300">·</span>
                <span>
                  <strong>Principal Local Crops:</strong> {currentDistrictObj.primaryCrops.join(', ')}
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
