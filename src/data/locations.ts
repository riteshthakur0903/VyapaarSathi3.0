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
];
