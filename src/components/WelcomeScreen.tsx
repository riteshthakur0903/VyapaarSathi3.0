import React, { useState } from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { MapPin, Calculator, Award, Mic, ArrowRight, Volume2, VolumeX, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface WelcomeScreenProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onStartDiscovery: () => void;
  onExploreBusinesses: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  language,
  onLanguageChange,
  onStartDiscovery,
  onExploreBusinesses,
}) => {
  const t = TRANSLATIONS[language];
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Audio speech synthesis helper
  const handleToggleAudio = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported on this device/browser.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    const narrationTexts = {
      hi: 'नमस्ते! व्यापारसाथी में आपका स्वागत है। यह मंच ग्रामीण उद्यमियों को उनकी बचत और गाँव के अनुसार सुरक्षित व्यवसाय चुनने, सही लागत का हिसाब लगाने और पीएमईजीपी तथा मुद्रा जैसी सरकारी सब्सिडी प्राप्त करने में मदद करता है। आगे बढ़ने के लिए शुरुआत करें बटन दबाएं।',
      mr: 'नमस्कार! व्यापारसाथी मध्ये आपले स्वागत आहे. ग्रामीण भागातील नवउद्योजकांना गावात कोणता व्यवसाय यशस्वी होईल, सुरुवातीला किती खर्च येईल आणि मुद्रा किंवा पीएमईजीपी योजनेतून किती अनुदान मिळेल हे समजून घेण्यासाठी हे व्यासपीठ तयार केले आहे.',
      en: 'Welcome to VyapaarSathi! A trustworthy advisory platform for rural entrepreneurs in India to evaluate local village business ideas, calculate honest EMIs, and unlock government subsidies like PMEGP and Mudra.',
    };

    const text = narrationTexts[language];
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-IN';
    utterance.rate = 0.95;

    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Top Banner & Language Choice Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-stone-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-lg">
            🌾
          </div>
          <div>
            <h2 className="text-sm font-semibold text-stone-900">{t.selectLanguage}</h2>
            <p className="text-xs text-stone-600">
              Select your preferred language at any time / कधीही भाषा बदला
            </p>
          </div>
        </div>

        {/* Trilingual Segmented Switcher */}
        <div className="flex items-center p-1 bg-stone-100 rounded-xl w-full sm:w-auto">
          {(
            [
              { code: 'hi', label: 'हिंदी (Hindi)' },
              { code: 'mr', label: 'मराठी (Marathi)' },
              { code: 'en', label: 'English' },
            ] as const
          ).map((l) => (
            <button
              key={l.code}
              onClick={() => {
                onLanguageChange(l.code);
                if (isPlayingAudio) {
                  window.speechSynthesis.cancel();
                  setIsPlayingAudio(false);
                }
              }}
              className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                language === l.code
                  ? 'bg-white text-emerald-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-emerald-900/5 via-stone-50 to-white rounded-3xl p-6 sm:p-12 border border-emerald-900/10">
        <div className="max-w-3xl space-y-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>{t.appTagline}</span>
            <span aria-hidden="true">·</span>
            <span className="text-stone-600">Govt Scheme Benchmarks</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-stone-900 tracking-tight leading-tight">
            {t.welcomeTitle}
          </h1>

          <p className="text-base sm:text-lg text-stone-700 leading-relaxed max-w-2xl">
            {t.welcomeDesc}
          </p>

          {/* Action Row */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={onStartDiscovery}
              className="px-6 py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors flex items-center gap-2"
            >
              <span>{t.getStarted}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onExploreBusinesses}
              className="px-5 py-3.5 bg-white hover:bg-stone-50 text-stone-800 border border-stone-200 font-semibold text-sm rounded-xl transition-colors"
            >
              {t.exploreIdeas}
            </button>

            {/* Read Aloud Button */}
            <button
              onClick={handleToggleAudio}
              className={`px-4 py-3 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-colors ${
                isPlayingAudio
                  ? 'bg-amber-50 border-amber-300 text-amber-900 animate-pulse'
                  : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
              }`}
              title="Voice narration"
            >
              {isPlayingAudio ? (
                <>
                  <VolumeX className="w-4 h-4 text-amber-700" />
                  <span>{t.voiceOutputStop}</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-emerald-700" />
                  <span>{t.voiceOutputPlay}</span>
                </>
              )}
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="pt-4 flex flex-wrap gap-y-2 gap-x-6 text-xs text-stone-600">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>No fabricated facts or loan guarantees</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>Reducing balance EMI formula</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>Official KVIC, Mudra, PMFME portal links</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center">
            <MapPin className="w-6 h-6 text-teal-700" />
          </div>
          <h2 className="text-base font-bold text-stone-900">{t.feature1Title}</h2>
          <p className="text-sm text-stone-600 leading-relaxed">{t.feature1Desc}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
            <Calculator className="w-6 h-6 text-emerald-700" />
          </div>
          <h2 className="text-base font-bold text-stone-900">{t.feature2Title}</h2>
          <p className="text-sm text-stone-600 leading-relaxed">{t.feature2Desc}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center">
            <Award className="w-6 h-6 text-amber-700" />
          </div>
          <h2 className="text-base font-bold text-stone-900">{t.feature3Title}</h2>
          <p className="text-sm text-stone-600 leading-relaxed">{t.feature3Desc}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-800 flex items-center justify-center">
            <Mic className="w-6 h-6 text-indigo-700" />
          </div>
          <h2 className="text-base font-bold text-stone-900">{t.feature4Title}</h2>
          <p className="text-sm text-stone-600 leading-relaxed">{t.feature4Desc}</p>
        </div>
      </div>

      {/* Transparency & Disclaimer Box */}
      <div className="bg-stone-100 rounded-2xl p-5 border border-stone-200 text-xs text-stone-600 leading-relaxed space-y-1">
        <p className="font-semibold text-stone-800">
          ⚖️ Transparent Prototype Notice / पारदर्शक माहिती सूचना:
        </p>
        <p>
          VyapaarSathi provides advisory estimates based on official 2024-25 MSME model project DPRs, NABARD farm sector guidelines, and state district benchmarks. Cost breakdowns and loan interest calculations use standard mathematical reducing balance formulas. We do not promise guaranteed loan sanction or bank approval.
        </p>
      </div>
    </div>
  );
};
