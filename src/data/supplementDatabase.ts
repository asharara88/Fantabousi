// Comprehensive supplement database based on biowell_all_supplements.json
export interface Supplement {
  id: string;
  name: string;
  category: string;
  use_case: string;
  tier: 'Green' | 'Orange' | 'Moderate';
  dose_typical: string;
  evidence_quality: 'Strong' | 'Moderate' | 'Emerging';
  price_aed: number;
  subscription_discount_percent: number;
  discounted_price_aed: number;
  image_url: string;
  form_image_url?: string;
  description?: string;
  benefits?: string[];
  warnings?: string[];
  interactions?: string[];
}

// Create supplement ID from name (normalize for consistency)
const createSupplementId = (name: string): string => {
  return name.toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters except hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/--+/g, '-') // Replace multiple hyphens with single
    .trim();
};

// Map supplement names to available local images
const supplementImageMap: Record<string, string> = {
  'ashwagandha': '/supplements/ashwagandha.svg',
  'coq10': '/supplements/coq10.svg',
  'creatine-monohydrate': '/supplements/creatine.svg',
  'creatine': '/supplements/creatine.svg',
  'curcumin': '/supplements/curcumin.svg',
  'iron-ferrous-bisglycinate': '/supplements/iron.svg',
  'iron': '/supplements/iron.svg',
  'magnesium-glycinate': '/supplements/magnesium-glycinate.svg',
  'magnesium': '/supplements/magnesium-glycinate.svg',
  'omega-3-epa-dha': '/supplements/omega-3.svg',
  'omega-3': '/supplements/omega-3.svg',
  'probiotics': '/supplements/probiotics.svg',
  'vitamin-b12': '/supplements/vitamin-b12.svg',
  'b12': '/supplements/vitamin-b12.svg',
  'vitamin-c': '/supplements/vitamin-c.svg',
  'vitamin-d3': '/supplements/vitamin-d3.svg',
  'vitamin-d': '/supplements/vitamin-d3.svg',
  'zinc-picolinate': '/supplements/zinc.svg',
  'zinc': '/supplements/zinc.svg',
  'zinc-carnosine': '/supplements/zinc.svg',
};

// Get appropriate image for supplement
const getSupplementImage = (name: string): string => {
  const normalizedName = createSupplementId(name);
  
  // Check for exact match first
  if (supplementImageMap[normalizedName]) {
    return supplementImageMap[normalizedName];
  }
  
  // Check for partial matches
  for (const [key, imagePath] of Object.entries(supplementImageMap)) {
    if (normalizedName.includes(key) || key.includes(normalizedName.split('-')[0])) {
      return imagePath;
    }
  }
  
  // Default fallback image
  return '/supplements/vitamin-c.svg'; // Use vitamin C as generic supplement icon
};

// Enhanced supplement descriptions
const supplementDescriptions: Record<string, string> = {
  'magnesium-glycinate': 'Highly bioavailable form of magnesium that supports deep sleep, muscle relaxation, and stress reduction.',
  'rhodiola-rosea': 'Adaptogenic herb that helps regulate cortisol levels and combat fatigue while supporting mental performance.',
  'ashwagandha': 'Powerful adaptogen that enhances stress resilience, supports healthy testosterone levels, and improves sleep quality.',
  'tongkat-ali': 'Traditional Malaysian herb known for supporting healthy testosterone levels and male vitality.',
  'creatine-monohydrate': 'The gold standard for muscle building and performance enhancement, extensively researched and proven effective.',
  'vitamin-d3': 'Essential vitamin for immune function, bone health, and hormone production. Most people are deficient.',
  'omega-3-epa-dha': 'Essential fatty acids crucial for heart health, brain function, and reducing inflammation.',
  'zinc-picolinate': 'Highly absorbable form of zinc essential for immune function, hormone production, and wound healing.',
  'melatonin': 'Natural sleep hormone that helps regulate circadian rhythms and improve sleep onset.',
  'berberine': 'Powerful compound that supports healthy blood sugar levels and metabolic function.',
  'probiotics': 'Beneficial bacteria that support digestive health, immune function, and mental well-being.',
  'l-citrulline': 'Amino acid that enhances blood flow, supports cardiovascular health, and improves exercise performance.',
  'beta-alanine': 'Amino acid that buffers muscle acidity, allowing for longer, more intense training sessions.',
  'coq10': 'Essential coenzyme that supports mitochondrial function, heart health, and cellular energy production.',
  'curcumin': 'Potent anti-inflammatory compound from turmeric that supports joint health and overall wellness.',
};

// Convert JSON data to Supplement objects
const rawSupplements = [
  {
    "name": "Magnesium Glycinate",
    "category": "Sleep & Recovery",
    "use_case": "Deep sleep, muscle relaxation",
    "tier": "Green",
    "dose_typical": "200–400 mg",
    "evidence_quality": "Strong",
    "price_aed": 162,
    "subscription_discount_percent": 21,
    "discounted_price_aed": 127.98
  },
  {
    "name": "Rhodiola Rosea",
    "category": "Stress & Mood",
    "use_case": "Cortisol regulation, fatigue",
    "tier": "Green",
    "dose_typical": "200–400 mg",
    "evidence_quality": "Strong",
    "price_aed": 111,
    "subscription_discount_percent": 18,
    "discounted_price_aed": 91.02
  },
  {
    "name": "Ashwagandha",
    "category": "Stress & Mood",
    "use_case": "Adaptogen, stress resilience",
    "tier": "Green",
    "dose_typical": "300–600 mg",
    "evidence_quality": "Strong",
    "price_aed": 152,
    "subscription_discount_percent": 23,
    "discounted_price_aed": 117.04
  },
  {
    "name": "Tongkat Ali",
    "category": "Hormonal Support",
    "use_case": "Testosterone support",
    "tier": "Orange",
    "dose_typical": "200–400 mg",
    "evidence_quality": "Moderate",
    "price_aed": 74,
    "subscription_discount_percent": 17,
    "discounted_price_aed": 61.42
  },
  {
    "name": "Creatine Monohydrate",
    "category": "Hypertrophy",
    "use_case": "Muscle growth, performance",
    "tier": "Green",
    "dose_typical": "5 g",
    "evidence_quality": "Strong",
    "price_aed": 166,
    "subscription_discount_percent": 19,
    "discounted_price_aed": 134.46
  },
  {
    "name": "Vitamin D3",
    "category": "General Health",
    "use_case": "Immune support, bone health",
    "tier": "Green",
    "dose_typical": "2000–4000 IU",
    "evidence_quality": "Strong",
    "price_aed": 131,
    "subscription_discount_percent": 17,
    "discounted_price_aed": 108.73
  },
  {
    "name": "Omega-3 (EPA/DHA)",
    "category": "General Health",
    "use_case": "Heart & brain health",
    "tier": "Green",
    "dose_typical": "1000 mg",
    "evidence_quality": "Strong",
    "price_aed": 120,
    "subscription_discount_percent": 21,
    "discounted_price_aed": 94.8
  },
  {
    "name": "Zinc Picolinate",
    "category": "Hormonal Support",
    "use_case": "Hormonal balance",
    "tier": "Green",
    "dose_typical": "15–30 mg",
    "evidence_quality": "Strong",
    "price_aed": 80,
    "subscription_discount_percent": 19,
    "discounted_price_aed": 64.8
  },
  {
    "name": "Melatonin",
    "category": "Sleep & Recovery",
    "use_case": "Short-term sleep aid",
    "tier": "Orange",
    "dose_typical": "0.5–3 mg",
    "evidence_quality": "Moderate",
    "price_aed": 162,
    "subscription_discount_percent": 23,
    "discounted_price_aed": 124.74
  },
  {
    "name": "Berberine",
    "category": "Metabolism",
    "use_case": "Insulin sensitivity, metabolism",
    "tier": "Green",
    "dose_typical": "500 mg 2x/day",
    "evidence_quality": "Strong",
    "price_aed": 142,
    "subscription_discount_percent": 21,
    "discounted_price_aed": 112.18
  },
  {
    "name": "Probiotics",
    "category": "Gut Health",
    "use_case": "Digestive health",
    "tier": "Green",
    "dose_typical": "5–10 billion CFU",
    "evidence_quality": "Strong",
    "price_aed": 146,
    "subscription_discount_percent": 16,
    "discounted_price_aed": 122.64
  },
  {
    "name": "L-Citrulline",
    "category": "Endurance",
    "use_case": "Blood flow, pumps",
    "tier": "Green",
    "dose_typical": "6–8 g",
    "evidence_quality": "Strong",
    "price_aed": 134,
    "subscription_discount_percent": 18,
    "discounted_price_aed": 109.88
  },
  {
    "name": "Beta-Alanine",
    "category": "Endurance",
    "use_case": "Muscle endurance",
    "tier": "Green",
    "dose_typical": "3–6 g",
    "evidence_quality": "Strong",
    "price_aed": 134,
    "subscription_discount_percent": 23,
    "discounted_price_aed": 103.18
  },
  {
    "name": "CoQ10",
    "category": "Longevity",
    "use_case": "Mitochondrial function",
    "tier": "Green",
    "dose_typical": "100–200 mg",
    "evidence_quality": "Moderate",
    "price_aed": 147,
    "subscription_discount_percent": 16,
    "discounted_price_aed": 123.48
  },
  {
    "name": "Curcumin",
    "category": "Longevity",
    "use_case": "Inflammation control",
    "tier": "Green",
    "dose_typical": "500–1000 mg",
    "evidence_quality": "Moderate",
    "price_aed": 176,
    "subscription_discount_percent": 24,
    "discounted_price_aed": 133.76
  },
  {
    "name": "Bacopa Monnieri",
    "category": "Cognitive Support",
    "use_case": "Memory & learning",
    "tier": "Green",
    "dose_typical": "300–600 mg",
    "evidence_quality": "Strong",
    "price_aed": 159,
    "subscription_discount_percent": 23,
    "discounted_price_aed": 122.43
  },
  {
    "name": "Vitamin B12",
    "category": "General Health",
    "use_case": "Energy metabolism",
    "tier": "Green",
    "dose_typical": "500–1000 mcg",
    "evidence_quality": "Strong",
    "price_aed": 163,
    "subscription_discount_percent": 24,
    "discounted_price_aed": 123.88
  },
  {
    "name": "Iron (Ferrous Bisglycinate)",
    "category": "General Health",
    "use_case": "Anemia prevention",
    "tier": "Orange",
    "dose_typical": "18–27 mg",
    "evidence_quality": "Moderate",
    "price_aed": 83,
    "subscription_discount_percent": 19,
    "discounted_price_aed": 67.23
  },
  {
    "name": "Calcium Citrate",
    "category": "General Health",
    "use_case": "Bone support",
    "tier": "Green",
    "dose_typical": "500–1000 mg",
    "evidence_quality": "Strong",
    "price_aed": 62,
    "subscription_discount_percent": 16,
    "discounted_price_aed": 52.08
  },
  {
    "name": "Vitamin K2 (MK-7)",
    "category": "General Health",
    "use_case": "Calcium utilization",
    "tier": "Green",
    "dose_typical": "90–200 mcg",
    "evidence_quality": "Moderate",
    "price_aed": 81,
    "subscription_discount_percent": 18,
    "discounted_price_aed": 66.42
  }
  // Add more supplements as needed...
];

// Convert raw data to full supplement objects
export const SUPPLEMENTS_DATABASE: Supplement[] = rawSupplements.map(item => {
  const id = createSupplementId(item.name);
  const image_url = getSupplementImage(item.name);
  const description = supplementDescriptions[id] || `${item.use_case}. ${item.evidence_quality} evidence for effectiveness.`;
  
  return {
    id,
    name: item.name,
    category: item.category,
    use_case: item.use_case,
    tier: item.tier as 'Green' | 'Orange' | 'Moderate',
    dose_typical: item.dose_typical,
    evidence_quality: item.evidence_quality as 'Strong' | 'Moderate' | 'Emerging',
    price_aed: item.price_aed,
    subscription_discount_percent: item.subscription_discount_percent,
    discounted_price_aed: item.discounted_price_aed,
    image_url,
    form_image_url: image_url, // Use same image for form
    description,
    benefits: [item.use_case],
    warnings: item.tier === 'Orange' ? ['Consult healthcare provider before use'] : undefined,
    interactions: []
  };
});

// Helper functions
export const getSupplementById = (id: string): Supplement | undefined => {
  return SUPPLEMENTS_DATABASE.find(supplement => supplement.id === id);
};

export const getSupplementsByCategory = (category: string): Supplement[] => {
  return SUPPLEMENTS_DATABASE.filter(supplement => supplement.category === category);
};

export const getSupplementsByTier = (tier: 'Green' | 'Orange' | 'Moderate'): Supplement[] => {
  return SUPPLEMENTS_DATABASE.filter(supplement => supplement.tier === tier);
};

export const searchSupplements = (query: string): Supplement[] => {
  const lowercaseQuery = query.toLowerCase();
  return SUPPLEMENTS_DATABASE.filter(supplement =>
    supplement.name.toLowerCase().includes(lowercaseQuery) ||
    supplement.category.toLowerCase().includes(lowercaseQuery) ||
    supplement.use_case.toLowerCase().includes(lowercaseQuery)
  );
};

// Categories
export const SUPPLEMENT_CATEGORIES = [
  'General Health',
  'Sleep & Recovery',
  'Stress & Mood',
  'Hormonal Support',
  'Hypertrophy',
  'Endurance',
  'Metabolism',
  'Gut Health',
  'Longevity',
  'Cognitive Support',
  'Liver Support',
  'Focus & Energy',
  'Adaptogen'
];

// Featured/Popular supplements
export const FEATURED_SUPPLEMENTS = [
  'magnesium-glycinate',
  'vitamin-d3',
  'omega-3-epa-dha',
  'ashwagandha',
  'creatine-monohydrate',
  'probiotics'
];
