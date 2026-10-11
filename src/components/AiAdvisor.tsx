import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, Language, AdvisorMessage, ExtractedSummary } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Send,
  Sparkles,
  Edit3,
  ArrowRight,
  User,
  Bot,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

interface AiAdvisorProps {
  userProfile: UserProfile;
  language: Language;
  onProceedToRecommendations: () => void;
  onEditProfile: () => void;
}

export const AiAdvisor: React.FC<AiAdvisorProps> = ({
  userProfile,
  language,
  onProceedToRecommendations,
  onEditProfile,
}) => {
  const t = TRANSLATIONS[language];

  // Initial welcome message tailored to language and user name
  const getInitialMessage = (): string => {
    const name = userProfile.name || 'Friend';
    const loc = userProfile.district ? `${userProfile.district}, ${userProfile.state}` : 'your village';

    if (language === 'hi') {
      return `नमस्ते ${name} जी! मैं आपका व्यापारसाथी सलाहकार हूँ।\n\nमुझे जानकारी मिली कि आपके पास ₹${userProfile.investment.toLocaleString('en-IN')} की बचत है और आप ${loc} में नया उद्यम शुरू करने का विचार कर रहे हैं।\n\nगाँव में आपकी रुचि किस तरह के काम में है — जैसे दाल/मसाला पिसाई, डेयरी पशुपालन, सोलर कोल्ड स्टोरेज, या ग्राहक सेवा केंद्र? क्या आपके पास सड़क किनारे दुकान या बिजली की सुविधा है?`;
    }
    if (language === 'mr') {
      return `नमस्कार ${name} जी! मी आपला व्यापारसाथी सल्लागार आहे.\n\nआपल्याकडे ₹${userProfile.investment.toLocaleString('en-IN')} चे स्वतःचे भांडवल आहे आणि आपण ${loc} परिसरात व्यवसाय सुरू करू इच्छिता.\n\nआपल्याला कोणत्या प्रकारचा उद्योग करायला आवडेल — शेतीमाल प्रक्रिया (उदा. डाळ मिल/मसाला), दुग्धव्यवसाय, सौर शीतगृह की डिजिटल सेवा केंद्र? आपल्याकडे स्वतःची जागा किंवा गोठा आहे का?`;
    }
    return `Hello ${name}! I am your VyapaarSathi Business Advisor.\n\nI see you have around ₹${userProfile.investment.toLocaleString('en-IN')} in personal capital and are exploring micro-business options in ${loc}.\n\nTo narrow down the best practical business for your tehsil: Do you prefer agro-processing (like a mini dal or spice mill), dairy and cattle, solar vegetable aggregation, or a retail/digital services hub? Also, do you already have road-facing space with power?`;
  };

  const [messages, setMessages] = useState<AdvisorMessage[]>([
    {
      id: 'msg-1',
      role: 'assistant',
      content: getInitialMessage(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [playingAudioMsgId, setPlayingAudioMsgId] = useState<string | null>(null);

  // Extracted user answers summary state
  const [summary, setSummary] = useState<ExtractedSummary>({
    preferredSector: userProfile.skills ? `Related to ${userProfile.skills}` : 'Agri-processing or Dairy',
    dailyTimeAvailable: 'Full-time (8-10 hours/day)',
    spaceAvailable: 'Own village room / Roadside rented shop',
    familySupport: 'Family assistance available for daily operations',
    electricityAccess: 'Single-phase available; need 3-phase for heavy mill',
    keyTargetAudience: 'Local village farmers and weekly haat buyers',
  });
  const [editingSummary, setEditingSummary] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Web Speech API Voice Recognition setup
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-IN';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [language]);

  const toggleVoiceListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please use text typing.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.lang =
          language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-IN';
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error(err);
        setIsListening(false);
      }
    }
  };

  const handleSpeakText = (msgId: string, text: string) => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported on this device.');
      return;
    }

    if (playingAudioMsgId === msgId) {
      window.speechSynthesis.cancel();
      setPlayingAudioMsgId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-IN';
    utterance.rate = 0.95;

    utterance.onend = () => setPlayingAudioMsgId(null);
    utterance.onerror = () => setPlayingAudioMsgId(null);

    window.speechSynthesis.speak(utterance);
    setPlayingAudioMsgId(msgId);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputValue.trim();
    if (!text || loading) return;

    const userMsg: AdvisorMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setLoading(true);

    try {
      // Send to server backend with Gemini integration
      const response = await fetch('/api/advisor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })),
          userProfile,
          language,
        }),
      });

      const data = await response.json();
      const assistantText = data.message || 'I recommend checking local agricultural supply demand and cost benchmarks.';

      const botMsg: AdvisorMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: assistantText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);

      // Automatically refine summary based on user keywords
      if (text.toLowerCase().includes('दाल') || text.toLowerCase().includes('grain') || text.toLowerCase().includes('डाळ')) {
        setSummary((s) => ({ ...s, preferredSector: 'Agro-processing (Mini Dal Mill & Spices)' }));
      } else if (text.toLowerCase().includes('दूध') || text.toLowerCase().includes('dairy') || text.toLowerCase().includes('डेअरी')) {
        setSummary((s) => ({ ...s, preferredSector: 'Dairy & Livestock Farming' }));
      } else if (text.toLowerCase().includes('csc') || text.toLowerCase().includes('दुकान') || text.toLowerCase().includes('सेवा')) {
        setSummary((s) => ({ ...s, preferredSector: 'Retail & Rural CSC Logistics Hub' }));
      }
    } catch (err) {
      console.error('Advisor request error:', err);
      // Fallback response if server fails
      const fallbackMsg: AdvisorMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content:
          language === 'hi'
            ? 'आपके क्षेत्र में दाल मिल और आधुनिक डेयरी दोनों बहुत लाभदायक विकल्प हैं। आपकी ₹' +
              userProfile.investment.toLocaleString('en-IN') +
              ' की पूंजी पर PMEGP योजना से 35% तक सरकारी सब्सिडी मिल सकती है।'
            : language === 'mr'
            ? 'आपल्या परिसरामध्ये मिनी डाळ मिल आणि दुग्ध व्यवसाय दोन्ही उत्तम पर्याय आहेत. आपल्या ₹' +
              userProfile.investment.toLocaleString('en-IN') +
              ' भांडवलावर PMEGP योजनेतून 35% पर्यंत शासकीय अनुदान मिळू शकते.'
            : 'Based on your capital and location, Mini Dal Milling and Dairy Chilling are strong options. With your ₹' +
              userProfile.investment.toLocaleString('en-IN') +
              ' investment, PMEGP offers up to 35% rural subsidy.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const quickQuestions = {
    hi: [
      '₹80,000 में गाँव में कौन सा काम सबसे अच्छा चलेगा?',
      'PMEGP योजना में 35% सब्सिडी कैसे मिलती है?',
      'क्या दाल मिल के लिए 3-फेज बिजली जरूरी है?',
      'डेयरी उद्योग में हर महीने कितना शुद्ध मुनाफा बचता है?',
    ],
    mr: [
      '₹80,000 भांडवलात गावात कोणता व्यवसाय फायदेशीर राहील?',
      'PMEGP योजनेतून 35% शासकीय अनुदान कसे मिळवावे?',
      'डाळ मिलसाठी थ्री-फेज वीज कनेक्शन आवश्यक आहे का?',
      'दुग्ध व्यवसायात महिन्याला साधारण किती नफा राहतो?',
    ],
    en: [
      'Which business is best for under ₹1,00,000 in my tehsil?',
      'How does the 35% PMEGP rural subsidy work?',
      'Is 3-phase electricity compulsory for a mini dal mill?',
      'What is the estimated monthly profit from a 2-cow dairy unit?',
    ],
  }[language];

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      {/* Advisor Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              {t.advisorTitle}
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
              AI Advisor
            </span>
          </div>
          <p className="text-stone-600 text-xs sm:text-sm mt-1">{t.advisorSubtitle}</p>
        </div>

        {/* Profile Context Pill */}
        <div className="bg-stone-100 border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-700 flex items-center gap-2">
          <span>
            <strong>Location:</strong> {userProfile.district || 'District'}, {userProfile.state}
          </span>
          <span aria-hidden="true">·</span>
          <span>
            <strong>Capital:</strong> ₹{userProfile.investment.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Main Chat & Summary Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Stream (2 Columns on large screens) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-stone-200 shadow-xs flex flex-col h-[580px] overflow-hidden">
          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-xl bg-emerald-800 text-white flex items-center justify-center shrink-0 text-xs font-bold shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-emerald-900 text-white rounded-br-xs'
                      : 'bg-stone-50 border border-stone-200 text-stone-800 rounded-bl-xs'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.content}</p>

                  <div className="mt-2 pt-1 border-t border-black/5 flex items-center justify-between text-[10px] opacity-75">
                    <span>{msg.timestamp}</span>

                    {msg.role === 'assistant' && (
                      <button
                        onClick={() => handleSpeakText(msg.id, msg.content)}
                        className="hover:opacity-100 flex items-center gap-1 text-emerald-800 font-semibold"
                        title="Read aloud"
                      >
                        {playingAudioMsgId === msg.id ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5 text-rose-600" />
                            <span>Stop</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>Listen</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-stone-200 text-stone-700 flex items-center justify-center shrink-0 text-xs font-bold">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 items-center text-stone-600 text-xs">
                <div className="w-8 h-8 rounded-xl bg-emerald-800 text-white flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-stone-50 border border-stone-200 rounded-2xl px-4 py-2.5 flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-700" />
                  <span>Thinking & consulting rural benchmarks...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions Strip */}
          <div className="px-4 py-2 bg-stone-50 border-t border-stone-100 overflow-x-auto whitespace-nowrap flex gap-2">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                disabled={loading}
                className="px-3 py-1.5 rounded-lg bg-white border border-stone-200 text-stone-700 hover:text-stone-900 hover:border-emerald-700 text-xs transition-colors shrink-0"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Chat Input Controls */}
          <div className="p-3 sm:p-4 bg-white border-t border-stone-200 flex items-center gap-2">
            {/* Mic Toggle Button */}
            <button
              type="button"
              onClick={toggleVoiceListening}
              className={`p-2.5 rounded-xl border transition-colors shrink-0 flex items-center justify-center ${
                isListening
                  ? 'bg-rose-50 border-rose-300 text-rose-600 animate-pulse'
                  : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
              }`}
              title={isListening ? t.voiceInputStop : t.voiceInputStart}
            >
              {isListening ? <MicOff className="w-5 h-5 text-rose-600" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Text Input */}
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
              placeholder={isListening ? t.voiceInputListening : t.chatPlaceholder}
              disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-xl border border-stone-200 text-stone-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
            />

            {/* Send Button */}
            <button
              type="button"
              onClick={() => handleSendMessage()}
              disabled={loading || !inputValue.trim()}
              className="p-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 disabled:bg-stone-200 text-white font-semibold transition-colors shrink-0"
              aria-label={t.sendBtn}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column: Key Discoveries & Answer Summary */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-stone-200 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h2 className="text-sm font-bold text-stone-900">{t.summaryTitle}</h2>
                <p className="text-[11px] text-stone-600">Review before recommendation</p>
              </div>
              <button
                onClick={() => setEditingSummary(!editingSummary)}
                className="text-xs text-emerald-800 font-semibold hover:underline flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{editingSummary ? 'Done' : 'Edit'}</span>
              </button>
            </div>

            {/* Answer List */}
            <div className="space-y-3 text-xs text-stone-700">
              <div>
                <span className="font-semibold text-stone-900">Preferred Sector:</span>
                {editingSummary ? (
                  <input
                    type="text"
                    value={summary.preferredSector || ''}
                    onChange={(e) => setSummary({ ...summary, preferredSector: e.target.value })}
                    className="w-full mt-1 p-2 border rounded-lg text-xs"
                  />
                ) : (
                  <p className="text-stone-600 mt-0.5">{summary.preferredSector}</p>
                )}
              </div>

              <div>
                <span className="font-semibold text-stone-900">Available Space / Shop:</span>
                {editingSummary ? (
                  <input
                    type="text"
                    value={summary.spaceAvailable || ''}
                    onChange={(e) => setSummary({ ...summary, spaceAvailable: e.target.value })}
                    className="w-full mt-1 p-2 border rounded-lg text-xs"
                  />
                ) : (
                  <p className="text-stone-600 mt-0.5">{summary.spaceAvailable}</p>
                )}
              </div>

              <div>
                <span className="font-semibold text-stone-900">Daily Time Commitment:</span>
                {editingSummary ? (
                  <input
                    type="text"
                    value={summary.dailyTimeAvailable || ''}
                    onChange={(e) => setSummary({ ...summary, dailyTimeAvailable: e.target.value })}
                    className="w-full mt-1 p-2 border rounded-lg text-xs"
                  />
                ) : (
                  <p className="text-stone-600 mt-0.5">{summary.dailyTimeAvailable}</p>
                )}
              </div>

              <div>
                <span className="font-semibold text-stone-900">Electricity / Three-Phase:</span>
                {editingSummary ? (
                  <input
                    type="text"
                    value={summary.electricityAccess || ''}
                    onChange={(e) => setSummary({ ...summary, electricityAccess: e.target.value })}
                    className="w-full mt-1 p-2 border rounded-lg text-xs"
                  />
                ) : (
                  <p className="text-stone-600 mt-0.5">{summary.electricityAccess}</p>
                )}
              </div>

              <div>
                <span className="font-semibold text-stone-900">Key Target Customers:</span>
                {editingSummary ? (
                  <input
                    type="text"
                    value={summary.keyTargetAudience || ''}
                    onChange={(e) => setSummary({ ...summary, keyTargetAudience: e.target.value })}
                    className="w-full mt-1 p-2 border rounded-lg text-xs"
                  />
                ) : (
                  <p className="text-stone-600 mt-0.5">{summary.keyTargetAudience}</p>
                )}
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="pt-3 border-t border-stone-100">
              <button
                onClick={onProceedToRecommendations}
                className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs sm:text-sm rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2"
              >
                <span>{t.generateRecommendationsBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* AI Grounding Disclaimer */}
          <div className="p-3.5 bg-stone-100 rounded-2xl border border-stone-200 text-[11px] text-stone-600 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-stone-600 shrink-0 mt-0.5" />
            <p>{t.disclaimerAi}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
