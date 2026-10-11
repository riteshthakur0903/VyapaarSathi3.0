export interface DistrictInfo {
  name: string;
  nameHi: string;
  nameMr: string;
  blocks: string[];
  primaryCrops: string[];
  mandiHub: string;
}

export interface StateInfo {
  name: string;
  nameHi: string;
  nameMr: string;
  districts: DistrictInfo[];
}

export const INDIAN_STATES: StateInfo[] = [
  {
    name: 'Maharashtra',
    nameHi: 'महाराष्ट्र',
    nameMr: 'महाराष्ट्र',
    districts: [
      {
        name: 'Pune',
        nameHi: 'पुणे',
        nameMr: 'पुणे',
        blocks: ['Baramati', 'Junnar', 'Khed', 'Shirur', 'Indapur', 'Ambegaon', 'Maval'],
        primaryCrops: ['Sugarcane', 'Onions', 'Vegetables', 'Grapes', 'Dairy'],
        mandiHub: 'Baramati APMC & Gultekdi Mandi',
      },
      {
        name: 'Nashik',
        nameHi: 'नासिक',
        nameMr: 'नाशिक',
        blocks: ['Niphad', 'Dindori', 'Yeola', 'Sinnar', 'Kalwan', 'Malegaon'],
        primaryCrops: ['Onion', 'Grapes', 'Pomegranate', 'Tomato', 'Maize'],
        mandiHub: 'Lasalgaon Onion Mandi & Pimpalgaon APMC',
      },
      {
        name: 'Kolhapur',
        nameHi: 'कोल्हापुर',
        nameMr: 'कोल्हापूर',
        blocks: ['Karveer', 'Shirol', 'Hatkanangle', 'Radhanagari', 'Kagal', 'Panhala'],
        primaryCrops: ['Sugarcane', 'Jaggery (Gul)', 'Soybean', 'Dairy & Milk'],
        mandiHub: 'Kolhapur APMC & Shahu Market Yard',
      },
      {
        name: 'Satara',
        nameHi: 'सातारा',
        nameMr: 'सातारा',
        blocks: ['Karad', 'Wai', 'Koregaon', 'Patan', 'Phaltan', 'Mahabaleshwar'],
        primaryCrops: ['Strawberry', 'Ginger', 'Sugarcane', 'Turmeric', 'Dairy'],
        mandiHub: 'Karad Market Yard & Satara Mandi',
      },
      {
        name: 'Solapur',
        nameHi: 'सोलापुर',
        nameMr: 'सोलापूर',
        blocks: ['Pandharpur', 'Barshi', 'Sangola', 'Madha', 'Malshiras'],
        primaryCrops: ['Pomegranate', 'Jowar', 'Tur (Pigeon Pea)', 'Chilli'],
        mandiHub: 'Solapur Cotton & Grain APMC',
      },
      {
        name: 'Ahmednagar',
        nameHi: 'अहमदनगर',
        nameMr: 'अहिल्यानगर (अहमदनगर)',
        blocks: ['Sangamner', 'Rahata (Shirdi)', 'Kopargaon', 'Shrirampur', 'Newasa', 'Parner'],
        primaryCrops: ['Dairy', 'Millets', 'Soybean', 'Guava', 'Onion'],
        mandiHub: 'Sangamner Milk & Vegetable Hub',
      },
      {
        name: 'Nagpur',
        nameHi: 'नागपुर',
        nameMr: 'नागपूर',
        blocks: ['Katol', 'Ramtek', 'Saoner', 'Umred', 'Narkhed', 'Hingna'],
        primaryCrops: ['Oranges', 'Cotton', 'Soybean', 'Tur (Arhar)'],
        mandiHub: 'Nagpur Kalamna Market Yard',
      },
    ],
  },
  {
    name: 'Uttar Pradesh',
    nameHi: 'उत्तर प्रदेश',
    nameMr: 'उत्तर प्रदेश',
    districts: [
      {
        name: 'Varanasi',
        nameHi: 'वाराणसी',
        nameMr: 'वाराणसी',
        blocks: ['Pindra', 'Kashi Vidyapeeth', 'Araziline', 'Sewapuri', 'Cholapur'],
        primaryCrops: ['Paddy', 'Wheat', 'Vegetables', 'Mango', 'Mustard'],
        mandiHub: 'Panchkoshi APMC Mandi',
      },
      {
        name: 'Gorakhpur',
        nameHi: 'गोरखपुर',
        nameMr: 'गोरखपूर',
        blocks: ['Pipraich', 'Sahjanwa', 'Bansgaon', 'Campierganj', 'Chauri Chaura'],
        primaryCrops: ['Paddy', 'Sugarcane', 'Mustard', 'Maize'],
        mandiHub: 'Gorakhpur Mahewa Mandi',
      },
      {
        name: 'Lucknow',
        nameHi: 'लखनऊ',
        nameMr: 'लखनौ',
        blocks: ['Bakshi Ka Talab', 'Malihabad', 'Mohanlalganj', 'Sarojini Nagar', 'Gosainganj'],
        primaryCrops: ['Mango (Dasheri)', 'Wheat', 'Paddy', 'Vegetables'],
        mandiHub: 'Dubagga Mandi & Naveen Galla Mandi',
      },
      {
        name: 'Prayagraj',
        nameHi: 'प्रयागराज',
        nameMr: 'प्रयागराज',
        blocks: ['Phulpur', 'Koraon', 'Handia', 'Karchhana', 'Meja', 'Soraon'],
        primaryCrops: ['Guava (Allahabadi)', 'Paddy', 'Wheat', 'Pulses'],
        mandiHub: 'Mundera Mandi Prayagraj',
      },
    ],
  },
  {
    name: 'Madhya Pradesh',
    nameHi: 'मध्य प्रदेश',
    nameMr: 'मध्य प्रदेश',
    districts: [
      {
        name: 'Indore',
        nameHi: 'इंदौर',
        nameMr: 'इंदूर',
        blocks: ['Depalpur', 'Sanwer', 'Mhow (Dr. Ambedkar Nagar)'],
        primaryCrops: ['Soybean', 'Wheat (Sharbati)', 'Garlic', 'Potato', 'Onion'],
        mandiHub: 'Indore Chhavani Krishi Upaj Mandi',
      },
      {
        name: 'Ujjain',
        nameHi: 'उज्जैन',
        nameMr: 'उज्जैन',
        blocks: ['Nagda', 'Badnagar', 'Mahidpur', 'Tarana', 'Khachrod'],
        primaryCrops: ['Soybean', 'Wheat', 'Gram (Chana)', 'Garlic'],
        mandiHub: 'Ujjain Chimanganj Mandi',
      },
      {
        name: 'Bhopal',
        nameHi: 'भोपाल',
        nameMr: 'भोपाळ',
        blocks: ['Berasia', 'Phanda'],
        primaryCrops: ['Wheat', 'Gram', 'Soybean', 'Dairy'],
        mandiHub: 'Karond Krishi Upaj Mandi Bhopal',
      },
    ],
  },
  {
    name: 'Bihar',
    nameHi: 'बिहार',
    nameMr: 'बिहार',
    districts: [
      {
        name: 'Muzaffarpur',
        nameHi: 'मुजफ्फरपुर',
        nameMr: 'मुझफ्फरपूर',
        blocks: ['Kanti', 'Motipur', 'Sakra', 'Minapur', 'Paroo', 'Sahebganj'],
        primaryCrops: ['Litchi (Shahi)', 'Maize', 'Paddy', 'Tobacco', 'Banana'],
        mandiHub: 'Brahmpura Krishi Mandi Muzaffarpur',
      },
      {
        name: 'Patna',
        nameHi: 'पटना',
        nameMr: 'पाटणा',
        blocks: ['Danapur', 'Phulwari Sharif', 'Bikram', 'Masaurhi', 'Bihta', 'Paliganj'],
        primaryCrops: ['Paddy', 'Wheat', 'Pulses', 'Vegetables'],
        mandiHub: 'Mithapur Bazar Samiti Patna',
      },
      {
        name: 'Gaya',
        nameHi: 'गया',
        nameMr: 'गया',
        blocks: ['Bodh Gaya', 'Sherghati', 'Tekari', 'Wazirganj', 'Manpur'],
        primaryCrops: ['Paddy', 'Wheat', 'Til (Sesame)', 'Gram'],
        mandiHub: 'Gaya Bazar Samiti Mandi',
      },
    ],
  },
  {
    name: 'Rajasthan',
    nameHi: 'राजस्थान',
    nameMr: 'राजस्थान',
    districts: [
      {
        name: 'Jaipur',
        nameHi: 'जयपुर',
        nameMr: 'जयपूर',
        blocks: ['Chomu', 'Kotputli', 'Amer', 'Bassie', 'Chaksu', 'Phulera'],
        primaryCrops: ['Mustard', 'Bajra (Pearl Millet)', 'Barley', 'Vegetables'],
        mandiHub: 'Muhana Terminal Mandi & Surajpole Mandi',
      },
      {
        name: 'Jodhpur',
        nameHi: 'जोधपुर',
        nameMr: 'जोधपूर',
        blocks: ['Bilara', 'Bhopalgarh', 'Osian', 'Phalodi', 'Piparcity'],
        primaryCrops: ['Guar Gum', 'Cumin (Jeera)', 'Bajra', 'Moong Dal'],
        mandiHub: 'Bhagat Ki Kothi Krishi Mandi',
      },
    ],
  },
  {
    name: 'Karnataka',
    nameHi: 'कर्नाटक',
    nameMr: 'कर्नाटक',
    districts: [
      {
        name: 'Belagavi',
        nameHi: 'बेलगावी',
        nameMr: 'बेळगाव',
        blocks: ['Chikkodi', 'Gokak', 'Athani', 'Bailhongal', 'Khanapur', 'Hukkeri'],
        primaryCrops: ['Sugarcane', 'Maize', 'Soybean', 'Vegetables', 'Dairy'],
        mandiHub: 'APMC Market Belagavi',
      },
      {
        name: 'Mysuru',
        nameHi: 'मैसूरु',
        nameMr: 'म्हैसूर',
        blocks: ['Nanjangud', 'Hunsur', 'T. Narasipura', 'Periyapatna', 'K.R. Nagar'],
        primaryCrops: ['Banana', 'Paddy', 'Ragi (Finger Millet)', 'Silk Cocoon'],
        mandiHub: 'Bandipalya APMC Mysuru',
      },
    ],
  },
  {
    name: 'Gujarat',
    nameHi: 'गुजरात',
    nameMr: 'गुजरात',
    districts: [
      {
        name: 'Ahmedabad',
        nameHi: 'अहमदाबाद',
        nameMr: 'अहमदाबाद',
        blocks: ['Dholka', 'Sanand', 'Dhandhuka', 'Viramgam', 'Bavla'],
        primaryCrops: ['Cotton', 'Wheat (Bhalia)', 'Paddy', 'Castor'],
        mandiHub: 'Jamalpur APMC & Sanand Mandi',
      },
      {
        name: 'Surat',
        nameHi: 'सूरत',
        nameMr: 'सुरत',
        blocks: ['Bardoli', 'Olpad', 'Mahuva', 'Mandvi', 'Kamrej'],
        primaryCrops: ['Sugarcane', 'Banana', 'Paddy', 'Vegetables'],
        mandiHub: 'Sardar Market Surat',
      },
      {
        name: 'Rajkot',
        nameHi: 'राजकोट',
        nameMr: 'राजकोट',
        blocks: ['Gondal', 'Jasdan', 'Jetpur', 'Dhoraji', 'Upleta'],
        primaryCrops: ['Groundnut (Peanut)', 'Cotton', 'Sesame', 'Cumin'],
        mandiHub: 'Gondal APMC & Rajkot Bedi Market Yard',
      },
    ],
  },
  {
    name: 'Punjab',
    nameHi: 'पंजाब',
    nameMr: 'पंजाब',
    districts: [
      {
        name: 'Ludhiana',
        nameHi: 'लुधियाना',
        nameMr: 'लुधियाना',
        blocks: ['Jagraon', 'Samrala', 'Khanna', 'Raikot'],
        primaryCrops: ['Wheat', 'Paddy', 'Maize', 'Dairy'],
        mandiHub: 'Khanna Grain Market (Asia largest grain mandi)',
      },
      {
        name: 'Amritsar',
        nameHi: 'अमृतसर',
        nameMr: 'अमृतसर',
        blocks: ['Ajnala', 'Majitha', 'Rayya', 'Verka'],
        primaryCrops: ['Basmati Paddy', 'Wheat', 'Vegetables', 'Dairy'],
        mandiHub: 'Bhagtanwala Dana Mandi Amritsar',
      },
    ],
  },
  {
    name: 'Haryana',
    nameHi: 'हरियाणा',
    nameMr: 'हरियाणा',
    districts: [
      {
        name: 'Karnal',
        nameHi: 'करनाल',
        nameMr: 'करनाल',
        blocks: ['Gharaunda', 'Assandh', 'Indri', 'Nilokheri'],
        primaryCrops: ['Basmati Rice', 'Wheat', 'Mustard', 'Sugarcane'],
        mandiHub: 'Karnal Grain Market',
      },
      {
        name: 'Hisar',
        nameHi: 'हिसार',
        nameMr: 'हिसार',
        blocks: ['Hansi', 'Barwala', 'Adampur', 'Narnaund'],
        primaryCrops: ['Cotton', 'Wheat', 'Mustard', 'Gram'],
        mandiHub: 'Hisar Anaj Mandi',
      },
    ],
  },
  {
    name: 'West Bengal',
    nameHi: 'पश्चिम बंगाल',
    nameMr: 'पश्चिम बंगाल',
    districts: [
      {
        name: 'Burdwan (Purba Bardhaman)',
        nameHi: 'बर्धमान',
        nameMr: 'बर्धमान',
        blocks: ['Kalna', 'Katwa', 'Memari', 'Raina'],
        primaryCrops: ['Paddy (Rice Bowl of Bengal)', 'Potato', 'Jute', 'Mustard'],
        mandiHub: 'Burdwan Regulated Market',
      },
      {
        name: 'Hooghly',
        nameHi: 'हुगली',
        nameMr: 'हुगळी',
        blocks: ['Arambagh', 'Singur', 'Pandua', 'Dhaniakhali'],
        primaryCrops: ['Potato', 'Paddy', 'Vegetables', 'Jute'],
        mandiHub: 'Singur Krishi Mandi',
      },
    ],
  },
  {
    name: 'Odisha',
    nameHi: 'ओडिशा',
    nameMr: 'ओडिशा',
    districts: [
      {
        name: 'Cuttack',
        nameHi: 'कटक',
        nameMr: 'कटक',
        blocks: ['Banki', 'Athagarh', 'Salepur', 'Tangi-Choudwar'],
        primaryCrops: ['Paddy', 'Pulses', 'Vegetables', 'Dairy'],
        mandiHub: 'Cuttack Malgodown & RMC Yard',
      },
      {
        name: 'Sambalpur',
        nameHi: 'संबलपुर',
        nameMr: 'संबलपूर',
        blocks: ['Rairakhol', 'Kuchinda', 'Dhankauda'],
        primaryCrops: ['Paddy', 'Chillies', 'Vegetables'],
        mandiHub: 'Khetrajpur RMC Mandi',
      },
    ],
  },
  {
    name: 'Telangana',
    nameHi: 'तेलंगाना',
    nameMr: 'तेलंगणा',
    districts: [
      {
        name: 'Warangal',
        nameHi: 'वारंगल',
        nameMr: 'वारंगळ',
        blocks: ['Narsampet', 'Wardhannapet', 'Geesugonda', 'Parkal'],
        primaryCrops: ['Chilli', 'Cotton', 'Paddy', 'Turmeric'],
        mandiHub: 'Warangal Enamamula Grain & Chilli Market (Largest in South India)',
      },
      {
        name: 'Nizamabad',
        nameHi: 'निजामाबाद',
        nameMr: 'निजामाबाद',
        blocks: ['Armoor', 'Bodhan', 'Bheemgal'],
        primaryCrops: ['Turmeric', 'Paddy', 'Soybean', 'Maize'],
        mandiHub: 'Nizamabad Turmeric Market Yard',
      },
    ],
  },
  {
    name: 'Andhra Pradesh',
    nameHi: 'आंध्र प्रदेश',
    nameMr: 'आंध्र प्रदेश',
    districts: [
      {
        name: 'Guntur',
        nameHi: 'गुंटूर',
        nameMr: 'गुंटूर',
        blocks: ['Tenali', 'Mangalagiri', 'Ponnur', 'Sattenapalle'],
        primaryCrops: ['Red Chilli', 'Cotton', 'Tobacco', 'Paddy'],
        mandiHub: 'Guntur Mirchi Yard (Asia largest chilli market)',
      },
    ],
  },
  {
    name: 'Tamil Nadu',
    nameHi: 'तमिलनाडु',
    nameMr: 'तमिळनाडू',
    districts: [
      {
        name: 'Coimbatore',
        nameHi: 'कोयंबटूर',
        nameMr: 'कोइम्बतूर',
        blocks: ['Pollachi', 'Sulur', 'Mettupalayam', 'Annur'],
        primaryCrops: ['Coconut', 'Poultry & Dairy', 'Vegetables', 'Tea'],
        mandiHub: 'Pollachi Coconut & Jaggery Market',
      },
    ],
  },
  {
    name: 'Delhi',
    nameHi: 'दिल्ली',
    nameMr: 'दिल्ली',
    districts: [
      {
        name: 'North West Delhi',
        nameHi: 'उत्तर पश्चिम दिल्ली',
        nameMr: 'उत्तर पश्चिम दिल्ली',
        blocks: ['Narela', 'Alipur', 'Kanjhawala'],
        primaryCrops: ['Vegetables', 'Wheat', 'Dairy'],
        mandiHub: 'Narela Anaj Mandi & Azadpur Sabzi Mandi',
      },
    ],
  },
];

/**
 * Finds matching state or dynamically registers new state & district
 */
export function ensureStateAndDistrict(
  stateName?: string,
  districtName?: string,
  blockName?: string
): { matchedState: string; matchedDistrict: string; matchedBlock: string } {
  if (!stateName) {
    return {
      matchedState: INDIAN_STATES[0].name,
      matchedDistrict: INDIAN_STATES[0].districts[0].name,
      matchedBlock: INDIAN_STATES[0].districts[0].blocks[0] || '',
    };
  }

  // Clean strings (remove trailing "State", "District", etc.)
  const cleanState = stateName
    .replace(/\s+State$/i, '')
    .replace(/^State\s+of\s+/i, '')
    .trim();

  const cleanDist = (districtName || '')
    .replace(/\s+District$/i, '')
    .replace(/\s+Division$/i, '')
    .trim();

  // Try exact or partial state match
  let stateObj = INDIAN_STATES.find(
    (s) =>
      s.name.toLowerCase() === cleanState.toLowerCase() ||
      cleanState.toLowerCase().includes(s.name.toLowerCase()) ||
      s.name.toLowerCase().includes(cleanState.toLowerCase())
  );

  // If state is not in list, dynamically inject it into INDIAN_STATES
  if (!stateObj) {
    stateObj = {
      name: cleanState,
      nameHi: cleanState,
      nameMr: cleanState,
      districts: [],
    };
    INDIAN_STATES.push(stateObj);
  }

  // Check district
  const targetDistName = cleanDist || (stateObj.districts[0]?.name ?? 'Rural Center');
  let districtObj = stateObj.districts.find(
    (d) =>
      d.name.toLowerCase() === targetDistName.toLowerCase() ||
      targetDistName.toLowerCase().includes(d.name.toLowerCase()) ||
      d.name.toLowerCase().includes(targetDistName.toLowerCase())
  );

  // If district is not in list, dynamically inject it
  if (!districtObj) {
    districtObj = {
      name: targetDistName,
      nameHi: targetDistName,
      nameMr: targetDistName,
      blocks: blockName ? [blockName] : ['Central Block', 'Gram Tehsil'],
      primaryCrops: ['Grains', 'Pulses', 'Vegetables', 'Dairy'],
      mandiHub: `${targetDistName} APMC Mandi Yard`,
    };
    stateObj.districts.push(districtObj);
  } else if (blockName && !districtObj.blocks.includes(blockName)) {
    districtObj.blocks.unshift(blockName);
  }

  return {
    matchedState: stateObj.name,
    matchedDistrict: districtObj.name,
    matchedBlock: blockName || districtObj.blocks[0] || 'Main Tehsil',
  };
}
