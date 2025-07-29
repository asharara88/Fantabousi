import supplementsData from '../../biowell_all_supplements.json';

export interface SupplementFromJson {
  name: string;
  category: string;
  use_case: string;
  tier: 'Green' | 'Yellow' | 'Orange';
  dose_typical: string;
  evidence_quality: string;
  price_aed: number;
  subscription_discount_percent: number;
  discounted_price_aed: number;
}

export interface ProcessedSupplement {
  id: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  tier: 'green' | 'yellow';
  use_case: string;
  price_aed: number;
  subscription_discount_percent: number;
  image_url: string;
  dosage: string;
  evidence_quality: string;
  discounted_price_aed: number;
  is_available: boolean;
  is_featured: boolean;
  is_bestseller: boolean;
  evidence_summary?: string;
  source_link?: string;
  benefits?: string[];
  certifications?: string[];
}

// Convert JSON data to our component format
export const processSupplementData = (): ProcessedSupplement[] => {
  return supplementsData.map((supplement, index) => ({
    id: `supplement-${index + 1}`,
    name: supplement.name,
    brand: 'Biowell',
    category: supplement.category,
    description: supplement.use_case || `${supplement.name} supplement for ${supplement.category.toLowerCase()}`,
    tier: supplement.tier.toLowerCase() === 'green' ? 'green' : 'yellow',
    use_case: supplement.use_case,
    price_aed: supplement.price_aed,
    subscription_discount_percent: supplement.subscription_discount_percent,
    image_url: 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg?auto=compress&cs=tinysrgb&w=300',
    dosage: supplement.dose_typical,
    evidence_quality: supplement.evidence_quality,
    discounted_price_aed: supplement.discounted_price_aed,
    is_available: true,
    is_featured: supplement.subscription_discount_percent > 20,
    is_bestseller: supplement.tier === 'Green' && supplement.subscription_discount_percent > 15,
    evidence_summary: `${supplement.name} has ${supplement.evidence_quality} evidence quality for ${supplement.use_case}.`,
    source_link: 'https://pubmed.ncbi.nlm.nih.gov/',
    benefits: supplement.use_case ? [supplement.use_case] : [],
    certifications: ['Third-party tested', 'GMP certified']
  }));
};

// Get all supplements
export const getAllSupplements = (): ProcessedSupplement[] => {
  return processSupplementData();
};

// Filter supplements by tier
export const getSupplementsByTier = (tier: 'green' | 'yellow'): ProcessedSupplement[] => {
  return getAllSupplements().filter(supplement => supplement.tier === tier);
};

// Get supplements by category
export const getSupplementsByCategory = (category: string): ProcessedSupplement[] => {
  return getAllSupplements().filter(supplement => 
    supplement.category.toLowerCase().includes(category.toLowerCase())
  );
};

// Get featured supplements
export const getFeaturedSupplements = (): ProcessedSupplement[] => {
  return getAllSupplements().filter(supplement => supplement.is_featured);
};

// Get bestseller supplements
export const getBestsellerSupplements = (): ProcessedSupplement[] => {
  return getAllSupplements().filter(supplement => supplement.is_bestseller);
};

// Search supplements by name or description
export const searchSupplements = (query: string): ProcessedSupplement[] => {
  const lowercaseQuery = query.toLowerCase();
  return getAllSupplements().filter(supplement =>
    supplement.name.toLowerCase().includes(lowercaseQuery) ||
    supplement.description.toLowerCase().includes(lowercaseQuery) ||
    supplement.use_case.toLowerCase().includes(lowercaseQuery) ||
    supplement.category.toLowerCase().includes(lowercaseQuery)
  );
};

// Get unique categories
export const getUniqueCategories = (): string[] => {
  const categories = getAllSupplements().map(supplement => supplement.category);
  return [...new Set(categories)].sort();
};