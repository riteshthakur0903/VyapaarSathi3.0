import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Gemini API integration
  const apiKey = process.env.GEMINI_API_KEY;
  let ai: GoogleGenAI | null = null;
  if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
    ai = new GoogleGenAI({ apiKey });
  }

  // Advisor Chat Endpoint
  app.post('/api/advisor/chat', async (req, res) => {
    try {
      const { messages, userProfile, language = 'en' } = req.body;

      if (!ai) {
        return res.json({
          status: 'fallback',
          message: getFallbackAdvisorResponse(messages, userProfile, language),
        });
      }

      const langInstructions = {
        hi: 'उत्तर सरल, व्यावहारिक और स्पष्ट हिंदी में दें (Devanagari script)। ग्रामीण उद्यमी के लिए सम्मानजनक और प्रोत्साहक लहजा रखें।',
        mr: 'उत्तर सोप्या, व्यावहारिक आणि स्पष्ट मराठीत द्या (Devanagari script)। ग्रामीण नवउद्योजकासाठी आदरयुक्त आणि मार्गदर्शक सूर ठेवा.',
        en: 'Respond in clear, friendly, practical English suited for a first-time rural entrepreneur.',
      }[language as 'hi' | 'mr' | 'en'] || 'Respond in clear, friendly English.';

      const systemPrompt = `You are VyapaarSathi Advisor, a warm, trustworthy, and realistic micro-business advisor for rural entrepreneurs in India.
Current User Profile:
- Name: ${userProfile?.name || 'Friend'}
- Location: Village: ${userProfile?.village || 'Local'}, Block/Tehsil: ${userProfile?.block || 'Local'}, District: ${userProfile?.district || 'Not specified'}, State: ${userProfile?.state || 'Not specified'}
- Occupation: ${userProfile?.occupation || 'General'}
- Existing Skills/Experience: ${userProfile?.skills || 'Open to learning'}
- Available Self Capital: ₹${userProfile?.investment || '50000'}
- Open to Loan: ${userProfile?.loanOpenness || 'Yes'}

Guidelines:
1. Always keep advice grounded in rural Indian reality (local mandi markets, power availability, seasonal cash flow, raw material access).
2. ${langInstructions}
3. Emphasize that business ideas require ground verification (never claim verified government approval).
4. Keep replies concise (2-4 brief conversational paragraphs or bullet points). Ask 1 practical follow-up question to help narrow their choice.
5. If discussing costs or schemes, reference realistic benchmarks like Mudra, PMEGP, or PMFME.`;

      // Format messages for Gemini
      const conversationHistory = (messages || []).map((m: { role: string; content: string }) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }],
      }));

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          { role: 'user', parts: [{ text: `System context: ${systemPrompt}` }] },
          ...conversationHistory,
        ],
      });

      const replyText = response.text || '';
      return res.json({
        status: 'success',
        message: replyText,
      });
    } catch (error: any) {
      console.error('Advisor chat error:', error?.message || error);
      // Fallback seamlessly on error so UI never breaks
      const { messages, userProfile, language = 'en' } = req.body || {};
      return res.json({
        status: 'fallback',
        message: getFallbackAdvisorResponse(messages, userProfile, language),
      });
    }
  });

  // Fallback function for offline / no-API-key mode
  function getFallbackAdvisorResponse(messages: any[], userProfile: any, language: string) {
    const userMsg = messages && messages.length > 0 ? messages[messages.length - 1].content.toLowerCase() : '';
    const loc = userProfile?.district ? `${userProfile.district}, ${userProfile.state || ''}` : 'your area';

    if (language === 'hi') {
      if (userMsg.includes('दाल') || userMsg.includes('आटा') || userMsg.includes('मसाला')) {
        return `आपके क्षेत्र (${loc}) में दलहन और मसाला प्रसंस्करण की बहुत अच्छी संभावना है।\n\n1. मुख्य लाभ: स्थानीय किसानों से सीधे चना, तुअर या मिर्च खरीदकर गाँव और नजदीकी कस्बे में 20-25% बेहतर मार्जिन पर बेच सकते हैं।\n2. प्रारंभिक लागत: लगभग ₹1.8 से ₹2.5 लाख (छोटा पल्वराइजर, क्लीनर और सीलिंग मशीन)।\n3. सरकारी सहायता: PMEGP योजना के तहत ग्रामीण क्षेत्र में 35% तक सब्सिडी मिल सकती है।\n\nक्या आपके पास गाँव में 200-300 वर्ग फुट पक्की जगह और 3-फेज बिजली कनेक्शन की सुविधा है?`;
      }
      return `नमस्ते ${userProfile?.name || ''}! आपके पास ₹${userProfile?.investment || '50,000'} की शुरुआती पूंजी है।\n\n${loc} के बाजार को देखते हुए, हमारे पास 3 व्यावहारिक विकल्प हैं:\n1. लघु दाल व मसाला चक्की (स्थिर मांग)\n2. सोलर कोल्ड स्टोरेज / सब्जी संकलन केंद्र\n3. ग्रामीण ग्राहक सेवा व ई-कॉमर्स वितरण केंद्र\n\nआपको निर्माण (manufacturing) का काम पसंद है या सेवा/दुकान (services/retail) का?`;
    }

    if (language === 'mr') {
      if (userMsg.includes('दूध') || userMsg.includes('डेअरी')) {
        return `आपल्या भागात (${loc}) दुग्धव्यवसाय आणि दूध संकलन केंद्र अतिशय फायदेशीर ठरू शकते.\n\n1. फायदा: दररोज रोख रक्कम आणि सहकारी किंवा खाजगी डेअरीकडून खात्रीशीर खरेदी.\n2. प्राथमिक खर्च: 2 उच्च प्रतीच्या म्हशी/गाई + दूध टेस्टिंग फॅट मशीन यासाठी अंदाजे ₹2.5 ते ₹3 लाख लागतील.\n3. योजना: नाबार्ड (NABARD) किंवा अण्णासाहेब पाटील महामंडळाकडून कर्ज व्याज परतावा मिळू शकतो.\n\nतुमच्याकडे जनावरांसाठी चारा आणि गोठ्याची जागा उपलब्ध आहे का?`;
      }
      return `नमस्कार ${userProfile?.name || ''}! आपल्याकडे ₹${userProfile?.investment || '50,000'} चे भांडवल उपलब्ध आहे.\n\n${loc} परिसरातील गरजा लक्षात घेता हे पर्याय उत्तम आहेत:\n1. मिनी डाळ मिल व मसाला उद्योग\n2. आधुनिक दुग्ध व्यवसाय व संकलन\n3. कृषी अवजारे भाडेतत्त्व केंद्र\n\nतुम्हाला शेतीशी संबंधित प्रक्रिया उद्योग आवडेल की सेवा केंद्र सुरू करायचे आहे?`;
    }

    return `Hello ${userProfile?.name || 'there'}! With your self-investment of ₹${userProfile?.investment || '50,000'} in ${loc}, you have solid foundational options.\n\nBased on rural demand in your block:\n1. Mini Grain & Spice Processing Unit (High recurring daily demand)\n2. Dairy & Chilling Collection Hub (Steady cashflow with dairy co-op tie-ups)\n3. Rural CSC & Logistics Delivery Point (Low asset cost, fast setup)\n\nDo you already have access to a small roadside space or room with electrical connection, or would you need to rent one?`;
  }

  // Health endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'VyapaarSathi backend', geminiActive: !!ai });
  });

  // Reverse Geocode Endpoint (Maps GPS Coordinates -> Real Village, Block, District, State)
  app.post('/api/location/reverse-geocode', async (req, res) => {
    try {
      const { latitude, longitude } = req.body;
      if (!latitude || !longitude) {
        return res.status(400).json({ error: 'Missing latitude or longitude' });
      }

      // Query OpenStreetMap Nominatim reverse geocode
      const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`;
      const response = await fetch(nominatimUrl, {
        headers: {
          'User-Agent': 'VyapaarSathi/1.0 (rural-business-advisory; support@vyapaarsathi.org)',
          'Accept-Language': 'en,hi',
        },
      });

      if (response.ok) {
        const data: any = await response.json();
        const address = data.address || {};

        const village =
          address.village ||
          address.hamlet ||
          address.suburb ||
          address.neighbourhood ||
          address.town ||
          address.city_district ||
          address.city ||
          '';

        const block =
          address.subdistrict ||
          address.county ||
          address.tehsil ||
          address.taluka ||
          address.municipality ||
          '';

        const district =
          address.state_district ||
          address.county ||
          address.district ||
          address.city ||
          '';

        const state = address.state || address.region || '';
        const pincode = address.postcode || '';
        const country = address.country || '';

        return res.json({
          status: 'success',
          location: {
            latitude: Number(latitude),
            longitude: Number(longitude),
            village,
            block,
            district,
            state,
            pincode,
            country,
            displayName: data.display_name || '',
          },
        });
      }

      // Fallback to BigDataCloud
      const bdcUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
      const bdcResp = await fetch(bdcUrl);
      if (bdcResp.ok) {
        const bdcData: any = await bdcResp.json();
        const village = bdcData.locality || bdcData.city || '';
        const state = bdcData.principalSubdivision || '';
        const adminLevels = bdcData.localityInfo?.administrative || [];
        const districtObj = adminLevels.find((a: any) => a.order === 4 || a.order === 5) || {};
        const district = districtObj.name || bdcData.city || '';

        return res.json({
          status: 'success',
          location: {
            latitude: Number(latitude),
            longitude: Number(longitude),
            village,
            block: '',
            district,
            state,
            country: bdcData.countryName || 'India',
            displayName: `${village}, ${district}, ${state}`,
          },
        });
      }

      return res.status(500).json({ error: 'Reverse geocode failed' });
    } catch (err: any) {
      console.error('Reverse geocode error:', err);
      return res.status(500).json({ error: err?.message || 'Geocoding service error' });
    }
  });

  // Search Places Endpoint (search villages, towns, districts)
  app.get('/api/location/search', async (req, res) => {
    try {
      const q = req.query.q as string;
      if (!q || q.length < 2) {
        return res.json({ results: [] });
      }

      const searchUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        q
      )}&format=json&addressdetails=1&countrycodes=in&limit=6`;
      const response = await fetch(searchUrl, {
        headers: {
          'User-Agent': 'VyapaarSathi/1.0 (rural-business-advisory)',
          'Accept-Language': 'en,hi',
        },
      });

      if (response.ok) {
        const data: any[] = await response.json();
        const results = data.map((item) => {
          const addr = item.address || {};
          return {
            displayName: item.display_name,
            latitude: parseFloat(item.lat),
            longitude: parseFloat(item.lon),
            village:
              addr.village ||
              addr.hamlet ||
              addr.suburb ||
              addr.town ||
              addr.city ||
              '',
            block: addr.subdistrict || addr.county || '',
            district: addr.state_district || addr.county || addr.city || '',
            state: addr.state || '',
            pincode: addr.postcode || '',
          };
        });
        return res.json({ results });
      }

      return res.json({ results: [] });
    } catch (err) {
      return res.json({ results: [] });
    }
  });

  // IP Location Fallback Endpoint
  app.get('/api/location/ip-lookup', async (req, res) => {
    try {
      const resp = await fetch('https://ipapi.co/json/');
      if (resp.ok) {
        const data: any = await resp.json();
        return res.json({
          status: 'success',
          location: {
            latitude: data.latitude,
            longitude: data.longitude,
            village: data.city || '',
            block: '',
            district: data.region || data.city || '',
            state: data.region || '',
            pincode: data.postal || '',
            country: data.country_name || 'India',
            displayName: `${data.city}, ${data.region}, ${data.country_name}`,
          },
        });
      }
      return res.status(500).json({ error: 'IP lookup failed' });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  // Mount Vite or static
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`VyapaarSathi server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
