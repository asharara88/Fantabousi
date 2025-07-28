export interface ProcessedSupplement {
  id: string;
  name: string;
  brand: string;
  description: string;
  tier: 'green' | 'yellow' | 'orange';
  category: string;
  price_aed: number;
  image_url: string;
  evidence_quality: string;
  dosage: string;
  subscription_discount_percent?: number;
  discounted_price_aed?: number;
  use_case?: string;
  benefits?: string[];
  certifications?: string[];
}

// Supplement data with local SVG images
const SUPPLEMENTS_DATA: ProcessedSupplement[] = [
  {
    id: "creatine-monohydrate",
    name: "Creatine Monohydrate",
    brand: "Biowell Premium",
    description: "High-quality creatine monohydrate for strength and power enhancement. Supports muscle growth and athletic performance.",
    tier: "green",
    category: "Sports Performance",
    price_aed: 89.99,
    image_url: "/supplements/creatine.svg",
    evidence_quality: "Strong",
    dosage: "5g daily",
    subscription_discount_percent: 15,
    discounted_price_aed: 76.49,
    use_case: "Muscle strength & power",
    benefits: ["Increases strength and power", "Enhances athletic performance", "Supports muscle growth"],
    certifications: ["Third-party tested", "GMP certified", "Non-GMO"]
  },
  {
    id: "vitamin-d3",
    name: "Vitamin D3",
    brand: "Biowell Premium",
    description: "High-potency vitamin D3 for immune support and bone health. Essential for calcium absorption and overall wellness.",
    tier: "green",
    category: "Vitamins",
    price_aed: 45.50,
    image_url: "/supplements/vitamin-d3.svg",
    evidence_quality: "Strong",
    dosage: "2000-5000 IU daily",
    subscription_discount_percent: 10,
    discounted_price_aed: 40.95,
    use_case: "Immune & bone health",
    benefits: ["Supports immune function", "Promotes bone health", "Enhances calcium absorption"],
    certifications: ["Third-party tested", "GMP certified"]
  },
  {
    id: "magnesium-glycinate",
    name: "Magnesium Glycinate",
    brand: "Biowell Premium",
    description: "Highly bioavailable magnesium glycinate for muscle function and relaxation. Gentle on the stomach.",
    tier: "green",
    category: "Minerals",
    price_aed: 67.25,
    image_url: "/supplements/magnesium-glycinate.svg",
    evidence_quality: "Strong",
    dosage: "200-400mg daily",
    subscription_discount_percent: 12,
    discounted_price_aed: 59.18,
    use_case: "Muscle function & sleep",
    benefits: ["Supports muscle function", "Promotes relaxation", "Aids in sleep quality"],
    certifications: ["Third-party tested", "GMP certified", "Non-GMO"]
  },
  {
    id: "omega-3-fish-oil",
    name: "Omega-3 Fish Oil",
    brand: "Biowell Premium",
    description: "Premium omega-3 fish oil with high EPA and DHA content. Supports heart, brain, and joint health.",
    tier: "green",
    category: "Essential Fatty Acids",
    price_aed: 129.99,
    image_url: "/supplements/omega-3.svg",
    evidence_quality: "Strong",
    dosage: "1-2g daily with meals",
    subscription_discount_percent: 15,
    discounted_price_aed: 110.49,
    use_case: "Heart & brain health",
    benefits: ["Supports cardiovascular health", "Enhances brain function", "Reduces inflammation"],
    certifications: ["Third-party tested", "Molecularly distilled", "Mercury-free"]
  },
  {
    id: "ashwagandha-extract",
    name: "Ashwagandha Extract",
    brand: "Biowell Premium",
    description: "Standardized ashwagandha root extract for stress management and adaptogenic support.",
    tier: "yellow",
    category: "Adaptogens",
    price_aed: 85.00,
    image_url: "/supplements/ashwagandha.svg",
    evidence_quality: "Moderate",
    dosage: "300-600mg daily",
    subscription_discount_percent: 10,
    discounted_price_aed: 76.50,
    use_case: "Stress management",
    benefits: ["Reduces stress and anxiety", "Supports cortisol balance", "Enhances energy levels"],
    certifications: ["Standardized extract", "Third-party tested"]
  },
  {
    id: "zinc-picolinate",
    name: "Zinc Picolinate",
    brand: "Biowell Premium",
    description: "Highly absorbable zinc picolinate for immune function and wound healing support.",
    tier: "green",
    category: "Minerals",
    price_aed: 32.75,
    image_url: "/supplements/zinc.svg",
    evidence_quality: "Strong",
    dosage: "15-30mg daily",
    subscription_discount_percent: 8,
    discounted_price_aed: 30.13,
    use_case: "Immune support",
    benefits: ["Supports immune function", "Aids in wound healing", "Antioxidant properties"],
    certifications: ["Third-party tested", "GMP certified"]
  },
  {
    id: "vitamin-b12-methylcobalamin",
    name: "Vitamin B12 (Methylcobalamin)",
    brand: "Biowell Premium",
    description: "Active form of vitamin B12 for energy production and nervous system support.",
    tier: "green",
    category: "Vitamins",
    price_aed: 38.99,
    image_url: "/supplements/vitamin-b12.svg",
    evidence_quality: "Strong",
    dosage: "1000-2500mcg daily",
    subscription_discount_percent: 10,
    discounted_price_aed: 35.09,
    use_case: "Energy & nervous system",
    benefits: ["Supports energy production", "Maintains nervous system health", "Aids in red blood cell formation"],
    certifications: ["Methylated form", "Third-party tested"]
  },
  {
    id: "curcumin-bioperine",
    name: "Curcumin with BioPerine",
    brand: "Biowell Premium",
    description: "Curcumin extract with black pepper extract for enhanced absorption and anti-inflammatory benefits.",
    tier: "yellow",
    category: "Anti-inflammatory",
    price_aed: 95.50,
    image_url: "/supplements/curcumin.svg",
    evidence_quality: "Moderate",
    dosage: "500-1000mg daily",
    subscription_discount_percent: 12,
    discounted_price_aed: 84.04,
    use_case: "Anti-inflammatory",
    benefits: ["Reduces inflammation", "Supports joint health", "Antioxidant properties"],
    certifications: ["Standardized extract", "Enhanced absorption"]
  },
  {
    id: "probiotics-multi-strain",
    name: "Probiotics Multi-Strain",
    brand: "Biowell Premium",
    description: "Multi-strain probiotic formula with prebiotics for digestive and immune health support.",
    tier: "yellow",
    category: "Digestive Health",
    price_aed: 149.99,
    image_url: "/supplements/probiotics.svg",
    evidence_quality: "Moderate",
    dosage: "1-2 capsules daily",
    subscription_discount_percent: 15,
    discounted_price_aed: 127.49,
    use_case: "Digestive health",
    benefits: ["Supports digestive health", "Enhances immune function", "Maintains gut microbiome"],
    certifications: ["Shelf-stable", "Clinically studied strains"]
  },
  {
    id: "coenzyme-q10",
    name: "Coenzyme Q10",
    brand: "Biowell Premium",
    description: "High-absorption CoQ10 for cardiovascular health and cellular energy production.",
    tier: "yellow",
    category: "Antioxidants",
    price_aed: 125.00,
    image_url: "/supplements/coq10.svg",
    evidence_quality: "Moderate",
    dosage: "100-200mg daily",
    subscription_discount_percent: 10,
    discounted_price_aed: 112.50,
    use_case: "Heart health",
    benefits: ["Supports heart health", "Enhances cellular energy", "Antioxidant protection"],
    certifications: ["Ubiquinol form", "Third-party tested"]
  },
  {
    id: "vitamin-c-ascorbic-acid",
    name: "Vitamin C (Ascorbic Acid)",
    brand: "Biowell Premium",
    description: "High-potency vitamin C for immune support and antioxidant protection.",
    tier: "green",
    category: "Vitamins",
    price_aed: 28.50,
    image_url: "/supplements/vitamin-c.svg",
    evidence_quality: "Strong",
    dosage: "500-1000mg daily",
    subscription_discount_percent: 8,
    discounted_price_aed: 26.22,
    use_case: "Immune support",
    benefits: ["Supports immune function", "Antioxidant protection", "Collagen synthesis"],
    certifications: ["USP verified", "Non-GMO"]
  },
  {
    id: "iron-bisglycinate",
    name: "Iron Bisglycinate",
    brand: "Biowell Premium",
    description: "Gentle, highly absorbable iron bisglycinate for blood health and energy support.",
    tier: "green",
    category: "Minerals",
    price_aed: 42.75,
    image_url: "/supplements/iron.svg",
    evidence_quality: "Strong",
    dosage: "18-25mg daily",
    subscription_discount_percent: 10,
    discounted_price_aed: 38.48,
    use_case: "Blood health",
    benefits: ["Supports healthy blood", "Reduces fatigue", "Gentle on stomach"],
    certifications: ["Chelated form", "Third-party tested"]
  }
];

// Utility functions
export function getAllSupplements(): ProcessedSupplement[] {
  return SUPPLEMENTS_DATA;
}

export function getUniqueCategories(): string[] {
  const categories = new Set(SUPPLEMENTS_DATA.map(s => s.category));
  return Array.from(categories).sort();
}

export function searchSupplements(query: string): ProcessedSupplement[] {
  const searchTerm = query.toLowerCase().trim();
  if (!searchTerm) return SUPPLEMENTS_DATA;
  
  return SUPPLEMENTS_DATA.filter(supplement => 
    supplement.name.toLowerCase().includes(searchTerm) ||
    supplement.brand.toLowerCase().includes(searchTerm) ||
    supplement.description.toLowerCase().includes(searchTerm) ||
    supplement.category.toLowerCase().includes(searchTerm) ||
    supplement.use_case?.toLowerCase().includes(searchTerm) ||
    supplement.benefits?.some(benefit => benefit.toLowerCase().includes(searchTerm))
  );
}

export function getSupplementById(id: string): ProcessedSupplement | undefined {
  return SUPPLEMENTS_DATA.find(supplement => supplement.id === id);
}

export function getSupplementsByCategory(category: string): ProcessedSupplement[] {
  return SUPPLEMENTS_DATA.filter(supplement => supplement.category === category);
}

export function getSupplementsByTier(tier: 'green' | 'yellow' | 'orange'): ProcessedSupplement[] {
  return SUPPLEMENTS_DATA.filter(supplement => supplement.tier === tier);
}
